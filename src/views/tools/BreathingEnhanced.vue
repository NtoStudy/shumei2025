<template>
  <div class="breathing-enhanced-page">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><WindPower /></el-icon>
        呼吸练习 Plus
      </h1>
      <p class="page-desc">多种科学呼吸模式，缓解焦虑，提升专注力</p>
    </div>

    <!-- 使用统计概览 -->
    <div class="stats-overview">
      <h3 class="section-title">
        <el-icon><TrendCharts /></el-icon>
        练习统计
      </h3>
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-content">
            <h4>总练习时间</h4>
            <p class="stat-number">{{ breathingStats.totalDuration }}</p>
            <p class="stat-desc">分钟</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Trophy /></el-icon>
          </div>
          <div class="stat-content">
            <h4>练习次数</h4>
            <p class="stat-number">{{ breathingStats.totalUsage }}</p>
            <p class="stat-desc">次</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Star /></el-icon>
          </div>
          <div class="stat-content">
            <h4>平均效果</h4>
            <p class="stat-number">{{ breathingStats.averageEffectiveness }}</p>
            <p class="stat-desc">分 (满分5分)</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="stat-content">
            <h4>连续天数</h4>
            <p class="stat-number">{{ breathingStats.streak }}</p>
            <p class="stat-desc">天</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 呼吸模式选择 -->
    <div class="pattern-selection">
      <h3 class="section-title">
        <el-icon><Grid /></el-icon>
        选择呼吸模式
      </h3>
      <div class="patterns-grid">
        <div 
          v-for="pattern in breathingPatterns" 
          :key="pattern.id"
          class="pattern-card"
          :class="{ selected: selectedPattern?.id === pattern.id }"
          @click="selectPattern(pattern)"
        >
          <div class="pattern-header">
            <div class="pattern-icon" :style="{ backgroundColor: pattern.color }">
              <el-icon><component :is="pattern.icon" /></el-icon>
            </div>
            <div class="pattern-level">{{ pattern.level }}</div>
          </div>
          <div class="pattern-content">
            <h4 class="pattern-name">{{ pattern.name }}</h4>
            <p class="pattern-desc">{{ pattern.description }}</p>
            <div class="pattern-details">
              <span class="detail-item">
                <el-icon><Timer /></el-icon>
                {{ pattern.duration }}分钟
              </span>
              <span class="detail-item">
                <el-icon><Star /></el-icon>
                {{ pattern.difficulty }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 练习设置 -->
    <div class="exercise-settings" v-if="selectedPattern">
      <h3 class="section-title">
        <el-icon><Setting /></el-icon>
        练习设置
      </h3>
      <div class="settings-panel">
        <div class="setting-group">
          <label class="setting-label">练习时长</label>
          <el-slider
            v-model="exerciseDuration"
            :min="1"
            :max="20"
            :step="1"
            :format-tooltip="(val) => `${val}分钟`"
            class="duration-slider"
          />
        </div>
        
        <div class="setting-group">
          <label class="setting-label">背景音乐</label>
          <el-select v-model="selectedMusic" placeholder="选择背景音乐" class="music-select">
            <el-option
              v-for="music in backgroundMusic"
              :key="music.id"
              :label="music.name"
              :value="music.id"
            />
          </el-select>
        </div>
        
        <div class="setting-group">
          <label class="setting-label">引导语音</label>
          <el-switch v-model="enableVoiceGuide" />
        </div>
        
        <div class="setting-group">
          <label class="setting-label">呼吸提示</label>
          <el-switch v-model="enableVisualCue" />
        </div>
      </div>
    </div>

    <!-- 呼吸练习区域 -->
    <div class="breathing-exercise" v-if="selectedPattern && !isActive">
      <div class="exercise-preview">
        <div class="preview-content">
          <h3>{{ selectedPattern.name }}</h3>
          <p class="pattern-guidance">{{ selectedPattern.guidance }}</p>
          <div class="breathing-rhythm">
            <div class="rhythm-item">
              <span class="rhythm-label">吸气</span>
              <span class="rhythm-time">{{ selectedPattern.inhale }}秒</span>
            </div>
            <div class="rhythm-item" v-if="selectedPattern.hold1 > 0">
              <span class="rhythm-label">屏气</span>
              <span class="rhythm-time">{{ selectedPattern.hold1 }}秒</span>
            </div>
            <div class="rhythm-item">
              <span class="rhythm-label">呼气</span>
              <span class="rhythm-time">{{ selectedPattern.exhale }}秒</span>
            </div>
            <div class="rhythm-item" v-if="selectedPattern.hold2 > 0">
              <span class="rhythm-label">屏气</span>
              <span class="rhythm-time">{{ selectedPattern.hold2 }}秒</span>
            </div>
          </div>
          <el-button 
            type="primary" 
            size="large" 
            @click="startExercise"
            class="start-btn"
          >
            <el-icon><VideoPlay /></el-icon>
            开始练习
          </el-button>
        </div>
      </div>
    </div>

    <!-- 练习进行中 -->
    <div class="breathing-active" v-if="isActive">
      <div class="exercise-header">
        <div class="exercise-info">
          <h3>{{ selectedPattern.name }}</h3>
          <div class="exercise-progress">
            <span class="current-cycle">第 {{ currentCycle }} 个周期</span>
            <span class="total-time">{{ formatTime(elapsedTime) }}</span>
          </div>
        </div>
        <el-button @click="pauseExercise" size="large" class="pause-btn">
          <el-icon><VideoPause /></el-icon>
          暂停
        </el-button>
      </div>

      <!-- 呼吸可视化 -->
      <div class="breathing-visualization">
        <div 
          class="breathing-circle"
          :class="[currentPhase, selectedPattern.animation]"
          :style="{ 
            borderColor: selectedPattern.color,
            boxShadow: `0 0 40px ${selectedPattern.color}40`
          }"
        >
          <div class="circle-inner">
            <div class="phase-text">{{ getPhaseText() }}</div>
            <div class="count-down">{{ phaseCountdown }}</div>
          </div>
        </div>
        
        <div class="breathing-instructions">
          <div class="instruction-text">{{ getCurrentInstruction() }}</div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ 
                width: `${phaseProgress}%`,
                backgroundColor: selectedPattern.color
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- 练习控制 -->
      <div class="exercise-controls">
        <el-button @click="stopExercise" size="large" type="danger" plain>
          <el-icon><VideoStop /></el-icon>
          结束练习
        </el-button>
      </div>
    </div>

    <!-- 练习完成反馈 -->
    <el-dialog
      v-model="showFeedback"
      title="练习完成"
      width="500px"
      :close-on-click-modal="false"
      class="feedback-dialog"
    >
      <div class="feedback-content">
        <div class="completion-celebration">
          <div class="celebration-icon">🎉</div>
          <h3>恭喜完成练习！</h3>
          <p>您刚刚完成了 {{ sessionDuration }} 分钟的{{ selectedPattern?.name }}</p>
        </div>
        
        <div class="feedback-form">
          <div class="rating-section">
            <h4>练习效果评分</h4>
            <el-rate
              v-model="sessionRating"
              :max="5"
              show-text
              :texts="['很差', '一般', '不错', '很好', '很棒']"
              class="effect-rating"
            />
          </div>
          
          <div class="notes-section">
            <h4>练习感受 <span class="optional">(可选)</span></h4>
            <el-input
              v-model="sessionNotes"
              type="textarea"
              :rows="3"
              placeholder="分享您的练习感受或心得..."
              maxlength="200"
              show-word-limit
            />
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="feedback-actions">
          <el-button @click="skipFeedback">跳过</el-button>
          <el-button type="primary" @click="submitFeedback">
            <el-icon><Check /></el-icon>
            提交反馈
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 最近练习记录 -->
    <div class="recent-sessions">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><Clock /></el-icon>
          最近练习
        </h3>
        <el-button @click="viewAllSessions" type="text" size="small">
          查看全部
        </el-button>
      </div>
      
      <div class="sessions-list">
        <div 
          v-for="session in recentSessions" 
          :key="session.id"
          class="session-item"
        >
          <div class="session-date">
            <span class="date">{{ formatDate(session.timestamp) }}</span>
            <span class="time">{{ formatTime(session.timestamp) }}</span>
          </div>
          <div class="session-details">
            <h5>{{ getPatternName(session.settings.patternId) }}</h5>
            <div class="session-meta">
              <span class="duration">{{ session.duration }}分钟</span>
              <span class="rating" v-if="session.effectiveness">
                <el-rate 
                  :model-value="session.effectiveness" 
                  disabled 
                  size="small"
                  show-score
                />
              </span>
            </div>
          </div>
          <div class="session-notes" v-if="session.notes">
            <p>{{ session.notes }}</p>
          </div>
        </div>
        
        <div v-if="!recentSessions.length" class="empty-sessions">
          <el-icon class="empty-icon"><DocumentRemove /></el-icon>
          <p>还没有练习记录</p>
          <p class="empty-tip">开始第一次呼吸练习吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useToolsStore } from '@/stores/tools'
