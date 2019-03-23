import MenuManager from './ui/MenuManager'
import { EventEmitter } from 'events';
import WindowManager from './ui/WindowManager';
import { app } from 'electron';

export default class Application extends EventEmitter {
    constructor () {
        super();
        this.init();
    }

    init () {

        this.windowManager = new WindowManager();

        this.menuManager = new MenuManager();
        this.menuManager.setup()
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

}
