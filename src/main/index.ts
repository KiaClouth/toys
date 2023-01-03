import { app, shell, BrowserWindow, screen } from 'electron'
import * as path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function createWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    title: 'Toys of KiaClouth',
    icon: path.join(__dirname, '../main/icon/256.ico'),
    frame: false,
    show: false,
    resizable: false,
    transparent: true,
    backgroundColor: '#00000000',
    maximizable: false,
    webPreferences: {
      // webSecurity: false,
      preload: path.join(__dirname, '../preload/index'),
      sandbox: false,
      accessibleTitle: 'Toys of KiaClouth',
      // contextIsolation: false,
      nodeIntegration: true
      // nodeIntegrationInWorker: true,
    },
    autoHideMenuBar: true,
    ...(process.platform === 'linux'
      ? {
          icon: path.join(__dirname, '../../build/icon.png')
        }
      : {})
  })

  mainWindow.on('ready-to-show', () => {
    // mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  //ipc模块
  const ipcMain = require('electron').ipcMain

  //接收最小化命令
  ipcMain.on('window-min', function () {
    mainWindow.minimize()
  })

  // ipcMain.on('chuantou', function () {
  //   console.log('chuantou')
  //   mainWindow.setIgnoreMouseEvents(true, {
  //     forward: true
  //   })
  // })

  // ipcMain.on('huanyuan', function () {
  //   console.log('huanyuan')
  //   mainWindow.setIgnoreMouseEvents(false)
  // })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
