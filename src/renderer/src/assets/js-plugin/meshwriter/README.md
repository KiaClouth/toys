#### 更换字步骤

将.ttf格式的字体文件放入font/文件夹

修改index.js里的config对象

项目根目录下运行指令：node index.js

然后将生成的meshwriter.ES.ts和dist文件夹一起复制到项目中

import MeshWriter from 'meshwriter.ES'后

const writerName = new Writer('想要生成的文案', {

          'font-family': '字体名称', // 名称注意大小写，和font文件夹下的文件名一致

          'letter-height': 决定字体大小,

          'letter-thickness': 厚度

        }) as Writer

const writerNameMesh = writerName.getMesh()!

writerNameMesh就是字体mesh了
