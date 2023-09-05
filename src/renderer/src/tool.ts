export const root = document.getElementById('root')!
export const resize = new CustomEvent('resize', { detail: 'change' })

// 柏林噪声
export class PerlinNoise {
  private permutation: number[] = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6,
    148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171,
    168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46,
    245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
    164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47,
    16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39,
    253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162,
    241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
  ]

  constructor(permutation?: number[]) {
    if (permutation) {
      this.permutation = permutation
    }
  }

  public noise = (x: number, y: number, z: number, min = 0, max = 1): number => {
    const p = new Array(512)
    for (let i = 0; i < 256; i++) p[256 + i] = p[i] = this.permutation[i]

    const X = Math.floor(x) & 255, // FIND UNIT CUBE THAT
      Y = Math.floor(y) & 255, // CONTAINS POINT.
      Z = Math.floor(z) & 255
    x -= Math.floor(x) // FIND RELATIVE X,Y,Z
    y -= Math.floor(y) // OF POINT IN CUBE.
    z -= Math.floor(z)
    const u = this.fade(x), // COMPUTE FADE CURVES
      v = this.fade(y), // FOR EACH OF X,Y,Z.
      w = this.fade(z)
    const A = p[X] + Y,
      AA = p[A] + Z,
      AB = p[A + 1] + Z, // HASH COORDINATES OF
      B = p[X + 1] + Y,
      BA = p[B] + Z,
      BB = p[B + 1] + Z // THE 8 CUBE CORNERS,

    // The perlin noise value 0 -> 1
    const val = this.scale(
      this.lerp(
        w,
        this.lerp(
          v,
          this.lerp(
            u,
            this.grad(p[AA], x, y, z), // AND ADD
            this.grad(p[BA], x - 1, y, z)
          ), // BLENDED
          this.lerp(
            u,
            this.grad(p[AB], x, y - 1, z), // RESULTS
            this.grad(p[BB], x - 1, y - 1, z)
          )
        ), // FROM  8
        this.lerp(
          v,
          this.lerp(
            u,
            this.grad(p[AA + 1], x, y, z - 1), // CORNERS
            this.grad(p[BA + 1], x - 1, y, z - 1)
          ), // OF CUBE
          this.lerp(u, this.grad(p[AB + 1], x, y - 1, z - 1), this.grad(p[BB + 1], x - 1, y - 1, z - 1))
        )
      )
    )

    return min + val * (max - min)
  }
  private fade = function (t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }
  private lerp = function (t: number, a: number, b: number): number {
    return a + t * (b - a)
  }
  private grad = function (hash: number, x: number, y: number, z: number): number {
    const h = hash & 15 // CONVERT LO 4 BITS OF HASH CODE
    const u = h < 8 ? x : y, // INTO 12 this.gradIENT DIRECTIONS.
      v = h < 4 ? y : h == 12 || h == 14 ? x : z
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v)
  }
  private scale = function (n: number): number {
    return (1 + n) / 2
  }
}

//
// export class SmoothCorners {

//     static get inputProperties() {
//         return ["--smooth-corners"];
//     }

//     paint(ctx: PaintRenderingContext2D, geom: PaintSize, properties: StylePropertyMapReadOnly) {
//         // 将css属性中的--smooth-corners赋值给变量c
//         const c = properties.get("--smooth-corners").toString();

//         const n = c;
//         let m = n;

//         //限定区间
//         if (n > 100) m = 100;
//         if (n < 0.00000000001) m = 0.00000000001;

//         const w = Math.trunc(geom.width / 2);
//         const h = Math.trunc(geom.height / 2);

//         //   将椭圆分成4个象限的四个部分
//         const coordinate: Array<number[]> = [[], []];

//         //   记录x,y正方向象限的坐标值
//         for (let i = 0; i < w + 1; i++) {
//             const x = i;
//             const y =
//                 Math.pow(
//                     Math.abs(Math.pow(h, m) * (1 - Math.pow(i, m) / Math.pow(w, m))),
//                     1 / m
//                 ) + h;
//             coordinate[0].push(x);
//             coordinate[1].push(y);
//         }

//         //开始绘制
//         ctx.beginPath();

