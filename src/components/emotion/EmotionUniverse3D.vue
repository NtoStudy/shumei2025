<template>
  <div class="emotion-universe-container">
    <!-- 控制面板 -->
    <div class="universe-controls" :class="{ collapsed: controlsCollapsed }">
      <div class="controls-header">
        <h3>
          <el-icon><MagicStick /></el-icon>
          3D情绪宇宙
        </h3>
        <div class="header-actions">
          <el-tooltip content="面板支持滚动查看更多选项" placement="top">
            <el-icon class="scroll-hint">↕️</el-icon>
          </el-tooltip>
          <el-button 
            @click="controlsCollapsed = !controlsCollapsed" 
            type="text" 
            size="small"
            :icon="controlsCollapsed ? 'ArrowDown' : 'ArrowUp'"
          />
        </div>
      </div>
      
      <div class="controls-content" v-show="!controlsCollapsed">
        <!-- 情绪数据输入 -->
        <div class="emotion-input">
          <el-form :model="emotionForm" size="small">
            <el-form-item label="快速设置">
              <el-button-group>
                <el-button @click="setPresetEmotion('happy')" size="small">😊 开心</el-button>
                <el-button @click="setPresetEmotion('sad')" size="small">😢 悲伤</el-button>
                <el-button @click="setPresetEmotion('angry')" size="small">😠 愤怒</el-button>
                <el-button @click="setPresetEmotion('calm')" size="small">😌 平静</el-button>
              </el-button-group>
            </el-form-item>
            
            <!-- 自定义情绪强度 -->
            <div class="custom-emotions">
              <div v-for="(intensity, emotion) in currentEmotions" :key="emotion" class="emotion-slider">
                <label>{{ getEmotionLabel(emotion) }} {{ getEmotionEmoji(emotion) }}</label>
                <el-slider 
                  v-model="currentEmotions[emotion]"
                  :min="0" 
                  :max="1" 
                  :step="0.1"
                  @change="updateUniverse"
                  size="small"
                />
                <span class="intensity-value">{{ (currentEmotions[emotion] * 100).toFixed(0) }}%</span>
              </div>
            </div>
          </el-form>
        </div>
        
        <!-- 控制按钮 -->
        <div class="universe-actions">
          <div class="action-group">
            <el-button @click="resetUniverse" size="small" type="warning">重置宇宙</el-button>
            <el-button @click="randomizeEmotions" size="small" type="primary">随机情绪</el-button>
            <el-button @click="loadFromStore" size="small" type="success">加载数据</el-button>
          </div>
          <div class="action-group">
            <el-button @click="forceTest3D" size="small" type="danger">强制测试3D</el-button>
            <el-button @click="testInteraction" size="small" type="primary">测试交互</el-button>
            <el-button @click="showExpectedEffect" size="small" type="info">查看预期效果</el-button>
            <el-button @click="runDiagnostic" size="small" type="success">诊断问题</el-button>
          <el-button @click="forceShowCanvas" size="small" type="warning">强制显示Canvas</el-button>
          <el-button @click="testWebGL" size="small" type="info">测试WebGL</el-button>
          </div>
        </div>
        
        <!-- 统计信息 -->
        <div class="universe-stats" v-if="universeStats">
          <h4>宇宙统计</h4>
          <div class="stats-grid">
            <div v-for="(stat, emotion) in universeStats" :key="emotion" class="stat-item">
              <span class="stat-emoji">{{ getEmotionEmoji(emotion) }}</span>
              <span class="stat-name">{{ getEmotionLabel(emotion) }}</span>
              <span class="stat-value">{{ (stat.intensity * 100).toFixed(0) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 3D渲染容器 -->
    <div 
      ref="universeContainer" 
      class="universe-canvas"
      :style="{ height: canvasHeight + 'px', minHeight: '500px' }"
    >
      <!-- 初始占位内容 - 只在加载时显示 -->
      <div v-if="isLoading && !universe3D" class="canvas-placeholder">
        <div class="placeholder-content">
          <div class="placeholder-icon">🌌</div>
          <p>正在准备3D情绪宇宙...</p>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="universe-loading">
      <el-icon class="is-loading"><Loading /></el-icon>
      <p>正在初始化3D情绪宇宙...</p>
    </div>
    
    <!-- 选中星球信息 -->
    <div v-if="selectedPlanetInfo" class="planet-info">
      <div class="info-header">
        <span class="planet-emoji">{{ getEmotionEmoji(selectedPlanetInfo.emotion) }}</span>
        <h4>{{ getEmotionLabel(selectedPlanetInfo.emotion) }}</h4>
        <el-button @click="selectedPlanetInfo = null" type="text" size="small" icon="Close" />
      </div>
      <div class="info-content">
        <p><strong>强度:</strong> {{ ((selectedPlanetInfo.intensity || 0) * 100).toFixed(0) }}%</p>
        <p><strong>描述:</strong> {{ getEmotionDescription(selectedPlanetInfo.emotion) }}</p>
      </div>
    </div>
    
    <!-- 帮助信息 -->
    <div class="universe-help">
      <el-tooltip content="点击星球查看详情，滚轮缩放，拖拽旋转视角" placement="top">
        <el-icon><QuestionFilled /></el-icon>
      </el-tooltip>
    </div>
    
    <!-- 关闭按钮 -->
    <div class="universe-close">
      <el-tooltip content="退出3D宇宙" placement="left">
        <el-button @click="handleClose" type="danger" size="large" circle>
          <el-icon><Close /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
    
  
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MagicStick, Loading, Close, QuestionFilled, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { EmotionUniverse3D } from '@/utils/EmotionUniverse3D'
import { useEmotionStore } from '@/stores/emotion'

// Store and Router
const emotionStore = useEmotionStore()
const router = useRouter()

// 响应式数据
const universeContainer = ref(null)
const isLoading = ref(true)
const controlsCollapsed = ref(false)
const canvasHeight = ref(600)
const selectedPlanetInfo = ref(null)
const universeStats = ref(null)

// 3D宇宙实例
let universe3D = null

// 当前情绪数据 - 确保包含所有情绪类型
const currentEmotions = ref({
  happy: 0.3,
  sad: 0.1,
  angry: 0.1,
  anxious: 0.2,
  calm: 0.4,
  excited: 0.2,
  neutral: 0.5,
  fear: 0.1,
  disgust: 0.1,
  surprise: 0.1
})

// 表单数据
const emotionForm = ref({})

// 情绪标签映射
const emotionLabels = {
  happy: '开心',
  sad: '悲伤', 
  angry: '愤怒',
  anxious: '焦虑',
  calm: '平静',
  excited: '兴奋',
  neutral: '中性',
  fear: '恐惧',
  disgust: '厌恶',
  surprise: '惊讶'
}

// 情绪表情映射
const emotionEmojis = {
  happy: '😊',
  sad: '😢',
  angry: '😠', 
  anxious: '😰',
  calm: '😌',
  excited: '🤩',
  neutral: '😐',
  fear: '😨',
  disgust: '🤢',
  surprise: '😲'
}

// 情绪描述
const emotionDescriptions = {
  happy: '积极正面的情绪状态，带来愉悦和满足感',
  sad: '消极情绪，通常由失落或失望引起',
  angry: '强烈的负面情绪，可能导致冲动行为',
  anxious: '担忧和不安的情绪，常伴随紧张感',
  calm: '平和宁静的状态，内心平衡',
  excited: '高度兴奋和热情的状态',
  neutral: '情绪平衡，无明显倾向',
  fear: '对威胁或危险的本能反应',
  disgust: '对不喜欢事物的排斥情绪',
  surprise: '对意外事件的情绪反应'
}

// 生命周期
onMounted(async () => {
  await nextTick()
  await initUniverse()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
  
  // 加载现有情绪数据
  loadFromStore()
})

onUnmounted(() => {
  if (universe3D) {
    universe3D.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

// 监听情绪数据变化
watch(currentEmotions, (newEmotions) => {
  updateUniverse()
}, { deep: true })

// 方法
const initUniverse = async () => {
  try {
    isLoading.value = true
    
    console.log('🚀 开始初始化3D情绪宇宙...')
    
    // 等待Vue组件完全挂载和DOM稳定
    await nextTick()
    
    // 严格检查容器引用
    if (!universeContainer.value) {
      console.error('❌ universeContainer.value 为 null 或 undefined')
      throw new Error('容器引用未找到，请检查模板中的ref设置')
    }
    
    // 检查容器是否已挂载到DOM
    if (!universeContainer.value.parentElement) {
      console.error('❌ 容器未挂载到DOM')
      throw new Error('容器未正确挂载到DOM树')
    }
    
    console.log('✅ 容器引用检查通过')
    
    // 等待DOM完全稳定 - 减少等待时间避免阻塞
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve)
      })
    })
    
    // 再次确认容器状态
    if (!universeContainer.value) {
      throw new Error('等待DOM稳定后，容器引用丢失')
    }
    
    console.log('✅ DOM稳定，开始创建3D引擎')
    
    // 创建3D宇宙（传入经过验证的容器）
    const containerElement = universeContainer.value
    console.log('🎯 传入3D引擎的容器:', containerElement)
    
    universe3D = new EmotionUniverse3D(containerElement)
    
    // 设置星球点击回调
    universe3D.onPlanetSelected = (planetInfo) => {
      console.log('🎯 星球点击回调:', planetInfo)
      
      // 确保数据格式正确，验证情绪类型
      const validEmotion = planetInfo.emotion && emotionLabels[planetInfo.emotion] ? planetInfo.emotion : 'neutral'
      const safeInfo = {
        emotion: validEmotion,
        intensity: typeof planetInfo.intensity === 'number' ? planetInfo.intensity : 0,
        planet: planetInfo.planet
      }
      
      selectedPlanetInfo.value = safeInfo
      ElMessage.success(`选中了${getEmotionLabel(safeInfo.emotion)}星球`)
    }
    
    // 等待初始化完成 - 减少等待时间
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // 初始化情绪数据
    if (universe3D.isInitialized) {
      universe3D.updateEmotionData(currentEmotions.value)
      ElMessage.success('3D情绪宇宙初始化完成！')
      
      // 使用nextTick确保DOM更新完成后再检查Canvas
      await nextTick()
      setTimeout(() => {
        if (!universeContainer.value) return
        
        const canvas = universeContainer.value.querySelector('canvas')
        if (canvas) {
          console.log('✅ Vue组件中找到Canvas:', {
            canvas: canvas,
            size: { width: canvas.clientWidth, height: canvas.clientHeight },
            style: canvas.style.cssText,
            visible: canvas.offsetParent !== null
          })
          
          // 如果Canvas不可见，尝试修复
          if (canvas.offsetParent === null || canvas.clientWidth === 0) {
            console.warn('⚠️ Canvas可能不可见，尝试修复...')
            nextTick(() => forceShowCanvas())
          }
        } else {
          console.error('❌ Vue组件中未找到Canvas元素')
        }
      }, 300)
    } else {
      throw new Error('3D引擎初始化失败')
    }
    
    // 确保加载状态更新
    await nextTick()
    isLoading.value = false
    
  } catch (error) {
    console.error('3D宇宙初始化失败:', error)
    ElMessage.error('3D情绪宇宙初始化失败: ' + error.message)
    
    // 确保加载状态更新
    await nextTick()
    isLoading.value = false
    
    // 显示错误信息和后备方案
    if (universeContainer.value) {
      universeContainer.value.innerHTML = `
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
          <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
          <h3 style="color: #ff6b6b; margin-bottom: 16px;">3D宇宙初始化失败</h3>
          <p style="color: rgba(255,255,255,0.7); margin-bottom: 20px;">
            错误: ${error.message}
          </p>
          <div style="margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 12px; text-align: left;">
            <strong>调试信息:</strong><br>
            • 请检查浏览器是否支持WebGL<br>
            • 请确保Three.js库已正确加载<br>
            • 请查看浏览器控制台获取详细错误信息<br>
            • 尝试刷新页面或重启浏览器
          </div>
          <div style="display: flex; gap: 12px;">
            <button onclick="window.location.reload()" style="
              padding: 8px 16px; 
              background: #00d4ff; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              cursor: pointer;
            ">重新加载</button>
            <button onclick="console.log('WebGL支持:', !!window.WebGLRenderingContext)" style="
              padding: 8px 16px; 
              background: #666; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              cursor: pointer;
            ">检测WebGL</button>
          </div>
        </div>
      `
      
      // 启动后备的2D可视化
      setTimeout(() => {
        initFallback2D()
      }, 1000)
    }
  }
}