import { ElMessage } from 'element-plus'

const toolsStore = useToolsStore()

// 响应式数据
const selectedPattern = ref(null)
const exerciseDuration = ref(5)
const selectedMusic = ref('nature')
const enableVoiceGuide = ref(true)
const enableVisualCue = ref(true)

// 练习状态
const isActive = ref(false)
const currentCycle = ref(0)
const currentPhase = ref('ready') // 'inhale', 'hold1', 'exhale', 'hold2'
const phaseCountdown = ref(0)
const phaseProgress = ref(0)
const elapsedTime = ref(0)
const startTime = ref(null)

// 反馈相关
const showFeedback = ref(false)
const sessionRating = ref(0)
const sessionNotes = ref('')
const sessionDuration = ref(0)

// 定时器
let exerciseTimer = null
let phaseTimer = null

// 呼吸模式数据
const breathingPatterns = ref([
  {
    id: 'basic',
    name: '基础呼吸法',
    description: '4-4-4-4节奏，适合初学者',
    guidance: '最简单的呼吸练习，帮助您建立呼吸节奏意识',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    duration: 5,
    color: '#3B82F6',
    icon: 'WindPower',
    level: '初级',
    difficulty: '简单',
    animation: 'circle'
  },
  {
    id: 'box',
    name: '方形呼吸法',
    description: '海军陆战队使用的呼吸技巧',
    guidance: '想象沿着正方形边缘呼吸，有助于快速降低压力',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    duration: 6,
    color: '#8B5CF6',
    icon: 'Grid',
    level: '中级',
    difficulty: '适中',
    animation: 'square'
  },
  {
    id: '478',
    name: '4-7-8呼吸法',
    description: 'Dr. Andrew Weil推荐的放松技巧',
    guidance: '强力的放松技巧，特别适合入睡前使用',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    duration: 7,
    color: '#10B981',
    icon: 'Timer',
    level: '高级',
    difficulty: '较难',
    animation: 'wave'
  },
  {
    id: 'triangle',
    name: '三角呼吸法',
    description: '简化的呼吸节奏',
    guidance: '三个阶段的呼吸，简单有效',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 0,
    duration: 5,
    color: '#F59E0B',
    icon: 'CaretTop',
    level: '初级',
    difficulty: '简单',
    animation: 'triangle'
  },
  {
    id: 'coherent',
    name: '共振呼吸法',
    description: '心律变异性优化呼吸',
    guidance: '与心脏节律同步，提升身心和谐',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0,
    duration: 8,
    color: '#06B6D4',
    icon: 'Connection',
    level: '中级',
    difficulty: '适中',
    animation: 'wave'
  },
  {
    id: 'energizing',
    name: '活力呼吸法',
    description: '快节奏呼吸，提升能量',
    guidance: '快速激活交感神经系统，提升专注力',
    inhale: 2,
    hold1: 0,
    exhale: 2,
    hold2: 0,
    duration: 3,
    color: '#EF4444',
    icon: 'Lightning',
    level: '高级',
    difficulty: '较难',
    animation: 'pulse'
  }
])

