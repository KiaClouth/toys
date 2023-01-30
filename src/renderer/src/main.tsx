import App from './App'
import { root, resize } from './tool'
import SmoothCorners from './assets/js-plugin/houdini/smooth-corners.worklet.js?url'
import ReactDOM from 'react-dom/client'

const ss = ['sss', 'aaa', 'vvv']
ss['ster'] = 'ssswww'
ss['css'] = 'ssswww'
console.log(ss)

// 启用监听
window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.code == 'F11') {
    e.preventDefault()
    root.classList.contains('fullScreen') ? root.classList.remove('fullScreen') : root.classList.add('fullScreen')
    root.dispatchEvent(resize)
  } else if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
    console.log('a && left')
  }
})

console.log(this === window ? 'browser' : 'node')
// 感知json内容打印
// Attr()

// if (path === 'node') {

// } else if (path === 'browser') {

// }

window.CSS && CSS.paintWorklet && CSS.paintWorklet.addModule && CSS.paintWorklet.addModule(SmoothCorners)
ReactDOM.createRoot(root).render(<App />)
