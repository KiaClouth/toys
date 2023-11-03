// import { Path2 } from 'babylonjs'

// meshwriter部分
type Writer = {
  material: BABYLON.StandardMaterial | null
  sps: BABYLON.SolidParticleSystem | null
  mesh: BABYLON.Mesh | null
  position: mrPosition
  colors: mrColors
  fontFamily: string
  anchor: mrAnchor
  rawheight: number
  rawThickness: number
  basicColor: string
  opac: number
  x: number
  y: number
  z: number
  diffuse: string
  specular: string
  ambient: string
  fontSpec: fontType
  letterScale: number
  thickness: number
  letters: string
  meshesAndBoxes: meshesAndBoxes
  meshes: BABYLON.Mesh[]
  lettersBoxes: number[][]
  lettersOrigins: number[][]
  xWidth: number
  combo: [BABYLON.SolidParticleSystem, BABYLON.Mesh]
  offsetX: number
  getSPS: () => BABYLON.SolidParticleSystem | null
  getMesh: () => BABYLON.Mesh | null
  getMaterial: () => BABYLON.StandardMaterial | null
  getOffsetX: () => number
  getLettersBoxes: () => number[][]
  getLettersOrigins: () => number[][]
  color: () => string
  alpha: () => number
  clearall: () => void
}
type numberTree = (numberTree | number)[]
type meshesAndBoxes = [BABYLON.Mesh[], number[][], number[][], number, number]

type fontData = {
  sC: string[] | null
  shapeCmds?: number[][][]
  hC?: string[][] | null
  holeCmds?: number[][][][]
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  wdth: number
}

type fontType = {
  [key: string]: fontData | boolean
  reverseHoles: boolean
  reverseShapes: boolean
}

type fontsType = {
  [key: string]: fontType
}

type mrPosition = { x?: number; y?: number; z?: number }
type mrColors = {
  diffuse?: string
  specular?: string
  ambient?: string
  emissive?: string
}
type mrAnchor = 'left' | 'center' | 'right'

type fonOptions = {
  position?: mrPosition
  colors?: mrColors
  'font-family'?: string
  anchor?: mrAnchor
  'letter-height'?: number
  'letter-thickness'?: number
  color?: string
  alpha?: number
}

interface MeshWriter {
  getSPS: () => BABYLON.SolidParticleSystem | null
  getMesh: () => BABYLON.Mesh | null
  getMaterial: () => BABYLON.StandardMaterial | null
  getOffsetX: () => number
  getLettersBoxes: () => number[][]
  getLettersOrigins: () => number[][]
  color: (c) => string
  alpha: (o) => number
  clearall: () => void
  setColor: () => void
}

// 添加新的类型
type MyPath2 = Path2 & {
  // 新的类型
  addCubicCurveTo: (redX: number, redY: number, greenX: number, greenY: number, blueX: number, blueY: number) => void
}

// 在BABYLON.Path2类型的定义中，使用extends关键字来扩展新的类型
declare namespace BABYLON {
  interface Path2 extends MyPath2 {}
}

declare module BABYLON {
  declare interface Color3 {
    hsvOffset(
      hOffset: [number, 'add' | 'mul'] | [number],
      sOffset: [number, 'add' | 'mul'] | [number],
      vOffset: [number, 'add' | 'mul'] | [number]
    ): BABYLON.Color3
  }
  declare interface Material {
    albedoColor: BABYLON.Color3
  }
  // declare interface Path2 {
  //   addCubicCurveTo: (redX: number, redY: number, greenX: number, greenY: number, blueX: number, blueY: number) => void
  // }
}