//         // 绘制第一象限，并镜像绘制其余三个象限
//         for (let i = 0; i < coordinate[0].length; i++) {
//             if (i == 0) {
//                 ctx.moveTo(w, h);
//                 ctx.lineTo(w, 2 * h);
//             } else ctx.lineTo(w + coordinate[0][i], +coordinate[1][i]);
//         }
//         for (let i = 0; i < coordinate[0].length; i++) {
//             if (i == 0) {
//                 ctx.moveTo(w, h);
//                 ctx.lineTo(w, 0);
//             } else ctx.lineTo(w + coordinate[0][i], -coordinate[1][i] + 2 * h);
//         }
//         for (let i = 0; i < coordinate[0].length; i++) {
//             if (i == 0) {
//                 ctx.moveTo(w, h);
//                 ctx.lineTo(w, 2 * h);
//             } else ctx.lineTo(w - coordinate[0][i], +coordinate[1][i]);
//         }
//         for (let i = 0; i < coordinate[0].length; i++) {
//             if (i == 0) {
//                 ctx.moveTo(w, h);
//                 ctx.lineTo(w, 0);
//             } else ctx.lineTo(w - coordinate[0][i], -coordinate[1][i] + 2 * h);
//         }

//         ctx.closePath();
//         ctx.fill();
//     }
// }
// typeof registerPaint === 'function' && registerPaint('smooth-corners', SmoothCorners);
/**/

//canvas大小设置
export function canvasResize(canvas: HTMLCanvasElement, width?: number | string, height?: number | string): void {
  if (typeof width === 'number') {
    canvas.width = width
  } else if (width === 'unset' || !width) {
    canvas.width = canvas.parentElement!.clientWidth
  }

  if (typeof height === 'number') {
    canvas.height = height
  } else if (height === 'unset' || !height) {
    canvas.height = canvas.parentElement!.clientHeight
  }
  // console.log('canvas：' + canvas.id + '的尺寸设置完成！')
}

//判断对象是否为HTMLCanvasElement
export function isCanvas(obj: HTMLCanvasElement | HTMLElement | null): obj is HTMLCanvasElement {
  if (obj !== null) {
    return obj.tagName === 'CANVAS'
  } else {
    return false
  }
}

export function rgb2hsv(rgb: { r: number; g: number; b: number }): {
  h: number
  s: number
  v: number
} {
  const r = rgb.r
  const g = rgb.g
  const b = rgb.b

  if (r > 255 || g > 255 || b > 255 || r < 0 || g < 0 || b < 0) {
    console.log('输入值不符合实际，已返回hsv(0,0,0)')
    return { h: 0, s: 0, v: 0 }
  }

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  // 计算H：色相
  const getH = (): number => {
    if (max === min) {
      return 0 // rgb三值相等时色相不会影响展示出来的颜色，因为色彩范围在hsv锥形中央，颜色为黑白灰
    } else if (max === r && g >= b) {
      return 60 * ((g - b) / (max - min)) + 0
    } else if (max === r && g < b) {
      return 60 * ((g - b) / (max - min)) + 360
    } else if (max === g) {
      return 60 * ((b - r) / (max - min)) + 120
    } else if (max === b) {
      return 60 * ((r - g) / (max - min)) + 240
    } else {
      return 123456789
    }
  }

  // 计算S：饱和度
  const getS = (): number => {
    if (max === 0) {
      return 0
    } else {
      return 1 - min / max
    }
  }

  // 计算V：明度
  const getV = (): number => {
    return max / 255
  }

  return {
    h: getH() / 360,
    s: getS(),
    v: getV()
  }
}

