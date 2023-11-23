import { useEffect } from 'react'
import earcut from 'earcut'
import { canvasResize, isCanvas } from '../../tool'

export default function Index(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('BackgroundCanvas')

    if (isCanvas(canvas)) {
      canvasResize(canvas)
      // const startTime = new Date().getTime()
      // const perlinNosie = new PerlinNoise()
      const engine = new BABYLON.Engine(canvas, true)
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
      const fps = document.getElementById('FPS')
      if (fps !== null) fps.innerHTML = engine.getFps().toFixed() + ' fps'

      const scene = new BABYLON.Scene(engine)
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0)
      // 是否开启inspector ///////////////////////////////////////////////////////////////////////////////////////////////////
      // scene.debugLayer.show({
      //   // embedMode: true
      // })

      // 摄像机
      const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, (Math.PI * 2) / 2, 10, BABYLON.Vector3.Zero(), scene)
      camera.attachControl(canvas, true)
      camera.minZ = 0.1
      camera.fov = 0.26
      camera.wheelPrecision = 100
      camera.lowerRadiusLimit = 1
      camera.inertia = 0.9
      camera.panningInertia = 0.9
      camera.panningSensibility = 300
      camera.angularSensibilityX = 800
      camera.angularSensibilityY = 800

      // 相机运动函数
      const cameraControl = (event: MouseEvent): void => {
        if (event.buttons === 0) {
          camera.alpha -= event.movementX / 10000
          camera.beta += event.movementY / 10000
        }
      }
      // 注册鼠标移动事件来触发相机控制
      canvas.addEventListener('mousemove', cameraControl)

      // 世界坐标轴显示
      // new BABYLON.Debug.AxesViewer(scene, 3.3333)

      // const light = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(10, 10, 0), scene)

      const createTriangleGrid = (side: number, column: number, row: number, alignment: 'center' | 'topLeft'): BABYLON.VertexData => {
        const cos60 = Math.sqrt(3) / 2
        const offsetX = alignment === 'center' ? column * side : 0
        const offsetZ = alignment === 'center' ? row * side * cos60 : 0
        const positions: number[] = []
        const indices: number[] = [0, row, column * row]
        for (let r = 0; r < row; r++) {
          const rPosition = r * side * cos60 - offsetZ
          for (let c = 0; c < column; c++) {
            const cPosition = c * side - offsetX
            positions.push(rPosition)
            positions.push(0)
            if (r % 2 == 0) {
              positions.push(cPosition)
            } else {
              positions.push(cPosition - side / 2)
            }
          }
        }
        const vertexData = new BABYLON.VertexData()
        vertexData.positions = positions
        vertexData.indices = indices
        return vertexData
      }

      const testMaterial = new BABYLON.PBRMaterial('testMaterial', scene)
      // testMaterial.pointsCloud = true
      testMaterial.wireframe = true
      testMaterial.albedoColor = new BABYLON.Color3(1, 1, 0)

      const testMesh = new BABYLON.Mesh('testMesh', scene)
      testMesh.material = testMaterial
      const triangleGrid = createTriangleGrid(1, 4, 4, 'center')
      // console.log(triangleGrid.positions)
      triangleGrid.applyToMesh(testMesh)

      const polyPoints: BABYLON.Vector3[] = []
      const objects: BABYLON.Mesh[] = []

      const icosahedronMaterial = new BABYLON.PBRMaterial('icosahedronMaterial', scene)

      const side = 20
      const subdivisions = 3
      const ground = BABYLON.MeshBuilder.CreateGround('ground', {
        height: side,
        width: side,
        subdivisions: subdivisions,
        updatable: true
      })
      ground.visibility = 0
      ground.material = icosahedronMaterial

      let polygon: BABYLON.Mesh

      scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERPICK:
            const pickPoint = pointerInfo.pickInfo!.pickedPoint!
            const impact1 = BABYLON.MeshBuilder.CreateSphere('sp1', { diameter: 0.1 }, scene)
            impact1.material = new BABYLON.StandardMaterial('impact1Mat', scene)
            impact1.position = new BABYLON.Vector3(pickPoint.x, pickPoint.y, pickPoint.z)
            polyPoints.push(new BABYLON.Vector3(pickPoint.x, pickPoint.y + 10.5, pickPoint.z))
            objects.push(impact1)
            if (polyPoints.length > 2) {
              if (polygon !== undefined) {
                console.log(polygon.id)
                polygon.dispose()
              }
              polygon = BABYLON.MeshBuilder.CreatePolygon(
                'polygon',
                { shape: polyPoints, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
                scene,
                earcut
              )
              const baseColor = new BABYLON.Color3((Math.random() * 255) / 255, (Math.random() * 255) / 255, 211 / 255)
              icosahedronMaterial.emissiveColor = baseColor
              polygon.material = icosahedronMaterial
            }
            break
        }
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
      }
    } else {
      //组件卸载时
      return () => {}
    }
  }, [])

  return (
    <div id="Index">
      <canvas id="BackgroundCanvas">当前浏览器不支持canvas，尝试更换Google Chrome浏览器尝试</canvas>
      <div className="pfs-info">
        FPS: <span className="FPS"></span>
      </div>
    </div>
  )
}
