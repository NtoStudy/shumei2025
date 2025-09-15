<template>
  <div class="relaxation-page">
    <AppHeader />
    
    <div class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><Timer /></el-icon>
            放松技巧
          </h1>
          <p class="page-desc">通过科学的放松技巧缓解身心压力，恢复平静状态</p>
        </div>
        
        <div class="relaxation-container">
          <!-- 放松技巧选择 -->
          <div class="technique-selector">
            <h3 class="section-title">选择放松技巧</h3>
            <div class="technique-grid">
              <div 
                v-for="technique in relaxationTechniques" 
                :key="technique.id"
                class="technique-card"
                :class="{ active: selectedTechnique === technique.id }"
                @click="selectTechnique(technique.id)"
              >
                <div class="technique-icon">
                  <el-icon><component :is="technique.icon" /></el-icon>
                </div>
                <h4 class="technique-name">{{ technique.name }}</h4>
                <p class="technique-desc">{{ technique.description }}</p>
                <div class="technique-duration">{{ technique.duration }}分钟</div>
              </div>
            </div>
          </div>
          
          <!-- 渐进式肌肉放松 -->
          <div class="relaxation-exercise" v-if="selectedTechnique === 'pmr'">
            <div class="exercise-header">
              <h3 class="exercise-title">渐进式肌肉放松</h3>
              <p class="exercise-desc">通过有意识地绷紧和放松不同肌肉群，减轻身体紧张感</p>
            </div>
            
            <div class="exercise-content">
              <div class="muscle-group-container">
                <div class="current-step" v-if="isRunning">
                  <div class="step-image">
                    <img :src="currentMuscleGroup.image || 'https://via.placeholder.com/300x200'" alt="肌肉组图示" />
                  </div>
                  <div class="step-instructions">
                    <h4>{{ currentMuscleGroup.name }}</h4>
                    <div class="instruction-text" v-if="tensionPhase">
                      <strong>绷紧:</strong> {{ currentMuscleGroup.tensionInstruction }}
                    </div>
                    <div class="instruction-text" v-else>
                      <strong>放松:</strong> {{ currentMuscleGroup.relaxationInstruction }}
                    </div>
                    <div class="countdown">{{ phaseDuration }}秒</div>
                  </div>
                </div>
                
                <div class="muscle-groups-overview" v-else>
                  <h4>肌肉放松顺序</h4>
                  <ol class="muscle-list">
                    <li v-for="group in muscleGroups" :key="group.id">{{ group.name }}</li>
                  </ol>
                  <p class="instruction-note">每个肌肉组将先绷紧5秒，然后放松10秒</p>
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
          </div>
          
          <!-- 引导想象放松 -->
          <div class="relaxation-exercise" v-if="selectedTechnique === 'guided-imagery'">
            <div class="exercise-header">
              <h3 class="exercise-title">引导想象放松</h3>
              <p class="exercise-desc">通过想象平静场景，帮助身心放松</p>
            </div>
            
            <div class="exercise-content">
              <div class="imagery-container">
                <div class="scene-image">
                  <img :src="currentScene.image || 'https://via.placeholder.com/600x300'" alt="放松场景" />
                </div>
                
                <div class="scene-instructions" v-if="isRunning">
                  <div class="instruction-text">
                    {{ currentInstruction }}
                  </div>
                </div>
                
                <div class="scene-selector" v-else>
                  <h4>选择想象场景</h4>
                  <div class="scene-options">
                    <div 
                      v-for="scene in imageryScenes" 
                      :key="scene.id"
                      class="scene-option"
                      :class="{ active: selectedScene === scene.id }"
                      @click="selectScene(scene.id)"
                    >
                      <img :src="scene.thumbnail || 'https://via.placeholder.com/100x100'" alt="场景缩略图" />
                      <span>{{ scene.name }}</span>
                    </div>
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
                    :disabled="!selectedScene"
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
                  <h4>{{ record.techniqueName }}</h4>
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
              <p>开始你的第一次放松练习吧！</p>
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

// 放松技巧数据
const relaxationTechniques = ref([
  {
    id: 'pmr',
    name: '渐进式肌肉放松',
    description: '通过有意识地绷紧和放松不同肌肉群，减轻身体紧张感',
    duration: 10,
    icon: 'User'
  },
  {
    id: 'guided-imagery',
    name: '引导想象放松',
    description: '通过想象平静场景，帮助身心放松',
    duration: 15,
    icon: 'Picture'
  }
])

