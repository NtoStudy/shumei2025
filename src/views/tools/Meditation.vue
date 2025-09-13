<template>
  <div class="meditation-page">
    <AppHeader />
    
    <div class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><Headphones /></el-icon>
            正念冥想
          </h1>
          <p class="page-desc">通过正念冥想提升专注力，平静内心，培养正念意识</p>
        </div>
        
        <div class="meditation-container">
          <!-- 冥想主题选择 -->
          <div class="theme-selector">
            <h3 class="section-title">选择冥想主题</h3>
            <div class="theme-grid">
              <div 
                v-for="theme in meditationThemes" 
                :key="theme.id"
                class="theme-card"
                :class="{ active: selectedTheme === theme.id }"
                @click="selectTheme(theme.id)"
              >
                <div class="theme-icon">
                  <el-icon><component :is="theme.icon" /></el-icon>
                </div>
                <h4 class="theme-name">{{ theme.name }}</h4>
                <p class="theme-desc">{{ theme.description }}</p>
                <div class="theme-duration">{{ theme.duration }}分钟</div>
              </div>
            </div>
          </div>
          
          <!-- 冥想练习区域 -->
          <div class="meditation-exercise" v-if="selectedTheme">
            <div class="exercise-header">
              <h3 class="exercise-title">{{ currentTheme.name }}</h3>
              <p class="exercise-desc">{{ currentTheme.description }}</p>
            </div>
            
            <div class="meditation-player">
              <div class="player-container">
                <div class="meditation-circle">
                  <div class="circle-content">
                    <div class="meditation-icon">
                      <el-icon><Headphones /></el-icon>
                    </div>
                    <div class="meditation-status">{{ meditationStatus }}</div>
                    <div class="meditation-time">{{ formatTime(remainingTime) }}</div>
                  </div>
                </div>
                
                <div class="progress-ring">
                  <svg class="progress-svg" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#E0E0E0"
                      stroke-width="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#FF6B6B"
                      stroke-width="8"
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="strokeDashoffset"
                      stroke-linecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            <div class="exercise-controls">
              <div class="duration-selector">
                <label>冥想时长：</label>
                <el-select v-model="selectedDuration" @change="updateDuration">
                  <el-option label="5分钟" :value="5" />
                  <el-option label="10分钟" :value="10" />
                  <el-option label="15分钟" :value="15" />
                  <el-option label="20分钟" :value="20" />
                </el-select>
              </div>
              
              <div class="control-buttons">
                <el-button 
                  v-if="!isPlaying" 
                  type="primary" 
                  @click="startMeditation"
                  class="start-btn"
                >
                  <el-icon><VideoPlay /></el-icon>
                  开始冥想
                </el-button>
                <el-button 
                  v-if="isPlaying" 
                  @click="pauseMeditation"
                  class="pause-btn"
                >
                  <el-icon><VideoPause /></el-icon>
                  暂停
                </el-button>
                <el-button 
                  v-if="isPlaying" 
                  @click="stopMeditation"
                  class="stop-btn"
                >
                  <el-icon><VideoStop /></el-icon>
                  停止
                </el-button>
              </div>
            </div>
            
            <div class="meditation-tips" v-if="isPlaying">
              <h4>冥想提示</h4>
              <p>{{ currentTip }}</p>
            </div>
          </div>
          
          <!-- 冥想记录 -->
          <div class="meditation-records">
            <h3 class="section-title">冥想记录</h3>
            <div class="records-list" v-if="meditationRecords.length > 0">
              <div 
                v-for="record in meditationRecords" 
                :key="record.id"
                class="record-item"
              >
                <div class="record-info">
                  <h4>{{ record.themeName }}</h4>
                  <p>{{ formatDate(record.date) }} - {{ record.duration }}分钟</p>
                </div>
                <div class="record-duration">
                  <el-icon><Timer /></el-icon>
                  {{ record.duration }}分钟
                </div>
              </div>
            </div>
            <div class="no-records" v-else>
              <el-icon class="no-records-icon"><Headphones /></el-icon>
              <p>还没有冥想记录</p>
              <p>开始你的第一次正念冥想吧！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'

// 冥想主题数据
const meditationThemes = ref([
  {
    id: 'breathing',
    name: '呼吸冥想',
    description: '专注于呼吸，平静内心',
    duration: 10,
    icon: 'WindPower'
  },
  {
    id: 'body-scan',
    name: '身体扫描',
    description: '放松身体，释放紧张',
    duration: 15,
    icon: 'User'
  },
  {
    id: 'loving-kindness',
    name: '慈爱冥想',
    description: '培养慈悲心，关爱他人',
    duration: 12,
    icon: 'Heart'
  },
  {
    id: 'mindfulness',
    name: '正念觉察',
    description: '觉察当下，提升专注力',
    duration: 8,
    icon: 'Sunny'
  }
])

// 状态管理
const selectedTheme = ref('')
const selectedDuration = ref(10)
const isPlaying = ref(false)
const remainingTime = ref(0)
const meditationStatus = ref('准备开始')

// 定时器
let meditationTimer = null

// 冥想提示
const meditationTips = ref([
  '保持舒适的坐姿，闭上眼睛',
  '专注于你的呼吸，感受空气进出',
  '当思绪飘散时，温柔地回到呼吸',
  '感受身体的放松，释放所有紧张',
  '保持觉察，不要评判任何想法',
  '让心灵平静下来，享受当下的宁静'
])

let currentTipIndex = 0