// 背景音乐选项
const backgroundMusic = ref([
  { id: 'none', name: '无音乐' },
  { id: 'nature', name: '自然之声' },
  { id: 'ocean', name: '海浪声' },
  { id: 'rain', name: '雨声' },
  { id: 'meditation', name: '冥想音乐' },
  { id: 'zen', name: '禅音' }
])

// 计算属性
const breathingStats = computed(() => {
  return toolsStore.getToolStats('breathing')
})

const recentSessions = computed(() => {
  return toolsStore.getUsageHistory('breathing', 5)
})

// 方法
const selectPattern = (pattern) => {
  selectedPattern.value = pattern
}

const startExercise = () => {
  if (!selectedPattern.value) return
  
  isActive.value = true
  currentCycle.value = 0
  elapsedTime.value = 0
  startTime.value = Date.now()
  
  startCycle()
  
  // 开始计时
  exerciseTimer = setInterval(() => {
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000)
    
    // 检查是否到达设定时间
    if (elapsedTime.value >= exerciseDuration.value * 60) {
      completeExercise()
    }
  }, 1000)
}

const startCycle = () => {
  currentCycle.value++
  startPhase('inhale')
}

const startPhase = (phase) => {
  currentPhase.value = phase
  const duration = selectedPattern.value[phase] || selectedPattern.value[phase === 'hold1' ? 'hold1' : phase === 'hold2' ? 'hold2' : phase]
  
  if (duration === 0) {
    // 跳过时长为0的阶段
    nextPhase()
    return
  }
  
  phaseCountdown.value = duration
  phaseProgress.value = 0
  
  const phaseStart = Date.now()
  phaseTimer = setInterval(() => {
    const elapsed = (Date.now() - phaseStart) / 1000
    phaseCountdown.value = Math.max(0, duration - Math.floor(elapsed))
    phaseProgress.value = Math.min(100, (elapsed / duration) * 100)
    
    if (elapsed >= duration) {
      clearInterval(phaseTimer)
      nextPhase()
    }
  }, 100)
}

