import { useEffect } from 'react'
// import * as d3 from 'd3'
// import functionPlot from 'function-plot'

import Versions from './components/Versions'

// window['d3'] = d3

export default function GS(): JSX.Element {
  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))
    const container = document.getElementById('container')!

    // functionPlot({
    //   target: container,
    //   width: 1280,
    //   height: 720,
    //   xAxis: { domain: [-1, 9] },
    //   yAxis: { domain: [-1, 9] },
    //   grid: true,
    //   data: [
    //     {
    //       fn: 'x^2',
    //       derivative: {
    //         fn: '2 * x',
    //         updateOnMouseMove: true
    //       }
    //     }
    //   ]
    // })

    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  return (
    <div id="Toram">
      <Versions />
      <div id="container"></div>
    </div>
  )
}
