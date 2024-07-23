import { useEffect, useRef } from 'react'
import { canvasResize, isCanvas, root } from '../../tool'

export default function MatrixEffectBox(): JSX.Element {
  const canvas1Ref = useRef<HTMLCanvasElement>(null)
  const canvas2Ref = useRef<HTMLCanvasElement>(null)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="751" height="118" viewBox="0 0 751 118" fill="none">
                <path
                  d="M22.928 5.73599H54.032L76.432 117.864H55.312L51.344 98.024H25.616L21.52 117.864H0.4L22.928 5.73599ZM47.376 78.312L38.416 33.64L29.584 78.312H47.376ZM89.275 5.73599H110.395V117.864H89.275V5.73599ZM202.254 87.4L189.07 58.6H210.574L213.262 64.488L215.694 59.624V33.256H208.782L206.606 47.08H187.662L194.062 2.536H213.518L211.726 13.928H239.63V33.256H234.254V64.744L223.374 86.376L237.838 117.736H216.078L212.11 109.032L207.758 117.736H187.534L202.254 87.4ZM122.254 104.04H130.958L138.638 99.304L128.782 92.776V80.488H122.254V66.664H128.782V62.312H145.422V66.664H161.422V62.312H179.086V66.664H185.742V80.488H179.086V92.776L168.718 99.688L175.886 104.04H185.742V117.864H166.158L153.87 109.672L141.582 117.864H122.254V104.04ZM126.35 40.808H142.734L138.894 60.392H122.382L126.35 40.808ZM122.382 24.296H143.63V2.408H164.366V24.296H185.742V38.12H164.366V60.392H143.63V38.12H122.382V24.296ZM137.87 3.688L141.198 22.12H125.582L122.382 3.688H137.87ZM153.486 90.216L161.422 85.352V80.488H145.422V85.352L153.486 90.216ZM182.03 40.808L185.742 60.392H168.974L165.262 40.808H182.03ZM170.126 3.688H185.742L182.286 22.12H166.798L170.126 3.688ZM289.934 0.615997H368.014V44.776H310.67V117.864H289.934V0.615997ZM249.998 98.408H258.702V83.304H249.998V63.72H258.702V39.656H249.998V20.2H258.702V0.999992H279.31V20.2H286.734V39.656H279.31V63.72H286.734V83.304H279.31V117.864H249.998V98.408ZM347.278 28.136V17.384H310.67V28.136H347.278ZM314.254 79.464H330.766V70.888H314.254V54.248H330.766V48.616H351.63V54.248H368.014V70.888H351.63V79.464H368.014V117.864H314.254V79.464ZM347.918 104.296V93.032H334.478V104.296H347.918ZM378.254 97.64H426.126V20.2H382.862V0.871994H490.126V20.2H446.862V97.64H494.734V116.968H378.254V97.64ZM523.79 53.864H507.15V34.28H523.79V21.352L508.558 21.864V2.408L559.886 0.743996V20.072L544.526 20.584V34.28H561.294V53.864H544.526V117.48H523.79V53.864ZM509.326 59.112H521.742L519.566 117.48H507.15L509.326 59.112ZM558.606 59.112L560.782 117.48H548.366L546.19 59.112H558.606ZM562.062 99.048H582.03V93.8H564.75V75.752H582.03V70.376H563.47V51.944H621.582V70.376H602.894V75.752H620.302V93.8H602.894V99.048H622.862V117.608H562.062V99.048ZM563.47 0.743996H621.71V47.592H563.47V0.743996ZM600.846 28.776V19.56H584.206V28.776H600.846ZM638.094 100.968H657.678V0.231995H674.83V117.48H638.094V100.968ZM637.966 5.864H654.222V94.312H637.966V5.864ZM679.566 0.231995H750.478V16.872H724.366V30.312H750.094V108.904H726.926V92.392H732.046V46.952H724.366V117.48H706.318V46.952H698.638V108.904H680.59V30.312H706.318V16.872H679.566V0.231995Z"
                  fill="rgb(0,0,0)"
                />
              </svg>`

  useEffect(() => {
    if (isCanvas(canvas1Ref.current) && isCanvas(canvas2Ref.current)) {
      const c1 = canvas1Ref.current
      const c2 = canvas2Ref.current
      canvasResize(c1)
      canvasResize(c2)
      const ctx2 = c2.getContext('2d')
      if (!ctx2) return

      const characters = '0123456789qwertyuiopasdfghjklzxcvbnm'
      const charactersArray = characters.split('')

      // 字体雨元素尺寸
      const font_size = 6
      const columns = c2.width / font_size

      const drops: number[] = []

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * c2.height
      }

      const W = c2.offsetWidth
      const H = c2.offsetHeight
      const ctx1 = c1.getContext('2d')
      if (!ctx1) return

      const img = new Image()
      img.src = 'data:image/svg+xml;base64,' + btoa(svg)

      const fillColors = ['#CA74FF', '#892BC3', '#430569']
      const heightPosition = 20
      const widthPosition = c1.width / 2 - W / 2

      /**
       * A：用于绘制高亮区域的canvas
       * B：用于绘制背景文字雨的canvas
       * image：高亮区域生成源
       **/
      function draw(
        cA: HTMLCanvasElement,
        ctxA: CanvasRenderingContext2D,
        cB: HTMLCanvasElement,
        ctxB: CanvasRenderingContext2D,
        image: HTMLImageElement
      ): void {
        ctxA.fillStyle = 'white'
        ctxA.fillRect(0, 0, W, H)
        ctxA.fillStyle = '#000'
        const x = (cA.width - image.width) / 2
        const y = (cA.height - image.height) / 2
        ctxA.drawImage(image, x, y)
        const pixels = ctxA.getImageData(0, 0, cA.width, cA.height)
        const colordata = pixels.data
        // 绘制背景
        ctxB.fillStyle = 'rgba(0,0,0,0.01)'
        ctxB.fillRect(0, 0, cB.width, cB.height)

        // 绘制文字雨
        ctxB.font = font_size + 'px Helvetica'
        for (let i = 0; i < drops.length; i += 0.5) {
          ctxB.fillStyle = fillColors[Math.floor(Math.random() * fillColors.length)]
          if (
            drops[Math.floor(i)] * font_size > heightPosition &&
            drops[Math.floor(i)] * font_size < heightPosition + H &&
            i * font_size > widthPosition &&
            i * font_size < widthPosition + W
          ) {
            const height = drops[Math.floor(i)] * font_size - heightPosition
            const width = font_size * i - widthPosition
            const location = (W * height + width) * 4
            const r = colordata[location]
            const g = colordata[location + 1]
            const b = colordata[location + 2]

            const gray = r + g + b

            if (gray < 500) {
              ctxB.fillStyle = '#fff'
              ctxB.shadowBlur = 30
            }
          }
          const text = charactersArray[Math.floor(Math.random() * charactersArray.length)]
          ctxB.fillText(text, i * font_size, drops[Math.floor(i)] * font_size)
          ctxB.shadowBlur = 0
          if (drops[i] * font_size > cB.height && Math.random() > 0.955) drops[Math.floor(i)] = 0
          drops[Math.floor(i)]++
        }
      }
      setInterval(() => draw(c1, ctx1, c2, ctx2, img), 30)
      window.addEventListener('resize', () => {
        canvasResize(c1)
        canvasResize(c2)
      })
      return () => {
        root.removeEventListener('resize', () => {
          canvasResize(c1)
          canvasResize(c2)
        })
      }
    } else {
      console.log('没找到canvas对象')
      return () => {}
    }
  }, [])

  return (
    <div id="MatrixEffectBox">
      <div id="title">
        <div id="mian">数字雨特效</div>
        <div id="info">...</div>
      </div>
      <div id="canvas-wrap">
        <canvas ref={canvas1Ref} id="notC">
          {' '}
          当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试{' '}
        </canvas>
        <canvas ref={canvas2Ref} style={{ position: 'relative' }} id="effectCanvas">
          {' '}
          当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试{' '}
        </canvas>
        <div id="overlay"></div>
      </div>
    </div>
  )
}
