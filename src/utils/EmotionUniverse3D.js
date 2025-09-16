/**
 * 3D情绪宇宙 - WebGL渲染引擎
 * 基于Three.js实现的情绪状态3D可视化
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class EmotionUniverse3D {
  constructor(container) {
    this.container = container
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    
    this.emotionPlanets = {}
    this.particleSystems = {}
    this.animationId = null
    this.isInitialized = false
    this.controls = null
    this.hoveredPlanet = null
    this.isDragging = false
    this.dragStartTime = 0
    
    // 情绪颜色映射
    this.emotionColors = {
      happy: 0xFFD700,      // 金黄色 - 开心
      sad: 0x4169E1,        // 皇家蓝 - 悲伤
      angry: 0xFF6347,      // 番茄红 - 愤怒
      anxious: 0xFF1493,    // 深粉红 - 焦虑
      calm: 0x98FB98,       // 淡绿色 - 平静
      excited: 0xFF69B4,    // 热粉红 - 兴奋
      neutral: 0xC0C0C0,    // 银色 - 中性
      fear: 0x8A2BE2,       // 蓝紫色 - 恐惧
      disgust: 0x9ACD32,    // 黄绿色 - 厌恶
      surprise: 0xFFB6C1,   // 浅粉红 - 惊讶
      // 中文情绪映射
      开心: 0xFFD700,
      兴奋: 0xFF69B4,
      中性: 0xC0C0C0,
      恐惧: 0x8A2BE2,
      庆祝: 0xFFD700,
      惊讶: 0xFFB6C1
    }
    
    // 中文到英文的情绪映射
    this.emotionNameMapping = {
      开心: 'happy',
      兴奋: 'excited', 
      中性: 'neutral',
      恐惧: 'fear',
      庆祝: 'happy', // 庆祝映射到开心
      惊讶: 'surprise'
    }
    
    // 鼠标控制
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.selectedPlanet = null
    
    this.init().catch(error => {
      console.error('❌ 3D宇宙初始化异常:', error)
      this.showFallbackMessage(error.message)
    })
  }
  
  async init() {
    if (this.isInitialized) return
    
    try {
      console.log('🔍 开始详细检查容器状态...')
      
      // 详细检查容器状态
      if (!this.container) {
        throw new Error('❌ 容器对象为null或undefined')
      }
      
      console.log('✅ 容器对象存在:', this.container)
      console.log('📏 容器类名:', this.container.className)
      console.log('📐 容器样式:', this.container.style.cssText)
      console.log('🔗 容器父元素:', this.container.parentElement)
      
      // 安全获取尺寸的函数
      const getSafeDimensions = (element) => {
        try {
          if (!element) return { width: 0, height: 0 }
          
          const width = element.clientWidth || element.offsetWidth || 0
          const height = element.clientHeight || element.offsetHeight || 0
          
          console.log(`📊 元素尺寸检测:`, {
            clientWidth: element.clientWidth,
            clientHeight: element.clientHeight,
            offsetWidth: element.offsetWidth,
            offsetHeight: element.offsetHeight,
            computed: { width, height }
          })
          
          return { width, height }
        } catch (error) {
          console.error('❌ 获取元素尺寸失败:', error)
          return { width: 0, height: 0 }
        }
      }
      
      // 获取容器尺寸
      let { width, height } = getSafeDimensions(this.container)
      
      // 如果容器尺寸为0，尝试多种方法获取正确尺寸
      if (width === 0 || height === 0) {
        console.warn('⚠️ 容器尺寸为0，开始修复...')
        
        // 方法1: 强制设置样式
        try {
          this.container.style.cssText += 'display: block !important; width: 100% !important; height: 500px !important;'
          console.log('🔧 强制设置容器样式')
          
          // 等待重新计算
          await new Promise(resolve => {
            requestAnimationFrame(() => {
              setTimeout(resolve, 100)
            })
          })
          
          const newDims = getSafeDimensions(this.container)
          width = newDims.width
          height = newDims.height
          
        } catch (error) {
          console.error('❌ 强制设置样式失败:', error)
        }
        
        // 方法2: 使用父元素尺寸
        if ((width === 0 || height === 0) && this.container.parentElement) {
          console.log('🔄 尝试使用父元素尺寸...')
          const parentDims = getSafeDimensions(this.container.parentElement)
          
          if (parentDims.width > 0) width = parentDims.width
          if (parentDims.height > 0) height = parentDims.height
        }
        
        // 方法3: 使用默认尺寸
        if (width === 0 || height === 0) {
          console.warn('🔧 使用默认尺寸')
          width = width || 800
          height = height || 600
        }
      }
      
      console.log('🌌 最终确定尺寸:', width, 'x', height)
      
      // 验证尺寸有效性
      if (width <= 0 || height <= 0) {
        throw new Error(`❌ 无效的渲染尺寸: ${width}x${height}`)
      }
      
      // 设置渲染器
      this.renderer.setSize(width, height)
      this.renderer.setClearColor(0x000011, 0.8)
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      
      // 设置相机宽高比
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      
      // 设置Canvas样式确保可见
      const canvas = this.renderer.domElement
      canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        z-index: 1;
        pointer-events: auto;
        background: transparent;
      `
      
      this.container.appendChild(canvas)
      
      console.log('✅ Canvas已添加到容器:', {
        canvas: canvas,
        container: this.container,
        canvasSize: { width: canvas.width, height: canvas.height },
        canvasStyle: canvas.style.cssText,
        containerSize: {
          width: this.container.clientWidth,
          height: this.container.clientHeight
        }
      })
      
      // 强制重绘
      this.container.style.transform = 'translateZ(0)'
    
    // 设置相机位置 - 调整角度更好观察星球
    this.camera.position.set(20, 15, 25)
    this.camera.lookAt(0, 0, 0)
    
    // 初始化轨道控制器 - 提供3D交互
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true // 启用阻尼（惯性）
    this.controls.dampingFactor = 0.05 // 阻尼系数
    this.controls.screenSpacePanning = false // 禁用屏幕空间平移
    this.controls.minDistance = 5 // 最小距离
    this.controls.maxDistance = 100 // 最大距离
    this.controls.maxPolarAngle = Math.PI // 允许完全旋转
    this.controls.autoRotate = false // 自动旋转关闭
    this.controls.autoRotateSpeed = 0.5 // 自动旋转速度
    this.controls.enablePan = true // 启用平移
    this.controls.enableZoom = true // 启用缩放
    this.controls.enableRotate = true // 启用旋转
    
    // 添加控制器事件监听
    this.controls.addEventListener('start', () => {
      console.log('🎮 开始拖拽')
      this.renderer.domElement.style.cursor = 'grabbing'
    })
    
    this.controls.addEventListener('end', () => {
      console.log('🎮 结束拖拽')
      this.renderer.domElement.style.cursor = 'grab'
    })
    
    this.controls.addEventListener('change', () => {
      // 控制器变化时触发渲染
      if (this.isInitialized) {
        this.renderer.render(this.scene, this.camera)
      }
    })
    
    console.log('🎮 3D轨道控制器已初始化', {
      enableRotate: this.controls.enableRotate,
      enableZoom: this.controls.enableZoom,
      enablePan: this.controls.enablePan,
      minDistance: this.controls.minDistance,
      maxDistance: this.controls.maxDistance
    })
    
    // 增强光照系统以突出3D立体效果
    
    // 环境光 - 降低强度让阴影更明显
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3)
    this.scene.add(ambientLight)
    
    // 主方向光 - 增强立体感
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(15, 20, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 4096
    directionalLight.shadow.mapSize.height = 4096
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 100
    directionalLight.shadow.camera.left = -50
    directionalLight.shadow.camera.right = 50
    directionalLight.shadow.camera.top = 50
    directionalLight.shadow.camera.bottom = -50
    this.scene.add(directionalLight)
    
    // 侧光源 - 增强球体轮廓
    const sideLight = new THREE.DirectionalLight(0x8888ff, 0.6)
    sideLight.position.set(-15, 5, -10)
    this.scene.add(sideLight)
    
    // 背光源 - 创建边缘光效果
    const rimLight = new THREE.DirectionalLight(0xffaa88, 0.4)
    rimLight.position.set(0, -10, -15)
    this.scene.add(rimLight)
    
    // 点光源 - 动态照明
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100)
    pointLight.position.set(-10, -10, -10)
    pointLight.castShadow = true
    this.scene.add(pointLight)
    
    // 创建星空背景
    this.createStarField()
    
    // 创建中心能量场
    this.createCenterEnergyField()
    
    // 添加事件监听
    this.addEventListeners()
    
    // 开始渲染循环
    this.animate()
    
    this.isInitialized = true
    console.log('🌌 3D情绪宇宙初始化完成')
    
    // 立即进行一次渲染确保可见
    this.renderer.render(this.scene, this.camera)
    
    // 验证Canvas是否正确显示
    setTimeout(() => {
      const canvas = this.renderer.domElement
      console.log('🔍 Canvas最终状态检查:', {
        attached: document.body.contains(canvas),
        visible: canvas.style.display !== 'none',
        size: { width: canvas.clientWidth, height: canvas.clientHeight },
        parent: canvas.parentElement,
        computedStyle: window.getComputedStyle(canvas)
      })
    }, 100)
      
      // 创建测试用的多个情绪星球
      console.log('✅ 3D引擎就绪，创建测试情绪星球...')
      
      // 根据界面显示的情绪数据创建星球
      const testEmotionData = {
        兴奋: 0.62,    // 62%
        中性: 0.55,    // 55% 
        恐惧: 0.74,    // 74%
        庆祝: 0.23,    // 23%
        惊讶: 0.73     // 73%
      }
      
      console.log('📊 测试情绪数据:', testEmotionData)
      
      // 使用updateEmotionData方法创建所有星球
      this.updateEmotionData(testEmotionData)
      
      console.log('🌟 多个情绪星球已创建')
      console.log('🔍 场景中的对象数量:', this.scene.children.length)
      console.log('🔍 当前星球列表:', Object.keys(this.emotionPlanets))
      
      // 强制立即渲染一次
      this.renderer.render(this.scene, this.camera)
      console.log('🎬 强制渲染完成')
      
    } catch (error) {
      console.error('❌ 3D情绪宇宙初始化失败:', error)
      this.showFallbackMessage(error.message)
    }
  }
  
  createStarField() {
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 3000
    const positions = new Float32Array(starCount * 3)
    const colors = new Float32Array(starCount * 3)
    
    for (let i = 0; i < starCount * 3; i += 3) {
      // 随机分布在球体内
      const radius = Math.random() * 100 + 50
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = radius * Math.cos(phi)
      
      // 随机颜色
      const color = new THREE.Color()
      color.setHSL(Math.random(), 0.5, Math.random() * 0.5 + 0.5)
      colors[i] = color.r
      colors[i + 1] = color.g
      colors[i + 2] = color.b
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.5,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    })
    
    const stars = new THREE.Points(starGeometry, starMaterial)
    this.scene.add(stars)
    this.starField = stars
  }
  
  createCenterEnergyField() {
    // 创建中心能量场
    const geometry = new THREE.SphereGeometry(0.5, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    })
    
    this.centerCore = new THREE.Mesh(geometry, material)
    this.scene.add(this.centerCore)
    
    // 创建能量环
    const ringGeometry = new THREE.RingGeometry(2, 2.2, 32)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    })
    
    this.energyRing = new THREE.Mesh(ringGeometry, ringMaterial)
    this.energyRing.rotation.x = Math.PI / 2
    this.scene.add(this.energyRing)
  }
  
  createEmotionPlanet(emotionType, intensity, color) {
    // 如果行星已存在，更新它
    if (this.emotionPlanets[emotionType]) {
      this.updateEmotionPlanet(emotionType, intensity)
      return this.emotionPlanets[emotionType]
    }
    
    // 创建情绪星球 - 高质量3D球体
    const radius = Math.max(2.0, intensity * 4) // 进一步增大基础半径
    const geometry = new THREE.SphereGeometry(radius, 64, 64) // 增加分段数获得更圆滑的球体
    
    // 创建真正的3D材质 - 强调立体感
    const effectiveColor = color || this.emotionColors[emotionType] || 0xffffff
    const baseColor = new THREE.Color(effectiveColor)
    
    // 使用MeshStandardMaterial获得更好的3D效果
    const material = new THREE.MeshStandardMaterial({
      color: baseColor,
      transparent: false,
      opacity: 1.0,
      metalness: 0.3, // 轻微金属感
      roughness: 0.4, // 适中的粗糙度
      emissive: baseColor.clone().multiplyScalar(0.1),
      emissiveIntensity: Math.max(0.1, intensity * 0.3),
      flatShading: false,
      wireframe: false
    })
    
    // 添加法线贴图效果（程序生成）
    this.addPlanetSurfaceDetails(material, radius)
    
    // 添加第二层外发光效果
    const glowGeometry = new THREE.SphereGeometry(radius * 1.2, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: effectiveColor,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    })
    
    console.log(`🎨 星球材质参数: ${emotionType}`, {
      radius,
      color: effectiveColor.toString(16),
      segments: '64x64 (高质量球体)',
      material: 'MeshLambertMaterial (3D立体效果)'
    })
    
    // 创建主星球
    const planet = new THREE.Mesh(geometry, material)
    planet.castShadow = true
    planet.receiveShadow = true
    
    // 添加外发光层
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial)
    planet.add(glowSphere)
    
    // 添加用户数据
    planet.userData = {
      emotionType,
      intensity,
      originalRadius: radius
    }
    
    // 添加粒子环
    const particleRing = this.createParticleRing(radius * 1.8, color || this.emotionColors[emotionType], intensity)
    planet.add(particleRing)
    
    // 设置位置（3D球体分布） - 让星球在3D空间中更自然分布
    const planetCount = Object.keys(this.emotionPlanets).length
    
    // 使用黄金角度创建更均匀的3D分布
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // 黄金角度
    const currentIndex = planetCount - 1
    
    // 基于强度调整距离
    const baseDistance = 12
    const intensityFactor = 1 + (intensity - 0.5) * 0.5 // 强度越高距离稍远
    const distance = baseDistance * intensityFactor
    
    // 球体表面均匀分布
    const theta = currentIndex * goldenAngle
    const phi = Math.acos(1 - 2 * (currentIndex + 0.5) / Math.max(8, Object.keys(this.emotionColors).length))
    
    const x = distance * Math.sin(phi) * Math.cos(theta)
    const y = distance * Math.cos(phi) 
    const z = distance * Math.sin(phi) * Math.sin(theta)
    
    planet.position.set(x, y, z)
    
    console.log(`🌍 星球位置: ${emotionType} at (${planet.position.x.toFixed(2)}, ${planet.position.y.toFixed(2)}, ${planet.position.z.toFixed(2)}), 距离: ${distance.toFixed(2)}`)
    
    // 添加轨道路径
    this.createOrbitPath(planet, distance)
    
    this.scene.add(planet)
    this.emotionPlanets[emotionType] = planet
    
    console.log(`🪐 创建情绪星球: ${emotionType}, 强度: ${intensity}`)
    return planet
  }
  
  createParticleRing(radius, color, intensity) {
    const particleCount = Math.floor(intensity * 150 + 50)
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      const angle = (i / particleCount) * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * 2
      const height = (Math.random() - 0.5) * 3
      
      positions[i3] = Math.cos(angle) * r
      positions[i3 + 1] = height
      positions[i3 + 2] = Math.sin(angle) * r
      
      velocities[i3] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02
      
      sizes[i] = Math.random() * 0.1 + 0.05
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    
    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    })
    
    const particles = new THREE.Points(geometry, material)
    particles.userData = { isParticleRing: true }
    
    // 禁用射线检测，避免被点击
    particles.raycast = () => {}
    
    return particles
  }
  
  addPlanetSurfaceDetails(material, radius) {
    // 创建程序生成的法线贴图以增强3D表面细节
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const context = canvas.getContext('2d')
    
    // 生成噪声纹理
    const imageData = context.createImageData(512, 512)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % 512
      const y = Math.floor((i / 4) / 512)
      
      // 简单的噪声函数
      const noise = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 
                   Math.sin(x * 0.05) * Math.cos(y * 0.05) * 127 + 128
      
      data[i] = 128 + noise * 0.2     // R - X法线
      data[i + 1] = 128 + noise * 0.2 // G - Y法线  
      data[i + 2] = 255               // B - Z法线 (向外)
      data[i + 3] = 255               // A - 透明度
    }
    
    context.putImageData(imageData, 0, 0)
    
    // 创建法线贴图
    const normalTexture = new THREE.CanvasTexture(canvas)
    normalTexture.wrapS = THREE.RepeatWrapping
    normalTexture.wrapT = THREE.RepeatWrapping
    material.normalMap = normalTexture
    material.normalScale = new THREE.Vector2(0.3, 0.3)
    
    console.log('🎨 添加了表面细节纹理')
  }

  createOrbitPath(planet, distance) {
    // 创建轨道路径
    const orbitGeometry = new THREE.RingGeometry(distance - 0.1, distance + 0.1, 64)
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    })
    
    const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial)
    orbitRing.rotation.x = Math.PI / 2
    orbitRing.position.y = 0
    
    this.scene.add(orbitRing)
    planet.userData.orbitRing = orbitRing
  }
  
  updateEmotionPlanet(emotionType, intensity) {
    const planet = this.emotionPlanets[emotionType]
    if (!planet) return
    
    // 平滑更新大小
    const targetScale = Math.max(0.3, intensity * 1.5)
    const currentScale = planet.scale.x
    const newScale = currentScale + (targetScale - currentScale) * 0.1
    planet.scale.setScalar(newScale)
    
    // 更新发光强度
    planet.material.emissiveIntensity = intensity * 0.3
    planet.material.opacity = Math.max(0.5, intensity)
    
    // 更新用户数据
    planet.userData.intensity = intensity
    
    console.log(`🔄 更新情绪星球: ${emotionType}, 强度: ${intensity}`)
  }
  
  updateEmotionData(emotionData) {
    if (!emotionData || typeof emotionData !== 'object') return
    
    console.log('📊 更新情绪数据:', emotionData)
    console.log('📊 数据类型检查:', Object.entries(emotionData).map(([emotion, intensity]) => ({
      emotion,
      intensity,
      type: typeof intensity,
      isNumber: typeof intensity === 'number',
      isPositive: intensity > 0
    })))
    
    // 更新或创建情绪星球 - 降低最小阈值
    Object.entries(emotionData).forEach(([emotion, intensity]) => {
      if (typeof intensity === 'number' && intensity > 0.05) { // 降低阈值从0改为0.05
        
        // 处理中文情绪名称映射
        const englishEmotion = this.emotionNameMapping[emotion] || emotion
        const planetKey = emotion // 使用原始名称作为key
        
        if (this.emotionPlanets[planetKey]) {
          this.updateEmotionPlanet(planetKey, intensity)
        } else {
          // 确保颜色存在 - 先尝试原始名称，再尝试英文映射
          const color = this.emotionColors[emotion] || this.emotionColors[englishEmotion] || 0xC0C0C0
          console.log(`🌟 创建新星球: ${emotion} (${englishEmotion}), 强度: ${intensity}, 颜色: ${color.toString(16)}`)
          this.createEmotionPlanet(planetKey, intensity, color)
        }
      } else if (typeof intensity === 'number') {
        console.log(`⚠️ 强度过低，跳过创建: ${emotion} = ${intensity}`)
      }
    })
    
    // 移除强度过低的星球
    Object.keys(this.emotionPlanets).forEach(emotion => {
      if (!emotionData[emotion] || emotionData[emotion] <= 0.05) {
        this.removeEmotionPlanet(emotion)
      }
    })
    
    console.log('✅ 当前活跃星球:', Object.keys(this.emotionPlanets))
    console.log('✅ 活跃星球详情:', Object.keys(this.emotionPlanets).map(emotion => ({
      emotion,
      intensity: emotionData[emotion],
      planet: this.emotionPlanets[emotion],
      position: this.emotionPlanets[emotion] ? this.emotionPlanets[emotion].position : null
    })))
    
    // 调试场景信息
    this.debugScene()
  }
  
  removeEmotionPlanet(emotionType) {
    const planet = this.emotionPlanets[emotionType]
    if (!planet) return
    
    // 移除轨道
    if (planet.userData.orbitRing) {
      this.scene.remove(planet.userData.orbitRing)
      planet.userData.orbitRing.geometry.dispose()
      planet.userData.orbitRing.material.dispose()
    }
    
    // 移除星球
    this.scene.remove(planet)
    planet.geometry.dispose()
    planet.material.dispose()
    
    // 清理粒子系统
    planet.children.forEach(child => {
      if (child.userData.isParticleRing) {
        child.geometry.dispose()
        child.material.dispose()
      }
    })
    
    delete this.emotionPlanets[emotionType]
    console.log(`🗑️ 移除情绪星球: ${emotionType}`)
  }
  
  addEventListeners() {
    const canvas = this.renderer.domElement
    
    // 确保Canvas可以接收事件
    canvas.style.pointerEvents = 'auto'
    canvas.style.cursor = 'grab'
    
    // 鼠标移动 - 更新鼠标位置并检测悬停
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect()
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      // 只有在不拖拽时才检测悬停
      if (!this.isDragging) {
        this.onMouseMove(event)
      }
    })
    
    // 鼠标按下 - 标记开始拖拽
    canvas.addEventListener('mousedown', (event) => {
      this.isDragging = false
      this.dragStartTime = Date.now()
    })
    
    // 鼠标抬起 - 检查是否为点击
    canvas.addEventListener('mouseup', (event) => {
      const dragDuration = Date.now() - this.dragStartTime
      const isClick = dragDuration < 200 && !this.isDragging // 200ms内且没有拖拽
      
      if (isClick) {
        console.log('🖱️ 检测到点击事件')
        this.onPlanetClick(event)
      }
      
      this.isDragging = false
    })
    
    // 鼠标离开
    canvas.addEventListener('mouseleave', () => {
      this.clearHover()
      this.isDragging = false
    })
    
    // 窗口大小变化
    window.addEventListener('resize', () => {
      this.onWindowResize()
    })
    
    // 监听控制器的拖拽状态
    if (this.controls) {
      this.controls.addEventListener('start', () => {
        this.isDragging = true
        canvas.style.cursor = 'grabbing'
      })
      
      this.controls.addEventListener('end', () => {
        setTimeout(() => {
          this.isDragging = false
          canvas.style.cursor = 'grab'
        }, 50) // 延迟一点避免误触发点击
      })
    }
    
    console.log('🎮 事件监听器已设置', {
      canvas: canvas,
      pointerEvents: canvas.style.pointerEvents,
      cursor: canvas.style.cursor
    })
  }
  
  onMouseMove(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const planets = Object.values(this.emotionPlanets)
    
    if (planets.length === 0) return
    
    const intersects = this.raycaster.intersectObjects(planets)
    
    if (intersects.length > 0) {
      const targetPlanet = intersects[0].object
      
      // 如果是新的悬停目标
      if (this.hoveredPlanet !== targetPlanet) {
        // 清除之前的悬停效果
        this.clearHover()
        
        // 设置新的悬停效果
        this.hoveredPlanet = targetPlanet
        this.applyHoverEffect(targetPlanet)
        
        // 改变鼠标样式
        this.renderer.domElement.style.cursor = 'pointer'
      }
    } else {
      // 没有悬停任何星球
      this.clearHover()
      this.renderer.domElement.style.cursor = 'grab'
    }
  }
  
  applyHoverEffect(planet) {
    if (!planet || !planet.material) return
    
    // 保存原始值
    if (!planet.userData.originalEmissiveIntensity) {
      planet.userData.originalEmissiveIntensity = planet.material.emissiveIntensity
      planet.userData.originalScale = planet.scale.x
    }
    
    // 应用悬停效果
    planet.material.emissiveIntensity = Math.min(1.0, planet.userData.originalEmissiveIntensity * 1.5)
    planet.scale.setScalar(planet.userData.originalScale * 1.1)
  }
  
  clearHover() {
    if (this.hoveredPlanet && this.hoveredPlanet.material) {
      // 恢复原始效果
      if (this.hoveredPlanet.userData.originalEmissiveIntensity !== undefined) {
        this.hoveredPlanet.material.emissiveIntensity = this.hoveredPlanet.userData.originalEmissiveIntensity
      }
      if (this.hoveredPlanet.userData.originalScale !== undefined) {
        this.hoveredPlanet.scale.setScalar(this.hoveredPlanet.userData.originalScale)
      }
    }
    this.hoveredPlanet = null
    this.renderer.domElement.style.cursor = 'grab'
  }

  onPlanetClick(event) {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    const planets = Object.values(this.emotionPlanets)
    
    // 递归获取所有可能的交互对象（包括星球的子对象）
    const allObjects = []
    planets.forEach(planet => {
      allObjects.push(planet)
      // 添加星球的子对象（但过滤掉粒子环）
      planet.children.forEach(child => {
        if (!child.userData.isParticleRing) {
          allObjects.push(child)
        }
      })
    })
    
    const intersects = this.raycaster.intersectObjects(allObjects)
    
    if (intersects.length > 0) {
      let targetPlanet = intersects[0].object
      
      // 如果点击的是子对象，找到父级星球
      if (targetPlanet.parent && this.emotionPlanets[targetPlanet.parent.userData?.emotionType]) {
        targetPlanet = targetPlanet.parent
      }
      
      // 调试信息
      console.log('🎯 点击的对象信息:', {
        clickedObject: intersects[0].object,
        userData: intersects[0].object.userData,
        targetPlanet: targetPlanet,
        planetUserData: targetPlanet.userData
      })
      
      // 验证是否是有效的星球
      if (!targetPlanet.userData.emotionType) {
        console.warn('⚠️ 点击的不是有效星球，忽略点击')
        return
      }
      
      const emotionType = targetPlanet.userData.emotionType
      const intensity = targetPlanet.userData.intensity
      
      // 触发事件
      this.onPlanetSelected && this.onPlanetSelected({
        emotion: emotionType,
        intensity: intensity || 0,
        planet: targetPlanet
      })
      
      // 高亮效果
      this.highlightPlanet(targetPlanet)
    }
  }
  
  highlightPlanet(planet) {
    // 重置之前的高亮
    if (this.selectedPlanet && this.selectedPlanet !== planet) {
      this.selectedPlanet.material.emissiveIntensity = this.selectedPlanet.userData.intensity * 0.3
    }
    
    // 设置新的高亮
    this.selectedPlanet = planet
    planet.material.emissiveIntensity = 0.8
    
    // 3秒后恢复
    setTimeout(() => {
      if (this.selectedPlanet === planet) {
        planet.material.emissiveIntensity = planet.userData.intensity * 0.3
        this.selectedPlanet = null
      }
    }, 3000)
  }
  
  onWindowResize() {
    if (!this.container) return
    
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }
  
  animate() {
    if (!this.isInitialized) return
    
    this.animationId = requestAnimationFrame(() => this.animate())
    
    // 更新控制器
    if (this.controls) {
      this.controls.update()
    }
    
    const time = Date.now() * 0.001
    
    // 旋转星空
    if (this.starField) {
      this.starField.rotation.y += 0.0005
    }
    
    // 旋转中心能量场
    if (this.centerCore) {
      this.centerCore.rotation.x += 0.01
      this.centerCore.rotation.y += 0.015
    }
    
    if (this.energyRing) {
      this.energyRing.rotation.z += 0.02
    }
    
    // 旋转和移动星球
    Object.values(this.emotionPlanets).forEach((planet, index) => {
      // 自转
      planet.rotation.y += 0.01 + index * 0.002
      
      // 轨道运动
      const orbitSpeed = 0.2 + index * 0.05
      const currentPos = planet.position.clone()
      const distance = Math.sqrt(currentPos.x ** 2 + currentPos.z ** 2)
      
      planet.position.x = Math.cos(time * orbitSpeed + index) * distance
      planet.position.z = Math.sin(time * orbitSpeed + index) * distance
      planet.position.y += Math.sin(time * 2 + index) * 0.01 // 轻微上下浮动
      
      // 更新粒子系统
      planet.children.forEach(child => {
        if (child.userData.isParticleRing) {
          this.updateParticles(child)
        }
      })
    })
    
    // 相机由轨道控制器控制，不需要手动摆动
    // 只有在没有用户交互时才启用轻微的自动旋转
    if (this.controls && !this.controls.autoRotate) {
      // 可以在这里添加一些微妙的效果，但不干扰用户控制
    }
    
    this.renderer.render(this.scene, this.camera)
  }
  
  updateParticles(particles) {
    const positions = particles.geometry.attributes.position.array
    const velocities = particles.geometry.attributes.velocity.array
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i]
      positions[i + 1] += velocities[i + 1]
      positions[i + 2] += velocities[i + 2]
      
      // 边界检查和重置
      const distance = Math.sqrt(
        positions[i] ** 2 + 
        positions[i + 1] ** 2 + 
        positions[i + 2] ** 2
      )
      
      if (distance > 15) {
        const angle = Math.random() * Math.PI * 2
        const radius = 3 + Math.random() * 2
        positions[i] = Math.cos(angle) * radius
        positions[i + 1] = (Math.random() - 0.5) * 2
        positions[i + 2] = Math.sin(angle) * radius
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true
  }
  
  // 设置相机位置
  setCameraPosition(x, y, z) {
    this.camera.position.set(x, y, z)
    this.camera.lookAt(0, 0, 0)
  }
  
  // 获取情绪统计
  getEmotionStats() {
    const stats = {}
    Object.entries(this.emotionPlanets).forEach(([emotion, planet]) => {
      stats[emotion] = {
        intensity: planet.userData.intensity,
        position: planet.position.clone(),
        scale: planet.scale.x
      }
    })
    return stats
  }
  
  // 切换自动旋转
  toggleAutoRotate() {
    if (this.controls) {
      this.controls.autoRotate = !this.controls.autoRotate
      console.log('🔄 自动旋转:', this.controls.autoRotate ? '开启' : '关闭')
      return this.controls.autoRotate
    }
    return false
  }
  
  // 重置相机位置
  resetCamera() {
    if (this.controls) {
      this.controls.reset()
      console.log('📷 相机位置已重置')
    }
  }
  
  // 测试交互功能
  testInteraction() {
    console.log('🧪 测试3D交互功能:')
    console.log('- 轨道控制器:', this.controls ? '✅' : '❌')
    console.log('- 可旋转:', this.controls?.enableRotate ? '✅' : '❌')
    console.log('- 可缩放:', this.controls?.enableZoom ? '✅' : '❌')
    console.log('- 可平移:', this.controls?.enablePan ? '✅' : '❌')
    console.log('- Canvas事件:', this.renderer.domElement.style.pointerEvents)
    console.log('- 星球数量:', Object.keys(this.emotionPlanets).length)
    console.log('- 点击回调:', typeof this.onPlanetSelected)
    
    // 模拟点击测试
    if (Object.keys(this.emotionPlanets).length > 0) {
      const firstPlanet = Object.values(this.emotionPlanets)[0]
      console.log('🎯 模拟点击第一个星球:', firstPlanet.userData.emotionType)
      
      if (this.onPlanetSelected) {
        this.onPlanetSelected({
          emotion: firstPlanet.userData.emotionType,
          intensity: firstPlanet.userData.intensity,
          planet: firstPlanet
        })
      }
    }
  }
  
  // 清理资源
  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    // 清理所有星球
    Object.keys(this.emotionPlanets).forEach(emotion => {
      this.removeEmotionPlanet(emotion)
    })
    
    // 清理星空
    if (this.starField) {
      this.scene.remove(this.starField)
      this.starField.geometry.dispose()
      this.starField.material.dispose()
    }
    
    // 清理中心能量场
    if (this.centerCore) {
      this.scene.remove(this.centerCore)
      this.centerCore.geometry.dispose()
      this.centerCore.material.dispose()
    }
    
    if (this.energyRing) {
      this.scene.remove(this.energyRing)
      this.energyRing.geometry.dispose()
      this.energyRing.material.dispose()
    }
    
    // 清理渲染器
    if (this.renderer) {
      this.renderer.dispose()
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement)
      }
    }
    
    // 清理控制器
    if (this.controls) {
      this.controls.dispose()
      this.controls = null
    }
    
    // 移除事件监听
    window.removeEventListener('resize', this.onWindowResize)
    
    this.isInitialized = false
    console.log('🧹 3D情绪宇宙已清理')
  }
  
  debugScene() {
    console.log('🔍 场景调试信息:')
    console.log('- 场景子对象数量:', this.scene.children.length)
    console.log('- 场景子对象类型:', this.scene.children.map(child => ({
      type: child.type,
      name: child.name || 'unnamed',
      position: child.position,
      visible: child.visible,
      userData: child.userData
    })))
    console.log('- 相机位置:', this.camera.position)
    console.log('- 相机朝向:', this.camera.getWorldDirection(new THREE.Vector3()))
    console.log('- 星球对象:', Object.keys(this.emotionPlanets))
  }

  // 显示错误信息的后备方案
  showFallbackMessage(errorMessage) {
    if (this.container) {
      this.container.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
          color: white;
          text-align: center;
          padding: 40px;
          border-radius: 12px;
        ">
          <div style="font-size: 48px; margin-bottom: 20px;">🌌</div>
          <h3 style="color: #00d4ff; margin-bottom: 16px;">3D情绪宇宙加载中...</h3>
          <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
            正在初始化WebGL渲染引擎
          </p>
          <div style="
            width: 200px;
            height: 4px;
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            overflow: hidden;
          ">
            <div style="
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, #00d4ff, #0099cc);
              animation: loading 2s infinite;
            "></div>
          </div>
          <style>
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          </style>
          <small style="color: rgba(255,255,255,0.5); margin-top: 16px;">
            错误信息: ${errorMessage}
          </small>
        </div>
      `
    }
  }
}
