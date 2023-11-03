import HNM from './helveticaneue-medium'
import earcut from 'earcut'

// >>>>>  STEP 1 <<<<<
const Γ = Math.floor
let scene: BABYLON.Scene, debug
let b128back, b128digits
const B = {
  Vector2: BABYLON.Vector2,
  Vector3: BABYLON.Vector3,
  Path2: BABYLON.Path2,
  Curve3: BABYLON.Curve3,
  Color3: BABYLON.Color3,
  SolidParticleSystem: BABYLON.SolidParticleSystem,
  PolygonMeshBuilder: BABYLON.PolygonMeshBuilder,
  CSG: BABYLON.CSG,
  StandardMaterial: BABYLON.StandardMaterial,
  Mesh: BABYLON.Mesh
}

const methodsList = [
  'Vector2',
  'Vector3',
  'Path2',
  'Curve3',
  'Color3',
  'SolidParticleSystem',
  'PolygonMeshBuilder',
  'CSG',
  'StandardMaterial',
  'Mesh'
]
prepArray()
// >>>>>  STEP 2 <<<<<
const FONTS: fontsType = {}
// >>>>>  STEP 3 <<<<<
FONTS['HelveticaNeue-Medium'] = HNM(codeList) // Do not remove
// >>>>>  STEP 4 <<<<<
const defaultColor = '#808080'
const defaultOpac = 1
const curveSampleSize = 6
const naturalLetterHeight = 1000

// *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
//  SUPERCONSTRUCTOR  SUPERCONSTRUCTOR  SUPERCONSTRUCTOR
// Parameters:
//   ~ scene
//   ~ preferences

