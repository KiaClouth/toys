import { useEffect } from 'react'
import 'babylonjs'
import 'babylonjs-materials'
import 'babylonjs-loaders'
import 'babylonjs-inspector'
import MeshWriter from '../assets/js-plugin/meshwriter/meshwriter.ES'

import { canvasResize, isCanvas } from '../tool'
import contrast_url from '../public/img/banner/contrast.jpg?url'
import top_nav_url from '../public/img/banner/top_nav.svg?url'
import banner_model_url from '../public/model/banner.gltf?url'

const camaraScale = 1.68 / 1500 // 当前相机配置下babylon世界中z=13时，中心部分每单位尺寸与设计稿单位尺寸（px）的比例
const exportSets: { name: string; size: { w: number; h: number }; containerWidth: number; containerHeight: number; rowCount: number }[] = [
  { name: 'cn.pc', size: { w: 1920, h: 650 }, containerWidth: 1500, containerHeight: 58, rowCount: 1 },
  { name: 'cn.mo', size: { w: 660, h: 330 }, containerWidth: 570, containerHeight: 164, rowCount: 2 },
  { name: 'com.pc', size: { w: 1110, h: 450 }, containerWidth: 1200, containerHeight: 58, rowCount: 1 },
  { name: 'com.mo', size: { w: 900, h: 300 }, containerWidth: 660, containerHeight: 158, rowCount: 2 }
]

const defaultContainerWidth = exportSets[0].containerWidth * camaraScale
const defaultContainerHeight = exportSets[0].containerHeight * camaraScale

const campusArray = [
  ['成都', '02.20'],
  ['天府', '03.06'],
  ['重庆', '02.27'],
  ['西安', '02.20'],
  ['上海', '02.20'],
  ['武汉', '02.20'],
  ['深圳', '02.20'],
  ['南京', '03.06'],
  ['杭州', '03.13'],
  ['广州', '03.06'],
  ['凡云', '03.01'],
  ['阿多比', '02.20']
]

const campus_displayed_count = campusArray.length - 2

// 按时间顺序对校区数组重排,不包括末尾的‘凡云’和‘阿多比’
for (let i = 0; i < campusArray.length - 3; i++) {
  for (let j = 0; j < campusArray.length - 3 - i; j++) {
    if (campusArray[j][1] > campusArray[j + 1][1]) {
      const temp_array = campusArray[j]
      campusArray[j] = campusArray[j + 1]
      campusArray[j + 1] = temp_array
    }
  }
}

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

