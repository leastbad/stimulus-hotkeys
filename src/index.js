import { Controller } from 'stimulus'
import hotkeys from 'hotkeys-js'

export default class extends Controller {
  static values = {
    bindings: Object
  }

  initialize () {
    this.bindings = Object.entries(this.bindingsValue)
    this.map = this.map.bind(this.application)
  }

  connect () {
    setTimeout(
      () =>
        this.bindings
          .map(this.map)
          .forEach(mapping => hotkeys.apply(this, mapping)),
      1
    )
  }

  disconnect () {
    setTimeout(
      () =>
        this.bindings
          .map(this.map)
          .forEach(mapping => hotkeys.unbind.apply(this, mapping)),
      1
    )
  }

  map (binding) {
    const [key, value] = binding
    const [selector, target] = value.split('->')
    const [identifier, method] = target.split('#')
    const element = document.querySelector(selector)
    const controller = this.getControllerForElementAndIdentifier(
      element,
      identifier
    )
    return [key, controller[method]]
  }
}
