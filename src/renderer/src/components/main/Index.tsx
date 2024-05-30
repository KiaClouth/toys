import { useEffect } from 'react'
import { PerlinNoise, canvasResize, isCanvas } from '../../tool'
// import textureUrl from '../../public/img/babylonImg/jianbian.jpg?url'

export default function Index(): JSX.Element {
  useEffect(() => {
    const canvas = document.getElementById('BackgroundCanvas')
    async function createEngine(canvas: HTMLCanvasElement): Promise<BABYLON.Engine | BABYLON.WebGPUEngine> {
      const webGPUSupported = await BABYLON.WebGPUEngine.IsSupportedAsync
      if (webGPUSupported) {
        const engine = new BABYLON.WebGPUEngine(canvas)
        await engine.initAsync()
        return engine
      }
      return new BABYLON.Engine(canvas, true)
    }

    if (isCanvas(canvas)) {
      canvasResize(canvas)
      createEngine(canvas).then((engine) => {
        const startTime = new Date().getTime()
        const perlinNosie = new PerlinNoise()
        const fps = document.getElementById('FPS')
        if (fps !== null) fps.innerHTML = engine.getFps().toFixed() + ' fps'

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
        scene.clearColor = new BABYLON.Color4(0, 0, 0, 1)
        // 是否开启inspector ///////////////////////////////////////////////////////////////////////////////////////////////////
        // scene.debugLayer.show({
        //   // embedMode: true
        // })

        // 摄像机
        const camera = new BABYLON.ArcRotateCamera('Camera', 0, 1, 12, BABYLON.Vector3.Zero(), scene)
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
        new BABYLON.Debug.AxesViewer(scene, 0.3333)

        // 光源
        new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(10, 30, 0), scene)

        // 网格纵向偏移幅度
        const offsetY = 1
        const createTriangleGrid = (
          side: number,
          column: number,
          row: number,
          alignment: 'center' | 'topLeft'
        ): {
          positions: number[]
          indices: number[]
          hexagonIndices: number[]
        } => {
          const cos60 = Math.sqrt(3) / 2
          const offsetX = alignment === 'center' ? (column - 1) * side * 0.5 + side / 4 : 0
          const offsetZ = alignment === 'center' ? (row - 1) * side * cos60 * 0.5 : 0
          const positions: number[] = []
          const indices: number[] = []
          const hexagonIndices: number[] = []
          // 顶点坐标计算
          for (let r = 0; r < row; r++) {
            const rPosition = r * side * cos60
            for (let c = 0; c < column; c++) {
              const cPosition = c * side
              positions.push(rPosition - offsetZ)
              positions.push(0)
              positions.push(cPosition + ((r % 2) * side) / 2 - offsetX)
            }
          }
          // 索引计算
          for (let r = 0; r < row - 1; r++) {
            for (let c = 0; c < column - 1; c++) {
              if (r % 2 === 0) {
                indices.push(r * column + c, (r + 1) * column + c, r * column + c + 1)
                indices.push(r * column + c + 1, (r + 1) * column + c, (r + 1) * column + c + 1)
              } else {
                indices.push(r * column + c, (r + 1) * column + c, (r + 1) * column + c + 1)
                indices.push(r * column + c, (r + 1) * column + c + 1, r * column + c + 1)
              }
            }
          }
          // 六边形网格顶点索引收集
          for (let r = 0; r < row - 1; r++) {
            for (let c = 0; c < column - 1; c++) {
              if (r % 2 === 0) {
                if (c % 3 !== 0) hexagonIndices.push(r * column + c)
              } else {
                if (c % 3 !== 2) hexagonIndices.push(r * column + c)
              }
            }
          }
          return {
            positions: positions,
            indices: indices,
            hexagonIndices: hexagonIndices
          }
        }
        // 定义网格尺寸，尺寸用于计算mesh顶点以及shader中计算六边形顶点
        const row = 70
        const column = 70
        const trianglePositionAndIndices = createTriangleGrid(0.1, row, column, 'center')

        BABYLON.ShaderStore.ShadersStoreWGSL['customcubeVertexShader'] = `
        #include<sceneUboDeclaration>
        #include<meshUboDeclaration>

        // Attributes
        attribute position : vec3<f32>;

        // Varying
        varying vColor : vec4<f32>;

        @vertex
        fn main(input : VertexInputs) -> FragmentInputs {
            vertexOutputs.position = scene.viewProjection * mesh.world * vec4<f32>(vertexInputs.position, 1.0);
            let a = input.vertexIndex % ${column};
            // 查找六边形顶点
            if (floor(f32(input.vertexIndex) / ${column}) % 2 == 0) {
              // 偶数行时
              if(a % 3 == 2) {
                vertexOutputs.vColor = vec4<f32>(0,0,0,0);
              } else {
                vertexOutputs.vColor = vec4<f32>(0.5, 1.0, 1.0, 1.0);
              }
            } else {
              // 奇数行时
              if(a % 3 == 0) {
                vertexOutputs.vColor = vec4<f32>(0,0,0,0);
              } else {
                vertexOutputs.vColor = vec4<f32>(0.5, 1.0, 1.0, 1.0);
              }
            }
        }
      `

        BABYLON.ShaderStore.ShadersStoreWGSL['customcubeFragmentShader'] = `
        varying vColor : vec4<f32>;

        @fragment
        fn main(input : FragmentInputs) -> FragmentOutputs {
            if(fragmentInputs.vColor[0] < 0.5) {
              discard;
            }
            fragmentOutputs.color = fragmentInputs.vColor;
        }
      `

        const myUBO = new BABYLON.UniformBuffer(engine)

        myUBO.addUniform('scale', 1)
        myUBO.updateFloat('scale', 1)
        myUBO.update()

        // const mainTexture = new BABYLON.Texture(textureUrl, scene)

        const shaderMaterial = new BABYLON.ShaderMaterial(
          'shader',
          scene,
          {
            vertex: 'customcube',
            fragment: 'customcube'
          },
          {
            attributes: ['position', 'normal', 'uv'],
            uniformBuffers: ['Scene', 'Mesh'],
            shaderLanguage: BABYLON.ShaderLanguage.WGSL
          }
        )

        shaderMaterial.setFloats('vColor', [1, 0, 0, 1, 0, 1, 0, 1])
        shaderMaterial.setUniformBuffer('myUBO', myUBO)
        // shaderMaterial.setTexture('diffuse', mainTexture)

        const sampler = new BABYLON.TextureSampler()

        sampler.setParameters() // use the default values
        sampler.samplingMode = BABYLON.Constants.TEXTURE_NEAREST_SAMPLINGMODE

        shaderMaterial.setTextureSampler('mySampler', sampler)

        // 创建并赋予材质
        const Triangle = new BABYLON.Mesh('Triangle', scene)
        Triangle.material = shaderMaterial
        Triangle.position._y -= offsetY
        Triangle.addRotation(0, Math.PI / 2, 0)

        const vertexData = new BABYLON.VertexData()
        vertexData.positions = trianglePositionAndIndices.positions
        vertexData.indices = trianglePositionAndIndices.indices
        vertexData.applyToMesh(Triangle)

        // 柏林噪声动画
        scene.registerBeforeRender(function () {
          const a = new Date().getTime() - startTime
          const tempPositions: number[] = []
          for (let i = 0; i < trianglePositionAndIndices.positions.length / 3; i++) {
            const perlin = perlinNosie.noise(
              trianglePositionAndIndices.positions[3 * i + 0] * 0.5 + a * 0.0001,
              trianglePositionAndIndices.positions[3 * i + 1] * 0.5 + a * 0.0002,
              trianglePositionAndIndices.positions[3 * i + 2] * 0.5 + a * 0.00005
            )
            tempPositions.push(
              trianglePositionAndIndices.positions[3 * i + 0] * (1 + perlin * 0.05),
              (trianglePositionAndIndices.positions[3 * i + 1] + offsetY) * (1 + perlin * 2),
              trianglePositionAndIndices.positions[3 * i + 2] * (1 + perlin * 0.05)
            )
          }
          vertexData.positions = tempPositions
          vertexData.indices = trianglePositionAndIndices.indices
          vertexData.applyToMesh(Triangle)
        })

        engine.displayLoadingUI()
        // 注册循环渲染函数
        engine.runRenderLoop(() => {
          scene.render()
        })
      })

      //组件卸载时
      return () => {
        // 销毁场景和引擎
        // scene.dispose()
        // engine.dispose()
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
        FPS: <span id="FPS"></span>
      </div>
    </div>
  )
}
