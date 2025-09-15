<template>
  <el-dialog
    v-model="visible"
    title="欢迎来到向阳而生"
    width="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="guide-dialog"
  >
    <div class="guide-content">
      <!-- 步骤指示器 -->
      <div class="steps-indicator">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="step-dot"
          :class="{ 
            active: currentStep === index, 
            completed: currentStep > index 
          }"
        >
          <span v-if="currentStep > index">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
      </div>
      
      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤1: 欢迎介绍 -->
        <div v-if="currentStep === 0" class="step-panel">
          <div class="step-header">
            <el-icon class="step-icon"><Sunny /></el-icon>
            <h3>欢迎来到向阳而生</h3>
          </div>
          <div class="step-body">
            <p class="intro-text">
              向阳而生是专为大学生设计的心理健康陪伴平台，我们致力于为你提供温暖、不说教、不尴尬的心理健康支持。
            </p>
            <div class="features-preview">
              <div class="feature-item">
                <el-icon><Sunny /></el-icon>
                <span>情绪记录与分析</span>
              </div>
              <div class="feature-item">
                <el-icon><Tools /></el-icon>
                <span>科学自助工具</span>
              </div>
              <div class="feature-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>温暖社区互助</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 步骤2: 个人设置 -->
        <div v-if="currentStep === 1" class="step-panel">
          <div class="step-header">
            <el-icon class="step-icon"><User /></el-icon>
            <h3>设置你的个人信息</h3>
          </div>
          <div class="step-body">
            <p class="step-desc">请设置你的昵称，你可以随时修改。我们支持完全匿名使用。</p>
            <el-form :model="userForm" :rules="userRules" ref="userFormRef">
              <el-form-item label="昵称" prop="nickname">
                <el-input
                  v-model="userForm.nickname"
                  placeholder="请输入你想要的昵称"
                  size="large"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="头像">
                <div class="avatar-selection">
                  <div 
                    v-for="avatar in avatarOptions" 
                    :key="avatar"
                    class="avatar-option"
                    :class="{ selected: userForm.avatar === avatar }"
                    @click="userForm.avatar = avatar"
                  >
                    {{ avatar }}
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        
        <!-- 步骤3: 隐私设置 -->
        <div v-if="currentStep === 2" class="step-panel">
          <div class="step-header">
            <el-icon class="step-icon"><Shield /></el-icon>
            <h3>隐私与安全设置</h3>
          </div>
          <div class="step-body">
            <p class="step-desc">我们非常重视你的隐私。以下是我们的隐私保护措施：</p>
            <div class="privacy-features">
              <div class="privacy-item">
                <el-icon><Shield /></el-icon>
                <div class="privacy-text">
                  <h4>本地存储</h4>
                  <p>所有数据仅存储在你的设备上，不会上传到服务器</p>
                </div>
              </div>
              <div class="privacy-item">
                <el-icon><Hide /></el-icon>
                <div class="privacy-text">
                  <h4>匿名使用</h4>
                  <p>你可以选择完全匿名参与社区互动</p>
                </div>
              </div>
              <div class="privacy-item">
                <el-icon><Lock /></el-icon>
                <div class="privacy-text">
                  <h4>数据安全</h4>
                  <p>支持数据导出和删除，你完全控制自己的数据</p>
                </div>
              </div>
            </div>
            <div class="privacy-settings">
              <el-checkbox v-model="userForm.anonymousMode">
                默认匿名参与社区互动
              </el-checkbox>
            </div>
          </div>
        </div>
        
        <!-- 步骤4: 完成设置 -->
        <div v-if="currentStep === 3" class="step-panel">
          <div class="step-header">
            <el-icon class="step-icon"><Check /></el-icon>
            <h3>准备就绪！</h3>
          </div>
          <div class="step-body">
            <div class="completion-content">
              <div class="celebration">
                <div class="celebration-emoji">🎉</div>
                <p class="celebration-text">恭喜你完成初始设置！</p>
              </div>
              <div class="next-steps">
                <h4>接下来你可以：</h4>
                <div class="next-step-item">
                  <el-icon><Sunny /></el-icon>
                  <span>记录你的第一个情绪状态</span>
                </div>
                <div class="next-step-item">
                  <el-icon><WindPower /></el-icon>
                  <span>尝试呼吸练习放松身心</span>
                </div>
                <div class="next-step-item">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>在匿名树洞分享你的心情</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <template #footer>
      <div class="guide-footer">
        <el-button 
          v-if="currentStep > 0" 
          @click="previousStep"
          class="prev-btn"
        >
          <el-icon><ArrowLeft /></el-icon>
          上一步
        </el-button>
        
        <div class="footer-spacer"></div>
        
        <el-button 
          v-if="currentStep < steps.length - 1"
          type="primary" 
          @click="nextStep"
          :disabled="!canProceed"
          class="next-btn"
        >
          下一步
          <el-icon><ArrowRight /></el-icon>
        </el-button>
        
        <el-button 
          v-if="currentStep === steps.length - 1"
          type="primary" 
          @click="completeGuide"
          class="complete-btn"
        >
          开始使用
          <el-icon><Right /></el-icon>
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, defineProps, defineEmits } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'complete'])

