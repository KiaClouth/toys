import { useEffect } from 'react'
// import { add } from 'mathjs'
// import functionPlot from 'function-plot'

import Versions from './components/Versions'

// const transform = [

// ]
// const player = {
//   lv: 1,
//   weapon: '',
//   baseAbility: {
//     str: 1,
//     int: 1,
//     vit: 1,
//     agi: 1,
//     dex: 1
//   },
//   getBaseAtk: () = {
//   }
// }
// const matk = presonLv + 4 * presonAttr.int + presonAttr.dex
// const generalAttacksDamage = (matk + presonLv - monsterLv) * monsterPRes - monsterDef * (1 - pie)
// const skillConstant = 500
// const skillRatio = (2100 + int / 2) / 100
// const skillDamage = (generalAttacksDamage + skillConstant) * skillRatio
// const cyclesDamage = skillDamage + generalAttacksDamage
// const monsterHp = 24000000
// const cycles = monsterHp / cyclesDamage

export default function GS(): JSX.Element {
  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))
    // const container = document.getElementById('container')!

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
