```js
const { app, BrowserWindow, ipcMain, session } = require('electron')
const path = require('path')


// Default game URL; override with env GAME_URL
const GAME_URL = process.env.GAME_URL || 'https://wartune.wan.com/'


let wins = []


function createClientWindow(x, y, w, h, title) {
const win = new BrowserWindow({
x, y, width: w, height: h,
webPreferences: {
preload: path.join(__dirname, 'preload.js'),
contextIsolation: true,
nodeIntegration: false,
sandbox: false
},
title
})


// Load the remote site directly
win.loadURL(GAME_URL)


// After page loads, inject helper script to synthesize events inside page
win.webContents.on('did-finish-load', async () => {
try {
const injectCode = require('fs').readFileSync(path.join(__dirname, 'inject.js'), 'utf8')
await win.webContents.executeJavaScript(injectCode)
} catch (e) {
console.error('inject failed', e)
}
})


wins.push(win)
win.on('closed', () => { wins = wins.filter(w => w !== win) })
return win
}


app.whenReady().then(() => {
// Example: create two windows side-by-side; change sizes/positions as you like
createClientWindow(0, 0, 1024, 768, 'Wartune - Account1')
createClientWindow(1030, 0, 800, 600, 'Wartune - Account2')


app.on('activate', () => {
if (BrowserWindow.getAllWindows().length === 0) createClientWindow(0,0,1024,768,'Wartune - Account1')
})
})


app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })


// IPC: renderer -> main (broadcast input event to other windows)
ipcMain.on('broadcast-input', (ev, payload) => {
// forward to all windows except sender
wins.forEach(w => {
if (w.webContents.id === payload.fromId) return
w.webContents.send('remote-input', payload)
})
})


// Optional: expose a way to get the current game URL
ipcMain.handle('get-game-url', () => GAME_URL)
```


---