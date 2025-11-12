import { BrowserWindow, app } from 'electron';
import path from 'path';
import { getPreloadPath, isDev } from '../util.js';


let mainWindowReference = null;
let childWindow = null;

export const setMainWindow = (window) => {
    mainWindowReference = window;
};

export const createShowWindow = (data) => {
    if (childWindow) return childWindow;

    childWindow = new BrowserWindow({
        width: data.width ?? 800,
        height: data.height ?? 600,
        webPreferences: {
            preload: getPreloadPath()
        }
    });


    if (isDev()) {
        childWindow.loadURL(`http://localhost:5123/#${data.path}`);

    } else {
        childWindow.loadFile(path.join(app.getAppPath(), 'react-dist', 'index.html'), {
            hash: data.path
        });

        if (!data.menu) {
            childWindow.setMenu(null);
        }

    }

    childWindow.on('closed', () => {
        childWindow = null;
    });

    return childWindow;
};
