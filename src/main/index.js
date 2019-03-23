import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import Application from './Application'
import path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`;

function createWindow () {
  /**
   * Initial window options
   */
    mainWindow = new BrowserWindow({
        width: 960,
        height: 580,
        minWidth: 840,
        minHeight: 420,
        useContentSize: true,
        frame: true,  // 是否创建frameless窗口
        center: true,  // 是否出现在屏幕居中的位置
        resizable: true,  // 是否允许拉伸大小
        webPreferences: {
            backgroundThrottling: false  // 当页面被置于非激活窗口的时候是否停止动画和计时器
        }
    });
    new Application();
    mainWindow.loadURL(winURL);
    mainWindow.webContents.closeDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null
    });
    return mainWindow
}


process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function init () {
    var window;
  app.on('ready', () => {
    global.application = new Application();
    global.application.start('index')
    //   window = createWindow()
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });

  app.on('activate', () => {
    // if (mainWindow === null) {
    //     window = createWindow()
    // }
    global.mainWindow = global.application.showPage('index')
  });

  /**
   * 文件拖拽
  ipcMain.on('dragenter', (event, filepath) => {
    const iconName = 'drag.png';
    console.log(path.join(__dirname, iconName)); // src\main\drag.png
    console.log(filepath);  // src\renderer\components\MainPage.vue?vue&type=script&lang=js&
    event.sender.startDrag({
      file: filepath,
      icon: path.join(__dirname, iconName),
    })
  });
  */
  /*
  * https://electronjs.org/docs/api/dialog
  * 在 Windows 和 Linux 上, 打开对话框不能同时是文件选择器和目录选择器,
  * 因此如果在这些平台上将 properties 设置为["openFile"、"openDirectory"],
  * 则将显示为目录选择器。
  * */
  ipcMain.on('open-file-dialog', (event) => {
    dialog.showOpenDialog({
      filters: [
        { name: '图片', extensions: ['jpg', 'png', 'jpeg', 'ico']}
      ],
      properties: ['openFile', 'multiSelections', 'showHiddenFiles']
    }, (files) => {
      if (files) {
        event.sender.send('selected-file', files)
      }
    });
  });

  ipcMain.on('open-directory-dialog', (event) => {
    dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (files) => {
      if (files) {
        event.sender.send('selected-directory', files)
      }
    })
  });

  ipcMain.on('fuckDrop', (event, files) => {
    console.log("fuck drop");
    files.forEach((file) => {
      console.log(typeof file, file)
    });
    event.sender.send('dropFuck', files);
  })

}

init();

























/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

