import { useState, useEffect } from 'react'

import BabylonBox from './components/BabylonBox'
import Menu from './components/Menu'
import LoadingAnimation from './components/LoadingAnimation'
import Versions from './components/Versions'
import BannerBox from './components/BannerBox'
import PaintBox from './components/PaintBox'
import Filing from './components/Filing'

export default function GS(): JSX.Element {
  const [appState, setAppState] = useState('LoadingAnimation')
  const [content, setContent] = useState(<LoadingAnimation />)
  // const appStateArray = ['Paint', 'BannerBox', 'BabylonBox']
  // let content = <LoadingAnimation />
  const classReplace = (): string => {
    switch (appState) {
      case 'LoadingAnimation': {
        setContent(<PaintBox />)
        return 'Paint'
      }

      case 'Paint': {
        setContent(<BannerBox />)
        return 'BannerBox'
      }

      case 'BannerBox': {
        setContent(<BabylonBox />)
        return 'BabylonBox'
      }

      case 'BabylonBox': {
        setContent(<LoadingAnimation />)
        return 'LoadingAnimation'
      }

      default: {
        setContent(<LoadingAnimation />)
        return 'LoadingAnimation'
      }
    }
  }

  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))

    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  return (
    <div id="GS" data-state={appState}>
      {content}
      <Versions />
      <Filing />
      <Menu onClick={(): void => setAppState(classReplace())} content={appState} />
    </div>
  )
}
