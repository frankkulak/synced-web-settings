import { expect } from "chai";
import { SettingsRespository } from "../../dst/lib/repository";
import * as types from "../../dst/lib/stored-types";
import type MockSettings from "../mocks/mock-settings";
import MockStorage from "../mocks/mock-storage";

describe("SettingsRespository", () => {
  const prefix = "setting:";
  const storage = new MockStorage();
  let repo: SettingsRespository<MockSettings>;

  beforeEach(() => {
    storage.clear();
    repo = new SettingsRespository<MockSettings>({
      prefix: prefix,
      storage: storage,
      settings: {
        boolean: {
          type: types.StoredBoolean,
          defaultValue: false
        },
        number: {
          type: types.StoredNumber,
          defaultValue: 0
        },
        string: {
          type: types.StoredString,
          defaultValue: ""
        },
        json: {
          type: types.StoredJson,
          defaultValue: { numbers: [] }
        }
      },
    });
  });

  describe("#constructor()", () => {
    it("", () => {
      // TODO:
    });
  });

  describe("#settings", () => {
    it("", () => {
      // TODO:
    });
  });

  describe("#subscriptions", () => {
    it("", () => {
      // TODO:
    });
  });
});
