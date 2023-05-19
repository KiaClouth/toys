import { useEffect, useState } from 'react'
import 'babylonjs'
import 'babylonjs-materials'
import 'babylonjs-loaders'
import 'babylonjs-inspector'
import MeshWriter from '../assets/js-plugin/meshwriter/meshwriter.ES'

import { canvasResize, isCanvas } from '../tool'
import top_nav_url from '../public/img/banner/top_nav.svg?url'
import banner_model_url from '../public/model/banner.gltf?url'

const exportSets = [
  {
    name: 'cn.pc',
    exportSize: { w: 1920, h: 650 },
    container: {
      position: new BABYLON.Vector3(0, 0.22, 13),
      size: { w: 1500, h: 58 },
      rowCount: 1,
      childs: {
        chineseTitle: {
          visibilty: 1,
          position: new BABYLON.Vector3(0.185, 0.12, 0),
          fontSize: 48
        },
        englishTitle: {
          visibilty: 1,
          position: new BABYLON.Vector3(0, 0, -0.025),
          fontSize: 24
        },
        line: {
          position: new BABYLON.Vector3(0, 0.032, 0)
        },
        box: {
          addTop: 17,
          campusName: {
            fontSize: 18,
            simpleFormat: false
          },
          date: {
            fontSize: 18,
            simpleFormat: false,
            positionZ: 0.01
          },
          addBottom: 5
        }
      }
    }
  },
  {
    name: 'cn.mo',
    exportSize: { w: 660, h: 330 },
    container: {
      position: new BABYLON.Vector3(0, 0.373, 13),
      size: { w: 571, h: 164 },
      rowCount: 2,
      childs: {
        chineseTitle: {
          visibilty: 1,
          position: new BABYLON.Vector3(0.185, 0.136, 0),
          fontSize: 48
        },
        englishTitle: {
          visibilty: 1,
          position: new BABYLON.Vector3(0, 0, -0.025),
          fontSize: 24
        },
        line: {
          position: new BABYLON.Vector3(0, -0.01, 0)
        },
        box: {
          addTop: 17,
          campusName: {
            fontSize: 24,
            simpleFormat: true
          },
          date: {
            fontSize: 24,
            simpleFormat: true,
            positionZ: -0.02
          },
          addBottom: 5
        }
      }
    }
  },
  {
    name: 'com.pc',
    exportSize: { w: 1110, h: 450 },
    container: {
      position: new BABYLON.Vector3(0.03, 0.186, 13),
      size: { w: 1240, h: 85 },
      rowCount: 1,
      childs: {
        chineseTitle: {
          visibilty: 1,
          position: new BABYLON.Vector3(0.217, 0.148, 0),
          fontSize: 70
        },
        englishTitle: {
          visibilty: 1,
          position: new BABYLON.Vector3(0, 0, -0.037),
          fontSize: 35
        },
        line: {
          position: new BABYLON.Vector3(0, 0.045, 0)
        },
        box: {
          addTop: 17 * 1.2,
          campusName: {
            fontSize: 26,
            simpleFormat: true
          },
          date: {
            fontSize: 26,
            simpleFormat: true,
            positionZ: -0.027
          },
          addBottom: 5 * 1.2
        }
      }
    }
  },
  {
    name: 'com.mo',
    exportSize: { w: 900, h: 300 },
    container: {
      position: new BABYLON.Vector3(0, 0.423, 13),
      size: { w: 661, h: 158 },
      rowCount: 2,
      childs: {
        chineseTitle: {
          visibilty: 1,
          position: new BABYLON.Vector3(0.185, 0.1, 0),
          fontSize: 36
        },
        englishTitle: {
          visibilty: 0,
          position: new BABYLON.Vector3(0, 0, -0.025),
          fontSize: 24
        },
        line: {
          position: new BABYLON.Vector3(0, 0, 0)
        },
        box: {
          addTop: 20,
          campusName: {
            fontSize: 24,
            simpleFormat: true
          },
          date: {
            fontSize: 24,
            simpleFormat: true,
            positionZ: 0.016
          },
          addBottom: 7
        }
      }
    }
  }
]
const camaraScale = 1.62 / 1500 // 当前相机配置下babylon世界中z=13时，中心部分每单位尺寸与设计稿单位尺寸（px）的比例
const campusArray = [
  ['成都', '05.22'],
  ['天府', '05.22'],
  ['重庆', '05.29'],
  ['西安', '05.31'],
  ['上海', '05.22'],
  ['武汉', '05.25'],
  ['深圳', '06.12'],
  ['南京', '05.22'],
  ['杭州', '05.22'],
  ['广州', '06.22'],
  ['凡云', '05.24'],
  ['阿多比', '05.29']
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

// 场景水滴参数
const shuidiArray: BABYLON.AbstractMesh[] = []
const shuidiPositionArray = [
  // eslint-disable-next-line prettier/prettier
  [-0.75, -0.36, -0.08, +0.4, +0.77, +1.3, +1.86, +2.37, +2.87, +3.35, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.7, +0.73, +1.02, +1.15, +1.25, +1.27, +1.4, +1.44, +1.6, +0.965, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+11.6, +11.4, +9.0, +7.3, +6.8, +5.6, +4.0, +3.0, +2.0, +1.0, 11, 12, 13]
]
const shuidiRotationArray = [
  // eslint-disable-next-line prettier/prettier
  [+1.95, +1.9, +0.001, +1.98, +0.001, +1.9, +1.98, +0.001, +0.001, -0.1, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.15, +1.9, +1.9, +1.68, +0.1, +1.8, +0.001, +0.11, +1.8, -0.32, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.001, +1.97, +1.97, +0.001, +1.98, +1.87, +0.001, +0.001, +0.001, -0.015, 11, 12, 13]
]
const shuidiScaleArray = [
  // eslint-disable-next-line prettier/prettier
  [+0.816, +0.735, +0.816, +0.816, +0.792, +0.816, +0.716, +0.701, +0.67, +0.67, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.816, +0.735, +0.816, +0.816, +0.792, +0.816, +0.716, +0.701, +0.67, +0.67, 11, 12, 13],
  // eslint-disable-next-line prettier/prettier
  [+0.816, +0.735, +0.816, +0.816, +0.792, +0.816, +0.716, +0.701, +0.67, +0.67, 11, 12, 13]
]
const textMaterialColorArray = [
  // eslint-disable-next-line prettier/prettier
  [233, 255, 0],
  // eslint-disable-next-line prettier/prettier
  [56, 167, 137],
  // eslint-disable-next-line prettier/prettier
  [74, 46, 251]
]

export default function BannerBox(): JSX.Element {
  const [imgUrl, setImgUrl] = useState('/src/public/img/banner/opneing.' + exportSets[0].name + '.jpg')

  useEffect(() => {
    const canvas = document.getElementById('BannerCanvas')

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
      scene.ambientColor = new BABYLON.Color3(1, 0, 1)

      // 是否开启inspector ///////////////////////////////////////////////////////////////////////////////////////////////////
      // scene.debugLayer.show({
      //   // embedMode: true
      // })

      // 文字模型创建器
      const Writer = MeshWriter(scene, { scale: 1 })

      // 摄像机
      const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 1.97, 12.7, new BABYLON.Vector3(0, 0.66, 3), scene)
      camera.attachControl(canvas, false)
      camera.minZ = 0.1
      camera.fov = 0.26

      const cameraControl = (event: MouseEvent): void => {
        if (event.buttons === 0) {
          camera.alpha += event.movementX / 1000000
          camera.beta += event.movementY / 1000000
        }
      }
      // 注册鼠标移动事件来触发相机控制
      canvas.addEventListener('mousemove', cameraControl)

      // ----------------------------静态材质定义----------------------------------

      // 加载model
      BABYLON.SceneLoader.AppendAsync(
        banner_model_url.substring(0, banner_model_url.lastIndexOf('/') + 1),
        banner_model_url.substring(banner_model_url.lastIndexOf('/') + 1),
        scene,
        function (event) {
          // 加载进度计算
          const percentage = event.lengthComputable ? ' ' + Math.floor((event.loaded / event.total) * 100) + '%' : ''
          document.getElementsByClassName('LoadingProgress')[0]
            ? (document.getElementsByClassName('LoadingProgress')[0].innerHTML = percentage)
            : console.log('没找到.LoadingProgress元素')
        }
      ).then(() => {
        // 水滴PBR材质
        const shuidiPbrMaterial = new BABYLON.PBRMaterial('shuidiPbrMaterial', scene)
        shuidiPbrMaterial.albedoColor = new BABYLON.Color3(192 / 255, 178 / 255, 211 / 255)
        shuidiPbrMaterial.metallic = 1
        shuidiPbrMaterial.roughness = 0.9
        shuidiPbrMaterial.emissiveColor = new BABYLON.Color3(192 / 255, 178 / 255, 211 / 255).multiply(new BABYLON.Color3(0.7, 0.7, 0.7))

        // 定义水滴母版
        let shuidi = scene.meshes[0]
        for (const mesh of scene.meshes) {
          if (mesh.name === '水滴') {
            shuidi = mesh
            shuidi.position = new BABYLON.Vector3(0, 10, 0)
          }
        }

        // ------------------------依赖model内容循环构建的内容------------------------------
        let b = 0
        for (let a = 0; a < campusArray.length; a++) {
          if (campusArray[a][0] === '阿多比' || campusArray[a][0] === '凡云') {
            b++
            continue
          }
          // 值简化
          const shuidiPosition = new BABYLON.Vector3(
            shuidiPositionArray[0][a - b],
            shuidiPositionArray[1][a - b],
            shuidiPositionArray[2][a - b]
          )
          const shuidiRotation = new BABYLON.Vector3(
            Math.PI * shuidiRotationArray[0][a - b],
            Math.PI * shuidiRotationArray[1][a - b],
            Math.PI * shuidiRotationArray[2][a - b]
          )
          const shuidiScaling = new BABYLON.Vector3(shuidiScaleArray[0][a - b], shuidiScaleArray[1][a - b], shuidiScaleArray[2][a - b])
          const text_material_color = new BABYLON.Color3(
            textMaterialColorArray[0][(a - b) % 3] / 255,
            textMaterialColorArray[1][(a - b) % 3] / 255,
            textMaterialColorArray[2][(a - b) % 3] / 255
          )

          // ---------------------------动态定义材质--------------------------------
          // 文字PBR材质
          const textPbrMaterial = new BABYLON.PBRMaterial('textPbrMaterial', scene)
          textPbrMaterial.metallic = 0
          textPbrMaterial.roughness = 1
          textPbrMaterial.albedoColor = text_material_color.toLinearSpace()
          // 每三个水滴一个循环
          switch ((a - b) % 3) {
            case 0:
              textPbrMaterial.emissiveColor = text_material_color.hsvOffset([0, 'add'], [1], [0.5, 'mul'])
              break

            case 1:
              textPbrMaterial.emissiveColor = text_material_color.hsvOffset([-0.07, 'add'], [1], [0.5, 'mul'])
              break

            case 2:
              textPbrMaterial.emissiveColor = text_material_color.hsvOffset([0.05, 'add'], [1], [0.5, 'mul'])
              break

            default:
              textPbrMaterial.emissiveColor = text_material_color
              break
          }

          // ---------------------------循环水滴生成------------------------
          // 水滴
          const shuidiClone = shuidi.clone('shuidi', null, false)!
          shuidiClone.id = 'shuidi' + a
          // shuidiClone.showBoundingBox = true
          shuidiClone.material = shuidiPbrMaterial

          // 水滴正面文字
          const shuidi_textWriter = new Writer(campusArray[a][0], {
            'font-family': 'YSbiaotiyuan', // 名称注意大小写
            'letter-height': 0.2,
            'letter-thickness': 0.05
          }) as Writer
          const shuidi_textMesh = shuidi_textWriter.getMesh()!
          shuidi_textMesh.name = 'shuidi_textMesh'
          shuidi_textMesh.id = 'shuidi_textMesh' + a
          // shuidi_textMesh.showBoundingBox = true
          shuidi_textMesh.material = textPbrMaterial
          shuidi_textMesh.parent = shuidiClone

          // x轴居中处理
          shuidi_textMesh.locallyTranslate(new BABYLON.Vector3(-shuidi_textMesh.getBoundingInfo().boundingBox.center.x, -0.09, 0.03))

          shuidi_textMesh.addRotation(Math.PI * (3 / 2), Math.PI * (0 / 2), Math.PI * (0 / 2))

          shuidiClone.position = shuidiPosition
          shuidiClone.scaling = shuidiScaling
          shuidiClone.addRotation(shuidiRotation._x, shuidiRotation._y, shuidiRotation._z)
          shuidiArray.push(shuidiClone)

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
          shuidi_spotLight.includedOnlyMeshes = [shuidiClone, shuidi_textMesh]
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
          shuidi_generator.addShadowCaster(shuidi_textMesh, true)

          // 设置锥形光使水滴上的文字颜色产生渐变
          const text_spotLight = new BABYLON.SpotLight(
            'text_spotLight',
            new BABYLON.Vector3(0, 2, 4.5),
            new BABYLON.Vector3(0, -0.4, -1),
            Math.PI * (1 / 13),
            10,
            scene
          )
          text_spotLight.id = 'text_spotLight' + a
          text_spotLight.includedOnlyMeshes = [shuidi_textMesh]
          text_spotLight.intensity = 500
          text_spotLight.radius = 3
          text_spotLight.diffuse =
            (a - b) % 3 === 1
              ? text_material_color.hsvOffset([0.1, 'add'], [1], [0.1, 'mul'])
              : text_material_color.hsvOffset([0.1, 'add'], [1], [1])
          text_spotLight.parent = shuidiClone
        }
        // 网格构建循环结束

        // --------------------------------模型调整-----------------------------------
        const floor = scene.getMeshById('地面'),
          background = scene.getMeshById('背景'),
          highway = scene.getMeshById('公路'),
          yellowLine = scene.getMeshById('黄线'),
          whiteLine = scene.getMeshById('白线')

        if (floor !== null && background !== null && highway !== null && yellowLine !== null && whiteLine !== null) {
          // 主光源
          const mainLight = new BABYLON.DirectionalLight('mainLight', new BABYLON.Vector3(0, -10, 0), scene)
          mainLight.includedOnlyMeshes = [floor, background, highway, yellowLine, whiteLine]
          mainLight.intensity = 4
          mainLight.radius = 10

          // 正面光
          const positiveLight = new BABYLON.DirectionalLight('positiveLight', new BABYLON.Vector3(0, 0, -10), scene)
          positiveLight.includedOnlyMeshes = [floor, background, highway, yellowLine, whiteLine]
          positiveLight.intensity = 2
          positiveLight.radius = 10

          // 公路色彩增强光

          // 公路色相偏移
          const highwayLight01 = new BABYLON.DirectionalLight('highwayLight01', new BABYLON.Vector3(0, -10, 0), scene)
          highwayLight01.includedOnlyMeshes = [highway]
          highwayLight01.diffuse = new BABYLON.Color3(3, 0, 255)
          highwayLight01.intensity = 1
          highwayLight01.radius = 10

          // 黄线饱和度提高
          const highwayLight1 = new BABYLON.DirectionalLight('highwayLight1', new BABYLON.Vector3(0, -10, 0), scene)
          highwayLight1.includedOnlyMeshes = [yellowLine]
          highwayLight1.diffuse = new BABYLON.Color3(0, 255, 255)
          highwayLight1.intensity = 0.01
          highwayLight1.radius = 10

          // 正面红色
          const highwayLight2 = new BABYLON.PointLight('highwayLight2', new BABYLON.Vector3(0, 1, 15), scene)
          highwayLight2.includedOnlyMeshes = [highway, yellowLine, whiteLine]
          highwayLight2.diffuse = new BABYLON.Color3(1, 0, 0)
          highwayLight2.intensity = 100

          const highwayLight3 = new BABYLON.DirectionalLight('highwayLight3', new BABYLON.Vector3(0, 0, -10), scene)
          highwayLight3.includedOnlyMeshes = [highway, whiteLine]
          highwayLight3.diffuse = new BABYLON.Color3(0, 1, 0)
          highwayLight3.intensity = 10

          // 水滴环境色补足
          const shuidiLight = new BABYLON.HemisphericLight('shuidiLight', new BABYLON.Vector3(0, -10, 0), scene)
          shuidiLight.includedOnlyMeshes = shuidiArray
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

            if (scene.meshes[i].name === '公路' || scene.meshes[i].name === '黄线' || scene.meshes[i].name === '白线') {
              // scene.meshes[i].isVisible = false
              scene.meshes[i].position.y += -0.45
              scene.meshes[i].rotation = new BABYLON.Vector3(Math.PI * (-1 / 512), Math.PI * (0 / 6), Math.PI * (0 / 6))
            }

            if (scene.meshes[i].name === '地面') {
              scene.meshes[i].rotation = new BABYLON.Vector3(Math.PI * (1.25 / 256), Math.PI * (0 / 6), Math.PI * (0 / 6))
              scene.meshes[i].position.y += -0.2
              // scene.meshes[i].isVisible = false
            }
          }
        }
      })

      // 世界坐标轴显示
      // new BABYLON.AxesViewer(scene, 1)

      // 动态布局
      let container: BABYLON.AbstractMesh

      // 功能型信息PBR材质
      const infoPbrMaterial = new BABYLON.PBRMaterial('infoPbrMaterial', scene)
      infoPbrMaterial.albedoColor = new BABYLON.Color3(255 / 255, 255 / 255, 255 / 255)
      infoPbrMaterial.metallic = 1
      infoPbrMaterial.roughness = 0.9
      infoPbrMaterial.emissiveColor = new BABYLON.Color3(255 / 255, 255 / 255, 255 / 255)

      // 容器透明材质
      const containerMaterial = new BABYLON.PBRMaterial('containerMaterial', scene)
      containerMaterial.alpha = 0

      const screenshot = (shot: boolean, k: number): void => {
        container !== undefined && container.dispose() // 清空容器
        container = BABYLON.MeshBuilder.CreateBox(
          'container',
          { width: exportSets[k].container.size.w * camaraScale, height: exportSets[k].container.size.h * camaraScale, depth: 0.01 },
          scene
        )
        container.id = 'container'
        container.position = exportSets[k].container.position
        container.addRotation(Math.PI * (0 / 2), Math.PI * (2 / 2), Math.PI * (0 / 2))
        container.material = containerMaterial
        // container.showBoundingBox = true

        // 最新开班时间
        const title_cn_textWriter = new Writer('最新开班时间', {
          'font-family': 'YouSheBiaoTiHei-2',
          'letter-height': exportSets[k].container.childs.chineseTitle.fontSize * camaraScale,
          'letter-thickness': 0.001,
          color: '#e72323'
        }) as Writer
        const title_cn_textMesh = title_cn_textWriter.getMesh()!
        title_cn_textMesh.id = 'title_cn_textMesh'
        title_cn_textMesh.name = 'title_cn_textMesh'
        title_cn_textMesh.material = infoPbrMaterial
        title_cn_textMesh.parent = container
        title_cn_textMesh.addRotation(Math.PI * (3 / 2), Math.PI * (0 / 2), Math.PI * (0 / 2))
        title_cn_textMesh.position = exportSets[k].container.childs.chineseTitle.position
        title_cn_textMesh.visibility = exportSets[k].container.childs.chineseTitle.visibilty

        // Lastest opening time
        const title_en_textWriter = new Writer('Lastest opening time', {
          'font-family': 'YouSheBiaoTiHei-2',
          'letter-height': exportSets[k].container.childs.englishTitle.fontSize * camaraScale,
          'letter-thickness': 0.001
        }) as Writer
        const title_en_textMesh = title_en_textWriter.getMesh()!
        title_en_textMesh.id = 'title_en_textMesh'
        title_en_textMesh.name = 'title_en_textMesh'
        title_en_textMesh.material = infoPbrMaterial
        title_en_textMesh.parent = title_cn_textMesh
        title_en_textMesh.position = exportSets[k].container.childs.englishTitle.position
        title_en_textMesh.visibility = exportSets[k].container.childs.englishTitle.visibilty

        // 白色横线
        const line = BABYLON.CreateBox('line', { width: 1, height: 0.001, depth: 0.001 })
        line.id = 'line'
        line.name = 'line'
        line.material = infoPbrMaterial
        line.parent = container
        line.position = exportSets[k].container.childs.line.position
        line.scaling._x = container.getBoundingInfo().boundingBox.maximum._x / line.getBoundingInfo().boundingBox.maximum._x

        const meshSizeArray: { w: number; h: number; d: number }[] = []
        // 开班时间信息创建
        for (let a = 0; a < campusArray.length; a++) {
          const time_array = campusArray[a][1].split('.') // 从“·”号处将时间拆分为[月，日]
          const campusName = exportSets[k].container.childs.box.campusName.simpleFormat ? campusArray[a][0] : campusArray[a][0] + '校区'
          const date = exportSets[k].container.childs.box.date.simpleFormat
            ? time_array[0].replace(/\b(0+)/gi, '') + '.' + time_array[1]
            : time_array[0].replace(/\b(0+)/gi, '') + '月' + time_array[1] + '日'
          // 校区名称字体
          const campus_textWriter = new Writer(campusName, {
            'font-family': 'YouSheBiaoTiHei-2',
            'letter-height': exportSets[k].container.childs.box.campusName.fontSize * camaraScale,
            'letter-thickness': 0.001
          }) as Writer
          const campus_name_textMesh = campus_textWriter.getMesh()!
          campus_name_textMesh.id = 'campus_name_textMesh' + a
          campus_name_textMesh.name = 'campus_name_textMesh'
          campus_name_textMesh.material = infoPbrMaterial
          // campus_name_textMesh.showBoundingBox = true
          // const campusAxesViewer = new BABYLON.AxesViewer(scene, 0.025)
          // campusAxesViewer.xAxis.parent = campus_name_textMesh
          // campusAxesViewer.yAxis.parent = campus_name_textMesh
          // campusAxesViewer.zAxis.parent = campus_name_textMesh

          // 时间文字生成
          const date_textWriter = new Writer(date, {
            'font-family': 'YouSheBiaoTiHei-2',
            'letter-height': exportSets[k].container.childs.box.date.fontSize * camaraScale,
            'letter-thickness': 0.001
          }) as Writer
          const date_textMesh = date_textWriter.getMesh()!
          date_textMesh.id = 'date_textMesh' + a
          date_textMesh.name = 'date_textMesh'
          date_textMesh.material = infoPbrMaterial
          // date_textMesh.showBoundingBox = true
          // const dateAxesViewer = new BABYLON.AxesViewer(scene, 0.025)
          // dateAxesViewer.xAxis.parent = date_textMesh
          // dateAxesViewer.yAxis.parent = date_textMesh
          // dateAxesViewer.zAxis.parent = date_textMesh

          const campusMeshSize = {
            w: Math.abs(campus_name_textMesh.getBoundingInfo().maximum._x - campus_name_textMesh.getBoundingInfo().minimum._x),
            h: Math.abs(campus_name_textMesh.getBoundingInfo().maximum._y - campus_name_textMesh.getBoundingInfo().minimum._y),
            d: Math.abs(campus_name_textMesh.getBoundingInfo().maximum._z - campus_name_textMesh.getBoundingInfo().minimum._z)
          }

          const dateMeshSize = {
            w: Math.abs(date_textMesh.getBoundingInfo().maximum._x - date_textMesh.getBoundingInfo().minimum._x),
            h: Math.abs(date_textMesh.getBoundingInfo().maximum._y - date_textMesh.getBoundingInfo().minimum._y),
            d: Math.abs(date_textMesh.getBoundingInfo().maximum._z - date_textMesh.getBoundingInfo().minimum._z)
          }

          const boxW = campusMeshSize.w > dateMeshSize.w ? campusMeshSize.w : dateMeshSize.w
          const boxH = campusMeshSize.h > dateMeshSize.h ? campusMeshSize.h : dateMeshSize.h
          const boxD =
            campusMeshSize.d +
            dateMeshSize.d +
            Math.abs(exportSets[k].container.childs.box.date.positionZ) +
            exportSets[k].container.childs.box.addTop * camaraScale +
            exportSets[k].container.childs.box.addBottom * camaraScale
          const box = BABYLON.MeshBuilder.CreateBox('box', { width: boxW, height: boxH, depth: boxD }, scene)
          box.id = 'box' + a
          box.material = containerMaterial
          box.addRotation(Math.PI * (3 / 2), Math.PI * (0 / 2), Math.PI * (0 / 2))
          box.visibility = 0
          box.parent = container
          // box.showBoundingBox = true
          // const boxAxesViewer = new BABYLON.AxesViewer(scene, 0.05)
          // boxAxesViewer.xAxis.parent = box
          // boxAxesViewer.yAxis.parent = box
          // boxAxesViewer.zAxis.parent = box

          campus_name_textMesh.parent = box
          date_textMesh.parent = box

          campus_name_textMesh.position = new BABYLON.Vector3(
            0 - boxW / 2,
            0,
            boxD / 2 - campusMeshSize.d - exportSets[k].container.childs.box.addTop * camaraScale
          )
          date_textMesh.position = new BABYLON.Vector3(
            0 - boxW / 2,
            0,
            -boxD / 2 + exportSets[k].container.childs.box.addBottom * camaraScale
          )

          meshSizeArray.push({ w: boxW, h: boxH, d: boxD })

          if (exportSets[k].name.split('.')[1] === 'mo') {
            // 当导出设置为移动端时，隐藏模型场景
            for (const mesh of scene.meshes) {
              if (mesh.name === '__root__') {
                // 将 __root__ 及其所有子级可见度设置为0
                setVisibility(mesh, false)
              }
            }
            // 标题居中
            title_cn_textMesh.position.x = 0 - title_cn_textMesh.getBoundingInfo().boundingBox.center.x
          } else {
            // 桌面端显示背景
            for (const mesh of scene.meshes) {
              setVisibility(mesh, true)
              if (mesh.name === 'container') {
                // 将 container 及其所有子级设置为不可见 ////////////////////////////////////////
                // setVisibility(mesh, false)
              }
            }
          }
        }

        const dateMeshPositionsArray = computeDateMeshPositions(
          meshSizeArray,
          exportSets[k].container.size.w * camaraScale,
          exportSets[k].container.size.h * camaraScale,
          exportSets[k].container.rowCount
        )

        // 更新校区网格坐标
        for (let b = 0; b < campusArray.length; b++) {
          const mesh = scene.getMeshById('box' + b)
          if (mesh !== null) {
            mesh.position = new BABYLON.Vector3(dateMeshPositionsArray[b].x, dateMeshPositionsArray[b].y, 0)
          }
        }

        // 截图
        shot === true &&
          BABYLON.Tools.CreateScreenshotUsingRenderTarget(
            engine,
            camera,
            { width: exportSets[k].exportSize.w, height: exportSets[k].exportSize.h, precision: 4 },
            undefined,
            'image/png',
            4,
            true,
            'opening' + exportSets[k].name + '.png'
          )

        // 替换背景图
        setImgUrl('/src/public/img/banner/opneing.' + exportSets[k].name + '.jpg')
      }

      // 根据container尺寸等设置计算元素位置
      const computeDateMeshPositions = (
        meshSizeArray: { w: number; h: number; d: number }[],
        containerWidth: number,
        containerHeight: number,
        rowCount: number
      ): { x: number; y: number }[] => {
        const positons: { x: number; y: number }[] = [] // 定义坐标数组
        const colCount = Math.ceil(meshSizeArray.length / rowCount) // 每行可容纳的数量
        for (let i = 0; i < rowCount; i++) {
          const meshHeight = meshSizeArray[0].d // 网格高度
          const totalHeight = rowCount * meshHeight // 计算有内容的高度
          const vSpacing = rowCount === 1 ? 0 : (containerHeight - totalHeight) / (rowCount - 1) // 计算均分垂直间距
          const y = containerHeight / 2 - i * (meshHeight + vSpacing)
          let x = 0
          let totalWidth = 0
          let hSpacing = 0

          // 计算单行元素总长度
          for (let j = 0; j < colCount; j++) {
            totalWidth += meshSizeArray[i * colCount + j].w
          }
          // 第i行的元素水平间距
          hSpacing = (containerWidth - totalWidth) / (colCount - 1)
          for (let k = 0; k < colCount; k++) {
            // 计算左侧所有盒子总宽度
            let totalWidthOfLeft = 0
            for (let l = 0; l < k; l++) {
              totalWidthOfLeft += meshSizeArray[i * colCount + l].w
            }
            x = totalWidthOfLeft + meshSizeArray[i * colCount + k].w / 2 + k * hSpacing - containerWidth / 2
            positons.push({ x: x, y: y - meshHeight / 2 })
          }
        }
        return positons
      }

      // 递归函数，将网格及其子级的可见性设置为 false
      const setVisibility = (mesh: BABYLON.AbstractMesh, visible: boolean): void => {
        mesh.visibility = visible ? 1 : 0

        // 遍历所有子级并递归调用 setVisibility 函数
        for (let i = 0; i < mesh.getChildMeshes().length; i++) {
          const childMesh = mesh.getChildMeshes()[i]
          setVisibility(childMesh, visible)
        }
      }

      let k = 0
      const timerIdArray: NodeJS.Timeout[] = []
      const screenshotLoop = (): void => {
        screenshot(true, k)

        // const delay = k === 0 ? 5000 : 500
        const timeId = setTimeout(screenshotLoop, 1000)
        timerIdArray.push(timeId)

        if (++k === 4) {
          console.log('已循环完所有导出配置')
          for (const timerId of timerIdArray) {
            clearTimeout(timerId)
          }
          return
        }
      }
      const keydown = (e: KeyboardEvent): void => {
        if (e.code == 'Enter') {
          console.log('正在循环导出所有配置的截图')
          screenshotLoop()
        } else if (e.code == 'Space') {
          if (k < exportSets.length) {
            screenshot(true, k) //测试环境变更此值以觉定是否截图
            k++
          } else {
            k = 0
            screenshot(false, k)
            console.log('已经执行过所有导出配置了')
          }
        }
      }
      engine.displayLoadingUI()

      // 当场景中资源加载和初始化完成后
      scene.executeWhenReady(() => {
        // 注册循环渲染函数
        engine.runRenderLoop(() => {
          scene.render()
        })
        screenshot(false, 0) /////////////////////////////////////////////////////////////////////////////////////
        window.addEventListener('keydown', keydown)
      })

      //组件卸载时
      return () => {
        // 销毁场景和引擎
        scene.dispose()
        engine.dispose()
        canvas.removeEventListener('mousemove', cameraControl)
        window.removeEventListener('keydown', keydown)
        console.log('内存已清理')
      }
    } else {
      //组件卸载时
      return () => {}
    }
  }, [])

  return (
    <div id="BannerBox">
      <div className="top_nav">
        <img src={top_nav_url} />
      </div>
      <div className="banner_area">
        <img className="contrast" src={imgUrl} />
        <canvas id="BannerCanvas">当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试</canvas>
      </div>
      <div className="loading_progress">
        LoadingProgress:<span className="LoadingProgress"></span>
      </div>
    </div>
  )
}
