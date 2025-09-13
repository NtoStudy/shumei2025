<template>
  <div class="register-page">
    <div class="register-container">
      <!-- 左侧装饰区域 -->
      <div class="register-decoration">
        <div class="decoration-content">
          <div class="logo-section">
            <el-icon class="main-logo"><Sunny /></el-icon>
            <h1 class="main-title">向阳而生</h1>
          </div>
          <p class="decoration-subtitle">大学生心理健康陪伴平台</p>
          <p class="decoration-desc">
            加入我们，开始你的心灵成长之旅<br>
            在这里找到温暖、理解和支持
          </p>
          
          <div class="floating-elements">
            <div class="element element-1">🌟</div>
            <div class="element element-2">💫</div>
            <div class="element element-3">✨</div>
            <div class="element element-4">🎈</div>
            <div class="element element-5">🦄</div>
          </div>
        </div>
      </div>
      
      <!-- 右侧注册表单区域 -->
      <div class="register-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">创建账户</h2>
            <p class="form-subtitle">注册新账户，开启你的心理健康之旅</p>
          </div>
          
          <el-form 
            :model="registerForm" 
            :rules="registerRules" 
            ref="registerFormRef"
            class="register-form"
            @submit.prevent="handleRegister"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                size="large"
                prefix-icon="User"
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                placeholder="请输入邮箱"
                size="large"
                prefix-icon="Message"
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                prefix-icon="Lock"
                class="form-input"
                show-password
              />
            </el-form-item>
            
            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                size="large"
                prefix-icon="Lock"
                class="form-input"
                show-password
              />
            </el-form-item>
            
            <el-form-item prop="nickname">
              <el-input
                v-model="registerForm.nickname"
                placeholder="请输入昵称"
                size="large"
                prefix-icon="Avatar"
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item>
              <div class="form-options">
                <el-checkbox v-model="registerForm.agreement">
                  我已阅读并同意
                  <el-button type="text" @click="showAgreement" class="agreement-link">
                    《用户协议》
                  </el-button>
                  和
                  <el-button type="text" @click="showPrivacy" class="agreement-link">
                    《隐私政策》
                  </el-button>
                </el-checkbox>
              </div>
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                class="register-btn"
                :loading="registerLoading"
                @click="handleRegister"
              >
                <el-icon><Check /></el-icon>
                立即注册
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="form-footer">
            <p class="login-tip">
              已有账户？
              <el-button type="text" @click="goToLogin" class="login-link">
                立即登录
              </el-button>
            </p>
            
            <div class="divider">
              <span>或</span>
            </div>
            
            <el-button 
              type="text" 
              @click="goToWelcome" 
              class="back-welcome"
            >
              <el-icon><ArrowLeft /></el-icon>
              返回首页
            </el-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 用户协议对话框 -->
    <el-dialog
      v-model="agreementVisible"
      title="用户协议"
      width="70%"
    >
      <div class="agreement-content">
        <h3>服务条款</h3>
        <p>欢迎使用"向阳而生"大学生心理健康陪伴平台。通过注册和使用我们的服务，您同意遵守以下条款：</p>
        
        <h3>用户责任</h3>
        <p>1. 您承诺提供真实、准确的信息</p>
        <p>2. 您不得发布违法、有害、威胁、诽谤、侵犯他人隐私的内容</p>
        <p>3. 您不得干扰或破坏平台正常运行</p>
        
        <h3>服务说明</h3>
        <p>本平台提供心理健康相关的信息和服务，但不替代专业医疗建议。如有严重心理问题，请及时寻求专业帮助。</p>
        
        <h3>联系我们</h3>
        <p>如有任何问题，请联系我们：support@xiangyang.com</p>
      </div>
      
      <template #footer>
        <el-button @click="agreementVisible = false">关闭</el-button>
        <el-button type="primary" @click="acceptAgreement">我已阅读并同意</el-button>
      </template>
    </el-dialog>
    
    <!-- 隐私政策对话框 -->
    <el-dialog
      v-model="privacyVisible"
      title="隐私政策"
      width="70%"
    >
      <div class="privacy-content">
        <h3>数据保护承诺</h3>
        <p>我们承诺保护您的隐私，所有数据仅存储在您的设备本地，不会上传到任何服务器。</p>
        
        <h3>匿名使用</h3>
        <p>您可以选择完全匿名使用我们的服务，无需提供任何个人信息。</p>
        
        <h3>数据安全</h3>
        <p>您的情绪记录、社区互动等数据都经过加密存储，只有您自己可以访问。</p>
        
        <h3>联系我们</h3>
        <p>如有任何隐私相关问题，请联系我们：support@xiangyang.com</p>
      </div>
      
      <template #footer>
        <el-button @click="privacyVisible = false">关闭</el-button>
        <el-button type="primary" @click="acceptPrivacy">我已阅读并同意</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const registerFormRef = ref()
