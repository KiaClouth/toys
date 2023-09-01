import { useEffect, useState } from 'react'
import Color from 'colorjs.io'
import { hex2rgb } from './tool'
import Versions from './components/Versions'

export default function GS(): JSX.Element {
  const [BGcolor, setBGcolor] = useState<string>('#8ed353')
  const [ELcolor, setELcolor] = useState<string>('#E1A83A')
  const ColorArray: [number, number, number][] = []
  const [ColorBoxChild, setColorBoxChild] = useState<JSX.Element[]>([])

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
    const color1 = new Color('sRGB', [c1.r / 255, c1.g / 255, c1.b / 255])
    const color2 = new Color('sRGB', [c2.r / 255, c2.g / 255, c2.b / 255])
    const delta = color1.contrast(color2, 'APCA')
    ColorArray.push([c1.r, c1.g, c1.b]) // 将参考颜色放在第一个
    console.log('start..........')
    for (let i = 0; i < 1; i += 1 / 255) {
      for (let j = 0; j < 1; j += 1 / 255) {
        for (let k = 0; k < 1; k += 1 / 255) {
          const color = new Color('sRGB', [i, j, k])
          if (Math.abs(color.contrast(color2, 'APCA') - delta) < 0.00001) {
            ColorArray.push([Math.round(i * 255), Math.round(j * 255), Math.round(k * 255)])
          }
        }
      }
    }
    console.log('okay..........')
    console.log(ColorArray)
    setColorBoxChild(
      ColorArray.map((color, index) => (
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
  }

  const handleColorInput_colorPickerEL = (event): void => setELcolor(event.target.value)

  const handleColorChange_colorPickerBG = (event): void => setBGcolor(event.target.value)

  return (
    <div id="Toram" style={{ backgroundColor: BGcolor }}>
      <Versions />
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
