import { useEffect } from 'react'

import Versions from './components/accessory/Versions'
import Filing from './components/accessory/Filing'

type abi = {
  str: number
  int: number
  vit: number
  agi: number
  dex: number
}
type abiName = keyof abi
type petType = {
  天才: abi
  博而不精: abi
  物理攻击: abi
  物理防御: abi
  命中: abi
  回避: abi
  魔法攻击: abi
  魔法防御: abi
  强化技能: abi
  平凡: abi
}
type typeName = keyof petType
const petTypeArray = {
  天才: {
    str: 80,
    int: 80,
    vit: 80,
    agi: 80,
    dex: 80
  },
  博而不精: {
    str: 60,
    int: 60,
    vit: 60,
    agi: 60,
    dex: 60
  },
  物理攻击: {
    str: 120,
    int: 10,
    vit: 40,
    agi: 80,
    dex: 50
  },
  物理防御: {
    str: 60,
    int: 30,
    vit: 110,
    agi: 50,
    dex: 50
  },
  命中: {
    str: 40,
    int: 40,
    vit: 40,
    agi: 60,
    dex: 120
  },
  回避: {
    str: 40,
    int: 40,
    vit: 20,
    agi: 120,
    dex: 80
  },
  魔法攻击: {
    str: 10,
    int: 120,
    vit: 40,
    agi: 60,
    dex: 70
  },
  魔法防御: {
    str: 30,
    int: 70,
    vit: 80,
    agi: 50,
    dex: 70
  },
  强化技能: {
    str: 50,
    int: 50,
    vit: 50,
    agi: 50,
    dex: 50
  },
  平凡: {
    str: 40,
    int: 40,
    vit: 40,
    agi: 40,
    dex: 40
  }
}
// type panel = {
//   最大生命值: number
//   攻击属性: {
//     物理攻击: number
//     魔法攻击: number
//     攻击速度: number
//     咏唱速度: number
//     命中: number
//     魔法值自然恢复: number
//     攻回: number
//   }
//   防御属性: {
//     最大生命值: number
//     物理防御: number
//     魔法防御: number
//     回避: number
//   }
// }

export default function GS(): JSX.Element {
  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))

    class Pet {
      generations: number
      maxLv: number
      potential: abi
      type: string
      character: number
      wea: number
      abi: abi
      mainAbiName: abiName

      constructor(generations: number, maxLv: number, potential: abi, type: string, mainAbiName: abiName, character: number) {
        this.generations = generations
        this.maxLv = maxLv
        this.potential = potential
        this.type = type
        this.character = character
        this.wea = 255 * 2
        this.abi = {
          str: 0,
          int: 0,
          vit: 0,
          agi: 0,
          dex: 0
        }
        this.mainAbiName = mainAbiName

        // 计算最终能力值
        for (const abiName in this.abi) {
          if (abiName === this.mainAbiName) {
            if (this.generations !== 0) {
              this.abi[abiName] = this.maxLv - 1
            }
            for (let lv = 0; lv < this.maxLv; lv++) {
              if (this.abi[abiName] < 255) {
                this.abi[abiName] = this.abi[abiName] + 1 + this.potential[abiName] / 100
              } else {
                this.abi[abiName] = this.abi[abiName] + this.potential[abiName] / 100
              }
            }
          } else {
            for (let lv = 0; lv < this.maxLv; lv++) {
              this.abi[abiName] = this.abi[abiName] + this.potential[abiName] / 100
            }
          }
        }
      }

      public matk = (): number => {
        return this.abi.int * 4 + this.abi.dex + this.wea + this.maxLv
      }

      public synthesisWith = (
        otherPet: Pet,
        { childType, childMainAbiName, childeCharacter }: { childType: typeName; childMainAbiName: abiName; childeCharacter: number }
      ): Pet => {
        const childGeneration = this.generations + otherPet.generations + 1
        const childMaxLv = 1 + (this.maxLv + otherPet.maxLv) / 2
        const childPotential = { ...petTypeArray[childType] }
        for (const potentialName in otherPet.potential) {
          if (potentialName === childMainAbiName) {
            childPotential[potentialName] =
              petTypeArray[childType][potentialName] + 195 + (this.potential[potentialName] + otherPet.potential[potentialName]) / 10
          } else {
            childPotential[potentialName] =
              petTypeArray[childType][potentialName] + (this.potential[potentialName] + otherPet.potential[potentialName]) / 10
          }
        }
        return new Pet(childGeneration, childMaxLv, childPotential, childType, childMainAbiName, childeCharacter)
      }

      public display = (): void => {
        const displayData = {
          类型: this.type,
          性格: this.character,
          合成代数: this.generations,
          最大等级: Math.ceil(this.maxLv),
          教育时选择的能力: this.mainAbiName,
          最终潜力: {
            str: Math.ceil(this.potential.str),
            int: Math.ceil(this.potential.int),
            vit: Math.ceil(this.potential.vit),
            agi: Math.ceil(this.potential.agi),
            dex: Math.ceil(this.potential.dex)
          },
          满级时的能力值: {
            str: Math.ceil(this.abi.str),
            int: Math.ceil(this.abi.int),
            vit: Math.ceil(this.abi.vit),
            agi: Math.ceil(this.abi.agi),
            dex: Math.ceil(this.abi.dex)
          }
        }
        console.table(displayData)
      }
    }

    const levePet = new Pet(0, 250, { str: 88, int: 285, vit: 88, agi: 88, dex: 88 }, '天才', 'int', 1)
    let testPet = new Pet(9990, 2, { str: 96, int: 285, vit: 96, agi: 96, dex: 96 }, '天才', 'int', 1)

    for (let i = 0; i < 5; i++) {
      testPet = testPet.synthesisWith(levePet, { childType: '天才', childMainAbiName: 'vit', childeCharacter: 1 })
      testPet.display()
    }

    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  return (
    <div id="GS">
      <Versions />
      <Filing />
    </div>
  )
}