export default function Wrapper(
  scene: BABYLON.Scene,
  prenferences: {
    defaultFont?: string
    meshOrigin?: string
    scale?: number
    debug?: boolean
    methods?: {
      Vector2?: BABYLON.Vector2
      Vector3?: BABYLON.Vector3
      Path2?: BABYLON.Path2
      Curve3?: BABYLON.Curve3
      Color3?: BABYLON.Color3
      SolidParticleSystem?: BABYLON.SolidParticleSystem
      PolygonMeshBuilder?: BABYLON.PolygonMeshBuilder
      CSG?: BABYLON.CSG
      StandardMaterial?: BABYLON.StandardMaterial
      Mesh?: BABYLON.Mesh
    }
  }
): (lttrs: string, opt: fonOptions) => void {
  const preferences = makePreferences(prenferences)
  const defaultFont = isObject(FONTS[preferences.defaultFont]) ? preferences.defaultFont : 'HelveticaNeue-Medium'
  const meshOrigin = preferences.meshOrigin === 'fontOrigin' ? preferences.meshOrigin : 'letterCenter'
  const scale = isNumber(preferences.scale) ? preferences.scale : 1

  debug = isBoolean(preferences.debug) ? preferences.debug : false

  // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
  //  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR
  // Called with 'new'
  // Parameters:
  //   ~ letters
  //   ~ options

  function MeshWriter(this: MeshWriter, lttrs: string, opt: fonOptions): void {
    let material: BABYLON.StandardMaterial | null, sps: BABYLON.SolidParticleSystem | null, mesh: BABYLON.Mesh | null
    //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
    // Here we set ALL parameters with incoming value or a default
    // setOption:  applies a test to potential incoming parameters
    //             if the test passes, the parameters are used, else the default is used
    const options = isObject(opt) ? opt : {}
    let color = setOption<string>(options, 'color', isString, defaultColor)
    let opac = setOption<number>(options, 'alpha', isAmplitude, defaultOpac)
    const position = setOption<mrPosition>(options, 'position', isObject, {}),
      colors = setOption<mrColors>(options, 'colors', isObject, {}),
      fontFamily = setOption<string>(options, 'font-family', isSupportedFont, defaultFont),
      anchor = setOption<mrAnchor>(options, 'anchor', isSupportedAnchor, 'left'),
      rawheight = setOption<number>(options, 'letter-height', isPositiveNumber, 100),
      rawThickness = setOption<number>(options, 'letter-thickness', isPositiveNumber, 1),
      y = setOption<number>(position, 'y', isNumber, 0),
      x = setOption<number>(position, 'x', isNumber, 0),
      z = setOption<number>(position, 'z', isNumber, 0),
      diffuse = setOption<string>(colors, 'diffuse', isString, '#F0F0F0'),
      specular = setOption<string>(colors, 'specular', isString, '#000000'),
      ambient = setOption<string>(colors, 'ambient', isString, '#F0F0F0'),
      emissive = setOption<string>(colors, 'emissive', isString, color),
      fontSpec = FONTS[fontFamily],
      letterScale = round((scale * rawheight) / naturalLetterHeight),
      thickness = round(scale * rawThickness),
      letters = isString(lttrs) ? lttrs : ''

    //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
    // Now all the parameters are set, let's get to business
    // First create the material
    material = makeMaterial(scene, letters, emissive, ambient, specular, diffuse, opac)

    //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
    // Next, create the meshes
    // This creates an array of meshes, one for each letter
    // It also creates two other arrays, which are used for letter positioning
    // const meshesAndBoxes = constructLetterPolygons(letters, fontSpec, 0, 0, 0, letterScale, thickness, material, meshOrigin)
    const meshesAndBoxes = constructLetterPolygons(letters, fontSpec, 0, 0, letterScale, thickness, meshOrigin)
    // const meshes = meshesAndBoxes[0]
    const lettersBoxes = meshesAndBoxes[1]
    const lettersOrigins = meshesAndBoxes[2]
    // 下标为3的值是ix
    const xWidth = meshesAndBoxes[4]

    //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
    // The meshes are converted into particles of an SPS
    const combo = makeSPS(scene, meshesAndBoxes, material)
    sps = combo[0]
    mesh = combo[1]

    //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
    // Set the final SPS-mesh position according to parameters
    const offsetX = anchor === 'right' ? 0 - xWidth : anchor === 'center' ? 0 - xWidth / 2 : 0
    mesh.position.x = scale * x + offsetX
    mesh.position.y = scale * y
    mesh.position.z = scale * z

    this.getSPS = (): BABYLON.SolidParticleSystem | null => sps
    this.getMesh = (): BABYLON.Mesh | null => mesh
    this.getMaterial = (): BABYLON.StandardMaterial | null => material
    this.getOffsetX = (): number => offsetX
    this.getLettersBoxes = (): number[][] => lettersBoxes
    this.getLettersOrigins = (): number[][] => lettersOrigins
    this.color = (c): string => (isString(c) ? (color = c) : color)
    this.alpha = (o): number => (isAmplitude(o) ? (opac = o) : opac)
    this.clearall = function (): void {
      sps = null
      mesh = null
      material = null
    }
  }
  //  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR  CONSTRUCTOR
  // *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
  MeshWriter.codeList = codeList
  MeshWriter.decodeList = decodeList

  return MeshWriter
}
if (typeof window !== 'undefined') {
  window['TYPE'] = Wrapper
  window['MeshWriter'] = Wrapper
}
if (typeof global !== 'undefined') {
  global.MeshWriter = Wrapper
}
if (typeof BABYLON === 'object') {
  cacheMethods(BABYLON)
  BABYLON['MeshWriter'] = Wrapper
}
if (typeof module === 'object' && module.exports) {
  module.exports = Wrapper
}

//  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
// MakeSPS turns the output of constructLetterPolygons into an SPS
// with the whole string, with appropriate offsets
function makeSPS(
  scene: BABYLON.Scene,
  meshesAndBoxes: meshesAndBoxes,
  material: BABYLON.StandardMaterial
): [BABYLON.SolidParticleSystem, BABYLON.Mesh] {
  const meshes = meshesAndBoxes[0]
  const lettersOrigins = meshesAndBoxes[2]
  const sps = new B.SolidParticleSystem('sps' + 'test', scene, {})
  meshes.forEach(function (mesh, ix) {
    sps.addShape(mesh, 1, {
      positionFunction: makePositionParticle(lettersOrigins[ix])
    })
    mesh.dispose()
  })
  const spsMesh = sps.buildMesh()
  spsMesh.material = material
  sps.setParticles()
  return [sps, spsMesh]

  function makePositionParticle(letterOrigins: number[]) {
    return function positionParticle(particle: { position: { x: number; z: number } }): void {
      particle.position.x = letterOrigins[0] + letterOrigins[1]
      particle.position.z = letterOrigins[2]
    }
  }
}