const updateUniverse = () => {
  if (!universe3D) return
  
  try {
    universe3D.updateEmotionData(currentEmotions.value)
    universeStats.value = universe3D.getEmotionStats()
  } catch (error) {
    console.error('更新宇宙失败:', error)
    ElMessage.error('更新3D宇宙失败')
  }
}

const setPresetEmotion = (emotion) => {
  // 重置所有情绪
  Object.keys(currentEmotions.value).forEach(key => {
    currentEmotions.value[key] = 0.1
  })
  
  // 设置主要情绪
  currentEmotions.value[emotion] = 0.8
  
  // 添加一些随机变化
  Object.keys(currentEmotions.value).forEach(key => {
    if (key !== emotion) {
      currentEmotions.value[key] = Math.random() * 0.3
    }
  })
  
  ElMessage.info(`设置为${getEmotionLabel(emotion)}主导状态`)
}

const randomizeEmotions = () => {
  Object.keys(currentEmotions.value).forEach(emotion => {
    currentEmotions.value[emotion] = Math.random()
  })
  ElMessage.info('已随机生成情绪状态')
}

const resetUniverse = () => {
  Object.keys(currentEmotions.value).forEach(emotion => {
    currentEmotions.value[emotion] = 0.3
  })
  selectedPlanetInfo.value = null
  ElMessage.info('宇宙已重置')
}

