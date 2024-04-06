export interface Subscription<SettingsType extends object, SettingName extends keyof SettingsType> {
  readonly setting: SettingName;
  readonly onChange: (value: SettingsType[SettingName]) => void;
}

export type Unsubscriber = () => void;

export class SubscriptionManager<SettingsType extends object> {
  private _nextId = 0;
  private readonly _subscriptions = new Map<number, Subscription<SettingsType, keyof SettingsType>>();

  subscribe<SettingName extends keyof SettingsType>(
    setting: SettingName,
    onChange: (value: SettingsType[SettingName]) => void
  ): Unsubscriber {
    const id = this._nextId++;
    this._subscriptions.set(id, { setting, onChange });
    return () => this._subscriptions.delete(id);
  }

  notifySubscribers<SettingName extends keyof SettingsType>(
    setting: SettingName,
    value: SettingsType[SettingName]
  ) {
    this._subscriptions.forEach(subscription => {
      if (subscription.setting === setting) subscription.onChange(value);
    });
  }

  clear() {
    this._subscriptions.clear();
    this._nextId = 0;
  }
}