//  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
// Takes specifications and returns an array with three elements, each of which
// is an array (length of each array === the number of incoming characters)
//   ~ the meshes (not offset by position)
//   ~ the boxes (to help with positions features)
//   ~ the letter origins (providing offset for each letter)
function constructLetterPolygons(
  letters: string,
  fontSpec: fontType,
  xOffset: number,
  // yOffset: number,
  zOffset: number,
  letterScale: number,
  thickness: number,
  // material,
  meshOrigin: 'fontOrigin' | 'letterCenter'
): meshesAndBoxes {
  let letterOffsetX = 0
  const lettersOrigins: number[][] = new Array(letters.length)
  const lettersBoxes: number[][] = new Array(letters.length)
  const lettersMeshes: BABYLON.Mesh[] = new Array(letters.length)
  let ix = 0
  let letter

  for (let i = 0; i < letters.length; i++) {
    letter = letters[i]
    const letterSpec = makeLetterSpec(fontSpec, letter)
    if (isObject(letterSpec)) {
      const lists = buildLetterMeshes(letter, i, letterSpec, fontSpec.reverseShapes, fontSpec.reverseHoles)
      const shapesList = lists[0]
      const holesList = lists[1]
      const letterBox = lists[2]
      const letterOrigins = lists[3]

      // ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
      // This subtracts the holes, if any, from the shapes and merges the shapes
      // (Many glyphs - 'i', '%' - have multiple shapes)
      // At the end, there is one mesh per glyph, as God intended
      const letterMeshes = punchHolesInShapes(shapesList, holesList, letter, i)
      if (letterMeshes.length) {
        lettersMeshes[ix] = merge(letterMeshes)
        lettersOrigins[ix] = letterOrigins
        lettersBoxes[ix] = letterBox
        ix++
      }
    }
  }
  const meshesAndBoxes: [BABYLON.Mesh[], number[][], number[][], number, number] = [
    lettersMeshes,
    lettersBoxes,
    lettersOrigins,
    ix,
    round(letterOffsetX)
  ]
  return meshesAndBoxes

  //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
  // A letter may have one or more shapes and zero or more holes
  // The shapeCmds is an array of shapes
  // The holeCmds is an array of array of holes, the outer array lining up with
  // the shapes array and the inner array permitting more than one hole per shape
  // (Think of the letter 'B', with one shape and two holes, or the symbol
  // '%' which has three shapes and two holes)
  //
  // For mystifying reasons, the holeCmds (provided by the font) must be reversed
  // from the original order and the shapeCmds must *not* be reversed
  // UNLESS the font is Jura, in which case the holeCmds are not reversed
  // (Possibly because the Jura source is .otf, and the others are .ttf)
  //
  // *WARNING*                                                         *WARNING*
  // buildLetterMeshes performs a lot of arithmetic for offsets to support
  // symbol reference points, BABYLON idiocyncracies, font idiocyncracies,
  // symbol size normalization, the way curves are specified and "relative"
  // coordinates.  (Fonts use fixed coordinates but many other SVG-style
  // symbols use relative coordinates)
  // *WARNING*                                                         *WARNING*
  //  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =

  function buildLetterMeshes(
    letter: string,
    index: number,
    spec: fontData,
    reverseShapes: boolean,
    reverseHoles: boolean
  ): [BABYLON.Mesh[], BABYLON.Mesh[][], number[], number[]] {
    // ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
    // A large number of offsets are created, per warning
    const balanced = meshOrigin === 'letterCenter',
      centerX = (spec.xMin + spec.xMax) / 2,
      centerZ = (spec.yMin + spec.yMax) / 2,
      xFactor = 'xFactor' in spec && isNumber(spec.xFactor) ? spec.xFactor : 1,
      zFactor = 'yFactor' in spec && isNumber(spec.yFactor) ? spec.yFactor : 1,
      xShift = 'xShift' in spec && isNumber(spec.xShift) ? spec.xShift : 0,
      zShift = 'yShift' in spec && isNumber(spec.yShift) ? spec.yShift : 0,
      reverseShape = 'reverseShape' in spec && isBoolean(spec.reverseShape) ? (spec.reverseShape as boolean) : reverseShapes,
      reverseHole = 'reverseHole' in spec && isBoolean(spec.reverseHole) ? (spec.reverseHole as boolean) : reverseHoles,
      offX = xOffset - (balanced ? centerX : 0),
      offZ = zOffset - (balanced ? centerZ : 0),
      shapeCmdsLists = (isArray(spec.shapeCmds) ? spec.shapeCmds : [[[]]]) as number[][][],
      holeCmdsListsArray = (isArray(spec.holeCmds) ? spec.holeCmds : []) as number[][][][]

    // ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
    // Several scaling functions are created too, per warning
    const adjX = makeAdjust(letterScale, xFactor, offX, 0, false, true), // no shift
      adjZ = makeAdjust(letterScale, zFactor, offZ, 0, false, false),
      adjXfix = makeAdjust(letterScale, xFactor, offX, xShift, false, true), // shifted / fixed
      adjZfix = makeAdjust(letterScale, zFactor, offZ, zShift, false, false),
      adjXrel = makeAdjust(letterScale, xFactor, offX, xShift, true, true), // shifted / relative
      adjZrel = makeAdjust(letterScale, zFactor, offZ, zShift, true, false)

    let thisX,
      lastX,
      thisZ,
      lastZ,
      minX = NaN,
      maxX = NaN,
      minZ = NaN,
      maxZ = NaN,
      minXadj = NaN,
      maxXadj = NaN,
      minZadj = NaN,
      maxZadj = NaN

    const letterBox = [adjX(spec.xMin), adjX(spec.xMax), adjZ(spec.yMin), adjZ(spec.yMax)]
    const letterOrigins = [round(letterOffsetX), -1 * adjX(0), -1 * adjZ(0)]

    // ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
    // Scope warning:  letterOffsetX belongs to an outer closure
    // and persists through multiple characters
    letterOffsetX = letterOffsetX + spec.wdth * letterScale

    if (debug && 'show' in spec) {
      console.log([minX, maxX, minZ, maxZ])
      console.log([minXadj, maxXadj, minZadj, maxZadj])
    }

    return [shapeCmdsLists.map(makeCmdsToMesh(reverseShape)), holeCmdsListsArray.map(meshesFromCmdsListArray), letterBox, letterOrigins]

    function meshesFromCmdsListArray(cmdsListArray: number[][][]): BABYLON.Mesh[] {
      return cmdsListArray.map(makeCmdsToMesh(reverseHole))
    }
    function makeCmdsToMesh(reverse) {
      return function cmdsToMesh(cmdsList) {
        let cmd = getCmd(cmdsList, 0)
        const path = new B.Path2(adjXfix(cmd[0]), adjZfix(cmd[1]))
        const first = 0

        // ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
        // Array length is used to determine curve type in the 'TheLeftover Font Format'  (TLFF)
        //
        // IDIOCYNCRACY:  Odd-length arrays indicate relative coordinates; the first digit is discarded

        for (let j = 1; j < cmdsList.length; j++) {
          cmd = getCmd(cmdsList, j)

          // ~  ~  ~  ~  ~  ~  ~  ~
          // Line
          if (cmd.length === 2) {
            path.addLineTo(adjXfix(cmd[0]), adjZfix(cmd[1]))
          }
          if (cmd.length === 3) {
            path.addLineTo(adjXrel(cmd[1]), adjZrel(cmd[2]))
          }

          // ~  ~  ~  ~  ~  ~  ~  ~
          // Quadratic curve
          if (cmd.length === 4) {
            path.addQuadraticCurveTo(adjXfix(cmd[0]), adjZfix(cmd[1]), adjXfix(cmd[2]), adjZfix(cmd[3]))
          }
          if (cmd.length === 5) {
            path.addQuadraticCurveTo(adjXrel(cmd[1]), adjZrel(cmd[2]), adjXrel(cmd[3]), adjZrel(cmd[4]))
          }

          // ~  ~  ~  ~  ~  ~  ~  ~
          // Cubic curve
          if (cmd.length === 6) {
            path.addCubicCurveTo(adjXfix(cmd[0]), adjZfix(cmd[1]), adjXfix(cmd[2]), adjZfix(cmd[3]), adjXfix(cmd[4]), adjZfix(cmd[5]))
          }
          if (cmd.length === 7) {
            path.addCubicCurveTo(adjXrel(cmd[1]), adjZrel(cmd[2]), adjXrel(cmd[3]), adjZrel(cmd[4]), adjXrel(cmd[5]), adjZrel(cmd[6]))
          }
        }
        // Having created a Path2 instance with BABYLON utilities,
        // we turn it into an array and discard it
        let array = path.getPoints().map(point2Vector)

        // Sometimes redundant coordinates will cause artifacts - delete them!
        const last = array.length - 1
        if (array[first].x === array[last].x && array[first].y === array[last].y) {
          array = array.slice(1)
        }
        if (reverse) {
          array.reverse()
        }

        const meshBuilder = new B.PolygonMeshBuilder('MeshWriter-' + letter + index + '-' + weeid(), array, scene, earcut)
        return meshBuilder.build(true, thickness)
      }
    }
    function getCmd(list: number[][], ix: number): number[] {
      lastX = thisX
      lastZ = thisZ
      const cmd = list[ix]
      const len = cmd.length
      thisX = isRelativeLength(len) ? round(cmd[len - 2] * xFactor + thisX) : round(cmd[len - 2] * xFactor)
      thisZ = isRelativeLength(len) ? round(cmd[len - 1] * zFactor + thisZ) : round(cmd[len - 1] * zFactor)
      minX = thisX > minX ? minX : thisX
      maxX = thisX < maxX ? maxX : thisX
      minXadj = thisX + xShift > minXadj ? minXadj : thisX + xShift
      maxXadj = thisX + xShift < maxXadj ? maxXadj : thisX + xShift
      minZ = thisZ > minZ ? minZ : thisZ
      maxZ = thisZ < maxZ ? maxZ : thisZ
      minZadj = thisZ + zShift > minZadj ? minZadj : thisZ + zShift
      maxZadj = thisZ + zShift < maxZadj ? maxZadj : thisZ + zShift
      return cmd
    }

    // ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
    // Returns the a scaling function, based on incoming parameters
    function makeAdjust(
      letterScale: number,
      factor: number,
      off: number,
      shift: number,
      relative: boolean,
      xAxis: boolean
    ): (val: number) => number {
      if (relative) {
        if (xAxis) {
          return (val: number): number => round(letterScale * (val * factor + shift + lastX + off))
        } else {
          return (val: number): number => round(letterScale * (val * factor + shift + lastZ + off))
        }
      } else {
        return (val: number): number => round(letterScale * (val * factor + shift + off))
      }
    }
  }

  // ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
  function punchHolesInShapes(shapesList: BABYLON.Mesh[], holesList: BABYLON.Mesh[][], letter: string, i: number): BABYLON.Mesh[] {
    const letterMeshes: BABYLON.Mesh[] = []
    for (let j = 0; j < shapesList.length; j++) {
      const shape = shapesList[j]
      const holes = holesList[j]
      if (isArray(holes) && holes.length) {
        letterMeshes.push(punchHolesInShape(shape, holes, letter, i))
      } else {
        letterMeshes.push(shape)
      }
    }
    return letterMeshes
  }
  function punchHolesInShape(shape: BABYLON.Mesh, holes: BABYLON.Mesh[], letter: string, i: number): BABYLON.Mesh {
    let csgShape = B.CSG.FromMesh(shape)
    for (let k = 0; k < holes.length; k++) {
      csgShape = csgShape.subtract(B.CSG.FromMesh(holes[k]))
    }
    holes.forEach((h) => h.dispose())
    shape.dispose()
    return csgShape.toMesh('Net-' + letter + i + '-' + weeid())
  }
}

