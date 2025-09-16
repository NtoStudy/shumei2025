<template>
  <div class="emotion-universe-page">
    <div class="universe-header">
      <h1 class="page-title">
        <el-icon><MagicStick /></el-icon>
        3D情绪宇宙
      </h1>
      <p class="page-desc">在三维空间中探索你的情绪世界</p>
      
      <!-- 快速操作 -->
      <div class="quick-actions">
        <el-button @click="loadTodayEmotions" type="primary" size="small">
          <el-icon><Calendar /></el-icon>
          加载今日情绪
        </el-button>
        <el-button @click="loadWeekEmotions" type="success" size="small">
          <el-icon><DataBoard /></el-icon>
          本周情绪趋势
        </el-button>
        <el-button @click="showHelp" type="info" size="small">
          <el-icon><QuestionFilled /></el-icon>
          使用帮助
        </el-button>
      </div>
    </div>

    <!-- 3D情绪宇宙组件 -->
    <div class="universe-wrapper">
      <EmotionUniverse3D 
        ref="universeRef"
        @planet-selected="onPlanetSelected"
        @universe-ready="onUniverseReady"
      />
    </div>

    <!-- 情绪数据面板 -->
    <div class="emotion-data-panel" v-if="showDataPanel">
      <div class="panel-header">
        <h3>情绪数据分析</h3>
        <el-button @click="showDataPanel = false" type="text" icon="Close" />
      </div>
      
      <div class="data-content">
        <div class="emotion-summary">
          <h4>当前情绪状态</h4>
          <div class="emotion-grid">
            <div 
              v-for="(intensity, emotion) in currentEmotionData" 
              :key="emotion"
              class="emotion-item"
              :class="{ active: intensity > 0.5 }"
            >
              <div class="emotion-icon">{{ getEmotionEmoji(emotion) }}</div>
              <div class="emotion-name">{{ getEmotionLabel(emotion) }}</div>
              <div class="emotion-intensity">{{ (intensity * 100).toFixed(0) }}%</div>
              <div class="intensity-bar">
                <div 
                  class="intensity-fill" 
                  :style="{ 
                    width: (intensity * 100) + '%',
                    backgroundColor: getEmotionColor(emotion)
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="emotion-insights" v-if="emotionInsights">
          <h4>AI洞察</h4>
          <div class="insights-content">
            <p><strong>主导情绪:</strong> {{ emotionInsights.dominant }}</p>
            <p><strong>情绪平衡度:</strong> {{ emotionInsights.balance }}%</p>
            <p><strong>建议:</strong> {{ emotionInsights.suggestion }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 帮助对话框 -->
    <el-dialog
      v-model="helpVisible"
      title="3D情绪宇宙使用指南"
      width="600px"
    >
      <div class="help-content">
        <h3>🌌 欢迎来到3D情绪宇宙！</h3>
        
        <div class="help-section">
          <h4>🎮 基本操作</h4>
          <ul>
            <li><strong>鼠标拖拽:</strong> 旋转视角，探索宇宙</li>
            <li><strong>鼠标滚轮:</strong> 缩放视角，靠近或远离</li>
            <li><strong>点击星球:</strong> 查看详细情绪信息</li>
            <li><strong>控制面板:</strong> 调整情绪强度和参数</li>
          </ul>
        </div>

        <div class="help-section">
          <h4>🪐 情绪星球说明</h4>
          <ul>
            <li><strong>星球大小:</strong> 代表情绪强度</li>
            <li><strong>星球颜色:</strong> 不同情绪的标识色彩</li>
            <li><strong>粒子环:</strong> 情绪活跃度的视觉表现</li>
            <li><strong>轨道运动:</strong> 情绪的动态变化</li>
          </ul>
        </div>

        <div class="help-section">
          <h4>✨ 高级功能</h4>
          <ul>
            <li><strong>数据加载:</strong> 从情绪日记导入真实数据</li>
            <li><strong>实时更新:</strong> 情绪变化的实时3D可视化</li>
            <li><strong>AI分析:</strong> 智能情绪洞察和建议</li>
            <li><strong>导出分享:</strong> 保存3D情绪快照</li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MagicStick, Calendar, DataBoard, QuestionFilled, Close } from '@element-plus/icons-vue'
import EmotionUniverse3D from '@/components/emotion/EmotionUniverse3D.vue'
import { useEmotionStore } from '@/stores/emotion'

// Store
const emotionStore = useEmotionStore()