const nextPhase = () => {
  const phases = ['inhale', 'hold1', 'exhale', 'hold2']
  const currentIndex = phases.indexOf(currentPhase.value)
  
  if (currentIndex < phases.length - 1) {
    const nextPhaseIndex = currentIndex + 1
    const nextPhaseName = phases[nextPhaseIndex]
    
    // 跳过时长为0的阶段
    if (selectedPattern.value[nextPhaseName] === 0) {
      if (nextPhaseIndex < phases.length - 1) {
        startPhase(phases[nextPhaseIndex + 1])
      } else {
        startCycle() // 开始新周期
      }
    } else {
      startPhase(nextPhaseName)
    }
  } else {
    startCycle() // 开始新周期
  }
}

const pauseExercise = () => {
  // 实现暂停逻辑
  clearInterval(exerciseTimer)
  clearInterval(phaseTimer)
  // 这里可以添加暂停状态管理
}

const stopExercise = () => {
  completeExercise()
}

const completeExercise = () => {
  isActive.value = false
  clearInterval(exerciseTimer)
  clearInterval(phaseTimer)
  
  sessionDuration.value = Math.floor(elapsedTime.value / 60)
  showFeedback.value = true
}

const submitFeedback = () => {
  const usageData = {
    toolType: 'breathing',
    toolName: selectedPattern.value.name,
    duration: sessionDuration.value,
    effectiveness: sessionRating.value,
    notes: sessionNotes.value,
    settings: {
      patternId: selectedPattern.value.id,
      duration: exerciseDuration.value,
      music: selectedMusic.value,
      voiceGuide: enableVoiceGuide.value,
      visualCue: enableVisualCue.value
    }
  }
  
  toolsStore.addUsageRecord(usageData)
  
  ElMessage.success('感谢您的反馈！')
  resetFeedback()
}

const skipFeedback = () => {
  const usageData = {
    toolType: 'breathing',
    toolName: selectedPattern.value.name,
    duration: sessionDuration.value,
    settings: {
      patternId: selectedPattern.value.id,
      duration: exerciseDuration.value
    }
  }
  
  toolsStore.addUsageRecord(usageData)
  resetFeedback()
}

const resetFeedback = () => {
  showFeedback.value = false
  sessionRating.value = 0
  sessionNotes.value = ''
  sessionDuration.value = 0
}

const getPhaseText = () => {
  const phaseTexts = {
    inhale: '吸气',
    hold1: '屏气',
    exhale: '呼气',
    hold2: '屏气'
  }
  return phaseTexts[currentPhase.value] || '准备'
}