const loadFromStore = () => {
  try {
    // 从情绪store加载最新数据
    const recentEmotions = emotionStore.todayEmotions
    
    if (recentEmotions.length > 0) {
      // 分析最近的情绪数据
      const emotionCounts = {}
      const emotionIntensities = {}
      
      recentEmotions.forEach(emotion => {
        const type = emotion.emotion.type
        const intensity = emotion.emotion.intensity / 10 // 转换为0-1范围
        
        emotionCounts[type] = (emotionCounts[type] || 0) + 1
        emotionIntensities[type] = (emotionIntensities[type] || [])
        emotionIntensities[type].push(intensity)
      })
      
      // 计算平均强度
      Object.keys(emotionIntensities).forEach(type => {
        const intensities = emotionIntensities[type]
        const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length
        currentEmotions.value[type] = Math.min(1, avgIntensity)
      })
      
      ElMessage.success(`已加载${recentEmotions.length}条今日情绪数据`)
    } else {
      ElMessage.info('暂无今日情绪数据')
    }
  } catch (error) {
    console.error('加载情绪数据失败:', error)
    ElMessage.error('加载情绪数据失败')
  }
}

const handleResize = () => {
  if (universe3D) {
    universe3D.onWindowResize()
  }
}

const getEmotionLabel = (emotion) => {
  return emotionLabels[emotion] || emotion
}