function makeMaterial(scene: BABYLON.Scene, letters, emissive, ambient, specular, diffuse, opac): BABYLON.StandardMaterial {
  const cm0 = new B.StandardMaterial('mw-matl-' + letters + '-' + weeid(), scene)
  cm0.diffuseColor = rgb2Bcolor3(diffuse)
  cm0.specularColor = rgb2Bcolor3(specular)
  cm0.ambientColor = rgb2Bcolor3(ambient)
  cm0.emissiveColor = rgb2Bcolor3(emissive)
  cm0.alpha = opac
  return cm0
}

// *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
//     FONT COMPRESSING AND DECOMPRESSING     FONT COMPRESSING AND DECOMPRESSING
//
// One can reduce file size by 50% with a content-specific compression of font strings
// Each letter object potentially has two long values, "shapeCmds" and "holeCmds"
// These may be optionally compressed during construction of the file
// The compressed versions are placed in "sC" and "hC"
// The *first* time a letter is used, if it was compressed, it is decompressed
function makeLetterSpec(fontSpec: fontType, letter: string): fontData {
  const letterSpec = fontSpec[letter] as fontData,
    singleMap = (cmds: string): number[][] => decodeList(cmds),
    doubleMap = (cmdslists: string[]): number[][][] => cmdslists.map(singleMap)

  if (isObject(letterSpec)) {
    if (!isArray(letterSpec.shapeCmds) && isArray(letterSpec.sC) && letterSpec.sC !== null) {
      letterSpec.shapeCmds = letterSpec.sC.map(singleMap)
      letterSpec.sC = null
    }
    if (!isArray(letterSpec.holeCmds) && isArray(letterSpec.hC) && letterSpec.hC !== null && letterSpec.hC !== undefined) {
      letterSpec.holeCmds = letterSpec.hC.map(doubleMap)
      letterSpec.hC = null
    }
  }
  return letterSpec
}

