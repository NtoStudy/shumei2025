<template>
  <div class="cognition-page">
    <AppHeader />
    
    <div class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><Edit /></el-icon>
            认知重构
          </h1>
          <p class="page-desc">识别和改变负面思维模式，建立积极认知</p>
        </div>
        
        <div class="cognition-container">
          <!-- 认知重构步骤 -->
          <div class="steps-container">
            <el-steps :active="currentStep" finish-status="success" align-center>
              <el-step title="识别情境" description="记录引发情绪的事件"></el-step>
              <el-step title="识别想法" description="记录自动化思维"></el-step>
              <el-step title="识别认知扭曲" description="找出思维陷阱"></el-step>
              <el-step title="重构思维" description="建立积极认知"></el-step>
            </el-steps>
          </div>
          
          <!-- 步骤内容 -->
          <div class="step-content">
            <!-- 步骤1：识别情境 -->
            <div v-if="currentStep === 0" class="step-panel">
              <h3 class="step-title">步骤1：识别情境</h3>
              <p class="step-desc">描述引发你负面情绪的具体事件或情境。尽量客观描述，不要包含主观评价。</p>
              
              <div class="form-group">
                <label>情境描述</label>
                <el-input
                  v-model="situation"
                  type="textarea"
                  :rows="4"
                  placeholder="例如：今天我在课堂上发言时，说错了一个概念，有几个同学笑了。"
                  maxlength="500"
                  show-word-limit
                ></el-input>
              </div>
              
              <div class="form-group">
                <label>当时的情绪</label>
                <el-select v-model="emotion" placeholder="选择情绪">
                  <el-option v-for="item in emotions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                
                <div class="emotion-intensity">
                  <label>情绪强度 (1-10)</label>
                  <el-slider v-model="emotionIntensity" :min="1" :max="10" :marks="intensityMarks"></el-slider>
                </div>
              </div>
              
              <div class="step-actions">
                <el-button type="primary" @click="nextStep" :disabled="!situation || !emotion">下一步</el-button>
              </div>
            </div>
            
            <!-- 步骤2：识别想法 -->
            <div v-if="currentStep === 1" class="step-panel">
              <h3 class="step-title">步骤2：识别想法</h3>
              <p class="step-desc">记录当时出现在你脑海中的自动化思维。这些想法通常是快速、无意识的。</p>
              
              <div class="situation-review">
                <h4>情境回顾</h4>
                <p>{{ situation }}</p>
              </div>
              
              <div class="form-group">
                <label>自动化思维</label>
                <el-input
                  v-model="automaticThoughts"
                  type="textarea"
                  :rows="4"
                  placeholder="例如：我太愚蠢了，大家都在笑我，他们一定觉得我很无知。"
                  maxlength="500"
                  show-word-limit
                ></el-input>
              </div>
              
              <div class="step-actions">
                <el-button @click="prevStep">上一步</el-button>
                <el-button type="primary" @click="nextStep" :disabled="!automaticThoughts">下一步</el-button>
              </div>
            </div>
            
            <!-- 步骤3：识别认知扭曲 -->
            <div v-if="currentStep === 2" class="step-panel">
              <h3 class="step-title">步骤3：识别认知扭曲</h3>
              <p class="step-desc">找出你的思维中可能存在的认知扭曲或思维陷阱。</p>
              
              <div class="thoughts-review">
                <h4>自动化思维回顾</h4>
                <p>{{ automaticThoughts }}</p>
              </div>
              
              <div class="form-group">
                <label>认知扭曲类型（可多选）</label>
                <el-checkbox-group v-model="cognitiveDistortions">
                  <el-checkbox v-for="item in distortionTypes" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
                </el-checkbox-group>
              </div>
              
              <div class="form-group">
                <label>为什么你认为这些是认知扭曲？</label>
                <el-input
                  v-model="distortionExplanation"
                  type="textarea"
                  :rows="3"
                  placeholder="解释为什么你认为这些想法是认知扭曲"
                  maxlength="300"
                  show-word-limit
                ></el-input>
              </div>
              
              <div class="step-actions">
                <el-button @click="prevStep">上一步</el-button>
                <el-button type="primary" @click="nextStep" :disabled="cognitiveDistortions.length === 0">下一步</el-button>
              </div>
            </div>
            
            <!-- 步骤4：重构思维 -->
            <div v-if="currentStep === 3" class="step-panel">
              <h3 class="step-title">步骤4：重构思维</h3>
              <p class="step-desc">尝试用更平衡、更客观的想法来替代负面思维。</p>
              
              <div class="distortions-review">
                <h4>认知扭曲回顾</h4>
                <p>{{ getDistortionLabels() }}</p>
              </div>
              
              <div class="form-group">
                <label>更平衡的思维</label>
                <el-input
                  v-model="balancedThoughts"
                  type="textarea"
                  :rows="4"
                  placeholder="例如：犯错是正常的，每个人都会犯错。同学们的笑声可能不全是针对我的。这只是一个小失误，不代表我的整体能力。"
                  maxlength="500"
                  show-word-limit
                ></el-input>
              </div>
              
              <div class="form-group">
                <label>情绪变化</label>
                <div class="emotion-change">
                  <div class="emotion-before">
                    <span>之前: {{ getEmotionLabel(emotion) }} ({{ emotionIntensity }}/10)</span>
                  </div>
                  
                  <div class="emotion-after">
                    <span>之后: </span>
                    <el-select v-model="newEmotion" placeholder="选择情绪">
                      <el-option v-for="item in emotions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    
                    <div class="emotion-intensity">
                      <label>情绪强度 (1-10)</label>
                      <el-slider v-model="newEmotionIntensity" :min="1" :max="10" :marks="intensityMarks"></el-slider>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="step-actions">
                <el-button @click="prevStep">上一步</el-button>
                <el-button type="primary" @click="saveRecord" :disabled="!balancedThoughts || !newEmotion">保存记录</el-button>
              </div>
            </div>
          </div>
          
          <!-- 认知重构历史记录 -->
          <div class="cognition-history" v-if="cognitionRecords.length > 0">
            <h3 class="section-title">历史记录</h3>
            <el-collapse>
              <el-collapse-item v-for="(record, index) in cognitionRecords" :key="index" :title="formatDate(record.date) + ' - ' + record.situation.substring(0, 30) + '...'">
                <div class="record-content">
                  <div class="record-item">
                    <h4>情境</h4>
                    <p>{{ record.situation }}</p>
                  </div>
                  <div class="record-item">
                    <h4>自动化思维</h4>
                    <p>{{ record.automaticThoughts }}</p>
                  </div>
                  <div class="record-item">
                    <h4>认知扭曲</h4>
                    <p>{{ record.distortions.join(', ') }}</p>
                  </div>
                  <div class="record-item">
                    <h4>平衡思维</h4>
                    <p>{{ record.balancedThoughts }}</p>
                  </div>
                  <div class="record-item">
                    <h4>情绪变化</h4>
                    <p>从 {{ record.emotion }} ({{ record.emotionIntensity }}/10) 到 {{ record.newEmotion }} ({{ record.newEmotionIntensity }}/10)</p>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
    
    <AppFooter />
    
    <!-- 保存成功提示 -->
    <el-dialog
      v-model="showSuccessDialog"
      title="保存成功"
      width="30%"
      center
    >
      <div class="success-content">
        <el-icon class="success-icon" :size="64"><SuccessFilled /></el-icon>
        <p>认知重构记录已保存！</p>
        <p class="emotion-improvement" v-if="emotionImprovement > 0">
          情绪改善: <span class="improvement-value">+{{ emotionImprovement }}%</span>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm">继续记录</el-button>
          <el-button type="primary" @click="goToHistory">查看历史</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import { Edit, SuccessFilled } from '@element-plus/icons-vue'

