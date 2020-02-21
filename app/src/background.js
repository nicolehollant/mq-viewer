'use strict'

import { app, protocol, BrowserWindow, nativeTheme, ipcMain, screen } from 'electron'
import {
  createProtocol,
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

let darkmode = true

let prevWindow = {
  width: 900,
  height: 600,
  x: null,
  y: null
}

ipcMain.on('checkCurrentTheme', (event) => {
  event.reply('currentTheme', darkmode ? 'dark' : 'light')
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ 
    width: 900, 
    height: 600, 
    minWidth: 400,
    minHeight: 500,
    backgroundColor: darkmode ? '#2C2C2E' : '#E5E5EA',
    frame: false,
    webPreferences: { nodeIntegration: true, webviewTag: true } 
  })

  ipcMain.on('stretchWindow', () => {
    let display = screen.getPrimaryDisplay()
    let fullScreenWidth = display.workArea.width;
    let fullScreenHeight = display.workArea.height;
    const workTop = display.bounds.height - display.workArea.height;
    let currSize = win.getSize()
    let currPos = win.getPosition()
    if(currSize[0] !== fullScreenWidth || currSize[1] !== fullScreenHeight || currPos[0] !== 0 || currPos[1] !== workTop) {
      prevWindow.width = currSize[0]
      prevWindow.height = currSize[1]
      prevWindow.x = currPos[0]
      prevWindow.y = currPos[1]
      win.setSize(fullScreenWidth, fullScreenHeight, true)
      win.setPosition(0, workTop, true)
    } else {
      win.setSize(prevWindow.width, prevWindow.height, true)
      if(prevWindow.x && prevWindow.y) win.setPosition(prevWindow.x, prevWindow.y, true)
      else win.center()
    }
  })

  nativeTheme.on('updated', () => {
    darkmode = nativeTheme.shouldUseDarkColors
    // win.backgroundColor = darkmode ? '#2C2C2E' : '#E5E5EA'
    win.webContents.send('themeUpdated')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }

  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