function decodeList(str: string): number[][] {
  const split = str.split(' '),
    list: number[][] = []
  split.forEach(function (cmds) {
    if (cmds.length === 12) {
      list.push(decode6(cmds))
    }
    if (cmds.length === 8) {
      list.push(decode4(cmds))
    }
    if (cmds.length === 4) {
      list.push(decode2(cmds))
    }
  })
  return list
  function decode6(s: string): [number, number, number, number, number, number] {
    return [decode1(s, 0, 2), decode1(s, 2, 4), decode1(s, 4, 6), decode1(s, 6, 8), decode1(s, 8, 10), decode1(s, 10, 12)]
  }
  function decode4(s: string): [number, number, number, number] {
    return [decode1(s, 0, 2), decode1(s, 2, 4), decode1(s, 4, 6), decode1(s, 6, 8)]
  }
  function decode2(s: string): [number, number] {
    return [decode1(s, 0, 2), decode1(s, 2, 4)]
  }
  function decode1(s: string, start: number, end: number): number {
    return (frB128(s.substring(start, end)) - 4000) / 2
  }
}
function codeList(list: [Array<number>]): string {
  let str = '',
    xtra = ''
  if (isArray(list)) {
    list.forEach(function (cmds) {
      if (cmds.length === 6) {
        str += xtra + code6(cmds)
        xtra = ' '
      }
      if (cmds.length === 4) {
        str += xtra + code4(cmds)
        xtra = ' '
      }
      if (cmds.length === 2) {
        str += xtra + code2(cmds)
        xtra = ' '
      }
    })
  }
  return str

  function code6(a): number {
    return code1(a[0]) + code1(a[1]) + code1(a[2]) + code1(a[3]) + code1(a[4]) + code1(a[5])
  }
  function code4(a): number {
    return code1(a[0]) + code1(a[1]) + code1(a[2]) + code1(a[3])
  }
  function code2(a): number {
    return code1(a[0]) + code1(a[1])
  }
  function code1(n): number {
    return toB128(n + n + 4000)
  }
}

