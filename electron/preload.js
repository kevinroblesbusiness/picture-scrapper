const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startUpload: (data) => ipcRenderer.invoke('start-upload', data),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  readFolder: (folderPath) => ipcRenderer.invoke('read-folder', folderPath),
  onProgress: (callback) => {
    // Remove any existing listeners to prevent duplicates
    ipcRenderer.removeAllListeners('progress');
    ipcRenderer.on('progress', (event, message) => callback(message));
  }
});
