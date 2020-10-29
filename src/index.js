import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import initReactFastclick from 'react-fastclick';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import appHistory from './history';
import { store, persistor } from './ducks/store';
import App from './components/App';
import ClipPaths from './components/ClipPaths';
import initPreventFileDrop from './utils/initPreventFileDrop';
import initIPCListeners from './utils/initIPCListeners';
import initFileOpener from './utils/initFileOpener';

import './styles/main.scss';

initIPCListeners();
initPreventFileDrop();
initReactFastclick();

const startApp = () => {
  ReactDOM.render(
    <Fragment>
      <ClipPaths />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router history={appHistory}>
            <App />
          </Router>
        </PersistGate>
      </Provider>
    </Fragment>,
    document.getElementById('root'),
  );
};

window.addEventListener('load', () => {
  startApp();
  initFileOpener();
});
