'use babel';

/** @jsx etch.dom */

const etch = require('etch')
const fs = require('fs')
const path = require('path');
const tempWrite = require('temp-write')
const {app, BrowserWindow} = require('electron')
const interact = require('interactjs')





import lilyFormalistPlugin from './lilyformalist'

const draggableOptions = {
   onmove: event => {
      const target = event.target
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
}

class StatefulComponent {


  constructor (lyPaths) {
    this.lyPaths = lyPaths
    this.counter = 0
    this.fileNames = []
    this.lyPaths.forEach( lyPath => {
      fileName = path.basename(lyPath)
      this.fileNames.push(fileName)
    })
    this.render_order_string = this.fileNames.join("\n")
    etch.initialize(this)
  }

  render () {
    return (
      <body>
        <div>
          <h1 id="maintitle" align="right">LILYFORMALIST</h1>
          <h3 align="right">version 0.0.0</h3>
        <div>
          <span>lilypond version number: </span><input type="text" id="ly-version" placeholder="2.18.2"></input>
        </div>
        <div>
          <span>language:</span><input type="text" id="language" placeholder="english"></input>
        </div>
          <div>
            <button onclick={() => this.writeFile()}>
              Render Score
            </button>
          </div>
          <div>
          <span>{this.render_order_string}</span>
          </div>
          <div id="demo">
              <div id="drag-1" class="draggable">
                  <p> You can drag one element </p>
              </div>
              <div id="drag-2" class="draggable">
                  <p> with each pointer </p>
              </div>
          </div>
        </div>
      </body>
    )
  }

  update () {}

  writeFile () {

    // grab version and language text input from user
    var lyString = document.getElementById('ly-version').value
    if (lyString === "") {
      lyString = '2.18.2'
    }

    var languageString = document.getElementById('language').value
    if (languageString === "") {
      languageString = "english"
    }

    // construct user input into version and language statement
    const versionStatement = `\\version "` + lyString + `"`
    theString = versionStatement + "\n"

    const languageStatement = `\\language "` + languageString + `"`
    var theString = theString + languageStatement + "\n"

    // add the include statements for the ly files
    theString +=
`

{
`

    this.lyPaths.forEach( (ly_path) => {
      theString = theString + "\n\t\\include " + "\""+ ly_path + "\""
    })

    theString += "\n}"

    //write the string to a temporary file
    const tmpScoreFilepath = tempWrite.sync(theString, "test.ly")

    //copy .ly files to the tmp directory
    tmp_dir = path.dirname(tmpScoreFilepath)

    this.lyPaths.forEach( ly_path => {
      var ly_file_name = path.basename(ly_path)
      var destination = path.join(tmp_dir, ly_file_name)
      fs.copyFileSync(ly_path, destination)
    })
    //render the temporary file using lilycompile
    lilyFormalistPlugin.lilycompile.compile(tmpScoreFilepath)
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
        full_path = path.join(project_path, file)
        project_dir_ly_file_paths.push(full_path)
      }
    })
    project_dir_ly_file_paths.sort()


    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('lilyformalist');
    //
    //Create a stateful component
    let component = new StatefulComponent(project_dir_ly_file_paths)
    // use it to make a new document element
    const element_from_component = this.element.appendChild(component.element);
    // append the new element to the main div.
    console.log(element_from_component)
    this.element.appendChild(element_from_component)
    }
    //something clever

// // use it to make a new document element
// const text_node = document.createTextNode(example)
// this.element.appendChild(text_node)





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
