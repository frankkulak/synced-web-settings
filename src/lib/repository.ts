import { StoredSettings, StoredSettingsBuilder } from "./stored-types";
import { SubscriptionManager } from "./subscriptions";

/**
 * Repository of settings that are synced with a storage container.
 */
export class SettingsRespository<SettingsType extends object> {
  /** Settings synced with storage. */
  public readonly settings: SettingsType;
  /** Subscription manager for these settings. */
  public readonly subscriptions = new SubscriptionManager<SettingsType>();

  /**
   * @param options Configurable options
   */
  constructor(options: {
    /** String to append before setting names for keys in storage. */
    prefix?: string;
    /** Storage container that will sync with these settings. */
    storage: Storage;
    /** Specs for settings. */
    settings: StoredSettingsBuilder<SettingsType>;
  }) {
    // creating settings object
    const settings: Partial<StoredSettings<SettingsType>> = {};
    for (const settingName in options.settings) {
      const builder = options.settings[settingName];
      settings[settingName] = new builder.type(
        builder.defaultValue,
        builder.callbacks
      );
    }

    // wrapping settings in a proxy
    const subManager = this.subscriptions;
    const storageKey = (prop: string) => `${options.prefix ?? ""}${prop}`;
    this.settings = new Proxy(settings as StoredSettings<SettingsType>, {
      get(target, prop: string) {
        const raw = options.storage.getItem(storageKey(prop));
        return target[prop].decode(raw);
      },
      set(target, prop: string, value: any) {
        const raw = target[prop].encode(value) as string;
        options.storage.setItem(storageKey(prop), raw);
        target[prop].handleChange(value);
        subManager.notifySubscribers(prop as keyof SettingsType, value);
        return true;
      },
      deleteProperty(target, prop: string) {
        options.storage.removeItem(storageKey(prop));
        target[prop].handleChange(undefined);
        subManager.notifySubscribers(prop as keyof SettingsType, undefined);
        return true;
      }
    }) as SettingsType;
  }
}
