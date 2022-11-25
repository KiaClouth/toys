import App from './App'
import { root } from './tool'
import SmoothCorners from './assets/js-plugin/houdini/smooth-corners.worklet.js?url'
import ReactDOM from 'react-dom/client'

console.log(this === window ? 'browser' : 'node')
// 感知json内容打印
// Attr()

// if (path === 'node') {

// } else if (path === 'browser') {

// }

window.CSS &&
  CSS.paintWorklet &&
  CSS.paintWorklet.addModule &&
  CSS.paintWorklet.addModule(SmoothCorners)
ReactDOM.createRoot(root).render(<App />)