const router = useRouter()

// 步骤控制
const currentStep = ref(0)
const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 表单数据
const situation = ref('')
const emotion = ref('')
const emotionIntensity = ref(5)
const automaticThoughts = ref('')
const cognitiveDistortions = ref([])
const distortionExplanation = ref('')
const balancedThoughts = ref('')
const newEmotion = ref('')
const newEmotionIntensity = ref(5)

// 情绪强度标记
const intensityMarks = {
  1: '1',
  5: '5',
  10: '10'
}

// 情绪选项
const emotions = [
  { value: 'anxiety', label: '焦虑' },
  { value: 'sadness', label: '悲伤' },
  { value: 'anger', label: '愤怒' },
  { value: 'fear', label: '恐惧' },
  { value: 'shame', label: '羞耻' },
  { value: 'guilt', label: '内疚' },
  { value: 'frustration', label: '挫折' },
  { value: 'disappointment', label: '失望' },
  { value: 'jealousy', label: '嫉妒' },
  { value: 'helplessness', label: '无助' }
]

// 认知扭曲类型
const distortionTypes = [
  { value: 'all-or-nothing', label: '非黑即白思维' },
  { value: 'overgeneralization', label: '过度概括' },
  { value: 'mental-filter', label: '心理过滤' },
  { value: 'disqualifying-positive', label: '否定积极面' },
  { value: 'jumping-to-conclusions', label: '跳跃式结论' },
  { value: 'magnification', label: '放大或缩小' },
  { value: 'emotional-reasoning', label: '情绪化推理' },
  { value: 'should-statements', label: '应该陈述' },
  { value: 'labeling', label: '贴标签' },
  { value: 'personalization', label: '个人化' }
]

