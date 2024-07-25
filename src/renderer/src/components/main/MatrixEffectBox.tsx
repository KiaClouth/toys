import { useEffect, useRef } from 'react'
import { canvasResize, isCanvas } from '../../tool'
import AI_B from '../../public/img/WoniuSec/AI-black.svg?url'
import AI_W from '../../public/img/WoniuSec/AI-white.svg?url'
import T1 from '../../public/img/WoniuSec/1st.svg?url'
import T2 from '../../public/img/WoniuSec/2nd.svg?url'
import T3 from '../../public/img/WoniuSec/3rd.svg?url'
import T4 from '../../public/img/WoniuSec/4th.svg?url'
// import Nav from '../../public/img/WoniuSec/Nav.svg?url'

export default function MatrixEffectBox(): JSX.Element {
  const TitleImageRef = useRef<HTMLImageElement>(null)
  // canvas1和canvas2是辅助画布，canvas3是主画布
  const templateCanvas1Ref = useRef<HTMLCanvasElement>(null)
  const templateCanvas2Ref = useRef<HTMLCanvasElement>(null)
  const effectCanvas1Ref = useRef<HTMLCanvasElement>(null)
  const effectCanvas2Ref = useRef<HTMLCanvasElement>(null)
  const effectCanvas3Ref = useRef<HTMLCanvasElement>(null)
  // 视差动画操作对象
  const img1Ref = useRef<HTMLImageElement>(null)
  const img2Ref = useRef<HTMLImageElement>(null)
  const img3Ref = useRef<HTMLImageElement>(null)
  const matrixEffectBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const titleImage = TitleImageRef.current
    if (titleImage) titleImage.style.opacity = '0.5'
    // 视差动画
    const img1 = img1Ref.current
    const img2 = img2Ref.current
    const img3 = img3Ref.current
    const matrixEffectBox = matrixEffectBoxRef.current

    const matrixEffectBoxParallaxFn = (): void => {
      const scrollOffsetY = matrixEffectBox?.scrollTop ?? 0
      if (img1 && img2 && img3) {
        img1.style.transform = `translateY(${-scrollOffsetY * 0.3}px)`
        img2.style.transform = `translateY(${-scrollOffsetY * 0.2}px)`
        img3.style.transform = `translateY(${-scrollOffsetY * 0.1}px)`
      }
    }
    matrixEffectBox?.addEventListener('scroll', matrixEffectBoxParallaxFn)

    // 文字雨动画
    if (
      isCanvas(templateCanvas1Ref.current) &&
      isCanvas(templateCanvas2Ref.current) &&
      isCanvas(effectCanvas1Ref.current) &&
      isCanvas(effectCanvas2Ref.current) &&
      isCanvas(effectCanvas3Ref.current)
    ) {
      const c1 = templateCanvas1Ref.current
      const c2 = templateCanvas2Ref.current
      const ce1 = effectCanvas1Ref.current
      const ce2 = effectCanvas2Ref.current
      const ce3 = effectCanvas3Ref.current
      // 将所有canvas尺寸设置为父级尺寸
      canvasResize(c1)
      canvasResize(c2)
      canvasResize(ce1)
      canvasResize(ce2)
      canvasResize(ce3)
      const ctx1 = c1.getContext('2d')
      const ctx2 = c2.getContext('2d')
      const ctxE1 = ce1.getContext('2d')
      const ctxE2 = ce2.getContext('2d')
      const ctxE3 = ce3.getContext('2d')
      if (!ctx1 || !ctx2 || !ctxE1 || !ctxE2 || !ctxE3) return

      // 字体雨
      const characters = '0123456789abcdefghijklmnopqrstuvwxyz'
      const charactersArray = characters.split('')
      const font_size = 8
      const columns = ce1.width / font_size
      const fillColors = ['rgba(211,115,255,1)', 'rgba(161, 9, 255, 0.5)', 'rgba(161, 9, 255, 0.3)', 'rgba(161, 9, 255, 0.1)']
      const highlightColor = '#FFF'

      const drops: number[] = []

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * ce1.height
      }

      const W = ce1.offsetWidth
      const H = ce1.offsetHeight

      const img = new Image()
      img.src = AI_B

      const heightPosition = 0
      const widthPosition = c1.width / 2 - W / 2

      /**
       * A：用于绘制高亮区域的canvas
       * B: 合成效果canvas
       * CE：分层显示canvas组
       * image：高亮区域生成源
       **/
      function draw(
        cA: HTMLCanvasElement,
        ctxA: CanvasRenderingContext2D,
        cB: HTMLCanvasElement,
        ctxB: CanvasRenderingContext2D,
        effectCanvas: {
          ce1: {
            canvas: HTMLCanvasElement
            ctx: CanvasRenderingContext2D
          }
          ce2: {
            canvas: HTMLCanvasElement
            ctx: CanvasRenderingContext2D
          }
          ce3: {
            canvas: HTMLCanvasElement
            ctx: CanvasRenderingContext2D
          }
        },
        image: HTMLImageElement
      ): void {
        // 在辅助画布上计算高亮区域数据
        // 绘制白色背景
        ctxA.fillStyle = 'white'
        ctxA.fillRect(0, 0, W, H)
        // 将svg形状以黑色绘制
        ctxA.fillStyle = 'black'
        // 绘制位置居中
        const x = (cA.width - image.width) / 2
        const y = (cA.height - image.height) / 2 - 140
        ctxA.drawImage(image, x, y)
        const pixels = ctxA.getImageData(0, 0, cA.width, cA.height)
        // 记录像素数据
        const colordata = pixels.data

        const cEA = effectCanvas.ce1.canvas
        const ctxEA = effectCanvas.ce1.ctx
        const cEB = effectCanvas.ce2.canvas
        const ctxEB = effectCanvas.ce2.ctx
        const cEC = effectCanvas.ce3.canvas
        const ctxEC = effectCanvas.ce3.ctx
        ctxEA.clearRect(0, 0, cEA.width, cEA.height)
        ctxEB.clearRect(0, 0, cEB.width, cEB.height)
        ctxEC.clearRect(0, 0, cEC.width, cEC.height)

        // 分别配置高亮区域和其他区域的消失速度
        const cImageData = ctxB.getImageData(0, 0, cB.width, cB.height)
        const cData = cImageData.data
        for (let i = 0; i < cData.length; i += 4) {
          if (cData[i] === 255 && cData[i + 1] === 255 && cData[i + 2] === 255) {
            cData[i + 3] = 0.994 * cData[i + 3]
          } else {
            cData[i + 3] = 0.98 * cData[i + 3]
          }
        }
        ctxB.clearRect(0, 0, cB.width, cB.height)
        ctxB.putImageData(cImageData, 0, 0)

        // 绘制文字雨
        ctxB.font = font_size + 'px Helvetica'
        ctxEA.font = font_size + 'px Helvetica'
        ctxEB.font = font_size + 'px Helvetica'
        ctxEC.font = font_size + 'px Helvetica'
        for (let i = 0; i < drops.length; i += 0.5) {
          ctxB.fillStyle = fillColors[Math.floor(Math.random() * fillColors.length)]
          ctxEA.fillStyle = fillColors[Math.floor(Math.random() * fillColors.length)]
          ctxEB.fillStyle = fillColors[Math.floor(Math.random() * fillColors.length)]
          ctxEC.fillStyle = fillColors[Math.floor(Math.random() * fillColors.length)]
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
              ctxB.fillStyle = highlightColor
              ctxEA.fillStyle = highlightColor
              ctxEB.fillStyle = highlightColor
              ctxEC.fillStyle = highlightColor
              ctxB.shadowBlur = 30
              ctxEA.shadowBlur = 30
              ctxEB.shadowBlur = 30
              ctxEC.shadowBlur = 30
            }
          }
          const text = charactersArray[Math.floor(Math.random() * charactersArray.length)]
          // 将图像分成3个画布渲染
          switch (Math.floor(i) % 3) {
            case 0:
              ctxEA.fillText(text, i * font_size, drops[Math.floor(i)] * font_size)
              ctxEA.shadowBlur = 0
              break
            case 1:
              ctxEB.fillText(text, i * font_size, drops[Math.floor(i)] * font_size)
              ctxEB.shadowBlur = 0
              break
            case 2:
              ctxEC.fillText(text, i * font_size, drops[Math.floor(i)] * font_size)
              ctxEC.shadowBlur = 0
              break
            default:
              break
          }
          ctxB.fillText(text, i * font_size, drops[Math.floor(i)] * font_size)
          ctxB.shadowBlur = 0
          if (drops[i] * font_size > cB.height && Math.random() > 0.955) drops[Math.floor(i)] = 0
          drops[Math.floor(i)]++
        }
      }
      const effectCanvas = {
        ce1: {
          canvas: ce1,
          ctx: ctxE1
        },
        ce2: {
          canvas: ce2,
          ctx: ctxE2
        },
        ce3: {
          canvas: ce3,
          ctx: ctxE3
        }
      }
      setInterval(() => draw(c1, ctx1, c2, ctx2, effectCanvas, img), 30)

      const matrixEffectBoxCanvasResizeFn = (): void => {
        canvasResize(c1)
        canvasResize(c2)
        canvasResize(ce1)
        canvasResize(ce2)
        canvasResize(ce3)
      }
      window.addEventListener('resize', matrixEffectBoxCanvasResizeFn)
      return () => {
        window.removeEventListener('resize', matrixEffectBoxCanvasResizeFn)
        matrixEffectBox?.removeEventListener('scroll', matrixEffectBoxParallaxFn)
      }
    } else {
      console.log('没找到canvas对象')
      return () => {
        matrixEffectBox?.removeEventListener('scroll', matrixEffectBoxParallaxFn)
      }
    }
  }, [])

  return (
    <div id="MatrixEffectBox" ref={matrixEffectBoxRef} style={{ backgroundColor: 'rgba(5, 15, 40, 1)', overflow: 'auto' }}>
      {/* <img src={Nav} alt="Nav" className="nav" /> */}
      <div className="firstScreen" style={{ position: 'relative', zIndex: 1 }}>
        <canvas ref={templateCanvas1Ref} className="templateCanvas"></canvas>
        <canvas ref={templateCanvas2Ref} className="effectCanvas"></canvas>
        <img src={T4} alt="illustration" className="illustration" style={{ zIndex: 1, top: 'calc(100vh - 300px)' }} />
        <canvas ref={effectCanvas1Ref} className="effectCanvas" style={{ zIndex: 2 }}>
          当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试
        </canvas>
        <img ref={img3Ref} src={T3} alt="illustration" className="illustration" style={{ zIndex: 3, top: 'calc(100vh - 240px)' }} />
        <canvas ref={effectCanvas2Ref} className="effectCanvas" style={{ zIndex: 4 }}></canvas>
        <img ref={img2Ref} src={T2} alt="illustration" className="illustration" style={{ zIndex: 5, top: 'calc(100vh - 210px)' }} />
        <canvas ref={effectCanvas3Ref} className="effectCanvas" style={{ zIndex: 6 }}></canvas>
        <img ref={img1Ref} src={T1} alt="illustration" className="illustration" style={{ zIndex: 7, top: 'calc(100vh - 100px)' }} />
        <img
          ref={TitleImageRef}
          src={AI_W}
          alt="ai"
          style={{
            zIndex: 1,
            position: 'fixed',
            top: 'calc(50vh - 140px)',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            filter: 'drop-shadow(0px 0px 80px #CA74FF) blur(15px)',
            mixBlendMode: 'plus-lighter',
            transition: 'all 2s',
            transitionDelay: '2s',
            opacity: 0
          }}
        />
      </div>
      <div className="mainContent" style={{ position: 'relative', height: '2000px', backgroundColor: '#000', zIndex: 100 }}></div>
    </div>
  )
}
