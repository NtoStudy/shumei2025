<template>
  <div class="emotion-diary">
    <div class="diary-container">
      <!-- 情绪选择器 -->
      <div class="emotion-selector">
        <h3 class="section-title">选择你的情绪</h3>
        <div class="emotion-grid">
          <div 
            v-for="emotion in emotions" 
            :key="emotion.id"
            class="emotion-item"
            :class="{ active: selectedEmotion === emotion.id }"
            @click="selectEmotion(emotion.id)"
          >
            <span class="emotion-emoji">{{ emotion.emoji }}</span>
            <span class="emotion-label">{{ emotion.label }}</span>
          </div>
        </div>
      </div>
      
      <!-- 情绪强度 -->
      <div class="intensity-section" v-if="selectedEmotion">
        <h3 class="section-title">情绪强度</h3>
        <div class="intensity-slider">
          <el-slider 
            v-model="intensity" 
            :min="1" 
            :max="10"
            :marks="intensityMarks"
            :show-tooltip="false"
          />
          <div class="intensity-labels">
            <span>轻微</span>
            <span>强烈</span>
          </div>
          <div class="intensity-value">
            强度: {{ intensity }}/10
          </div>
        </div>
      </div>
      
      <!-- 文字记录 -->
      <div class="content-section" v-if="selectedEmotion">
        <h3 class="section-title">记录你的感受</h3>
        <el-input
          v-model="content"
          type="textarea"
          :rows="4"
          placeholder="写下你此刻的感受，是什么让你产生了这种情绪？"
          maxlength="500"
          show-word-limit
          class="content-input"
        />
      </div>
      
      <!-- 触发因素 -->
      <div class="triggers-section" v-if="selectedEmotion">
        <h3 class="section-title">触发因素（可选）</h3>
        <div class="trigger-tags">
          <el-tag
            v-for="trigger in commonTriggers"
            :key="trigger"
            :type="selectedTriggers.includes(trigger) ? 'primary' : ''"
            class="trigger-tag"
            @click="toggleTrigger(trigger)"
          >
            {{ trigger }}
          </el-tag>
        </div>
        <el-input
          v-model="customTrigger"
          placeholder="添加其他触发因素"
          class="custom-trigger-input"
          @keyup.enter="addCustomTrigger"
        >
          <template #append>
            <el-button @click="addCustomTrigger">添加</el-button>
          </template>
        </el-input>
        
        <!-- 已选择的触发因素 -->
        <div class="selected-triggers" v-if="selectedTriggers.length > 0">
          <h4 class="subsection-title">已选择的触发因素：</h4>
          <div class="selected-trigger-tags">
            <el-tag
              v-for="trigger in selectedTriggers"
              :key="trigger"
              closable
              type="primary"
              @close="toggleTrigger(trigger)"
              class="selected-trigger-tag"
            >
              {{ trigger }}
            </el-tag>
          </div>
        </div>
      </div>
      
      <!-- 标签 -->
      <div class="tags-section" v-if="selectedEmotion">
        <h3 class="section-title">标签（可选）</h3>
        <div class="tag-input">
          <el-input
            v-model="tagInput"
            placeholder="输入标签，按回车添加"
            @keyup.enter="addTag"
          >
            <template #append>
              <el-button @click="addTag">添加</el-button>
            </template>
          </el-input>
        </div>
        <div class="selected-tags" v-if="selectedTags.length > 0">
          <el-tag
            v-for="tag in selectedTags"
            :key="tag"
            closable
            @close="removeTag(tag)"
            class="selected-tag"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-buttons" v-if="selectedEmotion">
        <el-button @click="resetForm" class="reset-btn">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
        <el-button 
          type="primary" 
          @click="saveEmotion"
          :loading="saving"
          class="save-btn"
        >
          <el-icon><Check /></el-icon>
          保存记录
        </el-button>
      </div>
      
      <!-- 今日记录列表 -->
      <div class="today-records" v-if="todayRecords.length > 0">
        <h3 class="section-title">今日记录</h3>
        <div class="records-list">
          <div 
            v-for="record in todayRecords" 
            :key="record.id"
            class="record-item"
          >
            <div class="record-header">
              <div class="record-emotion">
                <span class="record-emoji">{{ record.emotion.emoji }}</span>
                <span class="record-label">{{ getEmotionLabel(record.emotion.type) }}</span>
                <span class="record-intensity">{{ record.emotion.intensity }}/10</span>
              </div>
              <div class="record-time">
                {{ formatTime(record.timestamp) }}
              </div>
            </div>
            <div class="record-content" v-if="record.content">
              <p>{{ record.content }}</p>
            </div>
            <div class="record-tags" v-if="record.tags.length > 0">
              <el-tag
                v-for="tag in record.tags"
                :key="tag"
                size="small"
                class="record-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEmotionStore } from '@/stores/emotion'
import { ElMessage } from 'element-plus'

const emotionStore = useEmotionStore()

// 情绪选项
const emotions = ref([
  { id: 'happy', emoji: '😊', label: '开心', color: '#FFD700' },
  { id: 'sad', emoji: '😢', label: '难过', color: '#87CEEB' },
  { id: 'anxious', emoji: '😰', label: '焦虑', color: '#FF6B6B' },
  { id: 'angry', emoji: '😠', label: '愤怒', color: '#FF4500' },
  { id: 'calm', emoji: '😌', label: '平静', color: '#98FB98' },
  { id: 'excited', emoji: '🤩', label: '兴奋', color: '#FF69B4' },
  { id: 'tired', emoji: '😴', label: '疲惫', color: '#DDA0DD' },
  { id: 'confused', emoji: '😕', label: '困惑', color: '#F0E68C' }
])

