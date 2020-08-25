import './style/index.scss'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { Mesh } from 'three'
let STLLoader = require('three-stl-loader')(THREE)

let scene = new THREE.Scene() // 创建空场

// 添加坐标系
const addAxis = function() {
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
  return new Promise((resolve, reject) => {
    loader.load('./lib/fonts/typeface.json', font => {
      textArray.forEach(text => {
        const geometry = new THREE.TextGeometry(text, {
          font: font,
          size: 80,
          height: 5,
        })

        outGeometry.merge(geometry, geometry.matrix)
      })
      resolve(outGeometry)
    })
  })
}
// 添加文字
loadText({text: '123'}).then(geometry => {
  const material = new THREE.MeshBasicMaterial({ color: 0x999999 })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
})

function createCamera() {
  let width = window.innerWidth; //窗口宽度
  let height = window.innerHeight; //窗口高度
  let camera = new THREE.PerspectiveCamera(35, width / height, 1, 10000)
  camera.position.set(200, 300, 200); //设置相机位置
  camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
  return camera
}

function initWEBGL(scene, camera) {
  let width = window.innerWidth //窗口宽度
  let height = window.innerHeight //窗口高度
  let renderer = new THREE.WebGLRenderer()
  renderer.setSize(width, height) //设置渲染区域尺寸
  renderer.setClearColor(0xf8f9fc, 1) //设置背景颜色
  //执行渲染操作   指定场景、相机作为参数
  document.getElementById('app').appendChild(renderer.domElement) //body元素中插入canvas对象
  function render() {
    renderer.render(scene, camera)
  }
  render()
  
  let controls = new OrbitControls(camera, renderer.domElement)
  controls.enablePan = false
  controls.addEventListener('change', render)
  return { renderer, camera }
}
let camera = createCamera()
const { renderer } = initWEBGL(scene, camera)



