/** @jsx etch.dom */

const etch = require('etch')

class StatefulComponent {
  constructor () {
    this.counter = 0
    etch.initialize(this)
  }

  render () {
    return (
      <div>
        <span>{this.counter}</span>
        <button onclick={() => this.incrementCounter()}>
          Increment Counter
        </button>
      </div>
    )
  }

  incrementCounter () {
    this.counter++
    // since we updated state we use in render, call etch.update
    return etch.update(this)
  }
}
