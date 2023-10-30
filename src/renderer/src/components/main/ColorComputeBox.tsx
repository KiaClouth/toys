import { useEffect, useState } from 'react'
import { hex2rgb } from '../../tool'
import ColorComputeUrl from './../worker/ColorCompute.js?url'

export default function ColorComputeBox(): JSX.Element {
  const [BGcolor, setBGcolor] = useState<string>('#8ed353')
  const [ELcolor, setELcolor] = useState<string>('#141414')
  const [ColorBoxChild, setColorBoxChild] = useState<JSX.Element[]>([])
  const ColorComputeWorker = new Worker(ColorComputeUrl)

  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))

    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  const deltaE = (): void => {
    const c1 = hex2rgb(ELcolor)
    const c2 = hex2rgb(BGcolor)
    ColorComputeWorker.postMessage({ c1, c2 })
    ColorComputeWorker.onmessage = (e): void => {
      const result = e.data // 从 Web Worker 接收结果
      setColorBoxChild(
        result.map((color, index) => (
          <div
            key={index}
            className="subDiv"
            style={{
              backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`
            }}
          >
            {`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
          </div>
        ))
      )
      // 处理结果
    }
  }

  const handleColorInput_colorPickerEL = (event): void => setELcolor(event.target.value)

  const handleColorChange_colorPickerBG = (event): void => setBGcolor(event.target.value)

  return (
    <div id="ColorComputeBox" style={{ backgroundColor: BGcolor }}>
      <div id="title">
        <div id="mian">查找等感知亮度的颜色</div>
        <div id="info">
          选择背景色和前景色后，按下[计算]按钮将开始计算，由于计算过程非常复杂，通常需要花费几分钟的时候才能得到结果，请耐心等待...
        </div>
      </div>
      <input type="color" id="colorPickerEL" name="colorPicker2" value={ELcolor} onChange={handleColorInput_colorPickerEL}></input>
      <input type="color" id="colorPickerBG" name="colorPicker1" value={BGcolor} onChange={handleColorChange_colorPickerBG}></input>
      <button id="startCompute" onClick={deltaE} style={{ backgroundColor: ELcolor, color: BGcolor }}>
        Compute
      </button>
      <div id="colorBox">{ColorBoxChild}</div>
      <canvas id="webgpuCanvas"> 当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试 </canvas>
    </div>
  )
}
