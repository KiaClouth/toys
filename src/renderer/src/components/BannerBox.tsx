import { useEffect } from 'react'
import { canvasResize, isCanvas } from '../tool'
import 'babylonjs'
import 'babylonjs-materials'
import 'babylonjs-loaders'
import 'babylonjs-inspector'
import MeshWriter from '../assets/js-plugin/meshwriter/meshwriter.ES'

import contrast_url from '../assets/img/banner/contrast.png?url'
import top_nav_url from '../assets/img/banner/top_nav.svg?url'
import banner_model_url from '../assets/model/banner.gltf?url'

// const imgSize = [[1920, 650], [660, 330], [1110, 450]]
// const imgName = ['woniuxy.cn.pc', 'woniuxy.cn.mo', 'woniuxy.com.pc']
const campusArray = [
  ['成都', '01·22'],
  ['天府', '07·10'],
  ['重庆', '02·19'],
  ['西安', '03·19'],
  ['上海', '04·26'],
  ['武汉', '09·21'],
  ['深圳', '05·10'],
  ['南京', '08·24'],
  ['杭州', '06·18'],
  ['广州', '09·08'],
  ['阿多比', '09·26'],
  ['凡云', '09·28']
]

const shuidiArray: BABYLON.AbstractMesh[] = []
const shuidiPositionArray = [
  // eslint-disable-next-line prettier/prettier
  [-0.750, -0.360, -0.080, +0.400, +0.770, +1.300, +1.860, +2.370, +2.870, +3.350, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.700, +0.730, +1.020, +1.150, +1.250, +1.270, +1.400, +1.440, +1.600, +0.965, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+11.60, +11.40, +9.000, +7.300, +6.800, +5.600, +4.000, +3.000, +2.000, +1.000, 11, 12, 13],
]
const shuidiRotationArray = [
  // eslint-disable-next-line prettier/prettier
  [+1.950, +1.900, +0.001, +1.980, +0.001, +1.900, +1.980, +0.001, +0.001, -0.100, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.150, +1.900, +1.900, +1.680, +0.100, +1.800, +0.001, +0.110, +1.800, -0.320, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.001, +1.970, +1.970, +0.001, +1.980, +1.870, +0.001, +0.001, +0.001, -0.015, 11, 12, 13]
]
const shuidiScaleArray = [
  // eslint-disable-next-line prettier/prettier
  [+0.816, +0.735, +0.816, +0.816, +0.792, +0.816, +0.716, +0.701, +0.670, +0.670, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.816, +0.735, +0.816, +0.816, +0.792, +0.816, +0.716, +0.701, +0.670, +0.670, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.816, +0.735, +0.816, +0.816, +0.792, +0.816, +0.716, +0.701, +0.670, +0.670, 11, 12, 13]
]
const textMaterialColorArray = [
  // eslint-disable-next-line prettier/prettier
  [233, 255, 0],
  // eslint-disable-next-line prettier/prettier
  [56, 167, 137],
  // eslint-disable-next-line prettier/prettier
  [74, 46, 251]
]

// 按时间顺序对校区数组重排
for (let i = 0; i < campusArray.length - 1; i++) {
  for (let j = 0; j < campusArray.length - 1 - i; j++) {
    if (campusArray[j][1] > campusArray[j + 1][1]) {
      const temp_array = campusArray[j]
      campusArray[j] = campusArray[j + 1]
      campusArray[j + 1] = temp_array
    }
  }
}