// 肌肉组数据
const muscleGroups = ref([
  {
    id: 'hands',
    name: '双手和前臂',
    tensionInstruction: '握紧拳头，感受前臂肌肉的紧张',
    relaxationInstruction: '松开拳头，感受手部和前臂的放松',
    image: 'https://via.placeholder.com/300x200?text=双手和前臂'
  },
  {
    id: 'biceps',
    name: '上臂（二头肌）',
    tensionInstruction: '弯曲手肘，绷紧上臂肌肉',
    relaxationInstruction: '放松手臂，让它们自然下垂',
    image: 'https://via.placeholder.com/300x200?text=上臂'
  },
  {
    id: 'face',
    name: '面部肌肉',
    tensionInstruction: '皱眉、紧闭眼睛、抿嘴',
    relaxationInstruction: '放松面部，让表情自然舒展',
    image: 'https://via.placeholder.com/300x200?text=面部肌肉'
  },
  {
    id: 'neck',
    name: '颈部肌肉',
    tensionInstruction: '将头向后仰，感受颈部紧张',
    relaxationInstruction: '慢慢放松颈部，让头部回到自然位置',
    image: 'https://via.placeholder.com/300x200?text=颈部肌肉'
  },
  {
    id: 'shoulders',
    name: '肩膀',
    tensionInstruction: '耸肩，尽量靠近耳朵',
    relaxationInstruction: '放下肩膀，感受肩部的放松',
    image: 'https://via.placeholder.com/300x200?text=肩膀'
  },
  {
    id: 'chest',
    name: '胸部和背部',
    tensionInstruction: '深吸一口气，挺胸，绷紧背部肌肉',
    relaxationInstruction: '慢慢呼气，放松胸部和背部',
    image: 'https://via.placeholder.com/300x200?text=胸部和背部'
  },
  {
    id: 'abdomen',
    name: '腹部',
    tensionInstruction: '收紧腹部肌肉，就像准备承受腹部打击',
    relaxationInstruction: '放松腹部，让呼吸自然流动',
    image: 'https://via.placeholder.com/300x200?text=腹部'
  },
  {
    id: 'legs',
    name: '大腿和臀部',
    tensionInstruction: '绷紧大腿和臀部肌肉',
    relaxationInstruction: '放松大腿和臀部，感受重量下沉',
    image: 'https://via.placeholder.com/300x200?text=大腿和臀部'
  },
  {
    id: 'calves',
    name: '小腿',
    tensionInstruction: '脚尖向上翘，绷紧小腿肌肉',
    relaxationInstruction: '放松小腿，让脚自然放平',
    image: 'https://via.placeholder.com/300x200?text=小腿'
  },
  {
    id: 'feet',
    name: '脚部',
    tensionInstruction: '蜷曲脚趾，绷紧脚部肌肉',
    relaxationInstruction: '放松脚部，感受脚趾舒展',
    image: 'https://via.placeholder.com/300x200?text=脚部'
  }
])

// 想象场景数据
const imageryScenes = ref([
  {
    id: 'beach',
    name: '海滩',
    thumbnail: 'https://via.placeholder.com/100x100?text=海滩',
    image: 'https://via.placeholder.com/600x300?text=平静的海滩',
    instructions: [
      '闭上眼睛，想象你正站在一片宁静的海滩上',
      '感受温暖的阳光洒在你的皮肤上',
      '聆听海浪轻柔地拍打岸边的声音',
      '深吸一口气，闻到空气中的咸味',
      '感受脚下柔软的沙子，它温暖而舒适',
      '看着湛蓝的海水，平静而广阔',
      '让每一次呼吸都带走你的紧张和压力',
      '你感到无比放松和平静'
    ]
  },
  {
    id: 'forest',
    name: '森林',
    thumbnail: 'https://via.placeholder.com/100x100?text=森林',
    image: 'https://via.placeholder.com/600x300?text=宁静的森林',
    instructions: [
      '闭上眼睛，想象你正走在一片宁静的森林中',
      '阳光透过树叶洒下斑驳的光影',
      '聆听树叶沙沙作响和鸟儿歌唱的声音',
      '深吸一口气，闻到清新的松木和泥土的气息',
      '感受脚下柔软的苔藓和落叶',
      '看着周围高大的树木，它们给你带来安全感',
      '让每一次呼吸都带走你的紧张和压力',
      '你感到与自然融为一体，无比放松'
    ]
  },
  {
    id: 'mountain',
    name: '山顶',
    thumbnail: 'https://via.placeholder.com/100x100?text=山顶',
    image: 'https://via.placeholder.com/600x300?text=宁静的山顶',
    instructions: [
      '闭上眼睛，想象你正站在一座宁静的山顶上',
      '感受清新凉爽的空气拂过你的脸庞',
      '聆听远处的风声和鸟儿偶尔的鸣叫',
      '深吸一口气，闻到清新的空气和野花的香气',
      '感受脚下坚实的岩石，给你稳定的支撑',
      '看着远处连绵起伏的山脉和广阔的天空',
      '让每一次呼吸都带走你的紧张和压力',
      '你感到自己如此渺小却又与世界紧密相连'
    ]
  }
])