function prepArray(): void {
  let pntr = -1,
    n
  b128back = new Uint8Array(256)
  b128digits = new Array(128)
  while (160 > pntr++) {
    if (pntr < 128) {
      n = fr128to256(pntr)
      b128digits[pntr] = String.fromCharCode(n)
      b128back[n] = pntr
    } else {
      if (pntr === 128) {
        b128back[32] = pntr
      } else {
        b128back[pntr + 71] = pntr
      }
    }
  }
  function fr128to256(n): number {
    if (n < 92) {
      return n < 58 ? (n < 6 ? n + 33 : n + 34) : n + 35
    } else {
      return n + 69
    }
  }
}
function frB128(s: string): number {
  let result = 0,
    i = -1
  const l = s.length - 1
  while (i++ < l) {
    result = result * 128 + b128back[s.charCodeAt(i)]
  }
  return result
}
function toB128(i): number {
  let s = b128digits[i % 128]
  i = Γ(i / 128)
  while (i > 0) {
    s = b128digits[i % 128] + s
    i = Γ(i / 128)
  }
  return s
}
//     FONT COMPRESSING AND DECOMPRESSING     FONT COMPRESSING AND DECOMPRESSING
// *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*

// *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
//     PARAMETER QUALIFYING AND DEFAULTING     PARAMETER QUALIFYING AND DEFAULTING
//
// Screening and defaulting functions for incoming parameters
function makePreferences(prenfrences: {
  defaultFont?: string
  meshOrigin?: string
  scale?: number
  debug?: boolean
  methods?: {
    Vector2?: BABYLON.Vector2
    Vector3?: BABYLON.Vector3
    Path2?: BABYLON.Path2
    Curve3?: BABYLON.Curve3
    Color3?: BABYLON.Color3
    SolidParticleSystem?: BABYLON.SolidParticleSystem
    PolygonMeshBuilder?: BABYLON.PolygonMeshBuilder
    CSG?: BABYLON.CSG
    StandardMaterial?: BABYLON.StandardMaterial
    Mesh?: BABYLON.Mesh
  }
}): {
  defaultFont: string
  meshOrigin: string
  scale: number
  debug: boolean
} {
  const p = prenfrences
  const prefs = {
    defaultFont: '',
    meshOrigin: 'letterCenter',
    scale: 1,
    debug: false
  }

  if (isObject(p) && p.defaultFont) prefs.defaultFont = p.defaultFont
  if (isObject(p) && p['default-font']) prefs.defaultFont = p['default-font']
  if (isObject(p) && p.meshOrigin) prefs.meshOrigin = p.meshOrigin
  if (isObject(p) && p['meshOrigin']) prefs.meshOrigin = p['meshOrigin']
  if (isObject(p) && p.scale) prefs.scale = p.scale
  if (isObject(p) && p.debug) prefs.debug = p.debug
  if (isObject(p) && p.methods) cacheMethods(p.methods)

  return prefs
}
function cacheMethods(src): void {
  let incomplete: boolean | string
  incomplete = false
  if (isObject(src)) {
    methodsList.forEach(function (meth) {
      if (isObject(src[meth])) {
        B[meth] = src[meth]
      } else {
        incomplete = meth
      }
    })
    if (!incomplete) {
      supplementCurveFunctions()
    }
  }
  if (isString(incomplete)) {
    throw new Error("Missing method '" + incomplete + "'")
  }
}

// ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~
// Needed for making font curves
// Thanks Gijs, wherever you are
//
function supplementCurveFunctions(): void {
  if (isObject(B.Path2)) {
    if (!Object.keys(B.Path2).includes('addQuadraticCurveTo')) {
      // B.Path2.prototype.addQuadraticCurveTo = function (redX, redY, blueX, blueY): void {
      //   const points = this.getPoints()
      //   const lastPoint = points[points.length - 1]
      //   const origin = new B.Vector3(lastPoint.x, lastPoint.y, 0)
      //   const control = new B.Vector3(redX, redY, 0)
      //   const destination = new B.Vector3(blueX, blueY, 0)
      //   const nb_of_points = curveSampleSize
      //   const curve = B.Curve3.CreateQuadraticBezier(origin, control, destination, nb_of_points)
      //   const curvePoints = curve.getPoints()
      //   for (let i = 1; i < curvePoints.length; i++) {
      //     this.addLineTo(curvePoints[i].x, curvePoints[i].y)
      //   }
      // }
      console.log('在BABYLON.Path2上没有找到addQuadraticCurveTo方法')
    }
    if (!B.Path2.prototype.addCubicCurveTo) {
      B.Path2.prototype.addCubicCurveTo = function (redX, redY, greenX, greenY, blueX, blueY): void {
        const points = this.getPoints()
        const lastPoint = points[points.length - 1]
        const origin = new B.Vector3(lastPoint.x, lastPoint.y, 0)
        const control1 = new B.Vector3(redX, redY, 0)
        const control2 = new B.Vector3(greenX, greenY, 0)
        const destination = new B.Vector3(blueX, blueY, 0)
        const nb_of_points = Math.floor(0.3 + curveSampleSize * 1.5)
        const curve = B.Curve3.CreateCubicBezier(origin, control1, control2, destination, nb_of_points)
        const curvePoints = curve.getPoints()
        for (let i = 1; i < curvePoints.length; i++) {
          this.addLineTo(curvePoints[i].x, curvePoints[i].y)
        }
      }
    }
  }
}
//  ~  -  =  ~  -  =  ~  -  =  ~  -  =  ~  -  =
// Applies a test to potential incoming parameters
// If the test passes, the parameters are used, otherwise the default is used
function setOption<T>(opts: fonOptions | mrPosition | mrColors, field: string, tst: (opt: T) => boolean, defalt: T): T {
  return tst(opts[field]) ? opts[field] : defalt
}

