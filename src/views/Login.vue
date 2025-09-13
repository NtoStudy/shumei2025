<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧装饰区域 -->
      <div class="login-decoration">
        <div class="decoration-content">
          <div class="logo-section">
            <el-icon class="main-logo"><Sunny /></el-icon>
            <h1 class="main-title">向阳而生</h1>
          </div>
          <p class="decoration-subtitle">大学生心理健康陪伴平台</p>
          <p class="decoration-desc">
            温暖、不说教、不尴尬的心理健康自助与互助平台<br>
            让每一个心灵都能向阳而生
          </p>
          
          <div class="floating-elements">
            <div class="element element-1">😊</div>
            <div class="element element-2">🌱</div>
            <div class="element element-3">💝</div>
            <div class="element element-4">🌈</div>
            <div class="element element-5">🦋</div>
          </div>
        </div>
      </div>
      
      <!-- 右侧登录表单区域 -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">欢迎回来</h2>
            <p class="form-subtitle">登录你的账户，继续你的心灵之旅</p>
          </div>
          
          <el-form 
            :model="loginForm" 
            :rules="loginRules" 
            ref="loginFormRef"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                size="large"
                prefix-icon="User"
                class="form-input"
              />
            </el-form-item>
            
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                prefix-icon="Lock"
                class="form-input"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <div class="form-options">
                <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
                <el-button type="text" class="forgot-password">忘记密码？</el-button>
              </div>
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                class="login-btn"
                :loading="loginLoading"
                @click="handleLogin"
              >
                <el-icon><Right /></el-icon>
                登录
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="form-footer">
            <p class="register-tip">
              还没有账户？
              <el-button type="text" @click="goToRegister" class="register-link">
                立即注册
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref()
const loginLoading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loginLoading.value = true
    
    // 模拟登录请求
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新用户信息
    userStore.updateProfile({
      nickname: loginForm.username,
      joinDate: new Date().toISOString()
    })
    
    ElMessage.success('登录成功！')
    
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    console.log('表单验证失败:', error)
  } finally {
    loginLoading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

const goToWelcome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 50%, #E6F3FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(255, 107, 107, 0.15);
  overflow: hidden;
  min-height: 600px;
}

.login-decoration {
  flex: 1;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
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

.login-form-section {
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

.login-form {
  .form-input {
    margin-bottom: 20px;
    
    :deep(.el-input__wrapper) {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid #E0E0E0;
      
      &:hover {
        border-color: #FF6B6B;
      }
      
      &.is-focus {
        border-color: #FF6B6B;
        box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  
  .forgot-password {
    color: #FF6B6B;
    padding: 0;
    
    &:hover {
      color: #FF5252;
    }
  }
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
  }
  
  &:disabled {
    background: #E0E0E0;
    color: #999;
  }
}

.form-footer {
  text-align: center;
  margin-top: 30px;
  
  .register-tip {
    color: #666;
    margin: 0 0 20px 0;
    
    .register-link {
      color: #FF6B6B;
      font-weight: 500;
      
      &:hover {
        color: #FF5252;
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
      color: #FF6B6B;
    }
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
  .login-container {
    flex-direction: column;
    max-width: 400px;
  }
  
  .login-decoration {
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
  
  .login-form-section {
    padding: 40px 20px;
  }
}
</style>
