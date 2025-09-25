```js
const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('multibox', {
broadcastInput: (payload) => ipcRenderer.send('broadcast-input', payload),
onRemoteInput: (cb) => ipcRenderer.on('remote-input', (ev, data) => cb(data)),
getMyId: () => ipcRenderer.invoke('get-my-id')
})


// Small helper to get the sender id (we'll call from renderer)
ipcRenderer.handle('get-my-id', () => {
return ipcRenderer.senderId || 0
})
```


---