// 状态管理
const selectedTechnique = ref('')
const selectedScene = ref('')
const isRunning = ref(false)
const remainingTime = ref(0)
const progress = ref(0)
const currentMuscleGroupIndex = ref(0)
const tensionPhase = ref(true)
const phaseDuration = ref(5)
const currentInstructionIndex = ref(0)

// 定时器
let exerciseTimer = null
let phaseTimer = null

// 计算属性
const currentMuscleGroup = computed(() => {
  return muscleGroups.value[currentMuscleGroupIndex.value] || muscleGroups.value[0]
})

const currentScene = computed(() => {
  return imageryScenes.value.find(scene => scene.id === selectedScene.value) || {}
})

const currentInstruction = computed(() => {
  if (!currentScene.value.instructions) return ''
  return currentScene.value.instructions[currentInstructionIndex.value] || ''
})

// 练习记录
const practiceRecords = ref([])

const selectTechnique = (techniqueId) => {
  selectedTechnique.value = techniqueId
  stopExercise()
}

const selectScene = (sceneId) => {
  selectedScene.value = sceneId
}

const startExercise = () => {
  if (!selectedTechnique.value) return
  
  isRunning.value = true
  
  // 根据选择的技巧设置初始状态
  if (selectedTechnique.value === 'pmr') {
    currentMuscleGroupIndex.value = 0
    tensionPhase.value = true
    phaseDuration.value = 5 // 绷紧阶段5秒
    remainingTime.value = muscleGroups.value.length * 15 // 每个肌肉组15秒(5秒绷紧+10秒放松)
  } else if (selectedTechnique.value === 'guided-imagery') {
    if (!selectedScene.value) return
    currentInstructionIndex.value = 0
    remainingTime.value = currentScene.value.instructions.length * 15 // 每条指导15秒
  }
  
  progress.value = 0
  startExerciseTimer()
}

const pauseExercise = () => {
  isRunning.value = false
  clearTimers()
}

const stopExercise = () => {
  isRunning.value = false
  remainingTime.value = 0
  progress.value = 0
  currentMuscleGroupIndex.value = 0
  tensionPhase.value = true
  currentInstructionIndex.value = 0
  clearTimers()
}

const startExerciseTimer = () => {
  // 清除可能存在的定时器
  clearTimers()
  
  if (selectedTechnique.value === 'pmr') {
    startPMRExercise()
  } else if (selectedTechnique.value === 'guided-imagery') {
    startImageryExercise()
  }
  
  // 总体计时器
  exerciseTimer = setInterval(() => {
    if (!isRunning.value) return
    
    remainingTime.value--
    
    // 计算总体进度
    if (selectedTechnique.value === 'pmr') {
      const totalDuration = muscleGroups.value.length * 15
      progress.value = ((totalDuration - remainingTime.value) / totalDuration) * 100
    } else if (selectedTechnique.value === 'guided-imagery') {
      const totalDuration = currentScene.value.instructions.length * 15
      progress.value = ((totalDuration - remainingTime.value) / totalDuration) * 100
    }
    
    if (remainingTime.value <= 0) {
      completeExercise()
    }
  }, 1000)
}

