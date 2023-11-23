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
  tc: abi
  pf: abi
  bebj: abi
  wg: abi
  mg: abi
  wf: abi
  mf: abi
  hb: abi
  mz: abi
}
type typeName = keyof petType
const petTypeArray = {
  tc: {
    str: 80,
    int: 80,
    vit: 80,
    agi: 80,
    dex: 80
  },
  pf: {
    str: 40,
    int: 40,
    vit: 40,
    agi: 40,
    dex: 40
  },
  bebj: {
    str: 60,
    int: 60,
    vit: 60,
    agi: 60,
    dex: 60
  }
}

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
        this.abi = petTypeArray[this.type]
        this.mainAbiName = mainAbiName
      }

      public matk = (): number => {
        return this.maxAbi() * 4 + petTypeArray[this.type].dex
      }

      public maxAbi = (): number => {
        let mainAbi = 0
        if (this.generations !== 0) {
          mainAbi = mainAbi + this.maxLv - 1
        }
        for (let lv = 0; lv < this.maxLv; lv++) {
          if (mainAbi < 255) {
            mainAbi = mainAbi + 1 + this.potential[this.mainAbiName] / 100
          } else {
            mainAbi = mainAbi + this.potential[this.mainAbiName] / 100
          }
        }
        return mainAbi
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
        console.log(`
        代数： ${this.generations}
        最终潜力：
          str: ${Math.ceil(this.potential.str)}
          int: ${Math.ceil(this.potential.int)}
          vit: ${Math.ceil(this.potential.vit)}
          agi: ${Math.ceil(this.potential.agi)}
          dex: ${Math.ceil(this.potential.dex)}
        最大等级： ${Math.ceil(this.maxLv)}
        最大能力值： ${Math.ceil(this.maxAbi())}
        类型赋予的能力值： ${this.type}
        性格对该值的增幅倍率： ${this.character}
        `)
      }
    }
    const levePet = new Pet(0, 250, { str: 88, int: 285, vit: 88, agi: 88, dex: 88 }, 'tc', 'int', 1)
    let testPet = new Pet(9990, 2, { str: 96, int: 285, vit: 96, agi: 96, dex: 96 }, 'tc', 'int', 1)
    testPet.synthesisWith(levePet, { childType: 'tc', childMainAbiName: 'int', childeCharacter: 1 })

    for (let i = 0; i < 5; i++) {
      testPet = testPet.synthesisWith(levePet, { childType: 'tc', childMainAbiName: 'int', childeCharacter: 1 })
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
