<template>
  <div class="emotion-diary-page">
    <div class="diary-header">
      <h1 class="page-title">
        <el-icon><Edit /></el-icon>
        情绪日记
      </h1>
      <p class="page-desc">记录此刻的心情，让情绪有迹可循</p>
    </div>

    <!-- 今日情绪快览 -->
    <div class="today-emotions" v-if="todayEmotions.length">
      <h3 class="section-title">
        <el-icon><Calendar /></el-icon>
        今日已记录
      </h3>
      <div class="emotion-timeline">
        <div 
          v-for="emotion in todayEmotions" 
          :key="emotion.id"
          class="timeline-item"
          @click="editEmotion(emotion)"
        >
          <div class="timeline-dot">
            <span class="emotion-emoji">{{ emotion.emotion.emoji }}</span>
          </div>
          <div class="timeline-content">
            <div class="emotion-info">
              <span class="emotion-type">{{ getEmotionLabel(emotion.emotion.type) }}</span>
              <span class="emotion-time">{{ formatTime(emotion.timestamp) }}</span>
            </div>
            <div class="emotion-intensity">
              <div class="intensity-bar">
                <div 
                  class="intensity-fill" 
                  :style="{ width: (emotion.emotion.intensity * 10) + '%' }"
                ></div>
              </div>
              <span class="intensity-value">{{ emotion.emotion.intensity }}/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 情绪记录表单 -->
    <div class="emotion-form-section">
      <h3 class="section-title">
        <el-icon><Plus /></el-icon>
        {{ editingEmotion ? '编辑情绪记录' : '新增情绪记录' }}
      </h3>
      
      <div class="emotion-form">
        <!-- 情绪选择 -->
        <div class="form-section">
          <h4 class="form-section-title">选择情绪类型</h4>
          <div class="emotion-types">
            <div 
              v-for="emotionType in emotionTypes" 
              :key="emotionType.type"
              class="emotion-type-card"
              :class="{ selected: selectedEmotion.type === emotionType.type }"
              @click="selectEmotionType(emotionType)"
            >
              <div class="emotion-icon">{{ emotionType.emoji }}</div>
              <div class="emotion-label">{{ emotionType.label }}</div>
              <div class="emotion-desc">{{ emotionType.description }}</div>
            </div>
          </div>
        </div>

        <!-- 情绪强度 -->
        <div class="form-section" v-if="selectedEmotion.type">
          <h4 class="form-section-title">情绪强度</h4>
          <div class="intensity-selector">
            <div class="intensity-scale">
              <div 
                v-for="level in 10" 
                :key="level"
                class="intensity-point"
                :class="{ 
                  selected: selectedEmotion.intensity === level,
                  active: selectedEmotion.intensity >= level 
                }"
                @click="selectedEmotion.intensity = level"
              >
                {{ level }}
              </div>
            </div>
            <div class="intensity-labels">
              <span class="intensity-label-left">轻微</span>
              <span class="intensity-label-center">中等</span>
              <span class="intensity-label-right">强烈</span>
            </div>
            <div class="intensity-preview">
              <div class="preview-emotion">
                <span class="preview-emoji">{{ selectedEmotion.emoji }}</span>
                <span class="preview-text">
                  {{ getIntensityText(selectedEmotion.intensity) }}的{{ getEmotionLabel(selectedEmotion.type) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 情绪描述 -->
        <div class="form-section" v-if="selectedEmotion.type">
          <h4 class="form-section-title">情绪描述</h4>
          <el-input
            v-model="emotionContent"
            type="textarea"
            :rows="4"
            placeholder="描述一下你的感受，或者记录引发这种情绪的事件..."
            maxlength="500"
            show-word-limit
            class="emotion-textarea"
          />
        </div>

        <!-- 情绪触发因素 -->
        <div class="form-section" v-if="selectedEmotion.type">
          <h4 class="form-section-title">触发因素 <span class="optional">(可选)</span></h4>
          <div class="triggers-section">
            <div class="common-triggers">
              <div class="trigger-category">
                <h5>学习相关</h5>
                <div class="trigger-tags">
                  <el-tag 
                    v-for="trigger in studyTriggers" 
                    :key="trigger"
                    :type="selectedTriggers.includes(trigger) ? 'primary' : 'info'"
                    class="trigger-tag"
                    @click="toggleTrigger(trigger)"
                    effect="plain"
                  >
                    {{ trigger }}
                  </el-tag>
                </div>
              </div>
              
              <div class="trigger-category">
                <h5>人际关系</h5>
                <div class="trigger-tags">
                  <el-tag 
                    v-for="trigger in socialTriggers" 
                    :key="trigger"
                    :type="selectedTriggers.includes(trigger) ? 'primary' : 'info'"
                    class="trigger-tag"
                    @click="toggleTrigger(trigger)"
                    effect="plain"
                  >
                    {{ trigger }}
                  </el-tag>
                </div>
              </div>
              
              <div class="trigger-category">
                <h5>生活状态</h5>
                <div class="trigger-tags">
                  <el-tag 
                    v-for="trigger in lifeTriggers" 
                    :key="trigger"
                    :type="selectedTriggers.includes(trigger) ? 'primary' : 'info'"
                    class="trigger-tag"
                    @click="toggleTrigger(trigger)"
                    effect="plain"
                  >
                    {{ trigger }}
                  </el-tag>
                </div>
              </div>
            </div>
            
            <div class="custom-trigger">
              <el-input
                v-model="customTrigger"
                placeholder="添加自定义触发因素"
                @keyup.enter="addCustomTrigger"
                class="custom-trigger-input"
              >
                <template #append>
                  <el-button @click="addCustomTrigger" :disabled="!customTrigger.trim()">
                    <el-icon><Plus /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions" v-if="selectedEmotion.type">
          <el-button 
            v-if="editingEmotion"
            @click="cancelEdit"
            class="cancel-btn"
          >
            取消编辑
          </el-button>
          <el-button 
            type="primary" 
            @click="saveEmotion"
            :loading="saving"
            class="save-btn"
            size="large"
          >
            <el-icon><Check /></el-icon>
            {{ editingEmotion ? '更新记录' : '保存记录' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions" v-if="!selectedEmotion.type">
      <h3 class="section-title">
        <el-icon><Lightning /></el-icon>
        快速记录
      </h3>
      <div class="quick-emotion-buttons">
        <div 
          v-for="emotion in quickEmotions" 
          :key="emotion.type"
          class="quick-emotion-btn"
          @click="quickRecord(emotion)"
        >
          <div class="quick-emotion-icon">{{ emotion.emoji }}</div>
          <div class="quick-emotion-label">{{ emotion.label }}</div>
        </div>
      </div>
    </div>

    <!-- 记录历史 -->
    <div class="history-section">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><Clock /></el-icon>
          最近记录
        </h3>
        <el-button @click="goToChart" type="text" size="small">
          <el-icon><TrendCharts /></el-icon>
          查看图表分析
        </el-button>
      </div>
      
      <div class="emotion-history">
        <div 
          v-for="emotion in recentEmotions" 
          :key="emotion.id"
          class="history-item"
        >
          <div class="history-date">
            <span class="date">{{ formatDate(emotion.timestamp) }}</span>
            <span class="time">{{ formatTime(emotion.timestamp) }}</span>
          </div>
          <div class="history-emotion">
            <span class="emotion-emoji">{{ emotion.emotion.emoji }}</span>
            <span class="emotion-type">{{ getEmotionLabel(emotion.emotion.type) }}</span>
            <span class="emotion-intensity">{{ emotion.emotion.intensity }}/10</span>
          </div>
          <div class="history-content" v-if="emotion.content">
            {{ emotion.content }}
          </div>
          <div class="history-actions">
            <el-button @click="editEmotion(emotion)" type="text" size="small">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button @click="deleteEmotion(emotion.id)" type="text" size="small" class="delete-btn">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>
        </div>
        
        <div v-if="!recentEmotions.length" class="empty-history">
          <el-icon class="empty-icon"><DocumentRemove /></el-icon>
          <p>还没有情绪记录</p>
          <p class="empty-tip">开始记录你的第一个情绪吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmotionStore } from '@/stores/emotion'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const emotionStore = useEmotionStore()

// 响应式数据
const selectedEmotion = reactive({
  type: '',
  emoji: '',
  color: '',
  intensity: 5
})

const emotionContent = ref('')
const selectedTriggers = ref([])
const customTrigger = ref('')
const saving = ref(false)
const editingEmotion = ref(null)

// 情绪类型数据
const emotionTypes = [
  {
    type: 'happy',
    label: '开心',
    emoji: '😊',
    color: '#FFD700',
    description: '感到愉快、满足'
  },
  {
    type: 'sad',
    label: '难过',
    emoji: '😢',
    color: '#87CEEB',
    description: '感到沮丧、失落'
  },
  {
    type: 'anxious',
    label: '焦虑',
    emoji: '😰',
    color: '#FFA500',
    description: '感到紧张、担心'
  },
  {
    type: 'angry',
    label: '愤怒',
    emoji: '😠',
    color: '#FF6B6B',
    description: '感到生气、恼怒'
  },
  {
    type: 'calm',
    label: '平静',
    emoji: '😌',
    color: '#98FB98',
    description: '感到宁静、放松'
  },
  {
    type: 'excited',
    label: '兴奋',
    emoji: '🤩',
    color: '#FF69B4',
    description: '感到激动、充满活力'
  },
  {
    type: 'tired',
    label: '疲惫',
    emoji: '😴',
    color: '#D3D3D3',
    description: '感到疲劳、无力'
  },
  {
    type: 'confused',
    label: '困惑',
    emoji: '😕',
    color: '#DDA0DD',
    description: '感到迷茫、不确定'
  }
]

// 快速记录情绪
const quickEmotions = [
  { type: 'happy', label: '开心', emoji: '😊' },
  { type: 'sad', label: '难过', emoji: '😢' },
  { type: 'anxious', label: '焦虑', emoji: '😰' },
  { type: 'tired', label: '疲惫', emoji: '😴' }
]

// 触发因素分类
const studyTriggers = ['考试压力', '作业繁重', '学习困难', '成绩不理想', '学业竞争']
const socialTriggers = ['人际冲突', '社交焦虑', '孤独感', '被误解', '人际压力']
const lifeTriggers = ['睡眠不足', '身体不适', '经济压力', '家庭问题', '未来担忧']

// 计算属性
const todayEmotions = computed(() => {
  return emotionStore.todayEmotions.slice().reverse()
})

const recentEmotions = computed(() => {
  return emotionStore.emotions.slice().reverse().slice(0, 10)
})

// 方法
const getEmotionLabel = (type) => {
  const emotion = emotionTypes.find(e => e.type === type)
  return emotion ? emotion.label : type
}

const getIntensityText = (intensity) => {
  if (intensity <= 3) return '轻微'
  if (intensity <= 6) return '中等'
  if (intensity <= 8) return '较强'
  return '强烈'
}

const formatTime = (timestamp) => {
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

const selectEmotionType = (emotionType) => {
  Object.assign(selectedEmotion, {
    type: emotionType.type,
    emoji: emotionType.emoji,
    color: emotionType.color
  })
}

const toggleTrigger = (trigger) => {
  const index = selectedTriggers.value.indexOf(trigger)
  if (index > -1) {
    selectedTriggers.value.splice(index, 1)
  } else {
    selectedTriggers.value.push(trigger)
  }
}

const addCustomTrigger = () => {
  if (customTrigger.value.trim()) {
    selectedTriggers.value.push(customTrigger.value.trim())
    customTrigger.value = ''
  }
}

const quickRecord = async (emotion) => {
  selectEmotionType(emotionTypes.find(e => e.type === emotion.type))
  selectedEmotion.intensity = 5
  await saveEmotion()
}

const saveEmotion = async () => {
  if (!selectedEmotion.type) {
    ElMessage.warning('请选择情绪类型')
    return
  }
  
  saving.value = true
  
  try {
    const emotionData = {
      type: selectedEmotion.type,
      emoji: selectedEmotion.emoji,
      color: selectedEmotion.color,
      intensity: selectedEmotion.intensity,
      content: emotionContent.value,
      triggers: selectedTriggers.value,
      tags: selectedTriggers.value
    }
    
    if (editingEmotion.value) {
      // 更新现有记录
      const index = emotionStore.emotions.findIndex(e => e.id === editingEmotion.value.id)
      if (index > -1) {
        emotionStore.emotions[index] = {
          ...editingEmotion.value,
          emotion: emotionData.emotion || {
            type: emotionData.type,
            emoji: emotionData.emoji,
            color: emotionData.color,
            intensity: emotionData.intensity
          },
          content: emotionData.content,
          triggers: emotionData.triggers,
          tags: emotionData.tags,
          timestamp: editingEmotion.value.timestamp
        }
      }
      ElMessage.success('情绪记录更新成功！')
    } else {
      // 添加新记录
      emotionStore.addEmotion(emotionData)
      ElMessage.success('情绪记录保存成功！')
    }
    
    // 重置表单
    resetForm()
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const editEmotion = (emotion) => {
  editingEmotion.value = emotion
  
  // 填充表单
  Object.assign(selectedEmotion, {
    type: emotion.emotion.type,
    emoji: emotion.emotion.emoji,
    color: emotion.emotion.color,
    intensity: emotion.emotion.intensity
  })
  
  emotionContent.value = emotion.content || ''
  selectedTriggers.value = [...(emotion.triggers || [])]
  
  // 滚动到表单顶部
  document.querySelector('.emotion-form-section').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  })
}

const cancelEdit = () => {
  editingEmotion.value = null
  resetForm()
}

const deleteEmotion = async (emotionId) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条情绪记录吗？',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    const index = emotionStore.emotions.findIndex(e => e.id === emotionId)
    if (index > -1) {
      emotionStore.emotions.splice(index, 1)
      ElMessage.success('情绪记录已删除')
    }
  } catch (error) {
    // 用户取消删除
  }
}

const resetForm = () => {
  Object.assign(selectedEmotion, {
    type: '',
    emoji: '',
    color: '',
    intensity: 5
  })
  emotionContent.value = ''
  selectedTriggers.value = []
  customTrigger.value = ''
  editingEmotion.value = null
}

const goToChart = () => {
  router.push('/emotion/chart')
}

onMounted(() => {
  // 页面加载时更新统计数据
  emotionStore.updateStats()
})
</script>

<style scoped lang="scss">

.diary-header {
  text-align: center;
  margin-bottom: 30px;
  
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

.section-title {
  color: #FF6B6B;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.today-emotions {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.emotion-timeline {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
  padding: 15px;
  background: #F8F9FA;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #F0F0F0;
    transform: translateY(-2px);
  }
  
  .timeline-dot {
    .emotion-emoji {
      font-size: 24px;
    }
  }
  
  .timeline-content {
    flex: 1;
    
    .emotion-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .emotion-type {
        font-weight: 500;
        color: #333;
      }
      
      .emotion-time {
        font-size: 12px;
        color: #999;
      }
    }
    
    .emotion-intensity {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .intensity-bar {
        flex: 1;
        height: 4px;
        background: #E0E0E0;
        border-radius: 2px;
        overflow: hidden;
        
        .intensity-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFB6C1, #FF6B6B);
        }
      }
      
      .intensity-value {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.emotion-form-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.emotion-form {
  .form-section {
    margin-bottom: 30px;
    
    .form-section-title {
      color: #333;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      
      .optional {
        color: #999;
        font-weight: 400;
        font-size: 14px;
      }
    }
  }
}

.emotion-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.emotion-type-card {
  padding: 20px;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #FFB6C1;
    background: #FFF8F8;
  }
  
  &.selected {
    border-color: #FF6B6B;
    background: #FFE8E8;
  }
  
  .emotion-icon {
    font-size: 32px;
    margin-bottom: 10px;
  }
  
  .emotion-label {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 5px;
  }
  
  .emotion-desc {
    font-size: 12px;
    color: #666;
  }
}

.intensity-selector {
  .intensity-scale {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .intensity-point {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #E0E0E0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 600;
    color: #666;
    
    &.active {
      background: #FFB6C1;
      color: white;
    }
    
    &.selected {
      background: #FF6B6B;
      color: white;
      transform: scale(1.2);
    }
  }
  
  .intensity-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 12px;
    color: #999;
  }
  
  .intensity-preview {
    text-align: center;
    padding: 15px;
    background: #F8F9FA;
    border-radius: 8px;
    
    .preview-emotion {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      
      .preview-emoji {
        font-size: 24px;
      }
      
      .preview-text {
        color: #333;
        font-weight: 500;
      }
    }
  }
}

.emotion-textarea {
  :deep(.el-textarea__inner) {
    border-radius: 12px;
    border-color: #E0E0E0;
    
    &:focus {
      border-color: #FF6B6B;
    }
  }
}

.triggers-section {
  .common-triggers {
    margin-bottom: 20px;
  }
  
  .trigger-category {
    margin-bottom: 20px;
    
    h5 {
      color: #333;
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .trigger-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .trigger-tag {
      cursor: pointer;
      
      &.el-tag--primary {
        background: #FFE8E8;
        border-color: #FF6B6B;
        color: #FF6B6B;
      }
    }
  }
  
  .custom-trigger {
    .custom-trigger-input {
      :deep(.el-input-group__append) {
        border-left: none;
        background: #FF6B6B;
        
        .el-button {
          background: transparent;
          border: none;
          color: white;
          
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        }
      }
    }
  }
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  
  .save-btn {
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
    border: none;
    padding: 12px 30px;
    
    &:hover {
      background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
    }
  }
  
  .cancel-btn {
    color: #666;
    border-color: #E0E0E0;
  }
}

.quick-actions {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.quick-emotion-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.quick-emotion-btn {
  padding: 20px;
  background: #F8F9FA;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #FFE8E8;
    transform: translateY(-2px);
  }
  
  .quick-emotion-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  .quick-emotion-label {
    color: #333;
    font-weight: 500;
  }
}

.history-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}

.emotion-history {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .history-date {
    flex-shrink: 0;
    text-align: center;
    min-width: 60px;
    
    .date {
      display: block;
      color: #FF6B6B;
      font-size: 14px;
      font-weight: 500;
    }
    
    .time {
      display: block;
      color: #999;
      font-size: 12px;
    }
  }
  
  .history-emotion {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
    
    .emotion-emoji {
      font-size: 20px;
    }
    
    .emotion-type {
      color: #333;
      font-weight: 500;
    }
    
    .emotion-intensity {
      color: #666;
      font-size: 12px;
    }
  }
  
  .history-content {
    flex: 1;
    color: #666;
    line-height: 1.6;
  }
  
  .history-actions {
    flex-shrink: 0;
    display: flex;
    gap: 5px;
    
    .delete-btn {
      color: #FF6B6B;
      
      &:hover {
        color: #FF5252;
      }
    }
  }
}

.empty-history {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 15px;
    color: #E0E0E0;
  }
  
  p {
    margin-bottom: 10px;
    
    &.empty-tip {
      font-size: 14px;
      color: #CCC;
    }
  }
}

@media (max-width: 768px) {
  .diary-header .page-title {
    font-size: 24px;
  }
  
  .emotion-types {
    grid-template-columns: 1fr;
  }
  
  .intensity-scale {
    gap: 5px;
    
    .intensity-point {
      width: 35px;
      height: 35px;
      font-size: 14px;
    }
  }
  
  .quick-emotion-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .history-item {
    flex-direction: column;
    gap: 10px;
    
    .history-date,
    .history-emotion {
      min-width: auto;
      text-align: left;
    }
    
    .history-actions {
      justify-content: flex-start;
    }
  }
  
  .form-actions {
    flex-direction: column;
    
    .save-btn,
    .cancel-btn {
      width: 100%;
    }
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>