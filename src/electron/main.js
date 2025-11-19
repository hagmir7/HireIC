import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "path";
import { isDev, getPreloadPath } from "./util.js";
import createLoginWindow from "./windows/loginWindow.js";
import { createShowWindow } from "./windows/showWindow.js";
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;


let showWindow;
let mainWindow;
let loginWindow;

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: "Recruit365 - INTERCOCINA",
        width: 1300,
        height: 800,
        // icon: path.join(__dirname, '..', 'inter.ico'),
        webPreferences: {
            preload: getPreloadPath(),
            nodeIntegration: true,
        },
    });


    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), 'react-dist', 'index.html'));
        mainWindow.setMenu(null)
    }

    autoUpdater.checkForUpdatesAndNotify();
    return mainWindow;
};

ipcMain.handle('login', async (event, data) => {
    try {
        if (data.access_token) {
            if (loginWindow && !loginWindow.isDestroyed()) {
                loginWindow.close();
            }

            mainWindow = createMainWindow();
            return true;
        }
        return null;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
});

ipcMain.handle('logout', async () => {
    try {
        if (mainWindow) {
            mainWindow.close();
        }

        if (!loginWindow || loginWindow.isDestroyed()) {
            loginWindow = createLoginWindow();
        } else {
            loginWindow.show();
        }

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('user', async (event, data) => {
    try {

        if (data.access_token) {
            if (loginWindow && !loginWindow.isDestroyed()) {
                loginWindow.close();
            }

            mainWindow = createMainWindow();
            return true;
        }
        return null;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
});

ipcMain.on('openShow', async (event, preload) => {
    try {

        if (showWindow && !showWindow.isDestroyed()) {
            await new Promise((resolve) => {
                showWindow.once('closed', resolve);
                showWindow.close();
            });
        }

        showWindow = createShowWindow(preload);
        showWindow.show();

        event.reply('openShow-response', { success: true });
    } catch (error) {
        console.error('openShow error:', error);
        event.reply('openShow-response', { success: false, error: error.message });
    }
});




app.on('ready', () => {
    loginWindow = createLoginWindow();
     if (!isDev()) {
        
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        loginWindow = createLoginWindow();
    }
});

// For Downloading files
ipcMain.handle('download-file', async (event, url) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.webContents.downloadURL(url);
    }
});


ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});


// Update
autoUpdater.on("update-available", (info) => {
  dialog.showMessageBox({
    type: "info",
    title: "Mise à jour disponible",
    message: `Une nouvelle mise à jour est disponible.\nVersion actuelle : ${app.getVersion()}`,
    detail: `La version ${info.version} est en cours de téléchargement...`
  });

  autoUpdater.downloadUpdate();
});

autoUpdater.on("update-not-available", (info) => {
  dialog.showMessageBox({
    type: "info",
    title: "Aucune mise à jour",
    message: `Aucune mise à jour disponible.\nVersion actuelle : ${app.getVersion()}`
  });
});

autoUpdater.on("update-downloaded", (info) => {
  dialog.showMessageBox({
    type: "info",
    buttons: ["Redémarrer maintenant", "Plus tard"],
    defaultId: 0,
    cancelId: 1,
    title: "Mise à jour prête",
    message: `Mise à jour téléchargée`,
    detail: `La version ${info.version} a été téléchargée.\nRedémarrez maintenant pour l'appliquer.`
  }).then(result => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});


autoUpdater.on("error", (error) => {
  dialog.showErrorBox("Update Error", error == null ? "unknown" : (error.stack || error.toString()));
});