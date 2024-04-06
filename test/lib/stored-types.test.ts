import { expect } from "chai";
import * as types from "../../dst/lib/stored-types";

describe("StoredSetting", () => {
  describe("#handleChange()", () => {
    it("should call all registered callbacks", () => {
      let firstCalled = false, secondCalled = false;
      const setting = new types.StoredNumber(0, [
        (_) => { firstCalled = true; },
        (_) => { secondCalled = true; },
      ]);
      expect(firstCalled).to.be.false;
      expect(secondCalled).to.be.false;
      setting.handleChange(1);
      expect(firstCalled).to.be.true;
      expect(secondCalled).to.be.true;
    });

    it("should pass given value to callbacks", () => {
      let passedValue = 0;
      const setting = new types.StoredNumber(0, [
        (value) => { passedValue = value; },
      ]);
      expect(passedValue).to.equal(0);
      setting.handleChange(5);
      expect(passedValue).to.equal(5);
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
        //@ts-ignore
        expect(trueDefault.decode(null)).to.be.true;
        //@ts-ignore
        expect(falseDefault.decode(null)).to.be.false;
      });

      it("should return default value if raw value is undefined", () => {
        //@ts-ignore
        expect(trueDefault.decode(undefined)).to.be.true;
        //@ts-ignore
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
        //@ts-ignore
        expect(trueDefault.encode(1)).to.equal("true");
        //@ts-ignore
        expect(falseDefault.encode(1)).to.equal("true");
      });

      it("should return 'false' for falsey values", () => {
        expect(trueDefault.encode(false)).to.equal("false");
        expect(falseDefault.encode(false)).to.equal("false");
        //@ts-ignore
        expect(trueDefault.encode(0)).to.equal("false");
        //@ts-ignore
        expect(falseDefault.encode(0)).to.equal("false");
      });
    });
  });

  describe("StoredNumber", () => {
    const zeroDefault = new types.StoredNumber(0);
    const fiveDefault = new types.StoredNumber(5);

    describe("#decode()", () => {
      it("should return correct integer if raw value is integer", () => {
        expect(zeroDefault.decode("10")).to.equal(10);
        expect(fiveDefault.decode("10")).to.equal(10);
      });

      it("should return correct float if raw value is float", () => {
        expect(zeroDefault.decode("12.34")).to.be.approximately(12.34, 0.0001);
        expect(fiveDefault.decode("12.34")).to.be.approximately(12.34, 0.0001);
      });

      it("should return default value if raw value is null", () => {
        //@ts-ignore
        expect(zeroDefault.decode(null)).to.equal(0);
        //@ts-ignore
        expect(fiveDefault.decode(null)).to.equal(5);
      });

      it("should return default value if raw value is undefined", () => {
        //@ts-ignore
        expect(zeroDefault.decode(undefined)).to.equal(0);
        //@ts-ignore
        expect(fiveDefault.decode(undefined)).to.equal(5);
      });

      it("should return default value if raw value cannot be parsed as number", () => {
        expect(zeroDefault.decode("something")).to.equal(0);
        expect(fiveDefault.decode("something")).to.equal(5);
      });
    });

    describe("#encode()", () => {
      it("should return stringified integer for given integer", () => {
        expect(zeroDefault.encode(37)).to.equal("37");
        expect(fiveDefault.encode(37)).to.equal("37");
      });

      it("should return stringified float for given float", () => {
        const condition = (s: string) => s.startsWith("12.34");
        expect(zeroDefault.encode(12.34)).to.satisfy(condition);
        expect(fiveDefault.encode(12.34)).to.satisfy(condition);
      });
    });
  });

  describe("StoredBigint", () => {
    const zeroDefault = new types.StoredBigint(0n);
    const fiveDefault = new types.StoredBigint(5n);

    describe("#decode()", () => {
      it("should return correct bigint", () => {
        expect(zeroDefault.decode("37")).to.equal(37n);
        expect(fiveDefault.decode("37")).to.equal(37n);
        expect(zeroDefault.decode("1234")).to.equal(1234n);
        expect(fiveDefault.decode("1234")).to.equal(1234n);
      });

      it("should return default value if raw value is null", () => {
        //@ts-ignore
        expect(zeroDefault.decode(null)).to.equal(0n);
        //@ts-ignore
        expect(fiveDefault.decode(null)).to.equal(5n);
      });

      it("should return default value if raw value is undefined", () => {
        //@ts-ignore
        expect(zeroDefault.decode(undefined)).to.equal(0n);
        //@ts-ignore
        expect(fiveDefault.decode(undefined)).to.equal(5n);
      });

      it("should return default value if raw value cannot be parsed as bigint", () => {
        expect(zeroDefault.decode("something")).to.equal(0n);
        expect(fiveDefault.decode("something")).to.equal(5n);
      });
    });

    describe("#encode()", () => {
      it("should return stringified bigint", () => {
        expect(zeroDefault.encode(37n)).to.equal("37");
        expect(fiveDefault.encode(37n)).to.equal("37");
        expect(zeroDefault.encode(1234n)).to.equal("1234");
        expect(fiveDefault.encode(1234n)).to.equal("1234");
      });
    });
  });

  describe("StoredString", () => {
    const helloDefault = new types.StoredString("hello");
    const worldDefault = new types.StoredString("world");

    describe("#decode()", () => {
      it("should return raw value", () => {
        expect(helloDefault.decode("foo")).to.equal("foo");
        expect(worldDefault.decode("foo")).to.equal("foo");
        expect(helloDefault.decode("bar")).to.equal("bar");
        expect(worldDefault.decode("bar")).to.equal("bar");
      });

      it("should return default value if raw value is null", () => {
        //@ts-ignore
        expect(helloDefault.decode(null)).to.equal("hello");
        //@ts-ignore
        expect(worldDefault.decode(null)).to.equal("world");
      });

      it("should return default value if raw value is undefined", () => {
        //@ts-ignore
        expect(helloDefault.decode(undefined)).to.equal("hello");
        //@ts-ignore
        expect(worldDefault.decode(undefined)).to.equal("world");
      });
    });

    describe("#encode()", () => {
      it("should return given value", () => {
        expect(helloDefault.encode("foo")).to.equal("foo");
        expect(worldDefault.encode("foo")).to.equal("foo");
        expect(helloDefault.encode("bar")).to.equal("bar");
        expect(worldDefault.encode("bar")).to.equal("bar");
      });
    });
  });

  describe("StoredJson", () => {
    type TestArrayType = readonly number[];
    const array1: TestArrayType = [1, 2];
    const array1str = "[1,2]";
    const array2: TestArrayType = [3, 4, 5];
    const array2str = "[3,4,5]";
    const arrayJson = new types.StoredJson<TestArrayType>(array1);

    type TestObjectType = { readonly str: string; readonly num: number };
    const object1: TestObjectType = { str: "foo", num: 0 };
    const object1str = '{"str":"foo","num":0}';
    const object2: TestObjectType = { str: "bar", num: 5 };
    const object2str = '{"str":"bar","num":5}';
    const objectJson = new types.StoredJson<TestObjectType>(object1);

    describe("#decode()", () => {
      it("should return JSON object parsed from raw value", () => {
        expect(objectJson.decode(object1str)).to.be.an("object")
          .and.to.deep.equal(object1);
        expect(objectJson.decode(object2str)).to.be.an("object")
          .and.to.deep.equal(object2);
      });

      it("should return JSON array parsed from raw value", () => {
        expect(arrayJson.decode(array1str)).to.be.an("Array")
          .and.to.deep.equal(array1);
        expect(arrayJson.decode(array2str)).to.be.an("Array")
          .and.to.deep.equal(array2);
      });

      it("should return default value if raw value is null", () => {
        //@ts-ignore
        expect(arrayJson.decode(null)).to.be.an("Array")
          .and.to.deep.equal(array1);
        //@ts-ignore
        expect(objectJson.decode(null)).to.be.an("object")
          .and.to.deep.equal(object1);
      });

      it("should return default value if raw value is undefined", () => {
        //@ts-ignore
        expect(arrayJson.decode(undefined)).to.be.an("Array")
          .and.to.deep.equal(array1);
        //@ts-ignore
        expect(objectJson.decode(undefined)).to.be.an("object")
          .and.to.deep.equal(object1);
      });

      it("should return default value if raw value is malformed JSON", () => {
        //@ts-ignore
        expect(arrayJson.decode("][")).to.be.an("Array")
          .and.to.deep.equal(array1);
        //@ts-ignore
        expect(objectJson.decode("][")).to.be.an("object")
          .and.to.deep.equal(object1);
      });
    });

    describe("#encode()", () => {
      it("should stringify given JSON object with no whitespace", () => {
        expect(objectJson.encode(object1)).to.equal(object1str);
        expect(objectJson.encode(object2)).to.equal(object2str);
      });

      it("should stringify given JSON array with no whitespace", () => {
        expect(arrayJson.encode(array1)).to.equal(array1str);
        expect(arrayJson.encode(array2)).to.equal(array2str);
      });

      it("should throw if JSON.stringify() would throw", () => {
        const json = new types.StoredJson<{
          value: bigint; // JSON.stringify() cannot encode bigints
        }>({ value: 10n });
        expect(() => json.encode({ value: 10n })).to.throw();
      });
    });
  });

  //#endregion
});
