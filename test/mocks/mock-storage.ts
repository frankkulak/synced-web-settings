import type { StorageType } from "../../src/lib/repository";

export default class MockStorage implements StorageType {
  private _db = new Map<string, string>();
  get db(): ReadonlyMap<string, string> { return this._db; }

  getItem(key: string): string {
    return this._db.get(key) as string;
  }

  setItem(key: string, value: string): void {
    this._db.set(key, value);
  }

  removeItem(key: string): void {
    this._db.delete(key);
  }

  clear() {
    this._db.clear();
  }
}