// 获取认知扭曲标签
const getDistortionLabels = () => {
  return cognitiveDistortions.value.map(value => {
    const distortion = distortionTypes.find(type => type.value === value)
    return distortion ? distortion.label : value
  }).join(', ')
}

// 获取情绪标签
const getEmotionLabel = (value) => {
  const emotionObj = emotions.find(e => e.value === value)
  return emotionObj ? emotionObj.label : value
}

// 历史记录
const cognitionRecords = ref([])

// 保存记录
const showSuccessDialog = ref(false)
const emotionImprovement = computed(() => {
  if (emotionIntensity.value > newEmotionIntensity.value) {
    return Math.round(((emotionIntensity.value - newEmotionIntensity.value) / emotionIntensity.value) * 100)
  }
  return 0
})

const saveRecord = () => {
  const record = {
    date: new Date(),
    situation: situation.value,
    emotion: getEmotionLabel(emotion.value),
    emotionIntensity: emotionIntensity.value,
    automaticThoughts: automaticThoughts.value,
    distortions: cognitiveDistortions.value.map(value => {
      const distortion = distortionTypes.find(type => type.value === value)
      return distortion ? distortion.label : value
    }),
    balancedThoughts: balancedThoughts.value,
    newEmotion: getEmotionLabel(newEmotion.value),
    newEmotionIntensity: newEmotionIntensity.value
  }
  
  cognitionRecords.value.unshift(record)
  showSuccessDialog.value = true
}

// 格式化日期
const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 重置表单
const resetForm = () => {
  situation.value = ''
  emotion.value = ''
  emotionIntensity.value = 5
  automaticThoughts.value = ''
  cognitiveDistortions.value = []
  distortionExplanation.value = ''
  balancedThoughts.value = ''
  newEmotion.value = ''
  newEmotionIntensity.value = 5
  currentStep.value = 0
  showSuccessDialog.value = false
}

// 查看历史记录
const goToHistory = () => {
  showSuccessDialog.value = false
  // 滚动到历史记录部分
  setTimeout(() => {
    document.querySelector('.cognition-history').scrollIntoView({ behavior: 'smooth' })
  }, 100)
}
</script>

<style scoped lang="scss">
.cognition-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
  
  .page-title {
    font-size: 2rem;
    color: #4a5568;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      margin-right: 0.5rem;
      font-size: 1.8rem;
      color: #3498db;
    }
  }
  
  .page-desc {
    font-size: 1.1rem;
    color: #718096;
  }
}

.cognition-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
}

.steps-container {
  margin-bottom: 2rem;
}

.step-panel {
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  
  .step-title {
    font-size: 1.3rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  .step-desc {
    color: #718096;
    margin-bottom: 1.5rem;
  }
}

.form-group {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #4a5568;
  }
}

.situation-review,
.thoughts-review,
.distortions-review {
  background-color: #ebf8ff;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  
  h4 {
    color: #2b6cb0;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #4a5568;
  }
}

.emotion-intensity {
  margin-top: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
}

.emotion-change {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .emotion-before,
  .emotion-after {
    padding: 0.5rem;
    border-radius: 6px;
  }
  
  .emotion-before {
    background-color: #feebc8;
  }
  
  .emotion-after {
    background-color: #c6f6d5;
  }
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.cognition-history {
  margin-top: 3rem;
  
  .section-title {
    font-size: 1.5rem;
    color: #4a5568;
    margin-bottom: 1rem;
  }
  
  .record-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .record-item {
    h4 {
      font-size: 1rem;
      color: #4a5568;
      margin-bottom: 0.3rem;
    }
    
    p {
      color: #718096;
    }
  }
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  
  .success-icon {
    color: #48bb78;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  .emotion-improvement {
    margin-top: 1rem;
    font-weight: 500;
    
    .improvement-value {
      color: #48bb78;
      font-weight: 700;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>