const getEmotionEmoji = (emotion) => {
  return emotionEmojis[emotion] || '❓'
}

const getEmotionDescription = (emotion) => {
  return emotionDescriptions[emotion] || '未知情绪状态'
}

// 处理关闭
const handleClose = () => {
  // 清理3D资源
  if (universe3D) {
    universe3D.dispose()
    universe3D = null
  }
  
  // 返回上一页或情绪首页
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/emotion')
  }
}

// 强制测试3D功能
const forceTest3D = async () => {
  console.log('🔧 强制测试3D功能...')
  
  // 清理现有实例
  if (universe3D) {
    try {
      universe3D.dispose()
    } catch (e) {
      console.warn('清理3D实例时出错:', e)
    }
    universe3D = null
  }
  
  // 重新初始化
  ElMessage.info('正在强制重新初始化3D引擎...')
  await initUniverse()
}

// 显示预期效果说明
const showExpectedEffect = () => {
  ElMessageBox.alert(`
    <div style="text-align: left; line-height: 1.6;">
      <h3 style="color: #00d4ff; margin-bottom: 16px;">🌌 3D情绪宇宙预期效果</h3>
      
      <h4 style="color: #FF6B6B; margin: 12px 0 8px 0;">✨ 视觉效果:</h4>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>深蓝色渐变的星空背景 (类似夜空)</li>
        <li>数千个白色小星星闪烁</li>
        <li>中心有一个白色发光的能量核心</li>
        <li>围绕中心分布着彩色的情绪星球</li>
        <li>每个星球周围有粒子环效果</li>
      </ul>
      
      <h4 style="color: #FF6B6B; margin: 12px 0 8px 0;">🪐 情绪星球:</h4>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>开心 😊 - 金黄色球体</li>
        <li>平静 😌 - 淡绿色球体</li>
        <li>焦虑 😰 - 深粉红色球体</li>
        <li>星球大小代表情绪强度</li>
        <li>星球会缓慢自转和轨道运动</li>
      </ul>
      
      <h4 style="color: #FF6B6B; margin: 12px 0 8px 0;">🎮 交互功能:</h4>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>鼠标拖拽可以旋转整个视角</li>
        <li>滚轮可以缩放远近</li>
        <li>点击星球会高亮并显示详情</li>
        <li>调节左侧滑块星球会实时变化</li>
      </ul>
      
      <h4 style="color: #FF6B6B; margin: 12px 0 8px 0;">🚨 如果看不到:</h4>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>可能是Three.js库加载失败</li>
        <li>可能是WebGL不支持</li>
        <li>可能是容器尺寸问题</li>
        <li>请点击"强制测试3D"按钮重试</li>
      </ul>
    </div>
  `, '3D情绪宇宙效果说明', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '我知道了',
    customStyle: {
      width: '600px'
    }
  })
}

