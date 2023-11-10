import { useEffect } from 'react'
import { canvasResize, isCanvas } from '../../tool'

import model_url from '../../public/model/koduck.glb?url'

// import hdr_url from '../../public/model/chun.hdr?url'
export default function Index(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('KoduckCanvas')

    if (isCanvas(canvas)) {
      canvasResize(canvas)
      const engine = new BABYLON.Engine(canvas, true)

      //自定义加载动画
      engine.loadingScreen = {
        displayLoadingUI: (): void => {
          // console.log('display')
        },
        hideLoadingUI: (): void => {
          // console.log('hidden')
        },
        loadingUIBackgroundColor: '#000000',
        loadingUIText: 'Loading...'
      }

      const scene = new BABYLON.Scene(engine)
      // scene.ambientColor = new Color3(1, 0, 1)
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)

      // const hdrTexture = new HDRCubeTexture(hdr_url, scene, 128, false, true, false, true, () => {
      //   const hdrFiltering = new HDRFiltering(engine)
      //   hdrFiltering.prefilter(hdrTexture, () => {
      //     scene.environmentTexture = hdrTexture
      //     // previousOnLoad();
      //   })
      // })
      // scene.environmentIntensity = 1

      // // 是否开启inspector ///////////////////////////////////////////////////////////////////////////////////////////////////
      // scene.debugLayer.show({
      //   // embedMode: true
      // })

      // 摄像机
      const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, (Math.PI * 2) / 5, 25, BABYLON.Vector3.Zero(), scene)
      camera.attachControl(canvas, false)
      camera.minZ = 0.1
      camera.fov = 0.26
      camera.wheelPrecision = 100
      camera.lowerRadiusLimit = 1
      camera.inertia = 0.9
      camera.panningInertia = 0.9
      camera.panningSensibility = 300
      camera.angularSensibilityX = 800
      camera.angularSensibilityY = 800

      const cameraControl = (event: MouseEvent): void => {
        if (event.buttons === 0) {
          camera.alpha -= event.movementX / 10000
          camera.beta += event.movementY / 10000
        }
      }
      // 注册鼠标移动事件来触发相机控制
      canvas.addEventListener('mousemove', cameraControl)

      // ----------------------------静态材质定义----------------------------------

      // 加载model
      BABYLON.SceneLoader.AppendAsync(
        model_url.substring(0, model_url.lastIndexOf('/') + 1),
        model_url.substring(model_url.lastIndexOf('/') + 1),
        scene
      ).then(() => {
        const Sphere001 = scene.getMeshByName('Sphere.001')!
        Sphere001.receiveShadows = true
        const Root = scene.getMeshByName('__root__')!
        Root.position._y = -1

        const sun = new BABYLON.DirectionalLight('sun', new BABYLON.Vector3(-0.6, -1, -0.8), scene)
        sun.diffuse = new BABYLON.Color3(1, 0.99, 0.87)
        sun.autoCalcShadowZBounds = true
        sun.autoCalcShadowZBounds = false
        sun.shadowMinZ = -4
        sun.shadowMaxZ = 10
        sun.includedOnlyMeshes = [Root, Sphere001]

        Sphere001.computeBonesUsingShaders = false
        BABYLON.NodeMaterial.ParseFromSnippetAsync('#N1W93B#44', scene).then((node) => {
          Sphere001.material = node
          // node.getInputBlockByPredicate((b) => b.name === 'shadowCutOff')!.value = 0.8
          // node.getInputBlockByPredicate((b) => b.name === 'shadowItensity')!.value = 0.71
          // node.getInputBlockByPredicate((b) => b.name === 'rimIntensity')!.value = 0.08
        })

        // scene.getMeshByName("outline").dispose()
        // scene.getMeshByName('outline')!.material!.albedoColor = Color3.Black()
        // scene.getMeshByName("outline").computeBonesUsingShaders = false
        // NodeMaterial.ParseFromSnippetAsync('#N1W93B#30', scene).then((onode) => {
        //   scene.getMeshByName('outline')!.material = onode
        //   // onode.getInputBlockByPredicate((b) => b.name === "shadowCutOff").value = 0.8
        //   // node.getInputBlockByPredicate((b) => b.name === "shadowItensity").value = 0.71
        //   // node.getInputBlockByPredicate((b) => b.name === "rimIntensity").value = 0.08
        // })
        const shadowGenerator = new BABYLON.ShadowGenerator(512, sun, true)
        shadowGenerator.getShadowMap()!.renderList!.push(Sphere001)
        shadowGenerator.setDarkness(0)
        shadowGenerator.filter = BABYLON.ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP
        shadowGenerator.usePoissonSampling = true
        shadowGenerator.useContactHardeningShadow = true
        shadowGenerator.usePercentageCloserFiltering = true
        shadowGenerator.contactHardeningLightSizeUVRatio = 0.4
        shadowGenerator.useKernelBlur = true
        shadowGenerator.blurKernel = 64
        shadowGenerator.depthScale = 100
        shadowGenerator.normalBias = 0.1
        shadowGenerator.blurScale = 1
        shadowGenerator.bias = 0.01
        shadowGenerator.darkness = 0.2
        // shadowGenerator.addShadowCaster(Sphere001, true)
        // shadowGenerator.addShadowCaster(Root, true)

        // const groundPbrMaterial = new PBRMaterial('groundPbrMaterial', scene)
        // groundPbrMaterial.metallic = 1
        // groundPbrMaterial.roughness = 0.9
        // groundPbrMaterial.emissiveColor = new Color3(194 / 255, 121 / 255, 0 / 255)

        // const ground = CreateBox('ground', { width: 20, height: 2, depth: 20 }, scene)
        // ground.material = groundPbrMaterial
        // ground.position.y = -2
        // ground.receiveShadows = true
      })

      // 世界坐标轴显示
      // new AxesViewer(scene, 1)
      engine.displayLoadingUI()
      // 注册循环渲染函数
      engine.runRenderLoop(() => {
        scene.render()
      })

      //组件卸载时
      return () => {
        // 销毁场景和引擎
        scene.dispose()
        engine.dispose()
        canvas.removeEventListener('mousemove', cameraControl)
        console.log('内存已清理')
      }
    } else {
      //组件卸载时
      return () => {}
    }
  }, [])

  return (
    <div id="loadingPage">
      <div id="title">
        <div id="mian">启动页</div>
        <div id="info">这里会随便放一些有意思的东西，点击左下角的按钮切换页面可以查看其他内容</div>
      </div>
      <div id="loadingBox">
        <div className="shadow">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
        <div id="maskElement2"></div>
        <div id="maskElement3"></div>
        <div className="line">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
        </div>
      </div>
      <canvas id="KoduckCanvas">当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试</canvas>
    </div>
  )
}