const userStore = useUserStore()
const settingsStore = useSettingsStore()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const currentStep = ref(0)
const userFormRef = ref()

const steps = [
  '欢迎介绍',
  '个人设置',
  '隐私设置',
  '完成设置'
]

const avatarOptions = ['😊', '🌟', '🦋', '🌈', '🌸', '🌞', '💫', '🦄']

const userForm = reactive({
  nickname: '',
  avatar: '😊',
  anonymousMode: true
})

const userRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return true
    case 1:
      return userForm.nickname.trim().length >= 2
    case 2:
      return true
    case 3:
      return true
    default:
      return false
  }
})

const nextStep = async () => {
  if (currentStep.value === 1) {
    // 验证表单
    try {
      await userFormRef.value.validate()
    } catch (error) {
      return
    }
  }
  
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const completeGuide = () => {
  // 保存用户设置
  userStore.updateProfile({
    nickname: userForm.nickname,
    avatar: userForm.avatar,
    joinDate: new Date().toISOString(),
    level: 1
  })
  
  // 保存隐私设置
  settingsStore.updatePrivacy({
    anonymousMode: userForm.anonymousMode
  })
  
  ElMessage.success('欢迎加入向阳而生！开始你的心灵之旅吧！')
  
  visible.value = false
  emit('complete')
}
</script>

<style scoped lang="scss">
.guide-dialog {
  :deep(.el-dialog) {
    border-radius: 20px;
    
    .el-dialog__header {
      background: linear-gradient(135deg, #FF6B6B 0%, #FFB6C1 100%);
      color: white;
      padding: 20px 30px;
      border-radius: 20px 20px 0 0;
      
      .el-dialog__title {
        font-size: 24px;
        font-weight: 600;
      }
    }
    
    .el-dialog__body {
      padding: 30px;
    }
    
    .el-dialog__footer {
      padding: 20px 30px;
      border-top: 1px solid #E0E0E0;
    }
  }
}

.guide-content {
  min-height: 400px;
}

.steps-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 20px;
}

.step-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #E0E0E0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s;
  
  &.active {
    background: #FF6B6B;
    color: white;
    transform: scale(1.1);
  }
  
  &.completed {
    background: #4CAF50;
    color: white;
  }
}

.step-content {
  text-align: center;
}

.step-panel {
  animation: fadeInUp 0.5s ease;
}

.step-header {
  margin-bottom: 30px;
  
  .step-icon {
    font-size: 48px;
    color: #FF6B6B;
    margin-bottom: 15px;
  }
  
  h3 {
    color: #333;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
}

.step-body {
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.step-desc {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  text-align: center;
}

.intro-text {
  color: #666;
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 30px;
  text-align: center;
}

.features-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: #F8F9FA;
  border-radius: 12px;
  
  .el-icon {
    font-size: 32px;
    color: #FF6B6B;
  }
  
  span {
    color: #333;
    font-weight: 500;
    text-align: center;
  }
}

.avatar-selection {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.avatar-option {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #F0F0F0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    background: #E0E0E0;
  }
  
  &.selected {
    border-color: #FF6B6B;
    background: #FFE8E8;
  }
}

.privacy-features {
  margin: 20px 0;
}

.privacy-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  
  .el-icon {
    font-size: 24px;
    color: #FF6B6B;
    margin-top: 5px;
  }
  
  .privacy-text {
    h4 {
      color: #333;
      margin: 0 0 5px 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    p {
      color: #666;
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
    }
  }
}

.privacy-settings {
  margin-top: 30px;
  padding: 20px;
  background: #F8F9FA;
  border-radius: 12px;
}

.completion-content {
  text-align: center;
}

.celebration {
  margin-bottom: 30px;
  
  .celebration-emoji {
    font-size: 64px;
    margin-bottom: 15px;
  }
  
  .celebration-text {
    color: #333;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
  }
}

.next-steps {
  h4 {
    color: #333;
    margin-bottom: 20px;
    font-size: 18px;
  }
}

.next-step-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  padding: 15px;
  background: #F8F9FA;
  border-radius: 12px;
  
  .el-icon {
    font-size: 24px;
    color: #FF6B6B;
  }
  
  span {
    color: #333;
    font-size: 16px;
  }
}

.guide-footer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-spacer {
  flex: 1;
}

.prev-btn {
  color: #666;
  border-color: #E0E0E0;
}

.next-btn,
.complete-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
  }
  
  &:disabled {
    background: #E0E0E0;
    color: #999;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .guide-dialog :deep(.el-dialog) {
    width: 90% !important;
    margin: 20px auto;
  }
  
  .features-preview {
    grid-template-columns: 1fr;
  }
  
  .avatar-selection {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .steps-indicator {
    gap: 10px;
  }
  
  .step-dot {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }
}
</style>
