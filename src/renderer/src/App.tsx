import { useState, useEffect } from 'react'

import BabylonBox from './components/BabylonBox'
import Menu from './components/Menu'
import LoadingAnimation from './components/LoadingAnimation'
import Versions from './components/Versions'
import BannerBox from './components/BannerBox'
import PaintBox from './components/PaintBox'

export default function GS(): JSX.Element {
  const [appState, setAppState] = useState('BannerBox')
  // const appStateArray = ['Paint', 'BannerBox', 'BabylonBox']

  const classReplace = (): string => {
    switch (appState) {
      case 'LoadingAnimation':
        return 'Paint'

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

  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))

    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  switch (appState) {
    case 'Paint': {
      return (
        <div id="GS" data-state={appState}>
          <PaintBox />
          <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
        </div>
      )
    }
    case 'BabylonBox':
      return (
        <div id="GS" data-state={appState}>
          <BabylonBox />
          <Versions />
          <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
        </div>
      )
    case 'BannerBox':
      return (
        <div id="GS" data-state={appState}>
          <BannerBox />
          <Versions />
          <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
        </div>
      )
    default:
      return (
        <div id="GS" data-state={appState}>
          <LoadingAnimation />
          <Versions />
          <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
        </div>
      )
  }
}
