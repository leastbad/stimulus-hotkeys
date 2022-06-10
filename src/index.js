import { Controller } from '@hotwired/stimulus'
import hotkeys from 'hotkeys-js'

export default class extends Controller {
  static values = {
    bindings: Object
  }

  initialize () {
    this.map = this.map.bind(this.application)
    this.actOnHotkeys = this.actOnHotkeys.bind(this)
    this.connected = false
  }

  connect () {
    this.actOnHotkeys(hotkeys)
    this.connected = true
  }

  disconnect () {
    this.actOnHotkeys(hotkeys.unbind)
    this.connected = false
  }

  bindingsValueChanged () {
    if (this.connected) this.actOnHotkeys(hotkeys.unbind)
    this.bindings = Object.entries(this.bindingsValue)
    if (this.connected) this.actOnHotkeys(hotkeys)
  }

  actOnHotkeys (func) {
    setTimeout(
      () =>
        this.bindings
          .map(this.map)
          .filter(mapping => typeof mapping === 'object')
          .forEach(mapping => func.apply(null, mapping)),
      1
    )
  }

  map (binding) {
    try {
      const [key, value] = binding
      const [selector, target] = value.split('->')
      const [identifier, method] = target.split('#')
      const element = document.querySelector(selector)
      const controller = this.getControllerForElementAndIdentifier(
        element,
        identifier
      )
      if (typeof key === 'string' && typeof controller[method] === 'function')
        return [key, controller[method].bind(controller)]
    } catch (err) {}
  }
}
