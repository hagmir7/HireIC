const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  login: (payload) => ipcRenderer.invoke('login', payload),
  logout: () => ipcRenderer.invoke("logout"),
  user: (payload) => ipcRenderer.invoke('user', payload),
  openShow: (payload) => ipcRenderer.send('openShow', payload),
});


