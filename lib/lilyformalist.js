'use babel';

import LilyFormalistView from './lilyformalist-view';
import {CompositeDisposable, Disposable} from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener(uri => {
        if (uri === 'atom://lilyformalist') {
          return new LilyFormalistView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add('atom-workspace', {
        'lilyformalist:toggle': () => this.toggle()
      }),

      // Destroy any LilyFormalistViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof LilyFormalistView) {
            item.destroy();
          }
        });
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    atom.workspace.toggle('atom://lilyformalist');
  }

};

// 'use babel';
//
// import LilyFormalistView from './lilyformalist-view';
// import { CompositeDisposable, Disposable } from 'atom';
// import Draggable, {DraggableCore} from 'react-draggable';
//
// const React = require('react')
// const ReactDOM = require('react-dom')
// const fs = require('fs')
// const path = require('path')
//
// const lilyFormalistPlugin = {
//
//   lilyformalistView: null,
//   modalPanel: null,
//   subscriptions: null,
//
//   activate(state) {
//     // Query project path
//     var project_paths = atom.project.getPaths()
//     var project_path = project_paths[0]
//
//     //Get files in the project path that end in .ly
//     var project_dir_ly_file_paths = []
//     fs.readdirSync(project_path).forEach(file => {
//       if (file.slice(-3) === ".ly") {
//         full_path = path.join(project_path, file)
//         project_dir_ly_file_paths.push(full_path)
//       }
//     })
//     project_dir_ly_file_paths.sort()
//
//
//     // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
//     this.subscriptions = new CompositeDisposable(
//
//       atom.workspace.addOpener(uri => {
//         if (uri === 'atom://lilyformalist') {
//           return new LilyFormalistView();
//         }
//       }),
//
//       // Destroy any ActiveEditorInfoViews when the package is deactivated.
//        new Disposable(() => {
//          atom.workspace.getPaneItems().forEach(item => {
//            if (item instanceof LilyFormalistView) {
//              item.destroy();
//            }
//          });
//        })
//      );
//
//       atom.commands.add(
//         'atom-workspace', {'lilyformalist:toggle': () => this.toggle()}
//       )
//   },
//
//   deactivate() {
//     this.subscriptions.dispose();
//   },
//
//   toggle() {
//     atom.workspace.toggle('atom://lilyformalist')
//   },
//
//   deserializeLilyFormalistView(serialized) {
//     return new LilyFormalistView();
//   },
//
//   handleURI (parsedUri) {
//     console.log(parsedUri)
//   },
//
//   consumeCompile(lilycompile) {
//   this.lilycompile = lilycompile
//   return new Disposable(() => {
//       this.lilycompile = null;
//     });
//   },
//
//   writeFile () {
//
//     // grab version and language text input from user
//     var lyString = document.getElementById('ly-version').value
//     if (lyString === "") {
//       lyString = '2.18.2'
//     }
//
//     var languageString = document.getElementById('language').value
//     if (languageString === "") {
//       languageString = "english"
//     }
//
//     // construct user input into version and language statement
//     const versionStatement = `\\version "` + lyString + `"`
//     theString = versionStatement + "\n"
//
//     const languageStatement = `\\language "` + languageString + `"`
//     var theString = theString + languageStatement + "\n"
//
//     // add the include statements for the ly files
//     theString +=
// `
//
// {
// `
//
//     this.lyPaths.forEach( (ly_path) => {
//       theString = theString + "\n\t\\include " + "\""+ ly_path + "\""
//     })
//
//     theString += "\n}"
//
//     //write the string to a temporary file
//     const tmpScoreFilepath = tempWrite.sync(theString, "test.ly")
//
//     //copy .ly files to the tmp directory
//     tmp_dir = path.dirname(tmpScoreFilepath)
//
//     this.lyPaths.forEach( ly_path => {
//       var ly_file_name = path.basename(ly_path)
//       var destination = path.join(tmp_dir, ly_file_name)
//       fs.copyFileSync(ly_path, destination)
//     })
//     //render the temporary file using lilycompile
//     lilyFormalistPlugin.lilycompile.compile(tmpScoreFilepath)
//   }
//
// };
// export default lilyFormalistPlugin
