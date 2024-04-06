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
        // TODO:
      });

      it("should return default values for settings that don't exist", () => {
        // TODO:
      });

      it("should return correct values for settings that do exist", () => {
        // TODO:
      });

      it("should fetch value from storage even if set() was not used", () => {
        // TODO:
      });
    });

    describe("#set()", () => {
      it("should use the correct prefix when writing to storage", () => {
        // TODO:
      });

      it("should update value in storage", () => {
        // TODO:
      });

      it("should update value when fetched with get()", () => {
        // TODO:
      });

      it("should trigger setting's callback functions", () => {
        // TODO:
      });

      it("should notify all subscribers", () => {
        // TODO:
      });
    });

    describe("#deleteProperty()", () => {
      it("should use the correct prefix when deleting from storage", () => {
        // TODO:
      });

      it("should remove setting from storage", () => {
        // TODO:
      });

      it("should update value when fetched with get() to default", () => {
        // TODO:
      });

      it("should trigger setting's callback functions", () => {
        // TODO:
      });

      it("should notify all subscribers", () => {
        // TODO:
      });
    });
  });

  describe("#subscriptions", () => {
    it("should notify subscribers when a change is made to settings", () => {
      // TODO:
    });

    it("should stop notifying subscribers when unsub is called", () => {
      // TODO:
    });
  });
});
