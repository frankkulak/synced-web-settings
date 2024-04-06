//#region Base Types

export type OnChangeCallback<T> = (value: T) => void;

export abstract class StoredSetting<T> {
  constructor(
    protected readonly _defaultValue: T,
    private readonly _onChangeCallbacks?: readonly OnChangeCallback<T>[]
  ) { }

  decode(value: string): T {
    return value == null
      ? this._defaultValue
      : this._decode(value);
  }

  encode(value: T): string {
    return value == null
      ? this._encode(this._defaultValue)
      : this._encode(value);
  }

  handleChange(value: T) {
    this._onChangeCallbacks?.forEach(cb => cb(value));
  }

  protected abstract _decode(value: string): T;

  protected abstract _encode(value: T): string;
}

//#endregion

//#region Setting Types

export class StoredBoolean extends StoredSetting<boolean> {
  constructor(defaultValue: boolean, callbacks?: readonly OnChangeCallback<boolean>[]) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): boolean {
    return value === "true";
  }

  protected _encode(value: boolean): string {
    return value ? "true" : "false";
  }
}

export class StoredNumber extends StoredSetting<number> {
  constructor(defaultValue: number, callbacks?: readonly OnChangeCallback<number>[]) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): number {
    const number = parseFloat(value);
    return Number.isNaN(number) ? this._defaultValue : number;
  }

  protected _encode(value: number): string {
    return value.toString();
  }
}

export class StoredBigint extends StoredSetting<bigint> {
  constructor(defaultValue: bigint, callbacks?: readonly OnChangeCallback<bigint>[]) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): bigint {
    try {
      return BigInt(value);
    } catch (e) {
      console.error(e);
      return this._defaultValue;
    }
  }

  protected _encode(value: bigint): string {
    return value.toString();
  }
}

export class StoredString extends StoredSetting<string> {
  constructor(defaultValue: string, callbacks?: readonly OnChangeCallback<string>[]) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): string {
    return value;
  }

  protected _encode(value: string): string {
    return value;
  }
}

export class StoredJson<T extends object> extends StoredSetting<T> {
  constructor(defaultValue: T, callbacks?: readonly OnChangeCallback<T>[]) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): T {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error();

      return this._defaultValue;
    }
  }

  protected _encode(value: T): string {
    return JSON.stringify(value);
  }
}

//#endregion

//#region Settings Builder

export type StoredSettings<SettingsType extends object> = {
  [T in keyof SettingsType]: StoredSetting<SettingsType[T]>;
};

export type StoredSettingsBuilder<SettingsType extends object> = {
  [T in keyof SettingsType]: {
    type: new (
      name: string,
      defaultValue: SettingsType[T],
      callbacks?: readonly OnChangeCallback<SettingsType[T]>[]
    ) => StoredSetting<SettingsType[T]>,
    defaultValue: SettingsType[T],
    callbacks?: readonly OnChangeCallback<SettingsType[T]>[]
  };
};

//#endregion