const getCurrentInstruction = () => {
  const instructions = {
    inhale: '缓慢深呼吸，让腹部自然扩张',
    hold1: '保持呼吸，感受空气在肺部停留',
    exhale: '缓慢呼气，让紧张感随之释放',
    hold2: '保持自然状态，准备下一次呼吸'
  }
  return instructions[currentPhase.value] || '准备开始呼吸练习'
}

const formatTime = (timestamp) => {
  if (typeof timestamp === 'number' && timestamp < 3600) {
    // 如果是秒数且小于1小时
    const minutes = Math.floor(timestamp / 60)
    const seconds = timestamp % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  // 如果是时间戳
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  
  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const getPatternName = (patternId) => {
  const pattern = breathingPatterns.value.find(p => p.id === patternId)
  return pattern ? pattern.name : '未知模式'
}

const viewAllSessions = () => {
  // 跳转到详细记录页面
  ElMessage.info('功能开发中...')
}

onMounted(() => {
  // 初始化工具数据
  toolsStore.initializeStore()
})

onUnmounted(() => {
  if (exerciseTimer) clearInterval(exerciseTimer)
  if (phaseTimer) clearInterval(phaseTimer)
})
</script>

<style scoped lang="scss">
.breathing-enhanced-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  
  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #3B82F6;
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

.section-title {
  color: #3B82F6;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-overview {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #F8FAFC;
  border-radius: 12px;
  border-left: 4px solid #3B82F6;
  
  .stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
  }
  
  .stat-content {
    h4 {
      color: #666;
      margin: 0 0 5px 0;
      font-size: 14px;
    }
    
    .stat-number {
      color: #3B82F6;
      font-size: 24px;
      font-weight: 600;
      margin: 0;
    }
    
    .stat-desc {
      color: #999;
      font-size: 12px;
      margin: 0;
    }
  }
}

.pattern-selection {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.pattern-card {
  border: 2px solid #E5E7EB;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #3B82F6;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    transform: translateY(-2px);
  }
  
  &.selected {
    border-color: #3B82F6;
    background: #EFF6FF;
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
  }
  
  .pattern-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
    
    .pattern-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }
    
    .pattern-level {
      background: #F3F4F6;
      color: #6B7280;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
    }
  }
  
  .pattern-content {
    .pattern-name {
      color: #111827;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    
    .pattern-desc {
      color: #6B7280;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 15px 0;
    }
    
    .pattern-details {
      display: flex;
      gap: 15px;
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #6B7280;
        font-size: 12px;
        
        .el-icon {
          font-size: 14px;
        }
      }
    }
  }
}

.exercise-settings {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

.settings-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  
  .setting-group {
    .setting-label {
      display: block;
      color: #374151;
      font-weight: 500;
      margin-bottom: 10px;
    }
    
    .duration-slider {
      margin-top: 10px;
    }
    
    .music-select {
      width: 100%;
    }
  }
}

.breathing-exercise {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
  text-align: center;
}

