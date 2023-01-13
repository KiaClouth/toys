const chineseCoverage = [
  // eslint-disable-next-line prettier/prettier
  "成", "都", "天", "府", "重", "庆", "西", "安", "上", "海", "武", "汉", "深", "圳", "南", "京", "杭", "广", "州", "阿", "多", "比", "凡", "云",
  // eslint-disable-next-line prettier/prettier
  "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
  // eslint-disable-next-line prettier/prettier
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  // eslint-disable-next-line prettier/prettier
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
]

const engilshCoverage = [
  // eslint-disable-next-line prettier/prettier
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  // eslint-disable-next-line prettier/prettier
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  // eslint-disable-next-line prettier/prettier
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "|", '"', "'", "#", "$", "%", "&", "(", ")", "*", "+", ",", "-", ".", "/",
  // eslint-disable-next-line prettier/prettier
  ":", ";", "<", "=", ">", "?", "@", "[", "]", "^", "_", " ", " "
]

const config = {
  //默认字符区间不可删除
  'default-coverage': [
    // eslint-disable-next-line prettier/prettier
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    // eslint-disable-next-line prettier/prettier
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    // eslint-disable-next-line prettier/prettier
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "!", "|", '"', "'", "#", "$", "%", "&", "(", ")", "*", "+", ",", "-", ".", "/",
    // eslint-disable-next-line prettier/prettier
    ":", ";", "<", "=", ">", "?", "@", "[", "]", "^", "_", " ", " "
  ],

  //需要转化的字体文件目录
  relPathFrom: './font/',

  //导出资源目录
  relPathTo: './src/renderer/src/assets/js-plugin/meshwriter/dist/',

  //自定义字符区间
  customCoverage: {}
}

require('./meshwriter.commonjs') // Glyphin中需要用
const suffix = 'ttf'
const compress = true
const opentype = require('./opentype')
const PiP = require('./pip')
const Glyphin = require('./glyphin')
const fs = require('fs')
const path = require('path')

let coverage = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] // 缺省值

global.PiP = PiP
global.config_ = config

fs.readdir(path.join(__dirname, config.relPathFrom), (err, data) => {
  if (err) {
    console.log('无法读取' + path.join(__dirname, config.relPathFrom))
  } else {
    // console.log(data)
    for (const ttfFileName of data) {
      // fs.readFile(path.join(__dirname, config.relPathFrom + ttfFileName), (err, data) => {
      //   if (err) {
      //     console.log('err')
      //   } else {
      //     console.log(data)
      //   }
      // })

      const name = ttfFileName.replace('.ttf', '').replace('.TTF', '')
      coverage = chineseCoverage

      fs.readFile(path.join(__dirname, config.relPathFrom + name + '.' + suffix), (err, data) => {
        if (err) {
          console.log(
            "无法读取 '" + path.join(__dirname, config.relPathFrom + name + '.' + suffix) + "'"
          )
          console.log(err)
        } else {
          let fontName
          const fontArrayBuffer = convertBuff2AB(data)
          const nativeFont = opentype.parse(fontArrayBuffer, {
            lowMemory: false
          })
          const glyphin = new Glyphin(nativeFont, coverage)
          let fileText = glyphin.getMeshWriterSeries(compress)
          try {
            fontName = nativeFont.names.fontFamily.en
          } catch (e) {
            fontName = 'font'
          }
          fileText = filePre(fontName, nativeFont.outlinesFormat) + fileText + filePost(fontName)
          const fileBuffer = Buffer.from(fileText)
          fs.mkdir(config.relPathTo, { recursive: true }, (err) => {
            if (err) {
              throw err
            } else {
              console.log('路径就绪' + config.relPathTo)
            }
          })
          fs.writeFile(config.relPathTo + name.toLowerCase() + '.' + 'js', fileBuffer, (err) => {
            if (err) {
              console.log('无法写入' + config.relPathTo + name + '.' + 'js')
              console.log(err)
            } else {
              console.log('成功写入' + config.relPathTo + name.toLowerCase() + '.' + 'js')
            }
          })
        }
      })
    }
  }
})

function convertBuff2AB(buff) {
  var ab = new ArrayBuffer(buff.length),
    vw = new Uint8Array(ab)
  for (var i = 0; i < buff.length; i++) {
    vw[i] = buff[i]
  }
  return ab
}
function filePre(fontName, format) {
  let line1 = ''
  if (format === 'cff') {
    return (
      line1 +
      "export default function font(codeList){\n\n      var font={reverseHoles:true,reverseShapes:false},nbsp='\u00A0';\n\n"
    )
  } else {
    return (
      line1 +
      "export default function font(codeList){\n\n      var font={reverseHoles:false,reverseShapes:true},nbsp='\u00A0';\n\n"
    )
  }
}
function filePost() {
  return '\n      return font;\n    }'
}
