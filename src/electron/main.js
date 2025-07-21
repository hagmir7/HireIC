import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { isDev, getPreloadPath } from "./util.js";
import createLoginWindow from "./windows/loginWindow.js";
import { createShowWindow } from "./windows/showWindow.js";

let showWindow;
let mainWindow;
let loginWindow;

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        title: "HireIC - INTERCOCINA",
        width: 1300,
        height: 800,
        webPreferences: {
            preload: getPreloadPath(),
            nodeIntegration: true,
        },
    });


    mainWindow.setMenu(null)

    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), 'react-dist', 'index.html'));
    }

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
        if (!showWindow || showWindow.isDestroyed()) {
            showWindow = createShowWindow(preload);
        } else {
            showWindow.show();
        }

        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        return { success: false, error: error.message };
    }
});


app.on('ready', () => {
    loginWindow = createLoginWindow();

    if (!isDev()) {
        autoUpdater.checkForUpdatesAndNotify();
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