const electron = require("electron")
const { app, BrowserWindow, Menu, ipcMain } = electron

let mainWindow
let addWindow
let top
let child

app.on("ready", () => {
    mainWindow = new BrowserWindow
    mainWindow.loadURL(`file:// ${__dirname}/main.html`)
    mainWindow.on('close', () => app.quit())

    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add new to do',
        backgroundColor: 'blue'
    })
    addWindow.loadURL(`file:// ${__dirname}/add.html`)
    addWindow.on('closed', ()=> addWindow = null)
}
ipcMain.on('todo:add', (event, todo)=>{
	mainWindow.webContents.send('todo:add', todo)
	addWindow.close()
})
function parentChildWindow() {
    let child = new BrowserWindow({
        width: 300,
        height: 200,
        // vibrancy: 'menu',
        parent: top,
        modal: true,
        show: false,

    })
    child.loadURL('https://github.com')
    child.once('ready-to-show', () => {
        child.show()

    })
}



const menuTemplate = [

    {
        label: 'File',
        submenu: [{
                label: 'New Todo',
                accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',

                click() {
                    createAddWindow()
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',

                click() {
                    app.quit()
                }
            },
            {
                label: 'ChildWindow',
                click() {
                    parentChildWindow()
                }

            }


        ]
    }
]

if (process.platform === 'darwin') {
    menuTemplate.unshift({})
}
//aquí veremos si estamos en desarrollo o producción para activar las DevTools
if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [{
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Command+Alt+i' : 'Ctrl++Alt+i',

            click(item, focusedWindow) {

                focusedWindow.toggleDevTools()
            }
        }]
    })
}