export function hsv2rgb(hsv: { h: number; s: number; v: number }): {
  r: number
  g: number
  b: number
} {
  let h = hsv.h * 360
  let s = hsv.s
  let v = hsv.v
  for (let i = 0; h > 360 || h < 0; i++) {
    h = h < 0 ? h + 360 : h > 360 ? h - 360 : h
  }
  s = s > 1 ? 1 : s < 0 ? 0 : s
  v = v > 1 ? 1 : v < 0 ? 0 : v
  const hi = Math.floor(h / 60) % 6, // hi用于判断色相区间hi=0时为0~60°，hi=1时为60°~120°以此类推
    f = h / 60 - hi, // f用于计算在该色相区间的偏转度
    min = v * (1 - s), // 得出r、g、b中最小的值
    max = v * (1 - f * s), // r、g、b中最大的值
    med = v * (1 - (1 - f) * s) // r、g、b中中间的那个值

  // 根据色相区间确定r、g、b顺序
  switch (hi) {
    case 0:
      return { r: v * 255, g: med * 255, b: min * 255 }

    case 1:
      return { r: max * 255, g: v * 255, b: min * 255 }

    case 2:
      return { r: min * 255, g: v * 255, b: med * 255 }

    case 3:
      return { r: min * 255, g: max * 255, b: v * 255 }

    case 4:
      return { r: med * 255, g: min * 255, b: v * 255 }

    case 5:
      return { r: v * 255, g: min * 255, b: max * 255 }

    default:
      return { r: 0, g: 0, b: 0 }
  }
}

export function hex2rgb(hex: string): {
  r: number
  g: number
  b: number
} {
  // 去掉可能存在的 # 符号
  hex = hex.replace('#', '')

  // 将十六进制颜色值分解成红、绿、蓝三个分量
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return { r, g, b }
}

export function hsvOffset(
  color3: BABYLON.Color3,
  [h, hMeth]: [number, string?],
  [s, sMeth]: [number, string?],
  [v, vMeth]: [number, string?]
): BABYLON.Color3 {
  const hsv = rgb2hsv({ r: color3.r * 255, g: color3.g * 255, b: color3.b * 255 })
  // console.log('hsv:', hsv)

  h = typeof hMeth !== 'undefined' ? (hMeth === 'add' ? hsv.h + h : hsv.h * h) : h
  s = typeof sMeth !== 'undefined' ? (sMeth === 'add' ? hsv.s + s : hsv.s * s) : s
  v = typeof vMeth !== 'undefined' ? (vMeth === 'add' ? hsv.v + v : hsv.v * v) : v

  while (h < 0 || h > 1) {
    h = h > 1 ? h - 1 : h < 0 ? h + 1 : h
  }
  while (s < 0 || s > 1) {
    s = s > 1 ? 1 : s < 0 ? 0 : s
  }
  while (v < 0 || v > 1) {
    v = v > 1 ? 1 : v < 0 ? 0 : v
  }
  // console.log(h, s, v)

  const rgb = hsv2rgb({ h: h, s: s, v: v })
  // console.log('rgb:', rgb)
  return new BABYLON.Color3(rgb.r / 255, rgb.g / 255, rgb.b / 255)
}
// 给BABYLON.Color3添加按hsv调整色值方法
// BABYLON.Color3.prototype.hsvOffset = function ([h, hMeth], [s, sMeth], [v, vMeth]): BABYLON.Color3 {
//   const hsv = rgb2hsv({ r: this.r * 255, g: this.g * 255, b: this.b * 255 })
//   // console.log('hsv:', hsv)

//   h = typeof hMeth !== 'undefined' ? (hMeth === 'add' ? hsv.h + h : hsv.h * h) : h
//   s = typeof sMeth !== 'undefined' ? (sMeth === 'add' ? hsv.s + s : hsv.s * s) : s
//   v = typeof vMeth !== 'undefined' ? (vMeth === 'add' ? hsv.v + v : hsv.v * v) : v

//   while (h < 0 || h > 1) {
//     h = h > 1 ? h - 1 : h < 0 ? h + 1 : h
//   }
//   while (s < 0 || s > 1) {
//     s = s > 1 ? 1 : s < 0 ? 0 : s
//   }
//   while (v < 0 || v > 1) {
//     v = v > 1 ? 1 : v < 0 ? 0 : v
//   }
//   // console.log(h, s, v)

//   const rgb = hsv2rgb({ h: h, s: s, v: v })
//   // console.log('rgb:', rgb)
//   return new BABYLON.Color3(rgb.r / 255, rgb.g / 255, rgb.b / 255)
// }

