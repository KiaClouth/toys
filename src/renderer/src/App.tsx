import { useState, useEffect } from 'react'
import { root, resize } from './tool'
import { default as wasm, greet, hcl_init } from './assets/wasm/pkg/kiya_tool'

import BabylonBox from './components/BabylonBox'
import Menu from './components/Menu'
import LoadingAnimation from './components/LoadingAnimation'
import Versions from './components/Versions'
import BannerBox from './components/BannerBox'

export default function GS(): JSX.Element {
  const [appState, setAppState] = useState('LoadingAnimation')
  const appStateArray = ['Paint', 'BannerBox', 'BabylonBox']

  const classReplace = (): string => {
    switch (appState) {
      case 'LoadingAnimation': {
        return 'Paint'
      }

      case 'Paint':
        return 'BannerBox'

      case 'BannerBox':
        return 'BabylonBox'

      case 'BabylonBox':
        return 'LoadingAnimation'

      default:
        return 'LoadingAnimation'
    }
  }

  // 监听键盘事件
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code == 'F11') {
      e.preventDefault()
      root.classList.contains('fullScreen')
        ? root.classList.remove('fullScreen')
        : root.classList.add('fullScreen')
      root.dispatchEvent(resize)
    } else if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
      console.log('a && left')
    }
  })

  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))

    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  switch (appState) {
    case 'Paint': {
      wasm().then(() => {
        greet('Trump is a pig! lalalal~')
        hcl_init()
      })
      return (
        <div id="GS" className={'default ' + appState}>
          <canvas id="wasmCanvas"></canvas>
          <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
        </div>
      )
    }
    case 'BabylonBox':
      return (
        <div id="GS" className={'default ' + appState}>
          <BabylonBox />
          <Versions />
          <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
        </div>
      )
    case 'BannerBox':
      return (
        <div id="GS" className={'default ' + appState}>
          <BannerBox />
          <Versions />
          <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
        </div>
      )
    default:
      return (
        <div id="GS" className={'default ' + appState}>
          <LoadingAnimation />
          <Versions />
          <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
        </div>
      )
  }
}
