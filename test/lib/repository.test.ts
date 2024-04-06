import { expect } from "chai";
import { SettingsRespository } from "../../dst/lib/repository";
import * as types from "../../dst/lib/stored-types";
import type MockSettings from "../mocks/mock-settings";
import MockStorage from "../mocks/mock-storage";

describe("SettingsRespository", () => {
  const prefix = "setting:";
  const storage = new MockStorage();
  const callbackValues = new Map<keyof MockSettings, any[]>();
  let repo: SettingsRespository<MockSettings>;

  function onCallback<T extends keyof MockSettings>(setting: T, value: MockSettings[T]) {
    const array = callbackValues.get(setting) ?? [];
    array.push(value);
    callbackValues.set(setting, array);
  }

  beforeEach(() => {
    storage.clear();
    callbackValues.clear();
    repo = new SettingsRespository<MockSettings>({
      prefix: prefix,
      storage: storage,
      settings: {
        boolean: {
          type: types.StoredBoolean,
          defaultValue: false,
          callbacks: [
            (value) => onCallback("boolean", value)
          ]
        },
        number: {
          type: types.StoredNumber,
          defaultValue: 0,
          callbacks: [
            (value) => onCallback("number", value)
          ]
        },
        string: {
          type: types.StoredString,
          defaultValue: "",
          callbacks: [
            (value) => onCallback("string", value)
          ]
        },
        json: {
          type: types.StoredJson,
          defaultValue: { numbers: [] },
          callbacks: [
            (value) => onCallback("json", value)
          ]
        }
      },
    });
  });

  describe("#settings", () => {
    describe("#get()", () => {
      it("should use the correct prefix when reading from storage", () => {
        storage.setItem("string", "wrong");
        storage.setItem("setting:string", "right");
        expect(repo.settings.string).to.equal("right");
      });

      it("should return default values for settings that don't exist", () => {
        expect(repo.settings.boolean).to.equal(false);
        expect(repo.settings.number).to.equal(0);
        expect(repo.settings.string).to.equal("");
        expect(repo.settings.json).to.deep.equal({ numbers: [] });
      });

      it("should return correct values for settings that do exist", () => {
        storage.setItem("setting:boolean", "true");
        storage.setItem("setting:number", "123");
        storage.setItem("setting:string", "Hello World");
        storage.setItem("setting:json", '{"numbers":[1,2,3]}');
        expect(repo.settings.boolean).to.equal(true);
        expect(repo.settings.number).to.equal(123);
        expect(repo.settings.string).to.equal("Hello World");
        expect(repo.settings.json).to.deep.equal({ numbers: [1, 2, 3] });
      });
    });

    describe("#set()", () => {
      it("should use the correct prefix when writing to storage", () => {
        repo.settings.number = 123;
        expect(storage.getItem("number")).to.be.undefined;
        expect(storage.getItem("setting:number")).to.equal("123");
      });

      it("should update value in storage", () => {
        storage.setItem("setting:number", "5");
        repo.settings.number = 123;
        expect(storage.getItem("setting:number")).to.equal("123");
      });

      it("should update value when fetched with get()", () => {
        expect(repo.settings.number).to.equal(0);
        repo.settings.number = 123;
        expect(repo.settings.number).to.equal(123);
      });

      it("should trigger setting's callback functions", () => {
        expect(callbackValues.get("string")).to.be.undefined;
        repo.settings.string = "Hello World";
        expect(callbackValues.get("string")).to.be.an("Array")
          .and.deep.equal(["Hello World"]);

        expect(callbackValues.get("boolean")).to.be.undefined;
        repo.settings.boolean = true;
        repo.settings.boolean = false;
        expect(callbackValues.get("boolean")).to.be.an("Array")
          .and.deep.equal([true, false]);

        expect(callbackValues.get("number")).to.be.undefined;
        repo.settings.number = 1;
        repo.settings.number = 2;
        repo.settings.number = 3;
        expect(callbackValues.get("number")).to.be.an("Array")
          .and.deep.equal([1, 2, 3]);
      });

      it("should notify all subscribers", () => {
        let string1 = false, string2 = false, number = false;
        repo.subscriptions.subscribe("string", (_) => { string1 = true });
        repo.subscriptions.subscribe("string", (_) => { string2 = true });
        repo.subscriptions.subscribe("number", (_) => { number = true });
        repo.settings.string = "Test";
        expect(string1).to.be.true;
        expect(string2).to.be.true;
        expect(number).to.be.false;
        repo.settings.number = 5;
        expect(number).to.be.true;
      });
    });

    describe("#deleteProperty()", () => {
      it("should use the correct prefix when deleting from storage", () => {
        storage.setItem("number", "123");
        storage.setItem("setting:number", "123");
        //@ts-ignore
        delete repo.settings.number;
        expect(storage.getItem("number")).to.equal("123");
        expect(storage.getItem("setting:number")).to.be.undefined;
      });

      it("should remove setting from storage", () => {
        storage.setItem("setting:number", "123");
        //@ts-ignore
        delete repo.settings.number;
        expect(storage.getItem("setting:number")).to.be.undefined;
      });

      it("should trigger setting's callback functions", () => {
        storage.setItem("setting:number", "123");
        expect(callbackValues.get("number")).to.be.undefined;
        //@ts-ignore
        delete repo.settings.number;
        expect(callbackValues.get("number")).to.be.an("Array")
          .and.deep.equal([undefined]);
      });

      it("should notify all subscribers", () => {
        let string1 = false, string2 = false, number = false;
        repo.subscriptions.subscribe("string", (_) => { string1 = true });
        repo.subscriptions.subscribe("string", (_) => { string2 = true });
        repo.subscriptions.subscribe("number", (_) => { number = true });
        //@ts-ignore
        delete repo.settings.string;
        expect(string1).to.be.true;
        expect(string2).to.be.true;
        expect(number).to.be.false;
        //@ts-ignore
        delete repo.settings.number;
        expect(number).to.be.true;
      });
    });
  });

  describe("#subscriptions", () => {
    // subscribing behavior covered by set()/deleteProperty() tests

    it("should stop notifying subscribers when unsub is called", () => {
      let string1 = false, string2 = false, number = false;
      const unsubs = [
        repo.subscriptions.subscribe("string", (_) => { string1 = true }),
        repo.subscriptions.subscribe("string", (_) => { string2 = true }),
        repo.subscriptions.subscribe("number", (_) => { number = true }),
      ];
      unsubs.forEach(unsub => unsub());
      repo.settings.string = "Test";
      repo.settings.number = 5;
      expect(string1).to.be.false;
      expect(string2).to.be.false;
      expect(number).to.be.false;
    });
  });
});
