import {ipcMain} from 'electron'

ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
        file: filePath,
        icon: "../../renderer/assets/butter.png"
    })
})
