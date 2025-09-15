<template>
  <div class="breathing-page">

    <div class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><WindPower /></el-icon>
            呼吸练习
          </h1>
          <p class="page-desc">通过科学的呼吸方法缓解焦虑，放松身心</p>
        </div>

        <div class="breathing-container">
      <!-- 呼吸模式选择 -->
      <div class="pattern-selector">
        <h3 class="section-title">选择呼吸模式</h3>
        <div class="pattern-grid">
              <div
                v-for="pattern in breathingPatterns"
                :key="pattern.id"
                class="pattern-card"
                :class="{ active: selectedPattern === pattern.id }"
                @click="selectPattern(pattern.id)"
              >
                <div class="pattern-icon">
                  <el-icon><component :is="pattern.icon" /></el-icon>
                </div>
                <h4 class="pattern-name">{{ pattern.name }}</h4>
                <p class="pattern-desc">{{ pattern.description }}</p>
                <div class="pattern-duration">{{ pattern.duration }}分钟</div>
              </div>
            </div>
          </div>

          <!-- 呼吸练习区域 -->
          <div class="breathing-exercise" v-if="selectedPattern">
            <div class="exercise-header">
              <h3 class="exercise-title">{{ currentPattern.name }}</h3>
              <p class="exercise-desc">{{ currentPattern.description }}</p>
            </div>

            <div class="breathing-circle-container">
              <div
                class="breathing-circle"
                :class="{
                  'inhale': isInhaling,
                  'exhale': isExhaling,
                  'hold': isHolding,
                  [`animation-${currentPattern.animation || 'circle'}`]: true
                }"
                :style="{
                  transform: `scale(${circleScale})`,
                  opacity: circleOpacity,
                  '--primary-color': currentPattern.color || '#FF6B6B',
                  '--secondary-color': currentPattern.color ? `${currentPattern.color}33` : '#FF6B6B33'
                }"
              >
                <div class="circle-content">
                  <div class="breathing-text">{{ breathingText }}</div>
                  <div class="breathing-count">{{ breathingCount }}</div>
                  <div class="breathing-guidance" v-if="!isRunning && currentPattern.guidance">{{ currentPattern.guidance }}</div>
                </div>
              </div>
            </div>

            <div class="exercise-controls">
              <div class="timer-display">
                <el-icon><Timer /></el-icon>
                <span>{{ formatTime(remainingTime) }}</span>
              </div>

              <div class="control-buttons">
                <el-button
                  v-if="!isRunning"
                  type="primary"
                  @click="startExercise"
                  class="start-btn"
                >
                  <el-icon><VideoPlay /></el-icon>
                  开始练习
                </el-button>
                <el-button
                  v-if="isRunning"
                  @click="pauseExercise"
                  class="pause-btn"
                >
                  <el-icon><VideoPause /></el-icon>
                  暂停
                </el-button>
                <el-button
                  v-if="isRunning"
                  @click="stopExercise"
                  class="stop-btn"
                >
                  <el-icon><VideoStop /></el-icon>
                  停止
                </el-button>
              </div>
            </div>

            <div class="progress-section" v-if="isRunning">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${progress}%` }"
                ></div>
              </div>
              <div class="progress-text">进度: {{ Math.round(progress) }}%</div>
            </div>
          </div>

          <!-- 练习记录 -->
          <div class="practice-records">
            <h3 class="section-title">练习记录</h3>
            <div class="records-list" v-if="practiceRecords.length > 0">
              <div
                v-for="record in practiceRecords"
                :key="record.id"
                class="record-item"
              >
                <div class="record-info">
                  <h4>{{ record.patternName }}</h4>
                  <p>{{ formatDate(record.date) }} - {{ record.duration }}分钟</p>
                </div>
                <div class="record-duration">
                  <el-icon><Timer /></el-icon>
                  {{ record.duration }}分钟
                </div>
              </div>
            </div>
            <div class="no-records" v-else>
              <el-icon class="no-records-icon"><Timer /></el-icon>
              <p>还没有练习记录</p>
              <p>开始你的第一次呼吸练习吧！</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'

// 呼吸模式数据
const breathingPatterns = ref([
  {
    id: '4-4-4-4',
    name: '4-4-4-4呼吸法',
    description: '吸气4秒，屏气4秒，呼气4秒，屏气4秒',
    duration: 5,
    icon: 'WindPower',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    color: '#4ECDC4',
    animation: 'square',
    guidance: '通过鼻子缓慢吸气，感受腹部扩张，然后屏住呼吸，通过嘴巴缓慢呼气，再次屏住呼吸。'
  },
  {
    id: '4-7-8',
    name: '4-7-8呼吸法',
    description: '吸气4秒，屏气7秒，呼气8秒',
    duration: 10,
    icon: 'Timer',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    color: '#FF6B6B',
    animation: 'wave',
    guidance: '通过鼻子安静地吸气，屏住呼吸，然后通过嘴巴发出"嘘"的声音缓慢呼气，直到肺部完全排空。'
  },
  {
    id: 'box',
    name: '方形呼吸法',
    description: '吸气4秒，屏气4秒，呼气4秒，屏气4秒',
    duration: 8,
    icon: 'Grid',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    color: '#5A67D8',
    animation: 'square',
    guidance: '想象沿着一个正方形的边缘呼吸：上边吸气，右边屏气，下边呼气，左边屏气，形成一个完整的循环。'
  },
  {
    id: 'triangle',
    name: '三角形呼吸法',
    description: '吸气4秒，屏气4秒，呼气4秒',
    duration: 6,
    icon: 'CaretTop',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 0,
    color: '#F4A261',
    animation: 'circle',
    guidance: '想象沿着三角形的边缘呼吸：第一边吸气，第二边屏气，第三边呼气，形成一个完整的循环。'
  },
  {
    id: 'coherent',
    name: '共振呼吸法',
    description: '吸气5秒，呼气5秒，形成共振频率',
    duration: 7,
    icon: 'Connection',
    inhale: 5,
    hold1: 0,
    exhale: 5,
    hold2: 0,
    color: '#2A9D8F',
    animation: 'wave',
    guidance: '以每分钟约6次的频率呼吸，吸气和呼气时间相等，创造心脏、呼吸和神经系统之间的和谐。'
  },
  {
    id: 'alternate',
    name: '交替鼻孔呼吸法',
    description: '左右鼻孔交替呼吸',
    duration: 9,
    icon: 'Switch',
    inhale: 4,
    hold1: 2,
    exhale: 4,
    hold2: 0,
    color: '#E76F51',
    animation: 'alternate',
    guidance: '用右手拇指关闭右鼻孔，从左鼻孔吸气，然后换用无名指关闭左鼻孔，从右鼻孔呼气，再从右鼻孔吸气，左鼻孔呼气，形成一个完整循环。'
  }
])

// 状态管理
const selectedPattern = ref('')
const isRunning = ref(false)
const isInhaling = ref(false)
const isExhaling = ref(false)
const isHolding = ref(false)
const breathingCount = ref(0)
const remainingTime = ref(0)
const progress = ref(0)

// 定时器
let breathingTimer = null
let exerciseTimer = null

// 计算属性
const currentPattern = computed(() => {
  return breathingPatterns.value.find(p => p.id === selectedPattern.value) || {}
})

const breathingText = computed(() => {
  if (isInhaling.value) return '吸气'
  if (isExhaling.value) return '呼气'
  if (isHolding.value) return '屏气'
  return '准备开始'
})

const circleScale = computed(() => {
  if (isInhaling.value) return 1.2
  if (isExhaling.value) return 0.8
  return 1
})

const circleOpacity = computed(() => {
  if (isInhaling.value) return 0.8
  if (isExhaling.value) return 0.6
  return 1
})

// 练习记录
const practiceRecords = ref([
  {
    id: 1,
    patternName: '4-4-4-4呼吸法',
    date: new Date(),
    duration: 5
  }
])

const selectPattern = (patternId) => {
  selectedPattern.value = patternId
  stopExercise()
}

const startExercise = () => {
  if (!selectedPattern.value) return

  isRunning.value = true
  remainingTime.value = currentPattern.value.duration * 60
  progress.value = 0
  breathingCount.value = 0

  startBreathingCycle()
  startExerciseTimer()
}

const pauseExercise = () => {
  isRunning.value = false
  clearTimers()
}

const stopExercise = () => {
  isRunning.value = false
  isInhaling.value = false
  isExhaling.value = false
  isHolding.value = false
  breathingCount.value = 0
  remainingTime.value = 0
  progress.value = 0
  clearTimers()
}

const startBreathingCycle = () => {
  const pattern = currentPattern.value
  let phase = 'inhale'
  let phaseTime = 0

  const cycle = () => {
    if (!isRunning.value) return

    phaseTime++

    switch (phase) {
      case 'inhale':
        isInhaling.value = true
        isExhaling.value = false
        isHolding.value = false
        if (phaseTime >= pattern.inhale) {
          phase = 'hold1'
          phaseTime = 0
        }
        break
      case 'hold1':
        isInhaling.value = false
        isExhaling.value = false
        isHolding.value = true
        if (phaseTime >= pattern.hold1) {
          phase = 'exhale'
          phaseTime = 0
        }
        break
      case 'exhale':
        isInhaling.value = false
        isExhaling.value = true
        isHolding.value = false
        if (phaseTime >= pattern.exhale) {
          phase = 'hold2'
          phaseTime = 0
        }
        break
      case 'hold2':
        isInhaling.value = false
        isExhaling.value = false
        isHolding.value = true
        if (phaseTime >= pattern.hold2) {
          phase = 'inhale'
          phaseTime = 0
          breathingCount.value++
        }
        break
    }

    breathingTimer = setTimeout(cycle, 1000)
  }

  cycle()
}

const startExerciseTimer = () => {
  exerciseTimer = setInterval(() => {
    if (!isRunning.value) return

    remainingTime.value--
    progress.value = ((currentPattern.value.duration * 60 - remainingTime.value) / (currentPattern.value.duration * 60)) * 100

    if (remainingTime.value <= 0) {
      completeExercise()
    }
  }, 1000)
}

const completeExercise = () => {
  stopExercise()

  // 添加练习记录
  practiceRecords.value.unshift({
    id: Date.now(),
    patternName: currentPattern.value.name,
    date: new Date(),
    duration: currentPattern.value.duration
  })

  // 显示完成消息
  ElMessage.success('练习完成！做得很好！')
}

const clearTimers = () => {
  if (breathingTimer) {
    clearTimeout(breathingTimer)
    breathingTimer = null
  }
  if (exerciseTimer) {
    clearInterval(exerciseTimer)
    exerciseTimer = null
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
.breathing-page {
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

.breathing-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.pattern-selector {
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

.pattern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.pattern-card {
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

.pattern-icon {
  color: #FF6B6B;
  margin-bottom: 15px;

  .el-icon {
    font-size: 32px;
  }
}

.pattern-name {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.pattern-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.pattern-duration {
  background: #FFB6C1;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.breathing-exercise {
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

.breathing-circle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  height: 300px;
}

.breathing-circle {
  width: 200px;
  height: 200px;
  border: 4px solid var(--primary-color, #FF6B6B);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  background: linear-gradient(135deg, var(--primary-color, #FFB6C1) 0%, var(--secondary-color, #FFC0CB) 100%);
  position: relative;
  overflow: hidden;

  &.inhale {
    border-color: #87CEEB;
    background: linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%);
  }

  &.exhale {
    border-color: #98FB98;
    background: linear-gradient(135deg, #98FB98 0%, #90EE90 100%);
  }

  &.hold {
    border-color: #DDA0DD;
    background: linear-gradient(135deg, #DDA0DD 0%, #EE82EE 100%);
  }

  &.animation-square {
    border-radius: 15px;

    &.inhale {
      transform: scale(1.2) rotate(0deg) !important;
    }

    &.hold {
      transform: scale(1.2) rotate(90deg) !important;
    }

    &.exhale {
      transform: scale(0.8) rotate(180deg) !important;
    }
  }

  &.animation-wave {
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50% 50% 0 0;
      transition: height 1s ease;
    }

    &.inhale::before {
      height: 80%;
    }

    &.exhale::before {
      height: 20%;
    }
  }

  &.animation-alternate {
    position: relative;
    overflow: hidden;

    &::before, &::after {
      content: '';
      position: absolute;
      width: 50%;
      height: 100%;
      top: 0;
      background: rgba(255, 255, 255, 0.2);
      transition: opacity 1s ease;
    }

    &::before {
      left: 0;
      opacity: 0;
    }

    &::after {
      right: 0;
      opacity: 0;
    }

    &.inhale::before {
      opacity: 1;
    }

    &.exhale::after {
      opacity: 1;
    }
  }
}

.circle-content {
  text-align: center;

  .breathing-text {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }

  .breathing-count {
    font-size: 16px;
    color: #666;
    margin-bottom: 8px;
  }

  .breathing-guidance {
    color: #333;
    font-size: 14px;
    text-align: center;
    max-width: 90%;
    line-height: 1.4;
    opacity: 0.9;
    margin-top: 10px;
  }
}

.exercise-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #FF6B6B;
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

.progress-section {
  .progress-bar {
    width: 100%;
    height: 8px;
    background: #E0E0E0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
    transition: width 0.3s ease;
  }

  .progress-text {
    text-align: center;
    color: #666;
    font-size: 14px;
  }
}

.practice-records {
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

  .pattern-grid {
    grid-template-columns: 1fr;
  }

  .breathing-circle {
    width: 150px;
    height: 150px;
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
