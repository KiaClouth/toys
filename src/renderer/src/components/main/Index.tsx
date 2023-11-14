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
      const camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, (Math.PI * 2) / 2, 100, BABYLON.Vector3.Zero(), scene)
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

      const polyPoints: BABYLON.Vector3[] = []
      const objects: BABYLON.Mesh[] = []

      const icosahedronMaterial = new BABYLON.PBRMaterial('icosahedronMaterial', scene)
      icosahedronMaterial.pointsCloud = true
      icosahedronMaterial.wireframe = true

      const side = 20
      const subdivisions = 3
      const ground = BABYLON.MeshBuilder.CreateGround('ground', {
        height: side,
        width: side,
        subdivisions: subdivisions,
        updatable: true
      })
      ground.visibility = 1
      ground.material = icosahedronMaterial
      const groundAxesViewer = new BABYLON.Debug.AxesViewer(scene, 3.3333)
      groundAxesViewer.xAxis.parent = ground
      groundAxesViewer.yAxis.parent = ground
      groundAxesViewer.zAxis.parent = ground

      const positions = ground.getPositionData()
      const newPositions: BABYLON.FloatArray = []

      const indices = ground.getIndices()
      const newIndices: BABYLON.IndicesArray = []
      indices?.forEach((item: number) => {
        newIndices.push(item)
      })
      // console.log(positions)
      // console.log(newIndices)

      if (positions && indices) {
        for (let i = 0; i < indices.length; i += 3) {
          const vertex1 = indices[i]
          const vertex2 = indices[i + 1]
          const vertex3 = indices[i + 2]

          const coord1 = [positions[vertex1 * 3], positions[vertex1 * 3 + 1], positions[vertex1 * 3 + 2]]
          const coord2 = [positions[vertex2 * 3], positions[vertex2 * 3 + 1], positions[vertex2 * 3 + 2]]
          const coord3 = [positions[vertex3 * 3], positions[vertex3 * 3 + 1], positions[vertex3 * 3 + 2]]

          console.log(`Triangle ${i / 3 + 1}:`)
          console.log('Vertex 1:', coord1)
          console.log('Vertex 2:', coord2)
          console.log('Vertex 3:', coord3)
        }
        // 对合适的点进行偏移
        for (let i = 0; i < positions.length / 3; i++) {
          const row = Math.floor(i / (subdivisions + 1))
          const column = i % (subdivisions + 1)
          if (column >= 2 * (row + 1)) {
            newPositions.push(positions[i * 3] - column * (1 - 1.732050807569 / 2) * (side / subdivisions))
            newPositions.push(positions[i * 3 + 1])
            newPositions.push(positions[i * 3 + 2] + column * (1 / 2) * (side / subdivisions) + 5)
            // const indexToBeDeleted = indices[i]
          } else if (2 * (row - 1) >= column + subdivisions) {
            newPositions.push(positions[i * 3] - column * (1 - 1.732050807569 / 2) * (side / subdivisions))
            newPositions.push(positions[i * 3 + 1])
            newPositions.push(positions[i * 3 + 2] + column * (1 / 2) * (side / subdivisions) - 5)
          } else {
            newPositions.push(positions[i * 3] - column * (1 - 1.732050807569 / 2) * (side / subdivisions))
            newPositions.push(positions[i * 3 + 1])
            newPositions.push(positions[i * 3 + 2] + column * (1 / 2) * (side / subdivisions))
          }
        }
        // earcut(newPositions)
        // ground.setIndices(earcut(newPositions))
        // ground.setVerticesData(BABYLON.VertexBuffer.PositionKind, newPositions)
      }

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
