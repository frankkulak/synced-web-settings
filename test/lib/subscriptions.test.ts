import { expect } from "chai";
import { SubscriptionManager } from "../../dst/lib/subscriptions";
import type MockSettings from "../mocks/mock-settings";

describe("SubscriptionManager", () => {
  const manager = new SubscriptionManager<MockSettings>();

  beforeEach(() => {
    manager.clear();
  });

  describe("#subscribe()", () => {
    it("should add a subscriber whose onChange() function is called when notified", () => {
      let onChangeCalled = false;
      manager.subscribe("string", (_) => { onChangeCalled = true; });
      expect(onChangeCalled).to.be.false;
      manager.notifySubscribers("string", "Hello World");
      expect(onChangeCalled).to.be.true;
    });

    it("should return a function that cancels this subscription when called", () => {
      let onChangeCalled = false;
      const unsub = manager.subscribe("string", (_) => { onChangeCalled = true; });
      unsub();
      manager.notifySubscribers("string", "Hello World");
      expect(onChangeCalled).to.be.false;
    });
  });

  describe("#notifySubscribers()", () => {
    it("should call each matching subscriber's onChange() function", () => {
      let string1 = false, string2 = false;
      manager.subscribe("string", (_) => { string1 = true; });
      manager.subscribe("number", (_) => { });
      manager.subscribe("string", (_) => { string2 = true; });
      manager.subscribe("bigint", (_) => { });
      manager.notifySubscribers("string", "Hello World");
      expect(string1).to.be.true;
      expect(string2).to.be.true;
    });

    it("should not call non-matching subscriber's onChange() function", () => {
      let number = false, bigint = false;
      manager.subscribe("string", (_) => { });
      manager.subscribe("number", (_) => { number = true; });
      manager.subscribe("bigint", (_) => { bigint = true; });
      manager.notifySubscribers("string", "Hello World");
      expect(number).to.be.false;
      expect(bigint).to.be.false;
    });

    it("should pass the given value to the onChange() function", () => {
      let passedValue = 0;
      manager.subscribe("number", (value) => { passedValue = value; });
      manager.notifySubscribers("number", 5);
      expect(passedValue).to.equal(5);
    });
  });

  describe("#clear()", () => {
    it("should remove all existing subscribers", () => {
      let string = false, number = false, bigint = false;
      manager.subscribe("string", (_) => { string = true; });
      manager.subscribe("number", (_) => { number = true; });
      manager.subscribe("bigint", (_) => { bigint = true; });
      manager.clear();
      manager.notifySubscribers("string", "Hello World");
      manager.notifySubscribers("number", 5);
      manager.notifySubscribers("bigint", 5n);
      expect(string).to.be.false;
      expect(number).to.be.false;
      expect(bigint).to.be.false;
    });
  });
});
