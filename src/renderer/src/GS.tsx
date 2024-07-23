import { useState, useEffect } from 'react'

import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders'
import 'babylonjs-inspector'

import BabylonBox from './components/main/BabylonBox'
import Index from './components/main/Index'
import BannerBox from './components/main/BannerBox'
import PaintBox from './components/main/PaintBox'
import ColorComputeBox from './components/main/ColorComputeBox'
import MatrixEffectBox from './components/main/MatrixEffectBox'

import Menu from './components/accessory/Menu'
import Versions from './components/accessory/Versions'
import Filing from './components/accessory/Filing'

export default function GS(): JSX.Element {
  const [appState, setAppState] = useState('MatrixEffectBox')
  const [content, setContent] = useState(<MatrixEffectBox />)
  const mainComponentReplace = (): string => {
    switch (appState) {
      case 'Index': {
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
        setContent(<ColorComputeBox />)
        return 'ColorComputeBox'
      }

      case 'ColorComputeBox': {
        setContent(<MatrixEffectBox />)
        return 'MatrixEffectBox'
      }

      case 'MatrixEffectBox': {
        setContent(<Index />)
        return 'Index'
      }

      default: {
        setContent(<Index />)
        return 'Index'
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
      <Menu onClick={(): void => setAppState(mainComponentReplace())} content={appState} />
    </div>
  )
}

export { BABYLON }
