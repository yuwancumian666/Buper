import { app, ipcMain, dialog } from 'electron';
import { EventEmitter } from 'events';
const gm = require('gm');  // .subClass({imageMagick: true})
import fs from 'fs'
import path from 'path'

import MenuManager from './ui/MenuManager'
import WindowManager from './ui/WindowManager';

export default class Application extends EventEmitter {
  constructor () {
    super();
    this.init();
  }

  init () {

    this.windowManager = new WindowManager();

    // this.menuManager = new MenuManager();
    // this.menuManager.setup();
    this.handleIpcMessages();
  }

  start (page) {
    this.showPage(page)
  }

  showPage (page) {
    return this.windowManager.openWindow(page)
  }

  closePage (page) {
    this.windowManager.destroyWindow(page)
  }

  stop () {

  }

  relunch (page = 'index') {
    this.stop();
    app.relaunch();
    app.exit()
  }

  handleIpcMessages () {
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

    function filterFileFromDir(pathList) {
      let fileList = [];
      pathList.forEach((path) => {
        // forEach是同步的：http://www.gimoo.net/t/1502/54e2acd26b263.html
        // 这里全部要用同步函数，不然fileList返回的是空列表
        let files = [];  // 一个path下所有的文件，含文件夹
          try {
            files = fs.readdirSync(path);
            files.forEach((file) => {
              if (fs.statSync(path+'\\'+file).isFile()) {
                fileList.push(path + '\\' + file);
                }
            })
        } catch (e) {
          return console.error(e)
        }
      });
      return fileList
    };

    ipcMain.on('open-directory-dialog', (event) => {
      /**
       * 下方出现的变量名
       * pathList & path: 路径列表(含多选)& pathList中的单个路径
       * files & file: 单个路径下所有的文件名(含文件夹)& 单个文件名(只是文件名，不含路径)
       * fileList: 要返回的所有文件的全名(含路径)
       */
      dialog.showOpenDialog({
        properties: ['openDirectory', 'multiSelections', 'showHiddenFiles']
      }, (pathList) => {
        if (pathList) {
          var fileList = filterFileFromDir(pathList);
          event.sender.send('selected-directory', fileList)
        }
      })
    });

    ipcMain.on('filter-file-type', (event, files) => {
      let fileList = [];
      let pathList = [];
      for (let index in files) {
        let file = files[index];
        if (fs.statSync(file).isFile()) {  // 过滤两种“文件类型”，“文件”和“目录”
          fileList.push(file)
        } else if (fs.statSync(file).isDirectory()) {
          pathList.push(file)
        }
      }
      fileList = fileList.concat(filterFileFromDir(pathList));
      event.sender.send('filtered-file-type', fileList);
    });

    /* 读取指定文件并以base64编码的形式发送到ipcRenderer，已经用不到了
    ipcMain.on('read-image', (event, dir) => {
      let imageData = fs.readFileSync(dir);
      event.sender.send('base64-image', imageData.toString('base64'));
    });
    */
    ipcMain.on('crop', (event, files, info) => {  // save_dir
      let local_file = []
      files.forEach((file) => {  // 过滤网络图片
        if (file.indexOf('http') !== 0) {
          local_file.push(file)
        }
      })
      
      let save_dir = path.join(path.dirname(local_file[0]), 'buper-output')
      if (!fs.existsSync(save_dir)) {  // 判断输出路径是否存在
        fs.mkdirSync(save_dir)
      }
      let processed_images = []
      local_file.forEach((file) => {
        let filename = file.split('\\').pop()
        let new_image = path.join(save_dir, filename.replace('.', '_1.'))
        gm(file).crop(info.width, info.height, info.x, info.y).write(new_image, (err) => {
          if (err) {
            console.error(err.message)
          } else {
            console.log("process " + file + " done.")
            processed_images.push(file)
          }
        })
      })
      event.sender.send("cropped", processed_images);
    })
  }
}
