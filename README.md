<h1 align="center">Stimulus Hotkeys</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/stimulus-hotkeys" rel="nofollow">
    <img src="https://badge.fury.io/js/stimulus-hotkeys.svg" alt="npm version">
  </a>
</p>

<p align="center">
  <b>A Stimulus controller for mapping keystrokes to behaviors</b></br>
  <sub>Teenie at ~40 LOC </sub>
</p>

<br />

- **Simple**: with only one parameter, this is a drop-in, code-free solution
- **Backend Agnostic**: 100% client-side
- **Flexible**: built on the amazing [HotKeys.js](https://wangchujiang.com/hotkeys/) library
- **Idempotent**: compatible with Turbolinks by design
- **MIT Licensed**: free for personal and commercial use

## Built for StimulusJS

This [Stimulus](https://stimulusjs.org/) controller allows you to map keystrokes to functions in your Stimulus controllers using a simple JSON object. This is an easy way to create shortcut keys for your applications or capture input for games. Once registered in your Stimulus application, you can use it anywhere you like.

Here is a simple example, in which the user hits the "p" key and will see "PONG" on the console.

```html
<div data-controller="hotkeys" data-hotkeys-bindings-value='{"p": "foo->example#ping"}'></div>
<div id="foo" data-controller="example"></div>
```

```js
// example_controller.js
import { Controller } from 'stimulus'
export default class extends Controller {
  ping () { console.log('PONG') }
}
```

<tiny>Yes, that's really it.</tiny>

### Credit where credit is due

This package would be nothing without [Hotkeys](https://wangchujiang.com/hotkeys/). Thank you, Kenny Wong!

## Setup

Note: **stimulus-hotkeys requires StimulusJS v2.0+**

*If you are reading this in the past* (Stimulus 2 isn't out yet) you can change your `stimulus` package in `package.json` to point to [this commit](https://github.com/stimulusjs/dev-builds/archive/b8cc8c4/stimulus.tar.gz).

Add stimulus-hotkeys to your main JS entry point or Stimulus controllers root folder:

```js
import { Application } from 'stimulus'
import Hotkeys from 'stimulus-hotkeys'

import { definitionsFromContext } from 'stimulus/webpack-helpers'
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

`selector->identifier#method`

**selector** performs a CSS selector lookup and must return an element which holds a Stimulus controller.

**identifier** is the Stimulus controller identifier, in kebab-case.

**method** is the function in the target Stimulus controller.

Here is an example where both the `hotkeys` controller as well as the target `command` controller are both attached to `body`, which is reasonable since `hotkeys` has no visual component.

```html
<body data-controller="hotkeys command" data-hotkeys-bindings-value='{"ctrl+z, command+z": "body->command#undo", "ctrl+y, command+y": "body->command#redo"}'>
</body>
```

```js
// command_controller.js
import { Controller } from 'stimulus'
export default class extends Controller {
  undo () { console.log('roll back!') }
  redo () { console.log('never mind!') }
}
```

**Note:** this library is not raising events. If you want to receive events, you'll have to emit them yourself... but at some point, it'll probably be less complicated to just include `hotkeys-js` in your controller directly. This library is cool because the mapping is potentially dynamic.

### Obtaining a reference to the Stimulus controller instance

I'm usually a huge fan of putting a reference to the controller on the element holding the controller, but this library literally has no functions which can be called from outside. If you're trying to do this, you're doing something very wrong.

## Contributing

Bug reports and pull requests are welcome.

## License

This package is available as open source under the terms of the MIT License.