// 响应式数据
const universeRef = ref(null)
const showDataPanel = ref(false)
const helpVisible = ref(false)
const currentEmotionData = ref({})
const emotionInsights = ref(null)

// 情绪映射
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

const emotionColors = {
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#FF6347',
  anxious: '#FF1493',
  calm: '#98FB98',
  excited: '#FF69B4',
  neutral: '#C0C0C0',
  fear: '#8A2BE2',
  disgust: '#9ACD32',
  surprise: '#FFB6C1'
}

// 计算属性
const todayEmotions = computed(() => emotionStore.todayEmotions)
const weekEmotions = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return emotionStore.emotions.filter(emotion => 
    new Date(emotion.timestamp) >= oneWeekAgo
  )
})

// 生命周期
onMounted(() => {
  // 延迟显示帮助，让用户先看到3D效果
  setTimeout(() => {
    if (!localStorage.getItem('universe_help_shown')) {
      showHelp()
      localStorage.setItem('universe_help_shown', 'true')
    }
  }, 2000)
})

// 监听今日情绪变化
watch(todayEmotions, (newEmotions) => {
  if (newEmotions.length > 0) {
    analyzeEmotions(newEmotions)
  }
}, { deep: true })

// 方法
const onPlanetSelected = (planetInfo) => {
  ElMessage({
    message: `选中了${getEmotionLabel(planetInfo.emotion)}星球 (强度: ${(planetInfo.intensity * 100).toFixed(0)}%)`,
    type: 'info',
    duration: 2000
  })
  
  showDataPanel.value = true
}

const onUniverseReady = () => {
  ElMessage.success('3D情绪宇宙已就绪！')
  
  // 如果有今日情绪数据，自动加载
  if (todayEmotions.value.length > 0) {
    setTimeout(() => {
      loadTodayEmotions()
    }, 1000)
  }
}

const loadTodayEmotions = () => {
  const emotions = todayEmotions.value
  
  if (emotions.length === 0) {
    ElMessage.warning('今日暂无情绪记录')
    return
  }

  const emotionData = analyzeEmotions(emotions)
  
  if (universeRef.value) {
    universeRef.value.updateEmotionData(emotionData)
  }
  
  currentEmotionData.value = emotionData
  showDataPanel.value = true
  
  ElMessage.success(`已加载${emotions.length}条今日情绪记录`)
}

const loadWeekEmotions = () => {
  const emotions = weekEmotions.value
  
  if (emotions.length === 0) {
    ElMessage.warning('本周暂无情绪记录')
    return
  }

  const emotionData = analyzeEmotions(emotions)
  
  if (universeRef.value) {
    universeRef.value.updateEmotionData(emotionData)
  }
  
  currentEmotionData.value = emotionData
  showDataPanel.value = true
  
  ElMessage.success(`已加载${emotions.length}条本周情绪记录`)
}

const analyzeEmotions = (emotions) => {
  const emotionCounts = {}
  const emotionIntensities = {}
  
  // 统计情绪数据
  emotions.forEach(emotion => {
    const type = emotion.emotion.type
    const intensity = emotion.emotion.intensity / 10 // 转换为0-1范围
    
    emotionCounts[type] = (emotionCounts[type] || 0) + 1
    emotionIntensities[type] = emotionIntensities[type] || []
    emotionIntensities[type].push(intensity)
  })
  
  // 计算平均强度
  const emotionData = {}
  Object.keys(emotionIntensities).forEach(type => {
    const intensities = emotionIntensities[type]
    const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length
    emotionData[type] = Math.min(1, avgIntensity)
  })
  
  // 生成AI洞察
  generateInsights(emotionData, emotionCounts)
  
  return emotionData
}

