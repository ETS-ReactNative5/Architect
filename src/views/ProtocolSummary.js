import React, { useEffect } from 'react';
import { remote } from 'electron';
import path from 'path';
import fse from 'fs-extra';
import os from 'os';
import ProtocolSummary from '@app/lib/ProtocolSummary/ProtocolSummary';

const print = () => {
  const win = remote.BrowserWindow.getFocusedWindow();

  win.webContents.printToPDF({}).then((data) => {
    const pdfPath = path.join(os.homedir(), 'Desktop', 'temp.pdf');
    fse.writeFile(pdfPath, data, (error) => {
      if (error) { throw error; }
      console.log(`Wrote PDF successfully to ${pdfPath}`);
    });
  }).catch((error) => {
    console.log(`Failed to write PDF to ${pdfPath}: `, error);
  });
};

const ProtocolSummaryView = () => {
  useEffect(() => {
    print();
  }, []);

  return (
    <div>
      <ProtocolSummary />
    </div>
  );
};

export default ProtocolSummaryView;
