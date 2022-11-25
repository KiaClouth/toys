import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

window.addEventListener('ReactDomRender', () => {
  // 添加与electron主进程通信的ipc模块
  try {
    //点击穿透
    const root = document.getElementById('root')

    if (root !== null) {
      root.onmouseenter = (): void => {
        ipcRenderer.send('huanyuan', 'huanyuan')
      }
      root.onmouseleave = (): void => {
        ipcRenderer.send('chuantou', 'chuantou')
      }
    }
  } catch (error) {
    if (error instanceof EvalError) {
      console.log('EvalError')
    } else if (error instanceof RangeError) {
      console.log('RangeError')
    } else if (error instanceof ReferenceError) {
      console.log('ReferenceError')
    } else if (error instanceof SyntaxError) {
      console.log('SyntaxError')
    } else if (error instanceof TypeError) {
      console.log('TypeError')
    } else if (error instanceof URIError) {
      console.log('URIError')
    }
  }
})

// Custom APIs for renderer
const api = {
  min: (): void => {
    ipcRenderer.send('window-min', 'window-min')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
