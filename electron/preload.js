const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startUpload: (data) => ipcRenderer.invoke('start-upload', data),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  onProgress: (callback) => ipcRenderer.on('progress', (event, message) => callback(message))
});