.exercise-preview {
  .preview-content {
    h3 {
      color: #111827;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .pattern-guidance {
      color: #6B7280;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .breathing-rhythm {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      
      .rhythm-item {
        text-align: center;
        padding: 15px 20px;
        background: #F8FAFC;
        border-radius: 10px;
        min-width: 80px;
        
        .rhythm-label {
          display: block;
          color: #6B7280;
          font-size: 12px;
          margin-bottom: 5px;
        }
        
        .rhythm-time {
          display: block;
          color: #3B82F6;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    
    .start-btn {
      background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%);
      border: none;
      padding: 15px 30px;
      font-size: 16px;
      font-weight: 600;
      
      &:hover {
        background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
      }
    }
  }
}

.breathing-active {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  
  .exercise-info {
    h3 {
      color: #111827;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 10px 0;
    }
    
    .exercise-progress {
      display: flex;
      gap: 20px;
      color: #6B7280;
      font-size: 14px;
    }
  }
  
  .pause-btn {
    background: #F59E0B;
    border-color: #F59E0B;
    color: white;
    
    &:hover {
      background: #D97706;
      border-color: #D97706;
    }
  }
}

.breathing-visualization {
  text-align: center;
  margin-bottom: 40px;
  
  .breathing-circle {
    width: 200px;
    height: 200px;
    border: 4px solid #3B82F6;
    border-radius: 50%;
    margin: 0 auto 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s ease;
    
    &.inhale {
      transform: scale(1.2);
    }
    
    &.exhale {
      transform: scale(0.8);
    }
    
    &.hold1, &.hold2 {
      transform: scale(1.1);
    }
    
    .circle-inner {
      text-align: center;
      
      .phase-text {
        color: #111827;
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 10px;
      }
      
      .count-down {
        color: #3B82F6;
        font-size: 36px;
        font-weight: 700;
      }
    }
  }
  
  .breathing-instructions {
    .instruction-text {
      color: #6B7280;
      font-size: 16px;
      margin-bottom: 15px;
    }
    
    .progress-bar {
      width: 300px;
      height: 4px;
      background: #E5E7EB;
      border-radius: 2px;
      margin: 0 auto;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.1s linear;
      }
    }
  }
}

.exercise-controls {
  text-align: center;
  
  .el-button {
    padding: 12px 24px;
    font-size: 16px;
  }
}

.feedback-dialog {
  :deep(.el-dialog) {
    border-radius: 15px;
  }
  
  .feedback-content {
    .completion-celebration {
      text-align: center;
      margin-bottom: 30px;
      
      .celebration-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }
      
      h3 {
        color: #111827;
        font-size: 24px;
        font-weight: 600;
        margin: 0 0 10px 0;
      }
      
      p {
        color: #6B7280;
        font-size: 16px;
        margin: 0;
      }
    }
    
    .feedback-form {
      .rating-section,
      .notes-section {
        margin-bottom: 25px;
        
        h4 {
          color: #374151;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 15px 0;
          
          .optional {
            color: #9CA3AF;
            font-weight: 400;
            font-size: 14px;
          }
        }
        
        .effect-rating {
          justify-content: center;
        }
      }
    }
  }
  
  .feedback-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
}

.recent-sessions {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}

.sessions-list {
  .session-item {
    display: flex;
    gap: 15px;
    padding: 15px 0;
    border-bottom: 1px solid #F3F4F6;
    
    &:last-child {
      border-bottom: none;
    }
    
    .session-date {
      flex-shrink: 0;
      text-align: center;
      min-width: 80px;
      
      .date {
        display: block;
        color: #3B82F6;
        font-size: 14px;
        font-weight: 500;
      }
      
      .time {
        display: block;
        color: #9CA3AF;
        font-size: 12px;
      }
    }
    
    .session-details {
      flex: 1;
      
      h5 {
        color: #111827;
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 5px 0;
      }
      
      .session-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        
        .duration {
          color: #6B7280;
          font-size: 14px;
        }
        
        .rating {
          .el-rate {
            height: auto;
          }
        }
      }
    }
    
    .session-notes {
      flex: 1;
      
      p {
        color: #6B7280;
        font-size: 14px;
        margin: 0;
        font-style: italic;
      }
    }
  }
  
  .empty-sessions {
    text-align: center;
    padding: 40px 20px;
    color: #9CA3AF;
    
    .empty-icon {
      font-size: 48px;
      margin-bottom: 15px;
      color: #D1D5DB;
    }
    
    p {
      margin: 5px 0;
      
      &.empty-tip {
        font-size: 14px;
        color: #D1D5DB;
      }
    }
  }
}

// 动画样式
@keyframes breatheIn {
  from { transform: scale(1); }
  to { transform: scale(1.2); }
}

@keyframes breatheOut {
  from { transform: scale(1.2); }
  to { transform: scale(0.8); }
}

.breathing-circle {
  &.circle {
    &.inhale {
      animation: breatheIn 0.3s ease-out forwards;
    }
    
    &.exhale {
      animation: breatheOut 0.3s ease-out forwards;
    }
  }
}

@media (max-width: 768px) {
  .breathing-enhanced-page {
    padding: 15px;
  }
  
  .page-header .page-title {
    font-size: 24px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .patterns-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-panel {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .breathing-rhythm {
    justify-content: center;
    gap: 10px;
    
    .rhythm-item {
      min-width: 60px;
      padding: 10px 15px;
    }
  }
  
  .breathing-circle {
    width: 150px;
    height: 150px;
  }
  
  .exercise-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
    text-align: center;
  }
  
  .breathing-instructions .progress-bar {
    width: 250px;
  }
}
</style>
