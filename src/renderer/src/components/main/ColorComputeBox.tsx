import { useEffect, useState } from 'react'

import { hex2rgb } from '../../tool'
import ColorComputeUrl from './../worker/ColorCompute.js?url'

export default function ColorComputeBox(): JSX.Element {
  const [BGcolor, setBGcolor] = useState<string>('#8ed353')
  const [ELcolor, setELcolor] = useState<string>('#141414')
  const [Progress, setProgress] = useState<string>('点击计算')
  const [mainComponentState, setMainComponentState] = useState<string>('idle')
  const [ColorBoxChild, setColorBoxChild] = useState<JSX.Element[]>([])
  const ColorComputeWorker = new Worker(ColorComputeUrl)
  let key = 0

  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))

    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  const deltaE = (): void => {
    setColorBoxChild([])
    setMainComponentState('busy') // 调整输入组件可用性
    const el = hex2rgb(ELcolor)
    const bg = hex2rgb(BGcolor)
    ColorComputeWorker.postMessage({ el, bg })
    const colorBoxContent: JSX.Element[] = []
    ColorComputeWorker.onmessage = (e): void => {
      // 从 Web Worker 接收结果
      // 处理结果
      if (e.data.class === 'progress') {
        setProgress('[当前进度：' + e.data.value.toFixed(2) + '%' + ']，已找到' + key + '个')
      } else if (e.data.class === 'color') {
        if (key++ >= 1000) {
          ColorComputeWorker.terminate()
          console.log('已得到颜色超过1000个，为防止数量过多导致页面崩溃，已终止计算')
          setMainComponentState('idle')
          setProgress('已终止，点击再次计算')
        } else {
          const color = e.data.value.color
          const newDiv = (
            <div
              key={key}
              className="subDiv"
              style={{
                backgroundColor: color.oklch
                  ? `oklch(${color.oklch.l / 100} ${color.oklch.c / 100} ${color.oklch.h})`
                  : `rgb(${color.srgb.r} ${color.srgb.g} ${color.srgb.b})`,
                border: '1px solid rgb(0, 0, 0)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span>{`rgb(${color.srgb.r}, ${color.srgb.g}, ${color.srgb.b})`}</span>
              {color.oklch ? <span>{`OkLch(${color.oklch.l}, ${color.oklch.c}, ${color.oklch.h})`}</span> : null}
              <span>{`dE：${e.data.value.dE.toFixed(2)}`}</span>
              <span>{`dL: ${e.data.value.dL.toFixed(2)}`}</span>
            </div>
          )
          colorBoxContent.push(newDiv)
          setColorBoxChild(colorBoxContent)
        }
      } else if (e.data.class === 'finish') {
        // setTotal(0)
        key = 0
        setMainComponentState('idle')
        setProgress('已对比' + e.data.value + '个颜色，点击再次计算')
      }
    }
  }

  const handleColorInput_colorPickerEL = (event): void => {
    setELcolor(event.target.value)
    key = 0
  }

  const handleColorChange_colorPickerBG = (event): void => {
    setBGcolor(event.target.value)
    key = 0
  }

  return (
    <div id="ColorComputeBox" className={mainComponentState} style={{ backgroundColor: BGcolor }}>
      <div id="title">
        <div id="mian">查找等感知对比度的颜色</div>
        <div id="info">
          选择背景色和前景色后，按下[计算]按钮将锁定输入并开始计算，由于计算过程非常复杂，通常需要花费几分钟的时候才能得到结果，请耐心等待...
        </div>
      </div>
      <input type="color" id="colorPickerEL" name="colorPicker2" value={ELcolor} onChange={handleColorInput_colorPickerEL}></input>
      <input type="color" id="colorPickerBG" name="colorPicker1" value={BGcolor} onChange={handleColorChange_colorPickerBG}></input>
      <button id="startCompute" onClick={deltaE} style={{ backgroundColor: ELcolor, color: BGcolor }}>
        {Progress}
      </button>
      <div id="colorBox">{ColorBoxChild}</div>
      <canvas id="webgpuCanvas"> 当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试 </canvas>
    </div>
  )
}