const generateInsights = (emotionData, emotionCounts) => {
  const sortedEmotions = Object.entries(emotionData)
    .sort(([,a], [,b]) => b - a)
  
  const dominantEmotion = sortedEmotions[0]
  const totalEmotions = Object.values(emotionCounts).reduce((a, b) => a + b, 0)
  
  // 计算情绪平衡度
  const emotionVariance = Object.values(emotionData).reduce((sum, intensity) => {
    return sum + Math.pow(intensity - 0.5, 2)
  }, 0) / Object.keys(emotionData).length
  
  const balance = Math.max(0, Math.min(100, (1 - emotionVariance * 2) * 100))
  
  // 生成建议
  let suggestion = '保持当前的情绪状态'
  const dominantType = dominantEmotion[0]
  const dominantIntensity = dominantEmotion[1]
  
  if (dominantType === 'anxious' && dominantIntensity > 0.6) {
    suggestion = '建议尝试深呼吸练习或冥想来缓解焦虑'
  } else if (dominantType === 'sad' && dominantIntensity > 0.6) {
    suggestion = '建议寻找支持或进行一些愉快的活动'
  } else if (dominantType === 'angry' && dominantIntensity > 0.6) {
    suggestion = '建议进行体育运动或其他发泄方式'
  } else if (dominantType === 'happy' && dominantIntensity > 0.7) {
    suggestion = '很好！继续保持积极的心态'
  } else if (balance < 30) {
    suggestion = '情绪波动较大，建议关注情绪调节'
  }
  
  emotionInsights.value = {
    dominant: getEmotionLabel(dominantType),
    balance: Math.round(balance),
    suggestion,
    totalRecords: totalEmotions
  }
}

const showHelp = () => {
  helpVisible.value = true
}

const getEmotionLabel = (emotion) => {
  return emotionLabels[emotion] || emotion
}

const getEmotionEmoji = (emotion) => {
  return emotionEmojis[emotion] || '❓'
}

const getEmotionColor = (emotion) => {
  return emotionColors[emotion] || '#CCCCCC'
}

// 暴露给父组件
defineExpose({
  loadTodayEmotions,
  loadWeekEmotions,
  showHelp
})
</script>

<style scoped lang="scss">
.emotion-universe-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  overflow: hidden;
}

.universe-header {
  padding: 20px;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #00d4ff;
    font-size: 28px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  
  .page-desc {
    color: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    margin: 0 0 16px 0;
  }
  
  .quick-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.universe-wrapper {
  flex: 1;
  position: relative;
  min-height: 500px;
}

.emotion-data-panel {
  position: absolute;
  top: 100px;
  right: 20px;
  width: 350px;
  max-height: 80vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  z-index: 100;
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: rgba(0, 212, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    h3 {
      color: #00d4ff;
      margin: 0;
      font-size: 16px;
    }
  }
  
  .data-content {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
    
    h4 {
      color: white;
      margin: 0 0 12px 0;
      font-size: 14px;
    }
  }
  
  .emotion-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 24px;
    
    .emotion-item {
      display: grid;
      grid-template-columns: 30px 1fr 50px;
      grid-template-rows: auto auto;
      gap: 8px 12px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &.active {
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.3);
      }
      
      .emotion-icon {
        font-size: 20px;
        grid-row: 1 / 3;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .emotion-name {
        color: white;
        font-size: 14px;
        font-weight: 500;
      }
      
      .emotion-intensity {
        color: #00d4ff;
        font-size: 14px;
        font-weight: bold;
        text-align: right;
      }
      
      .intensity-bar {
        grid-column: 2 / 4;
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 2px;
        overflow: hidden;
        
        .intensity-fill {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 2px;
        }
      }
    }
  }
  
  .emotion-insights {
    .insights-content {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 16px;
      
      p {
        color: rgba(255, 255, 255, 0.9);
        margin: 8px 0;
        font-size: 14px;
        line-height: 1.5;
        
        strong {
          color: #00d4ff;
        }
      }
    }
  }
}

.help-content {
  color: #333;
  
  h3 {
    color: #00d4ff;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .help-section {
    margin-bottom: 24px;
    
    h4 {
      color: #FF6B6B;
      margin-bottom: 12px;
    }
    
    ul {
      padding-left: 20px;
      
      li {
        margin-bottom: 8px;
        line-height: 1.6;
        
        strong {
          color: #00d4ff;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .emotion-data-panel {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .universe-header {
    padding: 16px;
    
    .page-title {
      font-size: 24px;
    }
    
    .page-desc {
      font-size: 14px;
    }
  }
  
  .emotion-data-panel {
    position: fixed;
    top: 80px;
    left: 10px;
    right: 10px;
    width: auto;
    max-height: 70vh;
  }
  
  .quick-actions {
    .el-button {
      font-size: 12px;
      padding: 6px 12px;
    }
  }
}

// Element Plus 样式覆盖
:deep(.el-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

:deep(.el-button) {
  border-radius: 6px;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border-color: transparent;
}

:deep(.el-button--success) {
  background: linear-gradient(135deg, #98FB98, #66CC66);
  border-color: transparent;
}
</style>
