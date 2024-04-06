import { expect } from "chai";
import * as types from "../../dst/lib/stored-types";

describe("StoredSetting", () => {
  describe("#handleChange()", () => {
    it("should call all registered callbacks", () => {
      // TODO:
    });

    it("should pass given value to callbacks", () => {
      // TODO:
    });
  });

  //#region Implementations

  describe("StoredBoolean", () => {
    const trueDefault = new types.StoredBoolean(true);
    const falseDefault = new types.StoredBoolean(false);

    describe("#decode()", () => {
      it("should return true if raw value is 'true'", () => {
        expect(trueDefault.decode("true")).to.be.true;
        expect(falseDefault.decode("true")).to.be.true;
      });

      it("should return false if raw value is 'false'", () => {
        expect(trueDefault.decode("false")).to.be.false;
        expect(falseDefault.decode("false")).to.be.false;
      });

      it("should return default value if raw value is null", () => {
        //@ts-expect-error
        expect(trueDefault.decode(null)).to.be.true;
        //@ts-expect-error
        expect(falseDefault.decode(null)).to.be.false;
      });

      it("should return default value if raw value is undefined", () => {
        //@ts-expect-error
        expect(trueDefault.decode(undefined)).to.be.true;
        //@ts-expect-error
        expect(falseDefault.decode(undefined)).to.be.false;
      });

      it("should return default value if raw value is empty string", () => {
        expect(trueDefault.decode("")).to.be.true;
        expect(falseDefault.decode("")).to.be.false;
      });

      it("should return default value if raw value is string other than 'true' or 'false'", () => {
        expect(trueDefault.decode("testing")).to.be.true;
        expect(falseDefault.decode("testing")).to.be.false;
      });
    });

    describe("#encode()", () => {
      it("should return 'true' for truthy values", () => {
        expect(trueDefault.encode(true)).to.equal("true");
        expect(falseDefault.encode(true)).to.equal("true");
        //@ts-expect-error
        expect(trueDefault.encode(1)).to.equal("true");
        //@ts-expect-error
        expect(falseDefault.encode(1)).to.equal("true");
      });

      it("should return 'false' for falsey values", () => {
        expect(trueDefault.encode(false)).to.equal("false");
        expect(falseDefault.encode(false)).to.equal("false");
        //@ts-expect-error
        expect(trueDefault.encode(0)).to.equal("false");
        //@ts-expect-error
        expect(falseDefault.encode(0)).to.equal("false");
      });
    });
  });

  describe("StoredNumber", () => {
    describe("#decode()", () => {
      it("should return correct integer if raw value is integer", () => {
        // TODO:
      });

      it("should return correct float if raw value is float", () => {
        // TODO:
      });

      it("should return default value if raw value is null", () => {
        // TODO:
      });

      it("should return default value if raw value is undefined", () => {
        // TODO:
      });

      it("should return default value if raw value cannot be parsed as number", () => {
        // TODO:
      });
    });

    describe("#encode()", () => {
      it("should return stringified integer for given integer", () => {
        // TODO:
      });

      it("should return stringified float for given float", () => {
        // TODO:
      });
    });
  });

  describe("StoredBigint", () => {
    describe("#decode()", () => {
      it("should return correct bigint", () => {
        // TODO:
      });

      it("should return default value if raw value is null", () => {
        // TODO:
      });

      it("should return default value if raw value is undefined", () => {
        // TODO:
      });

      it("should return default value if raw value cannot be parsed as bigint", () => {
        // TODO:
      });
    });

    describe("#encode()", () => {
      it("should return stringified bigint", () => {
        // TODO:
      });
    });
  });

  describe("StoredString", () => {
    describe("#decode()", () => {
      it("should return raw value", () => {
        // TODO:
      });

      it("should return default value if raw value is null", () => {
        // TODO:
      });

      it("should return default value if raw value is undefined", () => {
        // TODO:
      });
    });

    describe("#encode()", () => {
      it("should return given value", () => {
        // TODO:
      });
    });
  });

  describe("StoredJson", () => {
    describe("#decode()", () => {
      it("should return JSON object parsed from raw value", () => {
        // TODO:
      });

      it("should return JSON array parsed from raw value", () => {
        // TODO:
      });

      it("should return default value if raw value is null", () => {
        // TODO:
      });

      it("should return default value if raw value is undefined", () => {
        // TODO:
      });

      it("should return default value if raw value is malformed JSON", () => {
        // TODO:
      });
    });

    describe("#encode()", () => {
      it("should stringify given JSON object with no whitespace", () => {
        // TODO:
      });

      it("should stringify given JSON array with no whitespace", () => {
        // TODO:
      });

      it("should throw if JSON.stringify() would throw", () => {
        // TODO:
      });
    });
  });

  //#endregion
});
