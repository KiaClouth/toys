import { useEffect } from 'react'
import { root, canvasResize, isCanvas } from '../tool'
import { default as wasm, greet, hcl_init } from '../assets/wasm/paint/pkg/kiya_tool'

export default function BabylonBox(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('wasmCanvas')

    if (isCanvas(canvas)) {
      canvasResize(canvas)
      wasm().then(() => {
        greet('Trump is a pig! lalalal~')
        hcl_init()
      })
      window.addEventListener('resize', () => canvasResize(canvas))
      return () => {
        root.removeEventListener('resize', () => canvasResize(canvas))
      }
    } else {
      console.log('没找到canvas对象')
      return () => {}
    }
  }, [])

  return (
    <div id="PaintBox">
      <canvas id="wasmCanvas"> 当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试 </canvas>
    </div>
  )
}