// 表单数据
const selectedEmotion = ref('')
const intensity = ref(5)
const content = ref('')
const selectedTriggers = ref([])
const customTrigger = ref('')
const selectedTags = ref([])
const tagInput = ref('')
const saving = ref(false)

// 常用触发因素
const commonTriggers = ref([
  '学习压力', '人际关系', '工作压力', '家庭问题', '健康问题',
  '经济压力', '未来规划', '感情问题', '社交焦虑', '自我怀疑'
])

// 强度标记
const intensityMarks = ref({
  1: '1',
  3: '3',
  5: '5',
  7: '7',
  10: '10'
})

// 今日记录
const todayRecords = computed(() => {
  const today = new Date().toDateString()
  return emotionStore.emotions
    .filter(emotion => new Date(emotion.timestamp).toDateString() === today)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

const selectEmotion = (emotionId) => {
  selectedEmotion.value = emotionId
  // 重置其他字段
  intensity.value = 5
  content.value = ''
  selectedTriggers.value = []
  selectedTags.value = []
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
  if (customTrigger.value.trim() && !selectedTriggers.value.includes(customTrigger.value.trim())) {
    selectedTriggers.value.push(customTrigger.value.trim())
    customTrigger.value = ''
  }
}

const addTag = () => {
  if (tagInput.value.trim() && !selectedTags.value.includes(tagInput.value.trim())) {
    selectedTags.value.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
}

const saveEmotion = async () => {
  if (!selectedEmotion.value) {
    ElMessage.warning('请先选择一种情绪')
    return
  }
  
  saving.value = true
  
  try {
    const emotionData = emotions.value.find(e => e.id === selectedEmotion.value)
    
    const emotionRecord = {
      type: selectedEmotion.value,
      intensity: intensity.value,
      emoji: emotionData.emoji,
      color: emotionData.color,
      content: content.value,
      triggers: selectedTriggers.value,
      tags: selectedTags.value
    }
    
    emotionStore.addEmotion(emotionRecord)
    
    ElMessage.success('情绪记录保存成功！')
    resetForm()
  } catch (error) {
    ElMessage.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  selectedEmotion.value = ''
  intensity.value = 5
  content.value = ''
  selectedTriggers.value = []
  customTrigger.value = ''
  selectedTags.value = []
  tagInput.value = ''
}

const getEmotionLabel = (type) => {
  const emotion = emotions.value.find(e => e.id === type)
  return emotion ? emotion.label : type
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style scoped lang="scss">
.emotion-diary {
  padding: 20px 0;
}

.diary-container {
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  color: #FF6B6B;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
}

.emotion-selector {
  margin-bottom: 30px;
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.emotion-item {
  background: white;
  border: 2px solid #E0E0E0;
  border-radius: 15px;
  padding: 20px;
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
  
  .emotion-emoji {
    font-size: 32px;
    display: block;
    margin-bottom: 8px;
  }
  
  .emotion-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }
}

.intensity-section {
  margin-bottom: 30px;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.intensity-slider {
  :deep(.el-slider) {
    margin: 20px 0;
  }
  
  :deep(.el-slider__runway) {
    background: #FFB6C1;
  }
  
  :deep(.el-slider__bar) {
    background: #FF6B6B;
  }
  
  :deep(.el-slider__button) {
    border-color: #FF6B6B;
  }
}

.intensity-labels {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
}

.intensity-value {
  text-align: center;
  color: #FF6B6B;
  font-weight: 600;
  font-size: 16px;
}

.content-section {
  margin-bottom: 30px;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.content-input {
  :deep(.el-textarea__inner) {
    border-radius: 10px;
    border-color: #E0E0E0;
    
    &:focus {
      border-color: #FF6B6B;
    }
  }
}

.triggers-section {
  margin-bottom: 30px;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.trigger-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.trigger-tag {
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &.el-tag--primary {
    background-color: #FF6B6B;
    border-color: #FF6B6B;
    color: white;
    transform: scale(1.05);
  }
}

.custom-trigger-input {
  margin-top: 15px;
}

.selected-triggers {
  margin-top: 20px;
}

.subsection-title {
  color: #666;
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 500;
}

.selected-trigger-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-trigger-tag {
  background-color: rgba(255, 107, 107, 0.1);
  border-color: #FF6B6B;
  color: #FF6B6B;
}

.tags-section {
  margin-bottom: 30px;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.tag-input {
  margin-bottom: 15px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  background: #FFB6C1;
  color: white;
  border: none;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 40px;
}

.reset-btn {
  color: #666;
  border-color: #E0E0E0;
  
  &:hover {
    color: #FF6B6B;
    border-color: #FF6B6B;
  }
}

.save-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
  }
}

.today-records {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-item {
  border: 1px solid #E0E0E0;
  border-radius: 10px;
  padding: 15px;
  background: #FAFAFA;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.record-emotion {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .record-emoji {
    font-size: 20px;
  }
  
  .record-label {
    font-weight: 600;
    color: #333;
  }
  
  .record-intensity {
    color: #FF6B6B;
    font-weight: 600;
  }
}

.record-time {
  color: #999;
  font-size: 14px;
}

.record-content {
  margin-bottom: 10px;
  
  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
}

.record-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.record-tag {
  background: #FFB6C1;
  color: white;
  border: none;
  font-size: 12px;
}

@media (max-width: 768px) {
  .emotion-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  .emotion-item {
    padding: 15px;
    
    .emotion-emoji {
      font-size: 24px;
    }
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
