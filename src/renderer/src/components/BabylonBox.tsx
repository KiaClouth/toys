import { useEffect } from 'react'
import { root, PerlinNoise, canvasResize, isCanvas } from '../tool'
import * as BABYLON from 'babylonjs'
import '../assets/js-plugin/babylon/cannon.js'

export default function BabylonBox(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('babylonCanvas')

    if (isCanvas(canvas)) {
      window.addEventListener('resize', () => canvasResize(canvas))
      canvasResize(canvas)

      const perlinNosie = new PerlinNoise()
      const fps = document.getElementById('FPS')
      const startTime = new Date().getTime() //记录场景开始时间
      const engine = new BABYLON.Engine(canvas, true) // 初始化 BABYLON 3D engine
      const scene = new BABYLON.Scene(engine)
      // 是否开启inspector ///////////////////////////////////////////////////////////////////////////////////////////////////
      // scene.debugLayer.show({
      //   // embedMode: true
      // })

      fps !== null && (fps.innerHTML = engine.getFps().toFixed() + ' fps')

      /******* 定义场景函数 ******/
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)
      scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), new BABYLON.CannonJSPlugin(false))

      // 摄像机
      const camera = new BABYLON.ArcRotateCamera('Camera', -Math.PI / 4, Math.PI / 2.5, 10, BABYLON.Vector3.Zero(), scene)
      camera.attachControl(canvas, true)
      camera.minZ = 0.1

      // 灯光
      const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 0, 0), scene)
      light1.diffuse = new BABYLON.Color3(158 / 255, 209 / 255, 255 / 255)

      // 物理地面
      // const ground = BABYLON.MeshBuilder.CreateSphere('Ground', { diameter: 2 }, scene)
      // ground.position.y = -2
      // ground.scaling = new BABYLON.Vector3(10, 1, 10)
      // ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      //   ground,
      //   BABYLON.PhysicsImpostor.SphereImpostor,
      //   { mass: 0, friction: 0, restitution: 0.6 }
      // )

      // const ball = BABYLON.MeshBuilder.CreateSphere('Ground1', { diameter: 1 }, scene)
      // ball.position.y = 10
      // ball.physicsImpostor = new BABYLON.PhysicsImpostor(
      //   ball,
      //   BABYLON.PhysicsImpostor.SphereImpostor,
      //   { mass: 1, friction: 0, restitution: 0.9 }
      // )

      // 二十面体材质-----------------
      const icosahedronMaterial = new BABYLON.PBRMaterial('icosahedronMaterial', scene)
      const baseColor = new BABYLON.Color3((Math.random() * 255) / 255, (Math.random() * 255) / 255, 211 / 255)
      // icosahedronMaterial.albedoColor = baseColor
      icosahedronMaterial.emissiveColor = baseColor
      icosahedronMaterial.pointsCloud = true

      // 二十面体---------------------
      const icosahedron = BABYLON.MeshBuilder.CreateGeodesic('icosahedron1', {
        m: 24,
        n: 2,
        size: 1.8,
        updatable: true
      })
      icosahedron.material = icosahedronMaterial
      // icosahedron.position = new BABYLON.Vector3(0, 15, 0)
      // icosahedron.physicsImpostor = new BABYLON.PhysicsImpostor(
      //   icosahedron,
      //   BABYLON.PhysicsImpostor.MeshImpostor,
      //   { mass: 1, restitution: 0.9 }
      // )

      // //阴影---------------------
      // const generator = new BABYLON.ShadowGenerator(1024, light1)
      // generator.usePoissonSampling = true
      // generator.bias = 0.000001
      // generator.blurScale = 1
      // generator.transparencyShadow = true
      // generator.darkness = 0.6

      // generator.addShadowCaster(icosahedron)

      const positions = icosahedron.getVerticesData(BABYLON.VertexBuffer.PositionKind) //顶点位置引用

      const initial_position: BABYLON.FloatArray = [] //复制一份初始状态顶点位置数组
      if (positions) {
        for (let i = 0; i < positions.length; i++) {
          initial_position.push(positions[i])
        }
      }

      scene.registerBeforeRender(function () {
        const a = new Date().getTime() - startTime

        if (positions) {
          for (let i = 0; i < positions.length / 3; i++) {
            const initial_vector = new BABYLON.Vector3(
              //将初始网格的每3个坐标组成一个点，创建Vector3对象
              initial_position[i * 3],
              initial_position[i * 3 + 1],
              initial_position[i * 3 + 2]
            )
            const perlin = perlinNosie.noise(
              //perlin值只与当前循环操作的顶点的位置信息相关
              initial_vector.x * 0.3 + a * 0.0002,
              initial_vector.y * 0.3 + a * 0.0003,
              initial_vector.z * 0.3
            )
            const ratio = perlin * 1 // 为了控制顶点缩放比例对噪声值做的进一步处理:number
            positions[i * 3] = initial_vector.x * ratio
            positions[i * 3 + 1] = initial_vector.y * ratio
            positions[i * 3 + 2] = initial_vector.z * ratio
          }
          icosahedron.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions) //更新顶点坐标数据

          // icosahedronMaterial.albedoColor = new BABYLON.Color3(perlinNosie.noise(baseColor.r, baseColor.g, baseColor.b))
        }
      })

      //将场景内网格添加到阴影渲染队列
      // for (let i = 0; i < scene.meshes.length; i++) {
      //   // console.log(i, scene.meshes[i].name);
      //   scene.meshes[i].receiveShadows = true
      // }

      engine.runRenderLoop(function () {
        scene.render()
      })
      return () => {
        // 销毁场景和引擎
        scene.dispose()
        engine.dispose()
        root.removeEventListener('resize', () => canvasResize(canvas))
      }
    } else {
      console.log('cannot find canvas')
      return () => {}
    }
  }, [])

  return (
    <div id="BabylonBox">
      <canvas id="babylonCanvas">当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试</canvas>
      <div className="pfs-info">
        FPS: <span className="FPS"></span>
      </div>
    </div>
  )
}