// 强制显示Canvas
const forceShowCanvas = () => {
  if (!universeContainer.value) {
    ElMessage.error('容器不存在')
    return
  }
  
  // 查找Canvas元素
  const canvas = universeContainer.value.querySelector('canvas')
  
  if (!canvas) {
    ElMessage.error('Canvas元素不存在')
    console.log('🔍 容器内容:', universeContainer.value.innerHTML)
    return
  }
  
  console.log('🎨 找到Canvas元素:', canvas)
  console.log('📐 Canvas尺寸:', canvas.width, 'x', canvas.height)
  console.log('📍 Canvas样式:', canvas.style.cssText)
  console.log('👁️ Canvas可见性:', {
    display: getComputedStyle(canvas).display,
    visibility: getComputedStyle(canvas).visibility,
    opacity: getComputedStyle(canvas).opacity,
    zIndex: getComputedStyle(canvas).zIndex
  })
  
  // 强制设置Canvas样式
  canvas.style.cssText = `
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    z-index: 1 !important;
    background: rgba(255, 0, 0, 0.1) !important;
  `
  
  ElMessage.success('已强制设置Canvas可见性，如果看到红色背景说明Canvas存在')
}

// 测试WebGL
const testInteraction = () => {
  if (!universe3D) {
    ElMessage.error('3D宇宙未初始化')
    return
  }
  
  try {
    universe3D.testInteraction()
    ElMessage.success('交互测试完成，请查看控制台')
  } catch (error) {
    console.error('交互测试失败:', error)
    ElMessage.error('交互测试失败: ' + error.message)
  }
}

