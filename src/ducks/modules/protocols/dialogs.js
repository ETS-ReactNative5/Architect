import React from 'react';
import path from 'path';
import { APP_SCHEMA_VERSION } from '@app/config';
import { actionCreators as dialogActions } from '../dialogs';

export const validationErrorDialog = (e) => {
  e.friendlyMessage = (
    <React.Fragment>
      <p>
        The protocol format seems to be invalid. Please help us to troubleshoot this issue
        by sharing your protocol file (or the steps to reproduce this problem) with us by
        emailing <code>info@networkcanvas.com</code>.
      </p>
      <p>
        You may still save and edit the protocol but it <strong>will not be compatable with
        Network Canvas or Server</strong>.
      </p>
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

export const saveErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <p>
      <em>{path.basename(filePath)}</em> could not be saved. See
      the information below for details about why this error occured.
    </p>
  );

  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

export const importErrorDialog = (e, filePath) => {
  e.friendlyMessage = (
    <React.Fragment>
      <em>{path.basename(filePath)}</em> could not be imported.
    </React.Fragment>
  );
  return dialogActions.openDialog({
    type: 'Error',
    error: e,
  });
};

export const appUpgradeRequiredDialog = (filePath = '', protocol) => {
  const message = (
    <React.Fragment>
      UPGRADE NOTICE
      <em>{path.basename(filePath)}</em>
      cannot be upgraded from {protocol.schemaVersion} to {APP_SCHEMA_VERSION}
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'UserError',
    message,
  });
};

export const mayUpgradeProtocolDialog = (filePath = '', protocol) => {
  const message = (
    <React.Fragment>
      This can be upgraded, what do you thing?
      <em>{path.basename(filePath)}</em>
      cannot be upgraded from {protocol.schemaVersion} to {APP_SCHEMA_VERSION}
    </React.Fragment>
  );

  return dialogActions.openDialog({
    type: 'Confirm',
    message,
  });
};
