const { app, BrowserWindow } = require('electron');
const path = require('path')

let mainWindow = null;

app.on('ready', () => {
  console.log('hey');
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.webContents.loadFile(path.resolve(__dirname, './index.html'));
});