const registerLoading = ref(false)
const agreementVisible = ref(false)
const privacyVisible = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  agreement: false
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  try {
    await registerFormRef.value.validate()
    
    if (!registerForm.agreement) {
      ElMessage.warning('请先阅读并同意用户协议和隐私政策')
      return
    }
    
    registerLoading.value = true
    
    // 模拟注册请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 更新用户信息
    userStore.updateProfile({
      nickname: registerForm.nickname,
      joinDate: new Date().toISOString()
    })
    
    ElMessage.success('注册成功！欢迎加入向阳而生！')
    
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    console.log('表单验证失败:', error)
  } finally {
    registerLoading.value = false
  }
}

const showAgreement = () => {
  agreementVisible.value = true
}

const showPrivacy = () => {
  privacyVisible.value = true
}

const acceptAgreement = () => {
  agreementVisible.value = false
  registerForm.agreement = true
  ElMessage.success('已确认用户协议')
}

const acceptPrivacy = () => {
  privacyVisible.value = false
  registerForm.agreement = true
  ElMessage.success('已确认隐私政策')
}

const goToLogin = () => {
  router.push('/login')
}

const goToWelcome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 50%, #E6F3FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(255, 107, 107, 0.15);
  overflow: hidden;
  min-height: 700px;
}

.register-decoration {
  flex: 1;
  background: linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.decoration-content {
  text-align: center;
  color: white;
  z-index: 2;
  position: relative;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
  
  .main-logo {
    font-size: 48px;
    animation: pulse 2s infinite;
  }
  
  .main-title {
    font-size: 48px;
    font-weight: 700;
    margin: 0;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }
}

.decoration-subtitle {
  font-size: 24px;
  margin-bottom: 15px;
  font-weight: 500;
  opacity: 0.9;
}

.decoration-desc {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.8;
  margin-bottom: 40px;
}

.floating-elements {
  position: relative;
  width: 300px;
  height: 200px;
  margin: 0 auto;
}

.element {
  position: absolute;
  font-size: 32px;
  animation: float 3s ease-in-out infinite;
  
  &.element-1 {
    top: 20px;
    left: 50px;
    animation-delay: 0s;
  }
  
  &.element-2 {
    top: 60px;
    right: 80px;
    animation-delay: 0.5s;
  }
  
  &.element-3 {
    bottom: 80px;
    left: 30px;
    animation-delay: 1s;
  }
  
  &.element-4 {
    bottom: 40px;
    right: 40px;
    animation-delay: 1.5s;
  }
  
  &.element-5 {
    top: 100px;
    left: 120px;
    animation-delay: 2s;
  }
}

.register-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
  
  .form-title {
    color: #333;
    font-size: 32px;
    font-weight: 600;
    margin: 0 0 10px 0;
  }
  
  .form-subtitle {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

.register-form {
  .form-input {
    margin-bottom: 20px;
    
    :deep(.el-input__wrapper) {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #E0E0E0;
      
      &:hover {
        border-color: #87CEEB;
      }
      
      &.is-focus {
        border-color: #87CEEB;
        box-shadow: 0 0 0 2px rgba(135, 206, 235, 0.2);
      }
    }
  }
}

.form-options {
  margin-bottom: 20px;
  
  .agreement-link {
    color: #87CEEB;
    padding: 0;
    font-weight: 500;
    
    &:hover {
      color: #5F9EA0;
    }
  }
}

.register-btn {
  width: 100%;
  background: linear-gradient(135deg, #87CEEB 0%, #98D8E8 100%);
  border: none;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  
  &:hover {
    background: linear-gradient(135deg, #5F9EA0 0%, #87CEEB 100%);
  }
  
  &:disabled {
    background: #E0E0E0;
    color: #999;
  }
}

.form-footer {
  text-align: center;
  margin-top: 30px;
  
  .login-tip {
    color: #666;
    margin: 0 0 20px 0;
    
    .login-link {
      color: #87CEEB;
      font-weight: 500;
      
      &:hover {
        color: #5F9EA0;
      }
    }
  }
  
  .divider {
    position: relative;
    margin: 20px 0;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #E0E0E0;
    }
    
    span {
      background: white;
      padding: 0 20px;
      color: #999;
      font-size: 14px;
    }
  }
  
  .back-welcome {
    color: #666;
    display: flex;
    align-items: center;
    gap: 5px;
    margin: 0 auto;
    
    &:hover {
      color: #87CEEB;
    }
  }
}

.agreement-content,
.privacy-content {
  h3 {
    color: #87CEEB;
    margin-bottom: 10px;
    margin-top: 20px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
    max-width: 400px;
  }
  
  .register-decoration {
    padding: 40px 20px;
    
    .main-title {
      font-size: 36px;
    }
    
    .decoration-subtitle {
      font-size: 20px;
    }
    
    .decoration-desc {
      font-size: 14px;
    }
  }
  
  .register-form-section {
    padding: 40px 20px;
  }
}
</style>
