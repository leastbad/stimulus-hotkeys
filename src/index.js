import { Controller } from '@hotwired/stimulus'
import hotkeys from 'hotkeys-js'

export default class extends Controller {
  static values = {
    bindings: Object
  }

  initialize () {
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
  
  map = binding => {
    try {
      const prevent = binding[1].includes(':prevent')
      const [key, value] = [binding[0], binding[1].replace(':prevent', '')]
      const [selector, target] = value.includes('->')
        ? value.split('->')
        : [null, value]
      const [identifier, ...command] = target.split('#')
      const method = command[0].split('(')[0]
      const element = selector ? document.querySelector(selector) : this.element
      const controller = this.application.getControllerForElementAndIdentifier(
        element,
        identifier
      )

      const matches = command.join('#').match(/^.+\((.*)\)$/)
      const args = matches
        ? matches[1].split(',').map(arg => {
            const value = arg.trim().match(/^["']?((?:\\.|[^"'\\])*)["']?$/)[1]
            if (value === 'true') return true
            if (value === 'false') return false
            return isNaN(value) ? value : Number(value)
          })
        : []

      if (typeof key === 'string' && typeof controller[method] === 'function')
        return prevent
          ? [
              key,
              event => {
                event.preventDefault()
                controller[method].bind(controller, ...args)()
              }
            ]
          : [key, controller[method].bind(controller, ...args)]
    } catch (err) {}
  }
}
