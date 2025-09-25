```js
(async function(){
const myId = await window.multibox.getMyId()


function getNormalized(clientX, clientY) {
const w = window.innerWidth
const h = window.innerHeight
const x = clientX
const y = clientY
return { xRatio: x / w, yRatio: y / h }
}


window.addEventListener('mousedown', (e) => {
if (e.button !== 0) return
const { xRatio, yRatio } = getNormalized(e.clientX, e.clientY)
window.multibox.broadcastInput({ fromId: myId, type: 'mouse', xRatio, yRatio })
}, true)


window.addEventListener('keydown', (e) => {
window.multibox.broadcastInput({ fromId: myId, type: 'key', key: e.key, code: e.code, alt: e.altKey, ctrl: e.ctrlKey, shift: e.shiftKey })
}, true)


// When remote input arrives, forward into page via postMessage so inject.js can handle it
window.multibox.onRemoteInput((payload) => {
window.postMessage(Object.assign({ __multibox: true }, payload), '*')
})


console.log('renderer multibox initialized')
})()
```


---