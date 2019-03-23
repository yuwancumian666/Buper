import { EventEmitter } from 'events'
import { Menu } from 'electron'

export default class MenuManager extends EventEmitter {
    constructor () {
      super();
  
    //   this.keymap = keymap
      this.template = [];
  
      this.menu = null;
      this.items = {}
    }
  
    load (locale = 'zh-CN') {
      let template = null;
      try {
        template = require(`../menus/${locale}/${process.platform}.json`);
        if (!template) {
          template = require(`../menus/zh-CN/${process.platform}.json`)
        }
      } catch (err) {
        template = require(`../menus/zh-CN/${process.platform}.json`)
      }
      this.template = template['menu']
    }
  
    build () {
      const keystrokesByCommand = {};
    //   for (let item in this.keymap) {
    //     keystrokesByCommand[this.keymap[item]] = item
    //   }
      this.menu = Menu.buildFromTemplate(this.template)
    }
  
    setup (locale) {
      this.load(locale);
      this.build();
      Menu.setApplicationMenu(this.menu)
    }
}
