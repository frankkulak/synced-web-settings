interface Subscription<SettingsType extends object, SettingName extends keyof SettingsType> {
  readonly setting: SettingName;
  readonly onChange: (value: SettingsType[SettingName]) => void;
}

type Unsubscriber = () => void;

/**
 * Tracks the subscriptions for settings updates.
 */
export class SubscriptionManager<SettingsType extends object> {
  private _nextId = 0;
  private readonly _subscriptions = new Map<number, Subscription<SettingsType, keyof SettingsType>>();

  /**
   * Registers a subscription for the given setting, and returns a function that
   * will unregister the subscription when called.
   * 
   * @param setting Setting to subscribe to
   * @param onChange Function to call when setting updates
   * @returns Function that cancels this subscription when called
   */
  subscribe<SettingName extends keyof SettingsType>(
    setting: SettingName,
    onChange: (value: SettingsType[SettingName]) => void,
  ): Unsubscriber {
    const id = this._nextId++;
    this._subscriptions.set(id, { setting, onChange });
    return () => this._subscriptions.delete(id);
  }

  /**
   * Registers subscriptions for the specified settings, and returns a function
   * that will unregister all of them when called.
   * 
   * @param subscriptions Mapping of settings to functions to call when updated
   * @returns Function that cancels all specified subscriptions
   */
  batchSubscribe(subscriptions: Partial<{
    [T in keyof SettingsType]: (value: SettingsType[T]) => void;
  }>): Unsubscriber {
    const unsubs: Unsubscriber[] = [];
    for (let setting in subscriptions)
      unsubs.push(this.subscribe(setting, subscriptions[setting]));
    return () => unsubs.forEach(unsub => unsub());
  }

  /**
   * Notifies all subscribers of the given setting that the value has been
   * updated to the given value.
   * 
   * @param setting Setting to notify subscriber for
   * @param value Value of setting
   */
  notifySubscribers<SettingName extends keyof SettingsType>(
    setting: SettingName,
    value: SettingsType[SettingName]
  ) {
    this._subscriptions.forEach(subscription => {
      if (subscription.setting === setting) subscription.onChange(value);
    });
  }

  /**
   * Cancels all subscriptions.
   */
  clear() {
    this._subscriptions.clear();
    this._nextId = 0;
  }
}
