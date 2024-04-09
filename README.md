# synced-web-settings

Tiny package to make syncing settings with browser storage easier.

## Overview

Instead of this:
```js
// getting value
let someString = localStorage.getItem("setting:someString");

// setting value
someString = "new value!";
localStorage.setItem("setting:someString", someString);
```

Do this:
```js
// getting value
repo.settings.someString;

// setting value
repo.settings.someString = "new value!"; 
```

Supported types include: `string`, `boolean`, `number`, `bigint`, any objects
compatible with `JSON.parse()`/`JSON.stringify()`, and any other objects you
want (as long as you write a custom serializer).

You can also subscribe to setting updates:
```js
// the subscribe() function knows what your settings are for type safety
repo.subscriptions.subscribe("someBool", (value) => {
  doStuffWithBoolean(value);
});
```

When setting up a repo, you can choose between `localStorage`, `sessionStorage`,
or any other storage container that implements the `Storage` type.

Advantages over using storage directly:
- ✅ Easier to read & write
- ✅ No manual type conversion
- ✅ Intellisense & type safety for setting names & values
- ✅ Default values when not present in storage container
- ✅ Callbacks/subscriptions when settings change

## Usage

### Creating a Settings Repository

Create a `SettingsRespository` and define your settings:
```ts
import { SettingsRespository, StoredBoolean } from "synced-web-settings";

const repo = new SettingsRespository({
  prefix: "setting:", // optional; gets appended to setting name for key
  storage: localStorage, // can be anything that implements Storage
  settings: {
    someBoolean: { // name can be whatever you want
      type: StoredBoolean, // reference to class that handles proxying
      defaultValue: false, // value to use when setting not yet set
      callbacks: [ // these all get called when the setting changes
        (value) => doStuffWithBoolean(value),
      ]
    },
    // add as many settings as you'd like
  }
});
```

Settings can use any subclass of `StoredSetting`. There are 5 predefined
implementations you can use:
- `StoredBoolean`
- `StoredNumber`
- `StoredBigint`
- `StoredString`
- `StoredJson`

Note that `StoredJson` is only compatible with objects that can work with
`JSON.parse()` and `JSON.stringify()`, which means objects with circular
references or containing bigints are not allowed. For more complex data types
such as these, you can create your own implementation of `StoredSetting`, like:
```ts
class StoredThing extends StoredSetting<YourType> {
  constructor(
    defaultValue: YourType,
    callbacks?: readonly OnChangeCallback<YourType>[]
  ) {
    super(defaultValue, callbacks);
  }

  protected _decode(value: string): YourType {
    // parse string as a YourType
  }

  protected _encode(value: YourType): string {
    // convert YourType to a string
  }
}
```

### Getting Your Settings Type

There is no need to write an interface for your settings and use it as a generic
in the `SettingsRespository` constructor. There is some TypeScript magic going
on behind the scenes so you can simply do this:
```ts
const repo = new SettingsRespository({
  storage: localStorage,
  settings: {
    someBoolean: {
      type: StoredBoolean,
      defaultValue: false
    },
    someNumber: {
      type: StoredNumber,
      defaultValue: 0
    },
  }
});

type MyWebsiteSettings = typeof repo.settings;

/*
  Equivalent to:

  interface MyWebsiteSettings {
    someBoolean: boolean;
    someNumber: number;
  }
*/
```

### Using Settings

Using settings is as simple as using an object, because that's literally all it
is. Just get, set, and delete properties as you would on a normal object, and
they will instantly sync with the storage container you chose.

```ts
const someBool = repo.settings.someBool; // reads from storage
repo.settings.someBool = true; // writes "true" to storage
delete repo.settings.someBool; // removes someBool setting from storage
```

### Subscribe to Setting Updates

To receive updates when a setting has changed, create a subscription:
```ts
// the subscribe() function knows what your settings are for type safety, and
// returns a function that will cancel the subscription when called
const unsub = repo.subscriptions.subscribe("someBool", (value) => {
  doStuffWithBoolean(value);
});

// when you're ready to terminate the subscription, call unsub()
unsub();
```

As shorthand for multiple subscriptions that are related, use a batch:
```ts
const unsub = repo.subscriptions.batchSubscribe(
  someBool: (value) => {
    // do stuff with the boolean
  },
  someNum: (value) => {
    // do stuff with the number
  }
);

// unsubscribes all of the above at once
unsub();
```
