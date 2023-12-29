import { useEffect } from 'react'

import Versions from './components/accessory/Versions'
import Filing from './components/accessory/Filing'

const variableBonus = {
  strR: 0,
  strV: 0,
  intR: 0,
  intV: 0,
  vitR: 0,
  vitV: 0,
  agiR: 0,
  agiV: 0,
  dexR: 0,
  dexV: 0,
  pAtkR: 0,
  pAtkV: 0,
  mAtkR: 0,
  mAtkV: 0,
  weaAtkR: 0,
  weaAtkV: 0,
  pPie: 0,
  mPie: 0,
  cdR: 0,
  cdV: 0,
  crR: 0,
  crV: 0,
  cdT: 0,
  crT: 0,
  stro: 0,
  dis: 0,
  pStab: 0,
  mStab: 0,
  total: 0,
  final: 0,
  aspdr: 0,
  aspdv: 0,
  cspdr: 0,
  cspdv: 0,
  am: 0
}
type bonus = keyof typeof variableBonus
type element = '无属性' | '水属性' | '火属性' | '地属性' | '风属性' | '光属性' | '暗属性'
type abi = {
  str: number
  int: number
  vit: number
  agi: number
  dex: number
}
type abiName = keyof abi
type weaType = {
  单手剑: {
    baseHit: 0.25
    baseAspd: 100
    convert: {
      str: {
        patk: 2
        stab: 0.025
        aspd: 0.2
      }
      int: {
        matk: 3
      }
      agi: {
        aspd: 4.2
      }
      dex: {
        patk: 2
        stab: 0.075
      }
    }
  }
  拔刀剑: {
    baseHit: 0.3
    baseAspd: 200
    convert: {
      str: {
        patk: 1.5
        stab: 0.075
        aspd: 0.3
      }
      int: {
        matk: 1.5
      }
      agi: {
        aspd: 3.9
      }
      dex: {
        patk: 2.5
        stab: 0.025
      }
    }
  }
  大剑: {
    baseHit: 0.15
    baseAspd: 50
    convert: {
      str: {
        patk: 3
        aspd: 0.2
      }
      int: {
        matk: 3
      }
      agi: {
        aspd: 2.2
      }
      dex: {
        patk: 1
        stab: 0.1
      }
    }
  }
  弓: {
    baseHit: 0.1
    baseAspd: 75
    convert: {
      str: {
        patk: 1
        stab: 0.05
      }
      int: {
        matk: 3
      }
      agi: {
        aspd: 3.1
      }
      dex: {
        patk: 3
        stab: 0.05
        aspd: 0.2
      }
    }
  }
  弩: {
    baseHit: 0.05
    baseAspd: 100
    convert: {
      str: {
        stab: 0.05
      }
      int: {
        matk: 3
      }
      agi: {
        aspd: 2.2
      }
      dex: {
        patk: 4
        aspd: 0.2
      }
    }
  }
  杖: {
    baseHit: 0.3
    baseAspd: 60
    convert: {
      str: {
        patk: 3
        stab: 0.05
      }
      int: {
        matk: 4
        patk: 1
        aspd: 0.2
      }
      agi: {
        aspd: 1.8
      }
      dex: {
        aspd: 0.2
      }
    }
  }
  魔导: {
    baseHit: 0.1
    baseAspd: 90
    convert: {
      int: {
        matk: 4
        padtk: 2
        aspd: 0.2
      }
      agi: {
        padtk: 2
        aspd: 4
      }
      dex: {
        stab: 0.1
      }
    }
  }
  拳: {
    baseHit: 0.1
    baseAspd: 100
    convert: {
      str: {
        aspd: 0.1
      }
      int: {
        matk: 4
      }
      agi: {
        patk: 2
        aspd: 4.6
      }
      dex: {
        patk: 0.5
        stab: 0.025
      }
    }
  }
  枪: {
    baseHit: 0.25
    baseAspd: 20
    convert: {
      str: {
        patk: 2.5
        stab: 0.05
        aspd: 0.2
      }
      int: {
        matk: 2
      }
      agi: {
        aspd: 3.5
        patk: 1.5
        matk: 1
      }
      dex: {
        stab: 0.05
      }
    }
  }
}
type weatypeName = keyof weaType
type wea = {
  type: weatypeName
  baseAtk: number
  stab: number
  refv: number
  dte: element
}
type permanentSkill = {
  name: string
  state: boolean
  effectList: {
    [K in bonus]?: number
  }
}
type permanentSkillList = permanentSkill[]
type petTypeName = '天才' | '博而不精' | '物理攻击' | '物理防御' | '命中' | '回避' | '魔法攻击' | '魔法防御' | '强化技能' | '平凡'
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

  public maxHp = (): number => {
    return 93 + (this.abi.vit / 3 + 127 / 17) * this.maxLv
  }

  public synthesisWith = (
    otherPet: Pet,
    { childType, childMainAbiName, childeCharacter }: { childType: petTypeName; childMainAbiName: abiName; childeCharacter: number }
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
      性格加成倍率: this.character,
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
      },
      武器为杖和魔导时的最终魔攻: Math.ceil(this.matk()),
      最大HP: Math.ceil(this.maxHp())
    }
    console.table(displayData)
  }
}
class Character {
  lv: number
  abi: abi
  wea: wea
  permanentSkillList: permanentSkillList
  constructor(lv: number, abi: abi, wea: wea, permanentSkillList: permanentSkillList) {
    this.lv = lv
    this.abi = abi
    this.wea = wea
    this.permanentSkillList = permanentSkillList
  }

