'use babel';

/** @jsx etch.dom */

const etch = require('etch')
const fs = require('fs')
const {app, BrowserWindow} = require('electron')

class StatefulComponent {

  constructor (ly_paths) {
    this.ly_paths = ly_paths
    console.log(this.ly_paths)
    this.counter = 0
    etch.initialize(this)
  }

  render () {
    return (
      <div>
        <button onclick={() => this.incrementCounter()}>
          Increment Counter
        </button>
        <span>{this.counter}</span>
      </div>
    )
  }

  update () {}

  incrementCounter () {
    this.counter++
    // since we updated state we use in render, call etch.update
    return etch.update(this)
  }
}

export default class LilyFormalistView {

  constructor(serializedState) {

    // Query project path
    var project_paths = atom.project.getPaths()
    var project_path = project_paths[0]

    //Get files in the project path that end in .ly
    var project_dir_ly_file_paths = []
    fs.readdirSync(project_path).forEach(file => {
      if (file.slice(-3) === ".ly") {
      project_dir_ly_file_paths.push(file)
      }
    })
    project_dir_ly_file_paths.sort()

    // // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('your-name-word-count');
    //
    //Create a stateful component
    let component = new StatefulComponent(project_dir_ly_file_paths)
    // use it to make a new document element
    const element_from_component = this.element.appendChild(component.element);
    // append the new elemenet to the main div.
    //console.log(element_from_component)
    //this.element.appendChild(element_from_component)
    // //  // Create message element
    // const message = document.createElement('div');
    // message.textContent = 'The YourNameWordCount package is Alive! It\'s ALIVE!';
    // message.classList.add('message');
    // this.element.appendChild(message);
    }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    //target = atom.views.getView(atom.workspace)
    //commandName = "atom-live-server:stop-server"
    //atom.commands.dispatch(target, commandName)
    atom.workspace.close('drag.html')
    this.subscriptions.dispose();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'lilyformalist'
  }

  getURI() {
    return 'atom://lilyformalist'
  }

  getDefaultLocation() {
    // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
    // Valid values are "left", "right", "bottom", and "center" (the default).
    return 'bottom';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['top', 'bottom'];
  }

  serialize() {
    return {
      // This is used to look up the deserializer function. It can be any string, but it needs to be
      // unique across all packages!
      deserializer: 'lilyformalist/LilyFormalistView'
    };
  }

}
