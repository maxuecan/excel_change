/*
 * @Author: maxuecan 623875282@qq.com
 * @Date: 2022-09-02 12:31:30
 * @LastEditors: maxuecan 623875282@qq.com
 * @LastEditTime: 2022-09-02 12:57:44
 * @FilePath: \新建文件夹3\新建文件夹\Multilingual_Packaging.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
let fs = require('fs') // 标准的文件操作
let path = require('path') // 处理文件路径
let xlsx = require('node-xlsx'); // 读取xlsx格式文件
let stat = fs.stat; // 获取文件信息
const modules = path.join(__dirname) + '\\'; // 绝对路径

let fileName = ['a', 'b', 'c'] // 对应文件目录
let language = ['zh', 'en', 'vi', 'ms', 'id', 'th'] // 输出文件名称
let array = [] // 数据

// 解析xlsx文件
let xlsxData = xlsx.parse(fs.readFileSync('测试.xlsx'))

function setData(arr1) {
  let golbal = {
    zh_data: {},// zh
    en_data: {},// en
    vi_data: {},// vi
    ms_data: {},// ms
    id_data: {},// id
    th_data: {},// th
  }
  for(let i = 0; i < arr1.length; i++) {
    golbal.zh_data[arr1[i][1].split(":")[0]] = arr1[i][0] // zh
    golbal.en_data[arr1[i][1].split(":")[0]] = arr1[i][2] // en
    golbal.vi_data[arr1[i][1].split(":")[0]] = arr1[i][4] // vi
    golbal.ms_data[arr1[i][1].split(":")[0]] = arr1[i][6] // ms
    golbal.id_data[arr1[i][1].split(":")[0]] = arr1[i][8] // id
    golbal.th_data[arr1[i][1].split(":")[0]] = arr1[i][10] // th
  }
  return golbal
}

// 创建对应目录
function createCatalogue() {
  for (let i = 0; i < fileName.length; i++) {
    let temp_v = xlsxData[i]['data'].slice(1)
    stat(modules + fileName[i], function(err, stats) {
      // 异步创建目录
      fs.mkdir(fileName[i], async (err) => {
        // 创建对应语言包js文件
        createFile(modules + fileName[i], setData(temp_v))
      })
      // 同步创建目录
      // if (typeof(stats) != object ) {
      //   fs.mkdirSync(modules + fileName[i])
      // }
    })
  }
}

// 创建对应文件
function createFile(path, golbal) {
  for (let i = 0; i < language.length; i++) {
    // fs.writeFile中data参数的类型必须为string或Buffer、TypedArray或DataView的实例
    fs.writeFile(path + '\\' + language[i] + '.js', JSON.stringify(golbal[language[i] + '_data']), (err) => {
      if (err) throw err
    })

    // Stream
    // var writerStream = fs.createWriteStream(path + '\\' + language[0] + '.js')
    // writerStream.write(JSON.stringify({gameName: {[a]: '1'}}), 'UTF8')
  }
}

createCatalogue()
