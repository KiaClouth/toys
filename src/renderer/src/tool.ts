import 'babylonjs'

export const root = document.getElementById('root')!
export const resize = new CustomEvent('resize', { detail: 'change' })

// 柏林噪声
export class PerlinNoise {
  private permutation: number[] = [
    151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69,
    142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219,
    203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175,
    74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230,
    220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76,
    132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186,
    3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59,
    227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70,
    221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178,
    185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81,
    51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115,
    121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195,
    78, 66, 215, 61, 156, 180
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
          this.lerp(
            u,
            this.grad(p[AB + 1], x, y - 1, z - 1),
            this.grad(p[BB + 1], x - 1, y - 1, z - 1)
          )
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
export function canvasResize(
  canvas: HTMLCanvasElement,
  width?: number | string,
  height?: number | string
): void {
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

// 给BABYLON.Color3添加按hsv调整色值方法
BABYLON.Color3.prototype.hsvOffset = function ([h, hMeth], [s, sMeth], [v, vMeth]): BABYLON.Color3 {
  const hsv = rgb2hsv({ r: this.r * 255, g: this.g * 255, b: this.b * 255 })
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