/**
 * Colour class
 * Represet the colour object and it's different types (HEX, RGBA, XYZ, LAB)
 * This class have the ability to do the following
 * 1. Convert HEX to RGBA
 * 2. Convert RGB to XYZ
 * 3. Convert XYZ to LAB
 * 4. Calculate Delta E00 between two LAB colour (Main purpose)
 * @author Ahmed Moussa <moussa.ahmed95@gmail.com>
 * @version 2.0
 */
export class Colour {
  /**
   * Convert HEX to LAB
   * @param {[string]} hex hex colour value desired to be converted to LAB
   */
  static hex2lab(hex): number[] {
    const [r, g, b, a] = Colour.hex2rgba(hex)
    const [x, y, z] = Colour.rgb2xyz(r, g, b, a)
    return Colour.xyz2lab(x, y, z) // [l, a, b]
  }
  /**
   * Convert RGBA to LAB
   * @param {[Number]} r     Red value from 0 to 255
   * @param {[Number]} g     Green value from 0 to 255
   * @param {[Number]} b     Blue value from 0 to 255
   */
  static rgba2lab(r, g, b, a = 1): number[] {
    const [x, y, z] = Colour.rgb2xyz(r, g, b, a)
    return Colour.xyz2lab(x, y, z) // [l, a, b]
  }
  /**
   * Convert LAB to RGBA
   * @param {[Number]} l
   * @param {[Number]} a
   * @param {[Number]} b
   */
  static lab2rgba(l, a, b): number[] {
    const [x, y, z] = Colour.lab2xyz(l, a, b)
    return Colour.xyz2rgba(x, y, z) // [r, g, b, a]
  }
  /**
   * Convert HEX to RGBA
   * @param {[string]} hex hex colour value desired to be converted to RGBA
   */
  static hex2rgba(hex): number[] {
    let c
    if (hex.charAt(0) === '#') {
      c = hex.substring(1).split('')
    }
    if (c.length > 6 || c.length < 3) {
      throw new Error(`HEX colour must be 3 or 6 values. You provided it ${c.length}`)
    }
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    const r = (c >> 16) & 255
    const g = (c >> 8) & 255
    const b = c & 255
    const a = 1
    return [r, g, b, a]
  }
  /**
   * Convert RGB to XYZ
   * @param {[Number]} r     Red value from 0 to 255
   * @param {[Number]} g     Green value from 0 to 255
   * @param {[Number]} b     Blue value from 0 to 255
   * @param {Number} [a=1]   Obacity value from 0 to 1 with a default value of 1 if not sent
   */
  static rgb2xyz(r, g, b, a = 1): number[] {
    if (r > 255) {
      // console.warn("Red value was higher than 255. It has been set to 255.");
      r = 255
    } else if (r < 0) {
      // console.warn("Red value was smaller than 0. It has been set to 0.");
      r = 0
    }
    if (g > 255) {
      // console.warn("Green value was higher than 255. It has been set to 255.");
      g = 255
    } else if (g < 0) {
      // console.warn("Green value was smaller than 0. It has been set to 0.");
      g = 0
    }
    if (b > 255) {
      // console.warn("Blue value was higher than 255. It has been set to 255.");
      b = 255
    } else if (b < 0) {
      // console.warn("Blue value was smaller than 0. It has been set to 0.");
      b = 0
    }
    if (a > 1) {
      // console.warn("Obacity value was higher than 1. It has been set to 1.");
      a = 1
    } else if (a < 0) {
      // console.warn("Obacity value was smaller than 0. It has been set to 0.");
      a = 0
    }
    r = r / 255
    g = g / 255
    b = b / 255
    // step 1
    if (r > 0.04045) {
      r = Math.pow((r + 0.055) / 1.055, 2.4)
    } else {
      r = r / 12.92
    }
    if (g > 0.04045) {
      g = Math.pow((g + 0.055) / 1.055, 2.4)
    } else {
      g = g / 12.92
    }
    if (b > 0.04045) {
      b = Math.pow((b + 0.055) / 1.055, 2.4)
    } else {
      b = b / 12.92
    }
    // step 2
    r = r * 100
    g = g * 100
    b = b * 100
    // step 3
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041
    return [x, y, z]
  }
  /**
   * Convert XYZ to RGBA
   * @param {[Number]} x
   * @param {[Number]} y
   * @param {[Number]} z
   */
  static xyz2rgba(x, y, z): number[] {
    const varX = x / 100
    const varY = y / 100
    const varZ = z / 100

    let varR = varX * 3.2404542 + varY * -1.5371385 + varZ * -0.4985314
    let varG = varX * -0.969266 + varY * 1.8760108 + varZ * 0.041556
    let varB = varX * 0.0556434 + varY * -0.2040259 + varZ * 1.0572252

    if (varR > 0.0031308) {
      varR = 1.055 * Math.pow(varR, 1 / 2.4) - 0.055
    } else {
      varR = 12.92 * varR
    }
    if (varG > 0.0031308) {
      varG = 1.055 * Math.pow(varG, 1 / 2.4) - 0.055
    } else {
      varG = 12.92 * varG
    }
    if (varB > 0.0031308) {
      varB = 1.055 * Math.pow(varB, 1 / 2.4) - 0.055
    } else {
      varB = 12.92 * varB
    }

    const r = Math.round(varR * 255)
    const g = Math.round(varG * 255)
    const b = Math.round(varB * 255)

    return [r, g, b, 1]
  }
  /**
   * Convert XYZ to LAB
   * @param {[Number]} x Value
   * @param {[Number]} y Value
   * @param {[Number]} z Value
   */
  static xyz2lab(x, y, z): number[] {
    // using 10o Observer (CIE 1964)
    // CIE10_D65 = {94.811f, 100f, 107.304f} => Daylight
    const referenceX = 94.811
    const referenceY = 100
    const referenceZ = 107.304
    // step 1
    x = x / referenceX
    y = y / referenceY
    z = z / referenceZ
    // step 2
    if (x > 0.008856) {
      x = Math.pow(x, 1 / 3)
    } else {
      x = 7.787 * x + 16 / 116
    }
    if (y > 0.008856) {
      y = Math.pow(y, 1 / 3)
    } else {
      y = 7.787 * y + 16 / 116
    }
    if (z > 0.008856) {
      z = Math.pow(z, 1 / 3)
    } else {
      z = 7.787 * z + 16 / 116
    }
    // step 3
    const l = 116 * y - 16
    const a = 500 * (x - y)
    const b = 200 * (y - z)
    return [l, a, b]
  }
  /**
   * Convert LAB to XYZ
   * @param {[Number]} l
   * @param {[Number]} a
   * @param {[Number]} b
   */
  static lab2xyz(l, a, b): number[] {
    // using 10o Observer (CIE 1964)
    // CIE10_D65 = {94.811f, 100f, 107.304f} => Daylight
    const referenceX = 94.811
    const referenceY = 100
    const referenceZ = 107.304

    let varY = (l + 16) / 116
    let varX = a / 500 + varY
    let varZ = varY - b / 200

    if (Math.pow(varY, 3) > 0.008856) {
      varY = Math.pow(varY, 3)
    } else {
      varY = (varY - 16 / 116) / 7.787
    }
    if (Math.pow(varX, 3) > 0.008856) {
      varX = Math.pow(varX, 3)
    } else {
      varX = (varX - 16 / 116) / 7.787
    }
    if (Math.pow(varZ, 3) > 0.008856) {
      varZ = Math.pow(varZ, 3)
    } else {
      varZ = (varZ - 16 / 116) / 7.787
    }

    const x = varX * referenceX
    const y = varY * referenceY
    const z = varZ * referenceZ

    return [x, y, z]
  }
  /**
   * The difference between two given colours with respect to the human eye
   * @param {[type]} l1 Colour 1
   * @param {[type]} a1 Colour 1
   * @param {[type]} b1 Colour 1
   * @param {[type]} l2 Colour 2
   * @param {[type]} a2 Colour 2
   * @param {[type]} b2 Colour 2
   */
  static deltaE00(l1, a1, b1, l2, a2, b2): number {
    // Utility functions added to Math Object
    const rad2deg = function (rad): number {
      return (360 * rad) / (2 * Math.PI)
    }
    const deg2rad = function (deg): number {
      return (2 * Math.PI * deg) / 360
    }
    // Start Equation
    // Equation exist on the following URL http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
    const avgL = (l1 + l2) / 2
    const c1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2))
    const c2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2))
    const avgC = (c1 + c2) / 2
    const g = (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7)))) / 2

    const a1p = a1 * (1 + g)
    const a2p = a2 * (1 + g)

    const c1p = Math.sqrt(Math.pow(a1p, 2) + Math.pow(b1, 2))
    const c2p = Math.sqrt(Math.pow(a2p, 2) + Math.pow(b2, 2))

    const avgCp = (c1p + c2p) / 2

    let h1p = rad2deg(Math.atan2(b1, a1p))
    if (h1p < 0) {
      h1p = h1p + 360
    }

    let h2p = rad2deg(Math.atan2(b2, a2p))
    if (h2p < 0) {
      h2p = h2p + 360
    }

    const avghp = Math.abs(h1p - h2p) > 180 ? (h1p + h2p + 360) / 2 : (h1p + h2p) / 2

    const t =
      1 -
      0.17 * Math.cos(deg2rad(avghp - 30)) +
      0.24 * Math.cos(deg2rad(2 * avghp)) +
      0.32 * Math.cos(deg2rad(3 * avghp + 6)) -
      0.2 * Math.cos(deg2rad(4 * avghp - 63))

    let deltahp = h2p - h1p
    if (Math.abs(deltahp) > 180) {
      if (h2p <= h1p) {
        deltahp += 360
      } else {
        deltahp -= 360
      }
    }

    const deltalp = l2 - l1
    const deltacp = c2p - c1p

    deltahp = 2 * Math.sqrt(c1p * c2p) * Math.sin(deg2rad(deltahp) / 2)

    const sl = 1 + (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2))
    const sc = 1 + 0.045 * avgCp
    const sh = 1 + 0.015 * avgCp * t

    const deltaro = 30 * Math.exp(-Math.pow((avghp - 275) / 25, 2))
    const rc = 2 * Math.sqrt(Math.pow(avgCp, 7) / (Math.pow(avgCp, 7) + Math.pow(25, 7)))
    const rt = -rc * Math.sin(2 * deg2rad(deltaro))

    const kl = 1
    const kc = 1
    const kh = 1

    const deltaE = Math.sqrt(
      Math.pow(deltalp / (kl * sl), 2) +
        Math.pow(deltacp / (kc * sc), 2) +
        Math.pow(deltahp / (kh * sh), 2) +
        rt * (deltacp / (kc * sc)) * (deltahp / (kh * sh))
    )

    return deltaE
  }
  /**
   * Get darker colour of the given colour
   * @param {[Number]} r     Red value from 0 to 255
   * @param {[Number]} g     Green value from 0 to 255
   * @param {[Number]} b     Blue value from 0 to 255
   */
  static getDarkerColour(r, g, b, a = 1, darkenPercentage = 0.05): number[] {
    let l1 = Colour.rgba2lab(r, g, b, a)[0]
    const a1 = Colour.rgba2lab(r, g, b, a)[1]
    const b1 = Colour.rgba2lab(r, g, b, a)[2]
    l1 -= l1 * darkenPercentage
    if (l1 < 0) {
      l1 = 0
    }
    return Colour.lab2rgba(l1, a1, b1) // [R, G, B, A]
  }
  /**
   * Get brighter colour of the given colour
   * @param {[Number]} r     Red value from 0 to 255
   * @param {[Number]} g     Green value from 0 to 255
   * @param {[Number]} b     Blue value from 0 to 255
   */
  static getBrighterColour(r, g, b, a = 1, brighterPercentage = 0.05): number[] {
    let l1 = Colour.rgba2lab(r, g, b, a)[0]
    const a1 = Colour.rgba2lab(r, g, b, a)[1]
    const b1 = Colour.rgba2lab(r, g, b, a)[2]
    l1 += l1 * brighterPercentage
    if (l1 > 100) {
      l1 = 100
    }
    return Colour.lab2rgba(l1, a1, b1) // [R, G, B, A]
  }
}
