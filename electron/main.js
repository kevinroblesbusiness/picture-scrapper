const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUploadToHiggsfield } = require('./automation');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for automation
ipcMain.handle('start-upload', async (event, { imagePaths, splitCount, higgsFieldUrl }) => {
  try {
    const result = await autoUploadToHiggsfield({
      imagePaths,
      splitCount,
      higgsFieldUrl,
      onProgress: (msg) => {
        if (mainWindow) mainWindow.webContents.send('progress', msg);
      }
    });
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('select-folder', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0] || null;
});

ipcMain.handle('read-folder', async (event, folderPath) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(file =>
      extensions.includes(path.extname(file).toLowerCase())
    );
    return { success: true, files: imageFiles };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
