'use babel';

const fs = require('fs')
const path = require('path');
const React = require('react')
const ReactDOM = require('react-dom')

import Draggable, {DraggableCore} from 'react-draggable';

export default class LilyFormalistView {

  constructor(serializedState) {
    // Get .ly files in project path
    this.getLilyPondFilePaths()
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('lilyformalist-view');

    // render React component to root element
    ReactDOM.render(
      <App paths={this.project_dir_ly_file_paths} />,
      this.element
    );

    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The LilyFormalist package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
  // Used by Atom for tab text
  return 'lilyformalist';
  }

  getURI() {
    // Used by Atom to identify the view when toggling.
    return 'atom://lilyformalist';
  }

  getDefaultLocation() {
  // This location will be used if the user hasn't overridden it by dragging the item elsewhere.
  // Valid values are "left", "right", "bottom", and "center" (the default).
  return 'right';
  }

  getAllowedLocations() {
    // The locations into which the item can be moved.
    return ['bottom'];
  }

  getLilyPondFilePaths() {
    // Query project path
       var project_paths = atom.project.getPaths()
       var project_path = project_paths[0]

       // Get files in the project path that end in .ly
       var project_dir_ly_file_paths = []
       fs.readdirSync(project_path).forEach(file => {
         if (file.slice(-3) === ".ly") {
           full_path = path.join(project_path, file)
           project_dir_ly_file_paths.push(full_path)
         }
       })
       project_dir_ly_file_paths.sort()
       this.project_dir_ly_file_paths = project_dir_ly_file_paths
      console.log(this.project_dir_ly_file_paths)
  }

}

class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    var pathItems = this.props.paths.map( (path) =>

    <Draggable
   axis="x"
   handle=".handle"
   defaultPosition={{x: 0, y: 0}}
   position={null}
   grid={[25, 25]}
   onStart={this.handleStart}
   onDrag={this.handleDrag}
   onStop={this.handleStop}>
   <div>
     <div className="handle">{path}</div>
   </div>
 </Draggable>
)
    return (
      <div>
          {pathItems}
      </div>
    )
  }
}
