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
        string: {
          type: types.StoredString,
          defaultValue: ""
        },
        numbers: {
          type: types.StoredJson,
          defaultValue: []
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
