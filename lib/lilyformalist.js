'use babel';

import LilyFormalistView from './lilyformalist-view';
import { CompositeDisposable, Disposable } from 'atom';
import React from 'react'
import ReactDOM from 'react-dom'

const lilyFormalistPlugin = {

  lilyformalistView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    const App = function() {
      return (
        <h1>Hi, React!</h1>
      )
    }
    root = document.createElement('div');
    ReactDOM.render(
      <App />,
      root
    );
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable(

      atom.workspace.addOpener(uri => {
        if (uri === 'atom://lilyformalist') {
          return atom.workspace.addBottomPanel({item: root});
        }
      }),

      atom.commands.add(
        'atom-workspace', {'lilyformalist:toggle': () => this.toggle()}
      ),

      new Disposable(
        () => {atom.workspace.getPaneItems().forEach(item =>
          {
            if (item instanceof LilyFormalistView) {
              item.destroy()
            }
          })
        }
      )
    )
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    atom.workspace.toggle('atom://lilyformalist')
  },

  deserializeLilyFormalistView(serialized) {
    return new LilyFormalistView();
  },

  handleURI (parsedUri) {
    console.log(parsedUri)
  },

  consumeCompile(lilycompile) {
  this.lilycompile = lilycompile
  return new Disposable(() => {
      this.lilycompile = null;
    });
  }

};
export default lilyFormalistPlugin
