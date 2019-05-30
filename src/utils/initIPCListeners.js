import React from 'react';
import { ipcRenderer } from 'electron';
import { store } from '../ducks/store';
import { actionCreators as protocolsActions } from '../ducks/modules/protocols';
import { actionCreators as dialogActions } from '../ducks/modules/dialogs';

const initIPCListeners = () => {
  ipcRenderer.on('SAVE_COPY', (e, filePath) => {
    store.dispatch(protocolsActions.saveCopy(filePath));
  });

  ipcRenderer.on('SAVE', () => {
    store.dispatch(protocolsActions.saveAndExportProtocol());
  });

  ipcRenderer.on('CONFIRM_CLOSE', () => {
    const state = store.getState();
    const hasUnsavedChanges = state.session.lastChanged > state.session.lastSaved;

    if (!hasUnsavedChanges) {
      ipcRenderer.send('QUIT');
      return;
    }

    store.dispatch(
      dialogActions.openDialog({
        type: 'Warning',
        title: 'Unsaved changes',
        message: (
          <div>
            Are you sure you want to exit the application?
            <p><strong>Any unsaved changes will be lost!</strong></p>
          </div>
        ),
        confirmLabel: 'Exit application',
        onConfirm: () => {
          ipcRenderer.send('QUIT');
        },
      }),
    );
  });
};

export default initIPCListeners;
