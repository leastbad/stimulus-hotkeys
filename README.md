<h1 align="center">Stimulus Hotkeys</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/stimulus-hotkeys" rel="nofollow">
    <img src="https://badge.fury.io/js/stimulus-hotkeys.svg" alt="npm version">
  </a>
</p>

<p align="center">
  <b>A Stimulus controller for mapping keystrokes to behaviors</b></br>
  <sub>Tiny at ~50 LOC </sub>
</p>

<br />

- **Simple**: with only one parameter, this is a drop-in, code-free solution
- **Backend Agnostic**: 100% client-side
- **Flexible**: built on the amazing [HotKeys.js](https://wangchujiang.com/hotkeys/) library
- **Idempotent**: compatible with Turbolinks by design
- **MIT Licensed**: free for personal and commercial use

## Built for StimulusJS

This [Stimulus](https://stimulus.hotwired.dev/) controller allows you to map keystrokes to methods in your Stimulus controllers using a simple JSON object. This is an easy way to create shortcut keys for your applications or capture input for games. Once registered in your Stimulus application, you can use it anywhere you like.

Here is a simple example, in which the user hits the "p" key and will see "PONG" on the console.

```html
<div
  data-controller="hotkeys example"
  data-hotkeys-bindings-value='{"p": "example#ping"}'
></div>
```

```js
// example_controller.js
import { Controller } from '@hotwired/stimulus'
export default class extends Controller {
  ping() {
    console.log('PONG')
  }
}
```

<tiny>Yes, that's really it.</tiny>

### Passing parameters

As of version 2.1, you can now pass String, Number and Boolean arguments to your Stimulus controller method. Note that it is not possible to pass Objects at this time.

```html
<body
  data-controller="hotkeys example"
  data-hotkeys-bindings-value='{"ctrl+y, command+y": "example#redo(hero, 666, true, \"false\", \"/path/to\")"}'
></body>
```

```js
// example_controller.js
import { Controller } from '@hotwired/stimulus'
export default class extends Controller {
  redo() {
    console.log(arguments) // ['hero', 666, true, false, '/path/to']
  }
}
```

### Preventing default actions

As of version 2.3, you can now use `:prevent` in your mapping to ensure that your key capture doesn't conflict with native browser behaviour.

```html
<div
  data-controller="hotkeys example"
  data-hotkeys-bindings-value='{"ctrl+k": "example#ping"}'
></div>
```

Now, instead of jumping to the browser search bar, you can capture the key event.

Thanks to @norkunas for the suggestion.

### Targeting Stimulus controllers on other elements

As of version 2.2, specifying a CSS selector to target an element containing a Stimulus controller is optional. It now defaults to assuming the `hotkeys` controller is on the same element as the controller receiving the mapping calls.

However, you can still use the `->` syntax to send mapping calls to controllers on other elements:

```html
<div
  data-controller="hotkeys"
  data-hotkeys-bindings-value='{"p": "#foo->example#ping"}'
></div>
<div id="foo" data-controller="example"></div>
```

### Credit where credit is due

This package would be nothing without [Hotkeys](https://wangchujiang.com/hotkeys/). Thank you, Kenny Wong!

## Setup

Add stimulus-hotkeys to your main JS entry point or Stimulus controllers root folder:

```js
import { Application } from '@hotwired/stimulus'
import Hotkeys from 'stimulus-hotkeys'

import { definitionsFromContext } from '@hotwired/stimulus-webpack-helpers'
const application = Application.start()
const context = require.context('../controllers', true, /\.js$/)
application.load(definitionsFromContext(context))

// Manually register Hotkeys as a Stimulus controller
application.register('hotkeys', Hotkeys)
```

## HTML Markup

The `data-hotkeys-bindings-value` attribute accepts an object in valid JSON notation. This string will be parsed using `JSON.parse()` so make sure to validate everything going into the expression. I usually forget that you must use `"` characters in JSON. 🤡

Each key/value pair corresponds to a mapping. The key is the keystroke(s) you want to capture, and the value contains a path to the function you want to call when your user hits the key.

You will want to learn about possible key combinations on the [Hotkeys project page](https://wangchujiang.com/hotkeys/).

The value borrows syntax from the Stimulus action system, with important differences:

`selector->identifier#method(params)`

**selector** performs a CSS selector lookup and must return an element which holds a Stimulus controller. (As of v2.2, this segment is optional.)

**identifier** is the Stimulus controller identifier, in kebab-case.

**method** is the function in the target Stimulus controller.

**params** is optional, and supports string, numeric and boolean parameters.

**Note:** this library is not raising events. If you want to receive events, you'll have to emit them yourself... but at some point, it'll probably be less complicated to just include `hotkeys-js` in your controller directly. This library is cool because the mapping is potentially dynamic.

### Obtaining a reference to the Stimulus controller instance

I'm usually a huge fan of putting a reference to the controller on the element holding the controller, but this library literally has no functions which can be called from outside. If you're trying to do this, you're doing something very wrong.

## Contributing

Bug reports and pull requests are welcome.

## License

This package is available as open source under the terms of the MIT License.