// 计算属性
const currentTheme = computed(() => {
  return meditationThemes.value.find(t => t.id === selectedTheme.value) || {}
})

const currentTip = computed(() => {
  return meditationTips.value[currentTipIndex] || meditationTips.value[0]
})

const circumference = computed(() => 2 * Math.PI * 45)
const strokeDashoffset = computed(() => {
  const progress = (selectedDuration.value * 60 - remainingTime.value) / (selectedDuration.value * 60)
  return circumference.value * (1 - progress)
})

// 冥想记录
const meditationRecords = ref([
  {
    id: 1,
    themeName: '呼吸冥想',
    date: new Date(),
    duration: 10
  }
])

const selectTheme = (themeId) => {
  selectedTheme.value = themeId
  stopMeditation()
}

const updateDuration = () => {
  if (!isPlaying.value) {
    remainingTime.value = selectedDuration.value * 60
  }
}

const startMeditation = () => {
  if (!selectedTheme.value) return
  
  isPlaying.value = true
  remainingTime.value = selectedDuration.value * 60
  meditationStatus.value = '冥想中...'
  
  startMeditationTimer()
  startTipRotation()
}

const pauseMeditation = () => {
  isPlaying.value = false
  meditationStatus.value = '已暂停'
  clearTimers()
}

const stopMeditation = () => {
  isPlaying.value = false
  meditationStatus.value = '准备开始'
  remainingTime.value = selectedDuration.value * 60
  currentTipIndex = 0
  clearTimers()
}

const startMeditationTimer = () => {
  meditationTimer = setInterval(() => {
    if (!isPlaying.value) return
    
    remainingTime.value--
    
    if (remainingTime.value <= 0) {
      completeMeditation()
    }
  }, 1000)
}

const startTipRotation = () => {
  setInterval(() => {
    if (isPlaying.value) {
      currentTipIndex = (currentTipIndex + 1) % meditationTips.value.length
    }
  }, 30000) // 每30秒更换提示
}

const completeMeditation = () => {
  stopMeditation()
  
  // 添加冥想记录
  meditationRecords.value.unshift({
    id: Date.now(),
    themeName: currentTheme.value.name,
    date: new Date(),
    duration: selectedDuration.value
  })
  
  // 显示完成消息
  ElMessage.success('冥想完成！做得很好！')
}

const clearTimers = () => {
  if (meditationTimer) {
    clearInterval(meditationTimer)
    meditationTimer = null
  }
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 页面加载时的初始化
})

onUnmounted(() => {
  clearTimers()
})
</script>

<style scoped lang="scss">
.meditation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 100%);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.content-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  
  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #FF6B6B;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .page-desc {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

.meditation-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.theme-selector {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.section-title {
  color: #FF6B6B;
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.theme-card {
  background: #FAFAFA;
  border: 2px solid #E0E0E0;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #FFB6C1;
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #FF6B6B;
    background: #FFF0F0;
  }
}

.theme-icon {
  color: #FF6B6B;
  margin-bottom: 15px;
  
  .el-icon {
    font-size: 32px;
  }
}

.theme-name {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.theme-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.theme-duration {
  background: #FFB6C1;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.meditation-exercise {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  text-align: center;
}

.exercise-header {
  margin-bottom: 40px;
  
  .exercise-title {
    color: #FF6B6B;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .exercise-desc {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

.meditation-player {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  height: 300px;
  position: relative;
}

.player-container {
  position: relative;
  width: 200px;
  height: 200px;
}

.meditation-circle {
  width: 200px;
  height: 200px;
  border: 4px solid #FF6B6B;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%);
  position: relative;
  z-index: 2;
}

.circle-content {
  text-align: center;
  
  .meditation-icon {
    color: #FF6B6B;
    margin-bottom: 10px;
    
    .el-icon {
      font-size: 32px;
    }
  }
  
  .meditation-status {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  
  .meditation-time {
    font-size: 14px;
    color: #666;
  }
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 200px;
  z-index: 1;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.exercise-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.duration-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  
  label {
    color: #666;
    font-weight: 500;
  }
}

.control-buttons {
  display: flex;
  gap: 15px;
}

.start-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 12px 24px;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
  }
}

.pause-btn {
  color: #FF6B6B;
  border-color: #FF6B6B;
  
  &:hover {
    background: #FF6B6B;
    color: white;
  }
}

.stop-btn {
  color: #666;
  border-color: #E0E0E0;
  
  &:hover {
    color: #FF6B6B;
    border-color: #FF6B6B;
  }
}

.meditation-tips {
  background: #FAFAFA;
  padding: 20px;
  border-radius: 15px;
  border-left: 4px solid #FF6B6B;
  
  h4 {
    color: #FF6B6B;
    margin-bottom: 10px;
    font-size: 16px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
    font-size: 14px;
  }
}

.meditation-records {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #FAFAFA;
  border-radius: 10px;
  border-left: 4px solid #FF6B6B;
}

.record-info {
  h4 {
    color: #333;
    margin: 0 0 5px 0;
    font-size: 16px;
  }
  
  p {
    color: #666;
    margin: 0;
    font-size: 14px;
  }
}

.record-duration {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #FF6B6B;
  font-weight: 600;
}

.no-records {
  text-align: center;
  padding: 40px;
  color: #666;
  
  .no-records-icon {
    font-size: 48px;
    color: #FFB6C1;
    margin-bottom: 15px;
  }
  
  p {
    margin: 5px 0;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .theme-grid {
    grid-template-columns: 1fr;
  }
  
  .exercise-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .control-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