const startPMRExercise = () => {
  phaseDuration.value = tensionPhase.value ? 5 : 10 // 绷紧5秒，放松10秒
  
  phaseTimer = setInterval(() => {
    if (!isRunning.value) return
    
    phaseDuration.value--
    
    if (phaseDuration.value <= 0) {
      // 切换阶段或肌肉组
      if (tensionPhase.value) {
        // 从绷紧切换到放松
        tensionPhase.value = false
        phaseDuration.value = 10 // 放松阶段10秒
      } else {
        // 从放松切换到下一个肌肉组的绷紧
        tensionPhase.value = true
        phaseDuration.value = 5 // 绷紧阶段5秒
        currentMuscleGroupIndex.value++
        
        // 检查是否完成所有肌肉组
        if (currentMuscleGroupIndex.value >= muscleGroups.value.length) {
          completeExercise()
          return
        }
      }
    }
  }, 1000)
}

const startImageryExercise = () => {
  phaseTimer = setInterval(() => {
    if (!isRunning.value) return
    
    // 每15秒切换一条指导语
    if (remainingTime.value % 15 === 0 && remainingTime.value > 0) {
      currentInstructionIndex.value++
      
      // 检查是否完成所有指导语
      if (currentInstructionIndex.value >= currentScene.value.instructions.length) {
        currentInstructionIndex.value = 0 // 循环播放指导语
      }
    }
  }, 1000)
}

const completeExercise = () => {
  // 停止练习
  stopExercise()
  
  // 添加练习记录
  const technique = relaxationTechniques.value.find(t => t.id === selectedTechnique.value)
  if (technique) {
    practiceRecords.value.unshift({
      id: Date.now(),
      techniqueName: technique.name,
      date: new Date(),
      duration: technique.duration
    })
  }
  
  // 显示完成消息
  ElMessage.success('练习完成！做得很好！')
}

const clearTimers = () => {
  if (exerciseTimer) {
    clearInterval(exerciseTimer)
    exerciseTimer = null
  }
  if (phaseTimer) {
    clearInterval(phaseTimer)
    phaseTimer = null
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
.relaxation-page {
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

.relaxation-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.technique-selector {
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

.technique-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.technique-card {
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

.technique-icon {
  color: #FF6B6B;
  margin-bottom: 15px;
  
  .el-icon {
    font-size: 32px;
  }
}

.technique-name {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.technique-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.technique-duration {
  background: #FFB6C1;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.relaxation-exercise {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.exercise-header {
  text-align: center;
  margin-bottom: 30px;
  
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

.exercise-content {
  margin-bottom: 30px;
}

.muscle-group-container {
  background: #FAFAFA;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.current-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
}

.step-image {
  width: 100%;
  max-width: 300px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
}

.step-instructions {
  flex: 1;
  padding: 20px;
  
  h4 {
    color: #FF6B6B;
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .instruction-text {
    color: #333;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .countdown {
    font-size: 24px;
    font-weight: 600;
    color: #FF6B6B;
  }
}

.muscle-groups-overview {
  text-align: center;
  
  h4 {
    color: #FF6B6B;
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .muscle-list {
    text-align: left;
    max-width: 400px;
    margin: 0 auto 20px;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      color: #333;
    }
  }
  
  .instruction-note {
    color: #666;
    font-style: italic;
  }
}

.imagery-container {
  background: #FAFAFA;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  min-height: 300px;
}

.scene-image {
  width: 100%;
  margin-bottom: 20px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    max-height: 300px;
    object-fit: cover;
  }
}

.scene-instructions {
  padding: 20px;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  
  .instruction-text {
    color: #333;
    font-size: 18px;
    line-height: 1.6;
    text-align: center;
    font-style: italic;
  }
}

.scene-selector {
  text-align: center;
  
  h4 {
    color: #FF6B6B;
    font-size: 20px;
    margin-bottom: 20px;
  }
}

.scene-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.scene-option {
  width: 120px;
  cursor: pointer;
  transition: all 0.3s;
  
  img {
    width: 100%;
    height: 80px;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid transparent;
    margin-bottom: 8px;
  }
  
  span {
    display: block;
    text-align: center;
    color: #333;
  }
  
  &:hover img {
    border-color: #FFB6C1;
  }
  
  &.active img {
    border-color: #FF6B6B;
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
  
  .technique-grid {
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