  public display = (): void => {
    console.log(this)
  }
}
function PetModule(): JSX.Element {
  useEffect(() => {
    const levePet = new Pet(0, 250, { str: 88, int: 285, vit: 88, agi: 88, dex: 88 }, '天才', 'int', 1)
    let testPet = new Pet(0, 2, { str: 96, int: 285, vit: 96, agi: 96, dex: 96 }, '天才', 'int', 1)

    for (let i = 0; i < 8; i++) {
      testPet = testPet.synthesisWith(levePet, { childType: '天才', childMainAbiName: 'int', childeCharacter: 1 })
      testPet.display()
    }

    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  return (
    <div id="Pet">
      <div id="title">
        <div id="mianTitle">Pet</div>
        <div id="subTitle">宠物相关计算</div>
      </div>
      <div id="content">
        <div id="inputModule"></div>
        <div id="outModule"></div>
      </div>
    </div>
  )
}

function CharacterModule(): JSX.Element {
  useEffect(() => {
    const cLv = 1
    const cAbi: abi = {
      str: 1,
      int: 415,
      vit: 1,
      agi: 1,
      dex: 247
    }
    const cWeapon: wea = {
      type: '魔导',
      baseAtk: 320,
      stab: 60,
      refv: 15,
      dte: '光属性'
    }
    const cPermanentSkillList: permanentSkillList = [
      {
        name: '魔法要领',
        state: true,
        effectList: {
          mAtkR: 3,
          weaAtkR: 3
        }
      },
      {
        name: '远程狙击',
        state: true,
        effectList: {
          total: 10
        }
      }
    ]
    const character = new Character(cLv, cAbi, cWeapon, cPermanentSkillList)
    character.display()
    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  return (
    <div id="Character">
      <div id="title">
        <div id="mianTitle">Character</div>
        <div id="subTitle">= =</div>
      </div>
      <div id="content">
        <div id="inputModule"></div>
        <div id="outModule"></div>
      </div>
    </div>
  )
}

function Main(): JSX.Element {
  useEffect(() => {
    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  return (
    <div id="Main">
      <CharacterModule />
      <PetModule />
    </div>
  )
}

export default function GS(): JSX.Element {
  useEffect(() => {
    // 初始化
    window.dispatchEvent(new CustomEvent('ReactDomRender', { detail: 'base' }))
    return () => {
      // 组件卸载时需要做的事
    }
  }, [])

  return (
    <div id="GS">
      <Main />
      <Versions />
      <Filing />
    </div>
  )
}
