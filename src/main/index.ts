'use strict';

import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';

declare const __static: string;
const iconSource = path.join(__static, '/assets/helmet.png');

const isDevelopment = process.env.NODE_ENV !== 'production';

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | undefined;

function createMainWindow() {
  const window = new BrowserWindow({
    height: 800,
    width: 1200,
    title: 'TFS Monitor',
    // tslint:disable-next-line: no-unsafe-any
    icon: iconSource,
    webPreferences: {
      webSecurity: false
    }
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
  }

  window.on('closed', () => {
    mainWindow = undefined;
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (!mainWindow) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
