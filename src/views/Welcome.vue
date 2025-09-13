<template>
  <div class="welcome-page">
    <div class="welcome-container">
      <!-- 主标题区域 -->
      <div class="hero-section">
        <div class="hero-content">
          <div class="logo-section">
            <el-icon class="main-logo"><Sunny /></el-icon>
            <h1 class="main-title">向阳而生</h1>
          </div>
          <p class="subtitle">大学生心理健康陪伴平台</p>
          <p class="description">
            温暖、不说教、不尴尬的心理健康自助与互助平台<br>
            让每一个心灵都能向阳而生
          </p>
        </div>
        
        <div class="hero-image">
          <div class="floating-elements">
            <div class="element element-1">😊</div>
            <div class="element element-2">🌱</div>
            <div class="element element-3">💝</div>
            <div class="element element-4">🌈</div>
            <div class="element element-5">🦋</div>
          </div>
        </div>
      </div>
      
      <!-- 功能预览区域 -->
      <div class="features-section">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <el-icon :size="32"><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- 开始使用区域 -->
      <div class="cta-section">
        <h2 class="section-title">开始你的心灵之旅</h2>
        <p class="cta-desc">匿名、安全、温暖的心理健康陪伴</p>
        
        <div class="cta-actions">
          <el-button 
            type="primary" 
            size="large" 
            @click="startJourney"
            class="start-btn"
          >
            <el-icon><Right /></el-icon>
            开始使用
          </el-button>
          <el-button 
            size="large" 
            @click="showPrivacy"
            class="privacy-btn"
          >
            <el-icon><Document /></el-icon>
            隐私政策
          </el-button>
        </div>
      </div>
    </div>
    
    <!-- 隐私政策对话框 -->
    <el-dialog
      v-model="privacyVisible"
      title="隐私政策"
      width="80%"
      :before-close="handleClose"
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
        <el-button type="primary" @click="acceptPrivacy">我同意并开始使用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const privacyVisible = ref(false)

const features = ref([
  {
    id: 1,
    icon: 'Sunny',
    title: '情绪记录',
    description: '记录每日情绪变化，了解自己的心理状态'
  },
  {
    id: 2,
    icon: 'Tools',
    title: '自助工具',
    description: '呼吸练习、正念冥想等科学有效的调节方法'
  },
  {
    id: 3,
    icon: 'ChatDotRound',
    title: '社区互助',
    description: '匿名分享心情，获得同龄人的理解和支持'
  },
  {
    id: 4,
    icon: 'TrendCharts',
    title: '成长记录',
    description: '追踪心理健康变化，见证自己的成长历程'
  },
  {
    id: 5,
    icon: 'Reading',
    title: '专业资源',
    description: '心理健康知识、专业测试、危机干预资源'
  },
  {
    id: 6,
    icon: 'User',
    title: '个性化推荐',
    description: '基于您的数据，提供个性化的内容和服务'
  }
])

const startJourney = () => {
  console.log('开始使用按钮被点击')
  console.log('用户首次使用状态:', userStore.isFirstTime)
  console.log('用户信息:', userStore.profile)
  
  if (userStore.isFirstTime) {
    console.log('跳转到设置页面')
    router.push('/settings')
  } else {
    console.log('跳转到首页')
    router.push('/home')
  }
}

const showPrivacy = () => {
  privacyVisible.value = true
}

const acceptPrivacy = () => {
  privacyVisible.value = false
  startJourney()
}

const handleClose = (done) => {
  done()
}
</script>

<style scoped lang="scss">
.welcome-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 50%, #E6F3FF 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px;
}

.welcome-container {
  max-width: 1200px;
  width: 100%;
  margin-top: 60px;
}

.hero-section {
  display: flex;
  align-items: center;
  text-align: left;
  gap: 60px;
  margin-bottom: 100px;
  position: relative;
}

.hero-content {
  flex: 1;
  margin-bottom: 0;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  
  .main-logo {
    font-size: 48px;
    color: #FF6B6B;
    animation: pulse 2s infinite;
  }
  
  .main-title {
    font-size: 48px;
    font-weight: 700;
    color: #FF6B6B;
    margin: 0;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }
}

.subtitle {
  font-size: 24px;
  color: #666;
  margin-bottom: 15px;
  font-weight: 500;
}

.description {
  font-size: 18px;
  color: #888;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.hero-image {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.floating-elements {
  position: relative;
  width: 400px;
  height: 300px;
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

.features-section {
  margin-bottom: 80px;
}

.section-title {
  text-align: center;
  font-size: 32px;
  color: #FF6B6B;
  margin-bottom: 50px;
  font-weight: 600;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.2);
  }
}

.feature-icon {
  margin-bottom: 20px;
  color: #FF6B6B;
}

.feature-title {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
  font-weight: 600;
}

.feature-desc {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.cta-section {
  text-align: center;
  background: white;
  padding: 50px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.cta-desc {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.start-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
  }
}

.privacy-btn {
  color: #FF6B6B;
  border-color: #FF6B6B;
  
  &:hover {
    background: #FF6B6B;
    color: white;
  }
}

.privacy-content {
  h3 {
    color: #FF6B6B;
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
  .main-title {
    font-size: 36px;
  }
  
  .subtitle {
    font-size: 20px;
  }
  
  .description {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
