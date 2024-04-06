//#region Base Types

type OnChangeCallback<T> = (value: T) => void;

/**
 * Spec for a setting that can sync with storage.
 */
export abstract class StoredSetting<T> {
  constructor(
    protected readonly _defaultValue: T,
    private readonly _onChangeCallbacks?: readonly OnChangeCallback<T>[]
  ) { }

  /**
   * Decodes the given string as a type compatible with this setting. If value
   * is null or undefined, then the default value is returned.
   * 
   * @param value Raw value to decode
   * @returns Decoded value
   */
  decode(value: string): T {
    return value == null
      ? this._defaultValue
      : this._decode(value);
  }

  /**
   * Encodes a value for the type of this setting to a string that can be
   * written to storage. If value is null or undefined, then the default value
   * is encoded instead.
   * 
   * @param value Value to encode
   * @returns Stringified version of value
   */
  encode(value: T): string {
    return value == null
      ? this._encode(this._defaultValue)
      : this._encode(value);
  }

  /**
   * Notify this setting that it was updated to the given value. This will call
   * all registered callbacks with the given value.
   * 
   * @param value Value that this setting was updated to.
   */
  handleChange(value: T) {
    this._onChangeCallbacks?.forEach(cb => cb(value));
  }

  protected abstract _decode(value: string): T;

  protected abstract _encode(value: T): string;
}

//#endregion

//#region Setting Types

/**
 * Spec for a boolean setting that can sync with storage.
 */
export class StoredBoolean extends StoredSetting<boolean> {
  constructor(defaultValue: boolean, callbacks?: readonly OnChangeCallback<boolean>[]) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): boolean {
    if (value === "true") return true;
    if (value === "false") return false;
    return this._defaultValue;
  }

  protected _encode(value: boolean): string {
    return value ? "true" : "false";
  }
}

/**
 * Spec for a number (integer/float) setting that can sync with storage.
 */
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

/**
 * Spec for a bigint setting that can sync with storage.
 */
export class StoredBigint extends StoredSetting<bigint> {
  constructor(defaultValue: bigint, callbacks?: readonly OnChangeCallback<bigint>[]) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): bigint {
    try {
      return BigInt(value);
    } catch (_) {
      return this._defaultValue;
    }
  }

  protected _encode(value: bigint): string {
    return value.toString();
  }
}

/**
 * Spec for a string setting that can sync with storage.
 */
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

/**
 * Spec for a JSON setting that can sync with storage. Note that JSON structure
 * must be compatible with `JSON.parse()` and `JSON.stringify()` in order to
 * work (e.g. objects containing bigints will fail to write).
 */
export class StoredJson<T extends object> extends StoredSetting<T> {
  constructor(defaultValue: T, callbacks?: readonly OnChangeCallback<T>[]) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): T {
    try {
      return JSON.parse(value);
    } catch (_) {
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
      defaultValue: SettingsType[T],
      callbacks?: readonly OnChangeCallback<SettingsType[T]>[]
    ) => StoredSetting<SettingsType[T]>,
    defaultValue: SettingsType[T],
    callbacks?: readonly OnChangeCallback<SettingsType[T]>[]
  };
};

//#endregion