export default function BannerBox(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('BannerCanvas')!

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
        loadingUIBackgroundColor: '#ffffff',
        loadingUIText: 'Loading...'
      }

      const scene = new BABYLON.Scene(engine)
      scene.ambientColor = new BABYLON.Color3(1, 0, 1)
      // 是否开启inspector
      scene.debugLayer.show({
        // embedMode: true
      })

      // 文字模型创建器
      const Writer = MeshWriter(scene, { scale: 1 })

      // 摄像机
      const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 1.97, 12.7, new BABYLON.Vector3(0, 0.66, 3), scene)
      camera.attachControl(canvas, true)
      camera.minZ = 0.1
      camera.fov = 0.26
      // new BABYLON.FxaaPostProcess('fxaa', 4, camera) //后期抗锯齿处理

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
        for (let a = 0; a < campus_displayed_count; a++) {
          // 值简化
          const shuidiPosition = new BABYLON.Vector3(shuidiPositionArray[0][a], shuidiPositionArray[1][a], shuidiPositionArray[2][a])
          const shuidiRotation = new BABYLON.Vector3(
            Math.PI * shuidiRotationArray[0][a],
            Math.PI * shuidiRotationArray[1][a],
            Math.PI * shuidiRotationArray[2][a]
          )
          const shuidiScaling = new BABYLON.Vector3(shuidiScaleArray[0][a], shuidiScaleArray[1][a], shuidiScaleArray[2][a])
          const text_material_color = new BABYLON.Color3(
            textMaterialColorArray[0][a % 3] / 255,
            textMaterialColorArray[1][a % 3] / 255,
            textMaterialColorArray[2][a % 3] / 255
          )

          // ---------------------------动态定义材质--------------------------------
          // 文字PBR材质
          const textPbrMaterial = new BABYLON.PBRMaterial('textPbrMaterial', scene)
          textPbrMaterial.metallic = 0
          textPbrMaterial.roughness = 1
          textPbrMaterial.albedoColor = text_material_color.toLinearSpace()
          // 每三个水滴一个循环
          switch (a % 3) {
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
          })
          const shuidi_textMesh = shuidi_textWriter.getMesh()
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
            a % 3 === 1
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

      // 功能型信息PBR材质
      const infoPbrMaterial = new BABYLON.PBRMaterial('infoPbrMaterial', scene)
      infoPbrMaterial.albedoColor = new BABYLON.Color3(255 / 255, 255 / 255, 255 / 255)
      infoPbrMaterial.metallic = 1
      infoPbrMaterial.roughness = 0.9
      infoPbrMaterial.emissiveColor = new BABYLON.Color3(255 / 255, 255 / 255, 255 / 255)

      // 平面文本构建
      const container = BABYLON.MeshBuilder.CreateBox(
        'container',
        { width: defaultContainerWidth, height: defaultContainerHeight, depth: 0.01 },
        scene
      )
      container.id = 'container'
      container.scaling = new BABYLON.Vector3(1, 1, 1)
      container.position = new BABYLON.Vector3(0, 0.22, 13)
      container.addRotation(Math.PI * (0 / 2), Math.PI * (2 / 2), Math.PI * (0 / 2))
      container.material = infoPbrMaterial
      container.isVisible = false
      container.visibility = 0.1
      container.showBoundingBox = true

      // 复制原始顶点数据
      const containerVertexData = container.getVerticesData(BABYLON.VertexBuffer.PositionKind)!
      const containerPositionsDefault = new Float32Array(containerVertexData.slice())

      // //局部坐标轴显示
      // const campus_name_textMesh_a = new BABYLON.AxesViewer(scene, 0.25)
      // campus_name_textMesh_a.xAxis.parent = container
      // campus_name_textMesh_a.yAxis.parent = container
      // campus_name_textMesh_a.zAxis.parent = container

      // 最新开班时间
      const title_cn_textWriter = new Writer('最新开班时间', {
        'font-family': 'YouSheBiaoTiHei-2', // 名称注意大小写
        'letter-height': 0.05,
        'letter-thickness': 0.001
      })
      const title_cn_textMesh = title_cn_textWriter.getMesh()
      title_cn_textMesh.id = 'title_cn_textMesh'
      title_cn_textMesh.name = 'title_cn_textMesh'
      title_cn_textMesh.material = infoPbrMaterial
      title_cn_textMesh.parent = container
      title_cn_textMesh.addRotation(Math.PI * (3 / 2), Math.PI * (0 / 2), Math.PI * (0 / 2))
      title_cn_textMesh.position = new BABYLON.Vector3(0.185, 0.12, 0)
      title_cn_textMesh.isVisible = true

      // Lastest opening time
      const title_en_textWriter = new Writer('Lastest opening time', {
        'font-family': 'YouSheBiaoTiHei-2', // 名称注意大小写
        'letter-height': 0.026,
        'letter-thickness': 0.001
      })
      const title_en_textMesh = title_en_textWriter.getMesh()
      title_en_textMesh.id = 'title_en_textMesh'
      title_en_textMesh.name = 'title_en_textMesh'
      title_en_textMesh.material = infoPbrMaterial
      title_en_textMesh.parent = title_cn_textMesh
      title_en_textMesh.position = new BABYLON.Vector3(0, 0, -0.025)

      // 世界坐标轴显示
      // new BABYLON.AxesViewer(scene, 1)

      // 与model无关的循环创建项
      const campusMeshArray: BABYLON.AbstractMesh[] = []
      for (let a = 0; a < campus_displayed_count; a++) {
        // 校区名称字体
        const campus_textWriter = new Writer(campusArray[a][0] + '校区', {
          'font-family': 'YouSheBiaoTiHei-2', // 名称注意大小写
          'letter-height': 0.02,
          'letter-thickness': 0.001
        })
        const campus_name_textMesh = campus_textWriter.getMesh()
        campus_name_textMesh.id = 'campus_name_textMesh' + a
        campus_name_textMesh.name = 'campus_name_textMesh'
        campus_name_textMesh.material = infoPbrMaterial
        campus_name_textMesh.parent = container
        campus_name_textMesh.addRotation(Math.PI * (3 / 2), Math.PI * (0 / 2), Math.PI * (0 / 2))
        campusMeshArray.push(campus_name_textMesh)

        // 时间文字生成
        const time_array = campusArray[a][1].split('.') // 从“·”号处将时间拆分为[月，日]
        time_array[0] = time_array[0].replace(/\b(0+)/gi, '') //去掉月前面的0
        const date = time_array[0] + '月' + time_array[1] + '日'
        const date_textWriter = new Writer(date, {
          'font-family': 'YouSheBiaoTiHei-2', // 名称注意大小写
          'letter-height': 0.02,
          'letter-thickness': 0.001
        })
        const date_textMesh = date_textWriter.getMesh()
        date_textMesh.id = 'date_textMesh' + a
        date_textMesh.name = 'date_textMesh'
        date_textMesh.material = infoPbrMaterial
        date_textMesh.parent = campus_name_textMesh
        date_textMesh.position = new BABYLON.Vector3(0, 0, -0.025)
      }

      // 动态布局
      let k = 0
      const timerIdArray: NodeJS.Timeout[] = []

      const computeDateMeshPositions = (
        meshArray: BABYLON.AbstractMesh[],
        boxWidth: number,
        boxHeight: number,
        rowCount: number
      ): { x: number; y: number }[] => {
        const positons: { x: number; y: number }[] = [] // 定义坐标数组
        const colCount = Math.ceil(meshArray.length / rowCount) // 每行可容纳的数量
        for (let i = 0; i < rowCount; i++) {
          const meshHeight = meshArray[0].getBoundingInfo().boundingBox.center.z * 2
          const totalHeight = rowCount * meshHeight
          const vSpacing = (boxHeight - totalHeight) / (rowCount - 1)
          const y = rowCount <= 1 ? 0 : i * (meshHeight + vSpacing)
          let x = 0
          let totalWidth = 0
          let hSpacing = 0

          // 计算单行元素总长度
          for (let j = 0; j < colCount; j++) {
            totalWidth += meshArray[i * colCount + j].getBoundingInfo().boundingBox.center.x * 2
          }
          hSpacing = (boxWidth - totalWidth) / (colCount - 1) // 第i行的元素水平间距
          for (let k = 0; k < colCount; k++) {
            const meshWidth = meshArray[i * colCount + k].getBoundingInfo().boundingBox.center.x * 2
            x = k * (meshWidth + hSpacing) - boxWidth / 2
            positons.push({ x: x, y: y })
          }
        }
        return positons
      }

      const screenshot = (shot: boolean): void => {
        const containerPositions = containerPositionsDefault
        console.log(containerPositionsDefault)
        // 更新场景中的对象
        for (let i = 0; i < containerPositions.length; i += 3) {
          containerPositions[i] *= (exportSets[k].containerWidth * camaraScale) / defaultContainerWidth
          containerPositions[i + 1] *= (exportSets[k].containerHeight * camaraScale) / defaultContainerHeight
        }

        // 更新顶点坐标数据
        container.setVerticesData(BABYLON.VertexBuffer.PositionKind, containerPositions)

        const containerBundingInfo = container.getBoundingInfo()
        const containerSize = containerBundingInfo.boundingBox.maximum.subtract(containerBundingInfo.boundingBox.minimum)
        const dateMeshPositionsArray = computeDateMeshPositions(campusMeshArray, containerSize.x, containerSize.y, exportSets[k].rowCount)

        // 更新相机
        // camera.target = camera.target.multiply(new BABYLON.Vector3(1, 1, 0.5))

        // 更新container子级的缩放以抵消container缩放带来的影响
        // container.scaling = new BABYLON.Vector3(
        //   (exportSets[k].containerWidth * camaraScale) / defaultContainerWidth,
        //   (exportSets[k].containerHeight * camaraScale) / defaultContainerHeight,
        //   1
        // )

        // 移动端特殊处理
        if (exportSets[k].name.split('.')[1] === 'mo') {
          // 隐藏除开以下元素以外的网格
          for (const mesh of scene.meshes) {
            if (
              !(mesh.name === '地面') &&
              !(mesh.name === 'container') &&
              !(mesh.name === 'campus_name_textMesh') &&
              !(mesh.name === 'date_textMesh') &&
              !(mesh.name === 'title_cn_textMesh') &&
              !(mesh.name === 'title_en_textMesh')
            ) {
              mesh.isVisible = false
            }
          }
          // 标题居中
          title_cn_textMesh.position.x = containerSize.x - title_cn_textMesh.getBoundingInfo().boundingBox.center.x
        } else {
          // 桌面端显示背景
          for (const mesh of scene.meshes) {
            mesh.isVisible = true
          }
          // 标题靠右
          title_cn_textMesh.position = new BABYLON.Vector3(0.185, 0.12, 0)
        }

        // 更新校区网格坐标
        for (let b = 0; b < campus_displayed_count; b++) {
          const mesh = scene.getMeshById('campus_name_textMesh' + b)
          if (mesh !== null) {
            mesh.position = new BABYLON.Vector3(dateMeshPositionsArray[b].x, dateMeshPositionsArray[b].y, 0)
          }
        }

        // 截图
        // shot === true &&
        //   BABYLON.Tools.CreateScreenshotUsingRenderTarget(
        //     engine,
        //     camera,
        //     { width: exportSets[k].size.w, height: exportSets[k].size.h, precision: 1 },
        //     undefined,
        //     'image/png',
        //     1,
        //     true,
        //     'opening' + exportSets[k].name + '.png'
        //   )
      }

      const screenshotLoop = (): void => {
        screenshot(true)
        const timeId = setTimeout(screenshotLoop, 5000)
        timerIdArray.push(timeId)

        if (++k === exportSets.length) {
          screenshot(false)
          console.log('已循环完所有导出配置')
          for (const timerId of timerIdArray) {
            clearTimeout(timerId)
          }
          return
        }
      }
      // setTimeout(() => {
      //   BABYLON.Tools.CreateScreenshotUsingRenderTarget(
      //     engine,
      //     camera,
      //     { width: exportSets[0].size.w, height: exportSets[0].size.h, precision: 4 },
      //     undefined,
      //     'image/png',
      //     1,
      //     true,
      //     'opening' + exportSets[0].name + '.png'
      //   )
      // }, 2000)

      engine.displayLoadingUI()

      // 当场景中资源加载和初始化完成后
      scene.executeWhenReady(() => {
        // 注册循环渲染函数
        engine.runRenderLoop(() => {
          scene.render()
        })
        window.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.code == 'Enter') {
            console.log('正在循环导出所有配置的截图')
            screenshotLoop()
          } else if (e.code == 'Space') {
            if (k < exportSets.length) {
              screenshot(true)
              k++
            } else {
              k = 0
              screenshot(false)
              console.log('已经执行过所有导出配置了')
            }
          }
        })
      })

      //组件卸载时
      return () => {
        // 销毁场景和引擎
        scene.dispose()
        engine.dispose()
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
        <img className="contrast" src={contrast_url} />
        <canvas id="BannerCanvas">当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试</canvas>
      </div>
      <div className="loading_progress">
        LoadingProgress:<span className="LoadingProgress"></span>
      </div>
    </div>
  )
}