export default function BannerBox(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('BannerCanvas')!

    // !root.classList.contains('fullScreen') ? root.classList.add('fullScreen') : {}

    if (isCanvas(canvas)) {
      canvasResize(canvas)
      createBabylonScene(canvas)
    }

    //组件卸载时
    return () => {}
  }, [])

  // babylonjs引擎代码
  function createBabylonScene(canvas: HTMLCanvasElement): void {
    if (isCanvas(canvas)) {
      const engine = new BABYLON.Engine(canvas, true)

      //自定义加载动画
      engine.loadingScreen = {
        displayLoadingUI: (): void => {
          console.log('display')
        },
        hideLoadingUI: (): void => {
          console.log('hidden')
        },
        loadingUIBackgroundColor: '#ffffff',
        loadingUIText: 'Loading...'
      }

      const createScene = (): BABYLON.Scene => {
        const scene = new BABYLON.Scene(engine)
        scene.ambientColor = new BABYLON.Color3(1, 0, 1)

        // 摄像机
        const camera = new BABYLON.ArcRotateCamera(
          'Camera',
          Math.PI / 2,
          Math.PI / 1.97,
          12.7,
          new BABYLON.Vector3(0, 0.66, 3),
          scene
        )
        camera.attachControl(canvas, true)
        camera.minZ = 0.1
        camera.fov = 0.26
        // const postProcess = new BABYLON.FxaaPostProcess('fxaa', 4, camera) //后期抗锯齿处理

        // 加载场景模型
        BABYLON.SceneLoader.AppendAsync(
          banner_model_url.substring(0, banner_model_url.lastIndexOf('/') + 1),
          banner_model_url.substring(banner_model_url.lastIndexOf('/') + 1),
          scene,
          function (event) {
            // 加载进度计算
            const percentage = event.lengthComputable
              ? ' ' + Math.floor((event.loaded / event.total) * 100) + '%'
              : ''
            document.getElementsByClassName('LoadingProgress')[0]
              ? (document.getElementsByClassName('LoadingProgress')[0].innerHTML = percentage)
              : console.log('没找到.LoadingProgress元素')
          }
        ).then(() => {
          // 加载完成之后
          // ----------------------------定义静态材质----------------------------------
          // 水滴PBR材质
          const shuidiPbrMaterial = new BABYLON.PBRMaterial('shuidiPbrMaterial', scene)
          shuidiPbrMaterial.albedoColor = new BABYLON.Color3(192 / 255, 178 / 255, 211 / 255)
          shuidiPbrMaterial.metallic = 1
          shuidiPbrMaterial.roughness = 0.9
          shuidiPbrMaterial.emissiveColor = new BABYLON.Color3(
            192 / 255,
            178 / 255,
            211 / 255
          ).multiply(new BABYLON.Color3(0.7, 0.7, 0.7))
          // -----------------------------网格构建-------------------------------------
          let shuidi = scene.meshes[0]
          for (const mesh of scene.meshes) {
            if (mesh.name === '水滴') {
              shuidi = mesh
              shuidi.position = new BABYLON.Vector3(0, 10, 0)
            }
          }

          // 水滴与文字的循环生成
          for (let a = 0; a < campusArray.length - 2; a++) {
            if (campusArray[0][a] === ('阿多比' || '凡云')) break
            // 值简化
            const shuidiPosition = new BABYLON.Vector3(
              shuidiPositionArray[0][a],
              shuidiPositionArray[1][a],
              shuidiPositionArray[2][a]
            )
            const shuidiRotation = new BABYLON.Vector3(
              Math.PI * shuidiRotationArray[0][a],
              Math.PI * shuidiRotationArray[1][a],
              Math.PI * shuidiRotationArray[2][a]
            )
            const shuidiScaling = new BABYLON.Vector3(
              shuidiScaleArray[0][a],
              shuidiScaleArray[1][a],
              shuidiScaleArray[2][a]
            )
            const text_material_color = new BABYLON.Color3(
              textMaterialColorArray[0][a % 3] / 255,
              textMaterialColorArray[1][a % 3] / 255,
              textMaterialColorArray[2][a % 3] / 255
            )
            // ---------------------------动态材质定义--------------------------------
            // 文字PBR材质
            const textPbrMaterial = new BABYLON.PBRMaterial('textPbrMaterial', scene)
            textPbrMaterial.metallic = 0
            textPbrMaterial.roughness = 1
            textPbrMaterial.albedoColor = text_material_color.toLinearSpace()
            switch (a % 3) {
              case 0:
                textPbrMaterial.emissiveColor = text_material_color.hsvOffset(
                  [0, 'add'],
                  [1],
                  [0.5, 'mul']
                )
                break

              case 1:
                textPbrMaterial.emissiveColor = text_material_color.hsvOffset(
                  [-0.07, 'add'],
                  [1],
                  [0.5, 'mul']
                )
                break

              case 2:
                textPbrMaterial.emissiveColor = text_material_color.hsvOffset(
                  [0.05, 'add'],
                  [1],
                  [0.5, 'mul']
                )
                break

              default:
                textPbrMaterial.emissiveColor = text_material_color
                break
            }

            // 文字渐变材质
            // const textGraMaterial = new BABYLON.GradientMaterial('textGraMaterial', scene)
            // textGraMaterial.offset = 0.5
            // textGraMaterial.scale = 10
            // textGraMaterial.smoothness = 0.5
            // textGraMaterial.bottomColor = text_material_color
            // textGraMaterial.topColor = text_material_color.multiply(
            //   new BABYLON.Color3(0.1, 0.1, 0.1)
            // )

            // 开班日期拆分：暂未使用
            const time_array = campusArray[a][1].replace(' ', ':').replace(/:/g, '·').split('·') // 从“·”号处将时间拆分为[月，日]
            time_array[0] = time_array[0].replace(/\b(0+)/gi, '') //去掉月前面的0

            // ---------------------------动态网格生成------------------------
            // 水滴
            const shuidiClone = shuidi.clone('shuidi', null, false)!
            shuidiClone.id = 'shuidi' + a
            // shuidiClone.showBoundingBox = true
            shuidiClone.material = shuidiPbrMaterial

            shuidiArray.push(shuidiClone)

            // 水滴正面文字
            const Writer = MeshWriter(scene, { scale: 1 })
            const textWriter = new Writer(campusArray[a][0], {
              'font-family': 'ZiHunMengQuRuanTangTi', // 名称注意大小写
              'letter-height': 0.2,
              'letter-thickness': 0.05,
              color: '#0be1fd',
              anchor: 'left',
              colors: {
                diffuse: '#ffffff',
                specular: '#000000',
                ambient: '#444444',
                emissive: '#000000'
              },
              position: {
                x: 0,
                y: 0,
                z: 0
              }
            })
            const textMesh = textWriter.getMesh()
            textMesh.name = 'textMesh'
            textMesh.id = 'textMesh' + a
            // textMesh.showBoundingBox = true
            textMesh.material = textPbrMaterial
            textMesh.parent = shuidiClone

            // x轴居中处理
            textMesh.locallyTranslate(
              new BABYLON.Vector3(-textMesh.getBoundingInfo().boundingBox.center.x, -0.09, 0.03)
            )

            textMesh.addRotation(Math.PI * (3 / 2), Math.PI * (0 / 2), Math.PI * (0 / 2))

            shuidiClone.position = shuidiPosition
            shuidiClone.scaling = shuidiScaling
            shuidiClone.addRotation(shuidiRotation._x, shuidiRotation._y, shuidiRotation._z)

            // -------------------------动态光照设置-------------------------
            // 设置锥形光补足水滴正面亮度，以及产生文字阴影
            const shuidi_spotLight = new BABYLON.SpotLight(
              'shuidi_spotLight',
              new BABYLON.Vector3(1, 2, 4.5),
              new BABYLON.Vector3(-0.2, -0.4, -1),
              Math.PI * (1 / 3),
              2,
              scene
            )
            shuidi_spotLight.id = 'shuidi_spotLight' + a
            shuidi_spotLight.includedOnlyMeshes = [shuidiClone, textMesh]
            // shuidi_spotLight.diffuse = text_material_color.multiply(new BABYLON.Color3(0.8, 0.8, 0.8))
            shuidi_spotLight.intensity = 40
            shuidi_spotLight.radius = 10
            shuidi_spotLight.parent = shuidiClone

            // 锥形光的阴影发生器---------------------
            const shuidi_generator = new BABYLON.ShadowGenerator(4096, shuidi_spotLight)
            shuidi_generator.usePoissonSampling = true
            shuidi_generator.bias = 0.000001
            shuidi_generator.blurScale = 1
            shuidi_generator.transparencyShadow = true
            shuidi_generator.darkness = 0
            shuidi_generator.addShadowCaster(textMesh, true)

            // 设置锥形光产生渐变
            const text_spotLight = new BABYLON.SpotLight(
              'text_spotLight',
              new BABYLON.Vector3(0, 2, 4.5),
              new BABYLON.Vector3(0, -0.4, -1),
              Math.PI * (1 / 13),
              10,
              scene
            )
            text_spotLight.id = 'text_spotLight' + a
            text_spotLight.includedOnlyMeshes = [textMesh]
            text_spotLight.intensity = 500
            text_spotLight.radius = 3
            text_spotLight.diffuse =
              a % 3 === 1
                ? text_material_color.hsvOffset([0.1, 'add'], [1], [0.1, 'mul'])
                : text_material_color.hsvOffset([0.1, 'add'], [1], [1])
            text_spotLight.parent = shuidiClone

            // 世界坐标轴显示
            // new BABYLON.AxesViewer(scene, 1)

            // //局部坐标轴显示
            // const localAxes_shuidi = new BABYLON.AxesViewer(scene, 0.25)
            // localAxes_shuidi.xAxis.parent = shuidiArray[a]
            // localAxes_shuidi.yAxis.parent = shuidiArray[a]
            // localAxes_shuidi.zAxis.parent = shuidiArray[a]

            // const localAxes_text = new BABYLON.AxesViewer(scene, 0.25)
            // localAxes_text.xAxis.parent = textMesh
            // localAxes_text.yAxis.parent = textMesh
            // localAxes_text.zAxis.parent = textMesh

            // const localAxes_shuidi_light = new BABYLON.AxesViewer(scene, 0.25)
            // localAxes_shuidi_light.xAxis.parent = shuidi_light
            // localAxes_shuidi_light.yAxis.parent = shuidi_light
            // localAxes_shuidi_light.zAxis.parent = shuidi_light
          }

          // --------------------------------------环境构建----------------------------------
          // 主光源
          const mainLight = new BABYLON.DirectionalLight(
            'mainLight',
            new BABYLON.Vector3(0, -10, 0),
            scene
          )
          mainLight.includedOnlyMeshes = [
            scene.meshes[1],
            scene.meshes[2],
            scene.meshes[3],
            scene.meshes[4],
            scene.meshes[5]
          ]
          mainLight.intensity = 4
          mainLight.radius = 10

          // 正面光
          const positiveLight = new BABYLON.DirectionalLight(
            'positiveLight',
            new BABYLON.Vector3(0, 0, -10),
            scene
          )
          positiveLight.includedOnlyMeshes = [
            scene.meshes[1],
            scene.meshes[2],
            scene.meshes[3],
            scene.meshes[4],
            scene.meshes[5]
          ]
          positiveLight.intensity = 2
          positiveLight.radius = 10

          // 公路色彩增强光

          // 公路色相偏移
          const highwayLight01 = new BABYLON.DirectionalLight(
            'highwayLight01',
            new BABYLON.Vector3(0, -10, 0),
            scene
          )
          highwayLight01.includedOnlyMeshes = [scene.meshes[3]]
          highwayLight01.diffuse = new BABYLON.Color3(3, 0, 255)
          highwayLight01.intensity = 1
          highwayLight01.radius = 10

          // 黄线饱和度提高
          const highwayLight1 = new BABYLON.DirectionalLight(
            'highwayLight1',
            new BABYLON.Vector3(0, -10, 0),
            scene
          )
          highwayLight1.includedOnlyMeshes = [scene.meshes[4]]
          highwayLight1.diffuse = new BABYLON.Color3(0, 255, 255)
          highwayLight1.intensity = 0.01
          highwayLight1.radius = 10

          // 正面红色
          const highwayLight2 = new BABYLON.PointLight(
            'highwayLight2',
            new BABYLON.Vector3(0, 1, 15),
            scene
          )
          highwayLight2.includedOnlyMeshes = [scene.meshes[3], scene.meshes[4], scene.meshes[5]]
          highwayLight2.diffuse = new BABYLON.Color3(1, 0, 0)
          highwayLight2.intensity = 100

          const highwayLight3 = new BABYLON.DirectionalLight(
            'highwayLight3',
            new BABYLON.Vector3(0, 0, -10),
            scene
          )
          highwayLight3.includedOnlyMeshes = [scene.meshes[3], scene.meshes[5]]
          highwayLight3.diffuse = new BABYLON.Color3(0, 1, 0)
          highwayLight3.intensity = 10

          // 水滴环境色补足
          const shuidiLight = new BABYLON.HemisphericLight(
            'shuidiLight',
            new BABYLON.Vector3(0, -10, 0),
            scene
          )
          shuidiLight.includedOnlyMeshes = shuidiArray
          // shuidiLight.diffuse = new BABYLON.Color3(0.99, 0.7, 0.97)
          shuidiLight.diffuse = new BABYLON.Color3(0.8, 0.7, 0.97)
          shuidiLight.intensity = 2

          //阴影发生器---------------------
          const generator = new BABYLON.ShadowGenerator(4096, mainLight)
          generator.usePoissonSampling = true
          generator.bias = 0.00001
          generator.blurScale = 2
          generator.transparencyShadow = true
          generator.darkness = 0.5

          for (let i = 0; i < scene.meshes.length; i++) {
            // console.log(i, scene.meshes[i].name, scene.meshes[i])

            // 给所有网格添加阴影发射器并接受阴影
            generator.addShadowCaster(scene.meshes[i], true)
            scene.meshes[i].receiveShadows = true

            if (
              scene.meshes[i].name === '公路' ||
              scene.meshes[i].name === '黄线' ||
              scene.meshes[i].name === '白线'
            ) {
              // scene.meshes[i].isVisible = false
              scene.meshes[i].position.y += -0.45
              scene.meshes[i].rotation = new BABYLON.Vector3(
                Math.PI * (-1 / 512),
                Math.PI * (0 / 6),
                Math.PI * (0 / 6)
              )
            }

            if (scene.meshes[i].name === '地面') {
              scene.meshes[i].rotation = new BABYLON.Vector3(
                Math.PI * (1.25 / 256),
                Math.PI * (0 / 6),
                Math.PI * (0 / 6)
              )
              scene.meshes[i].position.y += -0.2
              // scene.meshes[i].isVisible = false
            }
          }
        })

        // scene.debugLayer.show({
        //   // embedMode: true
        // })

        return scene
      }

      const scene = createScene()

      engine.displayLoadingUI()
      engine.runRenderLoop(function () {
        scene.render()
      })
    }
  }

  // function fileDownLoadFn(canvas: HTMLCanvasElement): void {
  //   const fileContent = canvas.toDataURL('image/png')
  //   const save_link = document.createElementNS(
  //     'http://www.w3.org/1999/xhtml',
  //     'a'
  //   ) as HTMLAnchorElement
  //   const filename = ['woniuxy.cn.pc', 'woniuxy.cn.mo', 'woniuxy.com.pc']
  //   const cWidthTemp = [1920, 660, 1110]
  //   const cHeightTemp = [650, 330, 450]
  //   let event = document.createEvent('MouseEvents')
  //   setTimeout(() => {
  //     for (let i = 0; i < cWidthTemp.length; i++) {
  //       save_link.href = fileContent
  //       save_link.download = filename[i] + '.png'
  //       event = document.createEvent('MouseEvents')
  //       event.initMouseEvent(
  //         'click',
  //         true,
  //         false,
  //         window,
  //         0,
  //         0,
  //         0,
  //         0,
  //         0,
  //         false,
  //         false,
  //         false,
  //         false,
  //         0,
  //         null
  //       )
  //       save_link.dispatchEvent(event)
  //     }
  //   }, 0)
  // }

  return (
    <div id="BannerBox">
      <div className="top_nav">
        <img src={top_nav_url} />
      </div>
      <div className="banner_area">
        <img className="contrast" src={contrast_url} />
        <canvas id="BannerCanvas">当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试</canvas>
      </div>
      <div className="loading_progress">
        LoadingProgress:<span className="LoadingProgress"></span>
      </div>
    </div>
  )
}
