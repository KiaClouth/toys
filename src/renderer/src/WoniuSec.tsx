import { useEffect } from 'react'
import { PerlinNoise, canvasResize, isCanvas } from './tool'
import * as BABYLON from 'babylonjs'
import MeshWriter from './assets/js-plugin/meshwriter/meshwriter.ES'
import './assets/js-plugin/babylon/cannon.js'

import topNavUrl from './assets/img/WoniuSec/topNav.svg?url'

export default function GS(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('WoniuSecBannerCanvas')

    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))

    if (isCanvas(canvas)) {
      window.addEventListener('resize', () => canvasResize(canvas))
      canvasResize(canvas)
      createBabylonScene(canvas)
      return () => {
        window.removeEventListener('resize', () => canvasResize(canvas))
      }
    } else {
      console.log('cannot find canvas')
      return () => {}
    }
  }, [])

  function createBabylonScene(canvas: HTMLCanvasElement): void {
    const perlinNosie = new PerlinNoise()
    const startTime = new Date().getTime() //记录场景开始时间
    const engine = new BABYLON.Engine(canvas, true) // 初始化 BABYLON 3D engine

    if (document.getElementById('FPS')) {
      const fps = document.getElementById('FPS')!
      fps.innerHTML = engine.getFps().toFixed() + ' fps'
    }

    /******* 定义场景函数 ******/
    const createScene = function (engine): BABYLON.Scene {
      // 场景初始化
      const scene = new BABYLON.Scene(engine)
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0.2)
      scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.CannonJSPlugin(false))

      const init = (scene): void => {
        // 摄像机
        // const camera = new BABYLON.UniversalCamera('Camera', new BABYLON.Vector3(0, 0, -1), scene)

        // 摄像机
        const camera = new BABYLON.ArcRotateCamera(
          'Camera',
          Math.PI * (0 / 2),
          Math.PI * (0 / 2),
          1,
          new BABYLON.Vector3(0, 0, 0),
          scene
        )

        camera.attachControl(canvas, true)
        camera.minZ = 0.1
        // camera.maxZ = 20

        // 主光源
        const mainLight = new BABYLON.PointLight('mainLight', new BABYLON.Vector3(0, 40, 0), scene)

        //主光源阴影参数---------------------
        const mainLightGenerator = new BABYLON.ShadowGenerator(1024, mainLight)
        mainLightGenerator.usePoissonSampling = true
        mainLightGenerator.bias = 0.000001
        mainLightGenerator.blurScale = 1
        mainLightGenerator.transparencyShadow = true
        mainLightGenerator.darkness = 0.6

        // 二十面体---------------------
        const icosahedron = BABYLON.MeshBuilder.CreateGeodesic('icosahedron1', {
          m: 0,
          n: 0,
          size: 0.3,
          updatable: true
        })

        // icosahedron.position = new BABYLON.Vector3(-0.135, 0, 0)

        //WONIU文字创建
        const Writer = MeshWriter(scene, {})
        const textMesh = new Writer('WONIU', {
          'font-family': 'Helvetica-Black-SemiBold',
          'letter-height': 0.3,
          'letter-thickness': 0.01,
          color: '#0be1fd',
          anchor: 'center',
          colors: {
            diffuse: '#000000',
            specular: '#000000',
            ambient: '#444444',
            emissive: '#000000'
          }
        })
        const text_mesh = textMesh.getMesh()
        text_mesh.name = 'woniu'
        text_mesh.id = 'woniu'

        // //局部坐标系显示
        const localAxes_shuidi = new BABYLON.AxesViewer(scene, 0.25)
        localAxes_shuidi.xAxis.parent = text_mesh
        localAxes_shuidi.yAxis.parent = text_mesh
        localAxes_shuidi.zAxis.parent = text_mesh

        //文字居中处理
        const text_sizes = text_mesh.getHierarchyBoundingVectors()
        const text_depth = text_sizes.max.z - text_sizes.min.z
        text_mesh.locallyTranslate(new BABYLON.Vector3(0, -text_depth * (1 / 3)), 0)

        // 文字旋转
        text_mesh.addRotation(Math.PI * (3 / 2), Math.PI * 0, Math.PI * 0)

        for (let i = 0; i < scene.meshes.length; i++) {
          console.log(i, scene.meshes[i].name, scene.meshes[i])

          // 将所有网格都纳入主光源的阴影计算列表
          mainLightGenerator.addShadowCaster(scene.meshes[i], true)
          // 让所有网格都能接收阴影
          // scene.meshes[i].receiveShadows = true
        }
      }

      const animation = (scene): void => {
        scene.registerBeforeRender(function () {
          const a = new Date().getTime() - startTime
        })
      }

      init(scene)
      animation(scene)
      return scene
    }

    const scene = createScene(engine)
    engine.runRenderLoop(function () {
      scene.render()
    })
  }

  return (
    <div id="WoniuSec">
      <div className="main">
        <img className="topNav" src={topNavUrl} alt="导航栏" />
        <div className="banner">
          <canvas id="WoniuSecBannerCanvas">你的浏览器不支持canvas，建议尝试使用谷歌浏览器</canvas>
        </div>
        <div className="convenientEntrance">
          <div>
            WoniuSec <br />
            学习、认证、企业服务
          </div>
          <div className="buttonList">
            <button className="concave">快速入口</button>
            <button className="concave">快速入口</button>
            <button className="concave">快速入口</button>
          </div>
        </div>
        <div className="module">
          <div className="left">
            <h6>1.在线学习平台【在线实验室】</h6>
            <p>
              功能简介：国家主席习近平17日在北京主持中非团结抗疫特别峰会并发表题为《团结抗疫共克时艰》的主旨讲话。
              吉尔吉斯斯坦独立政治分析师舍拉迪尔·巴克特古洛夫认为，疫情暴发后，中非关系在中国和非洲国家团结抗疫的合作中得到进一步加强。
            </p>
          </div>
          <div className="right"></div>
        </div>
      </div>
      <div className="bg"></div>
    </div>
  )
}
