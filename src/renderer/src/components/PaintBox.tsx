import { useEffect } from 'react'
import { root, canvasResize, isCanvas } from '../tool'
import { default as wasm, greet, hcl_init } from '../assets/wasm/pkg/kiya_tool'

export default function BabylonBox(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('wasmCanvas')

    if (isCanvas(canvas)) {
      window.addEventListener('ReactDomRender', () => canvasResize(canvas))
      window.addEventListener('resize', () => canvasResize(canvas))
      wasm().then(() => {
        greet('Trump is a pig! lalalal~')
        hcl_init()
      })
      canvas.onclick = (): void => {
        alert('click!')
      }
      return () => {
        window.removeEventListener('ReactDomRender', () => canvasResize(canvas))
        root.removeEventListener('resize', () => canvasResize(canvas))
      }
    } else {
      console.log('没找到canvas对象')
      return () => {}
    }
  }, [])

  return (
    <div id="BabylonBox">
      <canvas id="wasmCanvas"> 当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试 </canvas>
    </div>
  )
}
