/* eslint-disable */

const mockProtocol = require('./mockProtocol.json');

window.saveAs || ( window.saveAs = (window.navigator.msSaveBlob ? function(b,n){ return window.navigator.msSaveBlob(b,n); } : false) || window.webkitSaveAs || window.mozSaveAs || window.msSaveAs || (function(){

    // URL's
    window.URL || (window.URL = window.webkitURL);

    if(!window.URL){
      return false;
    }

    return function(blob,name){
      var url = URL.createObjectURL(blob);

      // Test for download link support
      if( "download" in document.createElement('a') ){

        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', name);

        // Create Click event
        var clickEvent = document.createEvent ("MouseEvent");
        clickEvent.initMouseEvent ("click", true, true, window, 0,
          event.screenX, event.screenY, event.clientX, event.clientY,
          event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
          0, null);

        // dispatch click event to simulate download
        a.dispatchEvent (clickEvent);

      }
      else{
        // fallover, open resource in new tab.
        window.open(url, '_blank', '');
      }
    };

  })() );

const writeFile = (filename, content, callback) => { callback(); };

const writeFileSync = (filename, content) => {};

const mkdirSync = () => {};

const existsSync = () => true;

const unlinkSync = () => true;

const readFile = (...args) => {
  const cb = args.pop();
  cb(null, '{}');
}

const readFileSync = (filename) => {
  switch(true) {
    case /\.json$/.test(filename):
      return JSON.stringify(mockProtocol);
    default:
      return '';
  }
}

const readdirSync = () => ([]);

const createWriteStream = () => {
  return {
    on: (event, callback) => {
      if (event === 'close') {
        callback();
      }
    },
  };
}

module.exports = {
  writeFile,
  writeFileSync,
  createWriteStream,
  mkdirSync,
  readFileSync,
  readdirSync,
  existsSync,
  readFile,
  unlinkSync,
};
