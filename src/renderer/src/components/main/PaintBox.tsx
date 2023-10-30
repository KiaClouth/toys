import { useEffect } from 'react'
import { root, canvasResize, isCanvas } from '../../tool'
import { default as wasm, greet, hcl_init } from '../../assets/wasm/paint/pkg/kiya_tool'

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
      <div id="title">
        <div id="mian">简易涂鸦</div>
        <div id="info">这是一个wasm内容，使用rust完成的canvas绘制。在页面上按下并拖动鼠标将绘制线条。</div>
      </div>
      <canvas id="wasmCanvas"> 当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试 </canvas>
    </div>
  )
}
