import './style/index.scss'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import STLExporter from 'three-stlexporter'
let STLLoader = require('three-stl-loader')(THREE)

let scene = new THREE.Scene() // 创建空场
// 创建渲染元素
let width = window.innerWidth //窗口宽度
let height = window.innerHeight //窗口高度
let renderer = new THREE.WebGLRenderer()
renderer.setSize(width, height) //设置渲染区域尺寸
renderer.setClearColor(0xf8f9fc, 1) //设置背景颜色

// 创建相机
function createCamera() {
  let width = window.innerWidth; //窗口宽度
  let height = window.innerHeight; //窗口高度
  let camera = new THREE.PerspectiveCamera(35, width / height, 1, 10000)
  camera.position.set(200, 300, 200); //设置相机位置
  camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
  return camera
}

let textOptions = {
  text: '请输入你的文字',
  distance: 0,
  size: 3.2,
  thick: 0.5
}

// 添加坐标系
const addAxis = function () {
  return new THREE.AxesHelper(200, 200, 200)
}
scene.add(addAxis())

// 添加stl模型
function loadStl(url) {
  return new Promise((resolve, reject) => {
    try {
      const loader = new STLLoader()
      loader.load(url, geometry => {
        resolve(geometry)
      })
    } catch (err) {
      reject(err)
    }
  })
}

// 加载文字模型
function loadText(opstions) {
  const textArray = opstions.text.split('')
  const loader = new THREE.FontLoader()
  const outGeometry = new THREE.Geometry()
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 })
  let curX = 0, textlen = 0, startx = 0
  return new Promise((resolve, reject) => {
    loader.load('./lib/fonts/typeface.json', font => {
      textArray.forEach((text, i) => {
        const geometry = new THREE.TextGeometry(text, {
          font: font,
          size: opstions.size,
          height: opstions.thick,
        })
        geometry.computeBoundingBox()
        const { max, min } = geometry.boundingBox
        textlen = max.x - min.x
        const mesh = new THREE.Mesh(geometry, textMaterial)
        if (i > 0) {
          startx = curX + (opstions.distance || 1)
        } else {
          startx = 0
        }
        mesh.translateX(startx)
        mesh.updateMatrix();
        curX = startx + textlen
        outGeometry.merge(mesh.geometry, mesh.matrix)
      })
      resolve(outGeometry)
    })
  })
}
// 添加文字
function GenerateText() {
  if (scene.children.filter(item => item instanceof THREE.Mesh).length) {
    scene.remove(...scene.children.filter(item => item instanceof THREE.Mesh))
  }
  loadText(textOptions).then(geometry => {
    const material = new THREE.MeshBasicMaterial({ color: 0x999999 })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    render()
  })
}
GenerateText()

/**
 * 获取元素注册事件
 */

function InitPageEvent() {
  const fontTextInput = document.getElementById('text')
  const fontSizeInput = document.getElementById('size')
  const fontDistanceInput = document.getElementById('distance')
  const fontThickInput = document.getElementById('thick')
  const confirm = document.getElementById('confirm')
  const exportDom = document.getElementById('export')
  fontTextInput.addEventListener('change', function (e) {
    const { dataset, value } = e.target
    setFontAttr(dataset.attr, value)
  })
  fontSizeInput.addEventListener('change', function (e) {
    const { dataset, value } = e.target
    setFontAttr(dataset.attr, Number(value))
  })
  fontDistanceInput.addEventListener('change', function (e) {
    const { dataset, value } = e.target
    setFontAttr(dataset.attr, Number(value))
  })
  fontThickInput.addEventListener('change', function (e) {
    const { dataset, value } = e.target
    setFontAttr(dataset.attr, Number(value))
  })
  confirm.addEventListener('click', function (e) {
    GenerateText()
  })
  exportDom.addEventListener('click', function (e) {
    exportText()
  })
}

// 导出字体
function exportText() {
  const sceneCopy = scene.clone()
  const exportMesh = sceneCopy.children.find(item => !(item instanceof THREE.Mesh))
  sceneCopy.remove(exportMesh)
  const exporter = new STLExporter()
  const exportResult = exporter.parse(sceneCopy)
  const blob = new Blob([exportResult], { type: 'text/plain' })
  downloadFile(`${new Date().getTime()}.stl`, blob)
}

function setFontAttr(key, value) {
  textOptions[key] = value
}

let camera = createCamera()
function render() {
  renderer.render(scene, camera)
}

function initWEBGL() {
  //执行渲染操作   指定场景、相机作为参数
  document.getElementById('app').appendChild(renderer.domElement) //body元素中插入canvas对象
  // 注册页面事件
  InitPageEvent()
  render()

  let controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.addEventListener('change', render)

  return { renderer, camera }
}
initWEBGL()

// 下载方法
function downloadFile(name, blob) {
  const alink = document.createElement('a')
  alink.download = name
  console.log(blob);
  alink.href = URL.createObjectURL(blob)
  alink.click()
}