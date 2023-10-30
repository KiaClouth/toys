importScripts('./color.js')

onmessage = (e) => {
  // 接收消息
  const c1 = e.data.c1
  const c2 = e.data.c2
  // 执行计算
  const ColorArray = []
  const color1 = new Color('sRGB', [c1.r / 255, c1.g / 255, c1.b / 255])
  const color2 = new Color('sRGB', [c2.r / 255, c2.g / 255, c2.b / 255])
  const delta = color1.contrast(color2, 'APCA')
  ColorArray.push([c1.r, c1.g, c1.b]) // 将参考颜色放在第一个
  console.log('这可能会持续几秒到几分钟的时间，计算过程较长，请耐心等待...')
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
  postMessage(ColorArray) // 发送结果回主线程
  console.log('计算结束~')
}
