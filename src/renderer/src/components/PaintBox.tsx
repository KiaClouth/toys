import { useEffect } from 'react'
import { root, canvasResize, isCanvas } from '../tool'
import { default as wasm, greet, hcl_init } from '../assets/wasm/pkg/kiya_tool'

export default function BabylonBox(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('wasmCanvas')

    function paint(canvas: HTMLCanvasElement, t?: number): void {
      if (t) {
        const n = t
        let m = n

        //限定区间
        if (n > 100) m = 100
        if (n < 0.00000000001) m = 0.00000000001

        const w = Math.trunc(1200 / 2)
        const h = Math.trunc(460 / 2)

        //   将椭圆分成4个象限的四个部分
        const coordinate: [number[], number[]] = [[], []]

        //   记录x,y正方向象限的坐标值
        for (let i = 0; i < w + 1; i++) {
          const x = i
          const y = Math.pow(Math.abs(Math.pow(h, m) * (1 - Math.pow(i, m) / Math.pow(w, m))), 1 / m) + h
          coordinate[0].push(x)
          coordinate[1].push(y)
        }
        const ctx = canvas.getContext('2d')!

        //开始绘制
        ctx.beginPath()

        // 绘制第一象限，并镜像绘制其余三个象限
        for (let i = 0; i < coordinate[0].length; i++) {
          if (i == 0) {
            ctx.moveTo(w, h)
            ctx.lineTo(w, 2 * h)
          } else ctx.lineTo(w + coordinate[0][i], +coordinate[1][i])
        }
        for (let i = 0; i < coordinate[0].length; i++) {
          if (i == 0) {
            ctx.moveTo(w, h)
            ctx.lineTo(w, 0)
          } else ctx.lineTo(w + coordinate[0][i], -coordinate[1][i] + 2 * h)
        }
        for (let i = 0; i < coordinate[0].length; i++) {
          if (i == 0) {
            ctx.moveTo(w, h)
            ctx.lineTo(w, 2 * h)
          } else ctx.lineTo(w - coordinate[0][i], +coordinate[1][i])
        }
        for (let i = 0; i < coordinate[0].length; i++) {
          if (i == 0) {
            ctx.moveTo(w, h)
            ctx.lineTo(w, 0)
          } else ctx.lineTo(w - coordinate[0][i], -coordinate[1][i] + 2 * h)
        }

        ctx.closePath()
        ctx.fill()
      } else {
        wasm().then(() => {
          greet('Trump is a pig! lalalal~')
          hcl_init()
        })
      }
    }

    if (isCanvas(canvas)) {
      canvasResize(canvas)
      paint(canvas)
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