//     PARAMETER QUALIFYING AND DEFAULTING     PARAMETER QUALIFYING AND DEFAULTING
// *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*

// *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
// Conversion functions
function rgb2Bcolor3(rgb: string): BABYLON.Color3 {
  rgb = rgb.replace('#', '')
  return new B.Color3(convert(rgb.substring(0, 2)), convert(rgb.substring(2, 4)), convert(rgb.substring(4, 6)))
  function convert(x): number {
    return Γ(1000 * Math.max(0, Math.min((isNumber(parseInt(x, 16)) ? parseInt(x, 16) : 0) / 255, 1))) / 1000
  }
}
function point2Vector(point: { x: number; y: number }): BABYLON.Vector2 {
  return new B.Vector2(round(point.x), round(point.y))
}
function merge(arrayOfMeshes: BABYLON.Mesh[]): BABYLON.Mesh {
  // for (let i = 0; i < arrayOfMeshes.length; i++) {
  //   console.log(arrayOfMeshes[i])
  // }
  // debugger
  return arrayOfMeshes.length === 1 ? arrayOfMeshes[0] : (B.Mesh.MergeMeshes(arrayOfMeshes, true) as BABYLON.Mesh)
}

// *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-* *-*=*  *=*-*
// Boolean test functions
function isPositiveNumber(mn): mn is number {
  return typeof mn === 'number' && !isNaN(mn) ? 0 < mn : false
}
function isNumber(mn): mn is number {
  return typeof mn === 'number'
}
function isBoolean(mn): boolean {
  return typeof mn === 'boolean'
}
function isAmplitude(ma): ma is number {
  return typeof ma === 'number' && !isNaN(ma) ? 0 <= ma && ma <= 1 : false
}
function isObject(mo): mo is object {
  return (mo != null && typeof mo === 'object') || typeof mo === 'function'
}
function isArray(ma): boolean {
  return ma != null && typeof ma === 'object' && ma.constructor === Array
}
function isString(ms): boolean {
  return typeof ms === 'string' ? ms.length > 0 : false
}
function isSupportedFont(ff): boolean {
  return isObject(FONTS[ff])
}
function isSupportedAnchor(a): a is string {
  return a === 'left' || a === 'right' || a === 'center'
}
function isRelativeLength(l): l is number {
  return l === 3 || l === 5 || l === 7
}
function weeid(): number {
  return Math.floor(Math.random() * 1000000)
}
function round(n: number): number {
  return Γ(0.3 + n * 1000000) / 1000000
}
