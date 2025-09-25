```js
// Injected into the page context
(function(){
if (window.__wartune_multibox_injected) return
window.__wartune_multibox_injected = true


window.addEventListener('message', (ev) => {
try {
const data = ev.data
if (!data || !data.__multibox) return


if (data.type === 'mouse') {
// compute client coords
const w = window.innerWidth
const h = window.innerHeight
const x = Math.round(data.xRatio * w)
const y = Math.round(data.yRatio * h)
// create and dispatch events at point
const el = document.elementFromPoint(x, y) || document.body
['mousemove','mousedown','mouseup','click'].forEach((t) => {
const evt = new MouseEvent(t, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 })
el.dispatchEvent(evt)
})
}


else if (data.type === 'key') {
const evt = new KeyboardEvent('keydown', { key: data.key, code: data.code, bubbles: true })
document.dispatchEvent(evt)
}
} catch(e) {
console.error('multibox inject error', e)
}
})


// allow console logging to help debugging
console.log('Wartune multibox injector loaded')
})()
```


---