const testWebGL = () => {
  // 创建测试Canvas
  const testCanvas = document.createElement('canvas')
  testCanvas.width = 300
  testCanvas.height = 200
  testCanvas.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    border: 2px solid #00d4ff;
    background: black;
  `
  
  document.body.appendChild(testCanvas)
  
  // 获取WebGL上下文
  const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
  
  if (!gl) {
    ElMessage.error('WebGL不支持！')
    document.body.removeChild(testCanvas)
    return
  }
  
  // 绘制测试三角形
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `)
  gl.compileShader(vertexShader)
  
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(0.0, 0.8, 1.0, 1.0);
    }
  `)
  gl.compileShader(fragmentShader)
  
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  
  const vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ])
  
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
  
  ElMessage.success('WebGL测试成功！看到蓝色三角形说明WebGL正常工作')
  
  // 3秒后移除测试Canvas
  setTimeout(() => {
    if (document.body.contains(testCanvas)) {
      document.body.removeChild(testCanvas)
    }
  }, 3000)
}

// 诊断问题
const runDiagnostic = async () => {
  console.log('🔍 开始系统诊断...')
  
  let diagnosticResults = []
  
  // 1. 检查Three.js
  try {
    const THREE = await import('three')
    diagnosticResults.push('✅ Three.js库加载成功')
    console.log('Three.js version:', THREE.REVISION)
  } catch (error) {
    diagnosticResults.push('❌ Three.js库加载失败: ' + error.message)
  }
  
  // 2. 检查WebGL支持
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  if (gl) {
    diagnosticResults.push('✅ WebGL支持正常')
    diagnosticResults.push(`📊 WebGL版本: ${gl.getParameter(gl.VERSION)}`)
    diagnosticResults.push(`🎮 渲染器: ${gl.getParameter(gl.RENDERER)}`)
  } else {
    diagnosticResults.push('❌ WebGL不支持或被禁用')
  }
  
  // 3. 检查容器状态
  if (universeContainer.value) {
    const rect = universeContainer.value.getBoundingClientRect()
    diagnosticResults.push('✅ 容器元素存在')
    diagnosticResults.push(`📐 容器尺寸: ${rect.width}x${rect.height}`)
    diagnosticResults.push(`📍 容器位置: (${rect.left}, ${rect.top})`)
  } else {
    diagnosticResults.push('❌ 容器元素不存在')
  }
  
  // 4. 检查3D实例状态
  if (universe3D) {
    diagnosticResults.push('✅ 3D宇宙实例已创建')
    diagnosticResults.push(`🔧 初始化状态: ${universe3D.isInitialized ? '已初始化' : '未初始化'}`)
  } else {
    diagnosticResults.push('❌ 3D宇宙实例未创建')
  }
  
  // 5. 检查DOM元素
  const canvas3D = universeContainer.value?.querySelector('canvas')
  if (canvas3D) {
    diagnosticResults.push('✅ 3D Canvas元素存在')
    diagnosticResults.push(`🎨 Canvas尺寸: ${canvas3D.width}x${canvas3D.height}`)
  } else {
    diagnosticResults.push('❌ 3D Canvas元素不存在')
  }
  
  // 显示诊断结果
  ElMessageBox.alert(`
    <div style="text-align: left; line-height: 1.8; font-family: monospace;">
      <h3 style="color: #00d4ff; margin-bottom: 16px;">🔍 系统诊断结果</h3>
      ${diagnosticResults.map(result => `<div style="margin: 4px 0;">${result}</div>`).join('')}
      
      <div style="margin-top: 20px; padding: 12px; background: rgba(0,212,255,0.1); border-radius: 6px;">
        <strong style="color: #00d4ff;">💡 解决建议:</strong><br>
        ${diagnosticResults.some(r => r.includes('❌')) ? 
          '发现问题，请尝试：<br>• 刷新页面重试<br>• 检查浏览器是否支持WebGL<br>• 更新浏览器到最新版本' : 
          '系统状态正常，如果仍看不到效果，请点击"强制测试3D"'
        }
      </div>
    </div>
  `, '诊断报告', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '知道了',
    customStyle: {
      width: '500px'
    }
  })
}

// 2D后备可视化方案
const initFallback2D = () => {
  if (!universeContainer.value) return
  
  console.log('🎨 启动2D后备可视化方案')
  
  // 创建Canvas 2D版本
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
  
  const ctx = canvas.getContext('2d')
  
  // 清空容器并添加canvas
  universeContainer.value.innerHTML = ''
  universeContainer.value.appendChild(canvas)
  
  // 简单的2D情绪可视化
  const draw2DUniverse = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 绘制星空背景
    ctx.fillStyle = 'white'
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // 绘制情绪圆圈
    const emotions = Object.entries(currentEmotions.value)
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    emotions.forEach(([emotion, intensity], index) => {
      const angle = (index / emotions.length) * Math.PI * 2
      const distance = 150
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance
      const radius = Math.max(20, intensity * 60)
      
      // 绘制情绪圆圈
      const color = emotionColors[emotion] || '#CCCCCC'
      ctx.fillStyle = color
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      
      // 绘制情绪标签
      ctx.fillStyle = 'white'
      ctx.globalAlpha = 1
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(getEmotionLabel(emotion), x, y + 5)
      ctx.fillText(`${(intensity * 100).toFixed(0)}%`, x, y + 20)
    })
    
    // 绘制中心
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
    ctx.fill()
    
    // 添加标题
    ctx.fillStyle = '#00d4ff'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('2D情绪宇宙 (后备模式)', centerX, 50)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '14px Arial'
    ctx.fillText('3D模式不可用，使用2D可视化', centerX, 80)
  }
  
  // 初始绘制
  draw2DUniverse()
  
  // 定时更新
  const interval = setInterval(draw2DUniverse, 100)
  
  // 保存清理函数
  universeContainer.value._cleanup = () => {
    clearInterval(interval)
  }
  
  ElMessage.info('已切换到2D后备模式')
}

// 暴露给父组件的方法
defineExpose({
  updateEmotionData: (data) => {
    Object.assign(currentEmotions.value, data)
  },
  resetUniverse,
  getStats: () => universeStats.value
})
</script>

<style scoped lang="scss">
.emotion-universe-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.universe-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  min-width: 300px;
  max-width: 350px;
  max-height: calc(100vh - 40px);
  z-index: 10;
  transition: all 0.3s ease;
  overflow-y: auto;
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 212, 255, 0.6);
    border-radius: 3px;
    
    &:hover {
      background: rgba(0, 212, 255, 0.8);
    }
  }
  
  &.collapsed {
    .controls-content {
      display: none;
    }
  }
  
  .controls-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      color: white;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .scroll-hint {
        color: rgba(0, 212, 255, 0.6);
        font-size: 12px;
        cursor: help;
        
        &:hover {
          color: rgba(0, 212, 255, 1);
        }
      }
    }
  }
  
  .emotion-input {
    margin-bottom: 16px;
    
    .custom-emotions {
      .emotion-slider {
        margin-bottom: 12px;
        
        label {
          color: #fff;
          font-size: 12px;
          display: block;
          margin-bottom: 4px;
        }
        
        .intensity-value {
          color: #00d4ff;
          font-size: 12px;
          font-weight: bold;
          margin-left: 8px;
        }
      }
    }
  }
  
  .universe-actions {
    margin-bottom: 16px;
    
    .action-group {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .el-button {
      font-size: 11px;
      padding: 4px 8px;
      height: auto;
      min-height: 28px;
    }
  }
  
  .universe-stats {
    h4 {
      color: white;
      margin: 0 0 12px 0;
      font-size: 14px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      
      .stat-item {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
        
        .stat-emoji {
          font-size: 16px;
        }
        
        .stat-name {
          color: #ccc;
          font-size: 12px;
          flex: 1;
        }
        
        .stat-value {
          color: #00d4ff;
          font-size: 12px;
          font-weight: bold;
        }
      }
    }
  }
}

.universe-canvas {
  flex: 1;
  width: 100%;
  min-height: 500px;
  position: relative;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
  
  // 确保Canvas元素正确定位和可见性
  canvas {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    z-index: 1 !important;
    pointer-events: auto !important;
  }
  
  .canvas-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .placeholder-content {
      text-align: center;
      color: white;
      
      .placeholder-icon {
        font-size: 64px;
        margin-bottom: 20px;
        animation: float 3s ease-in-out infinite;
      }
      
      p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
        margin: 0;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.universe-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 20;
  
  .el-icon {
    font-size: 32px;
    margin-bottom: 16px;
  }
  
  p {
    margin: 0;
    font-size: 16px;
  }
}

.planet-info {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  min-width: 250px;
  z-index: 10;
  
  .info-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    .planet-emoji {
      font-size: 24px;
    }
    
    h4 {
      color: white;
      margin: 0;
      flex: 1;
    }
  }
  
  .info-content {
    color: #ccc;
    font-size: 14px;
    
    p {
      margin: 4px 0;
      
      strong {
        color: #00d4ff;
      }
    }
  }
}

.universe-help {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  
  .el-icon {
    color: rgba(255, 255, 255, 0.6);
    font-size: 20px;
    cursor: help;
    
    &:hover {
      color: #00d4ff;
    }
  }
}

.universe-close {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  
  .el-button {
    background: rgba(255, 107, 107, 0.8);
    border-color: rgba(255, 107, 107, 0.8);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 107, 107, 1);
      border-color: rgba(255, 107, 107, 1);
      transform: scale(1.1);
    }
    
    &:focus {
      background: rgba(255, 107, 107, 0.8);
      border-color: rgba(255, 107, 107, 0.8);
    }
  }
}

.debug-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  max-width: 500px;
  color: white;
  z-index: 100;
  
  h4 {
    color: #00d4ff;
    margin: 0 0 16px 0;
    font-size: 16px;
  }
  
  p {
    margin: 12px 0 8px 0;
    font-size: 14px;
    
    strong {
      color: #00d4ff;
    }
  }
  
  ul {
    margin: 8px 0 16px 0;
    padding-left: 20px;
    
    li {
      margin: 6px 0;
      font-size: 13px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .universe-controls {
    position: static;
    margin-bottom: 16px;
    min-width: unset;
    max-width: unset;
  }
  
  .planet-info {
    position: static;
    margin-top: 16px;
    min-width: unset;
  }
}

// Element Plus 样式覆盖
:deep(.el-slider__runway) {
  background-color: rgba(255, 255, 255, 0.2);
}

:deep(.el-slider__bar) {
  background-color: #00d4ff;
}

:deep(.el-slider__button) {
  border-color: #00d4ff;
}

:deep(.el-button-group .el-button) {
  font-size: 12px;
  padding: 4px 8px;
}

:deep(.el-form-item__label) {
  color: #ccc;
}
</style>
