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


    if (isDev()) {
        mainWindow.loadURL('http://localhost:5123');
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), 'react-dist', 'index.html'));
        mainWindow.setMenu(null)
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
