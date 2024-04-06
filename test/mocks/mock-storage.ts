export default class MockStorage implements Storage {
  private _db = new Map<string, string>();
  get db(): ReadonlyMap<string, string> { return this._db; }

  get length(): number { return this._db.size; };

  getItem(key: string): string {
    return this._db.get(key) as string;
  }

  setItem(key: string, value: string): void {
    this._db.set(key, value);
  }

  removeItem(key: string): void {
    this._db.delete(key);
  }

  key(index: number): string | null {
    return this._db.keys()[index];
  }

  clear() {
    this._db.clear();
  }
}
