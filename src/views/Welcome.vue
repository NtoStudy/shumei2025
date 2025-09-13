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
      
      <!-- 产品特色区域 -->
      <div class="features-section">
        <h2 class="section-title">为什么选择向阳而生？</h2>
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id" @click="showFeatureDetail(feature)">
            <div class="feature-icon">
              <el-icon :size="32"><component :is="feature.icon" /></el-icon>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
            <div class="feature-hint">
              <el-icon><InfoFilled /></el-icon>
              点击查看详情
            </div>
          </div>
        </div>
      </div>
      
      <!-- 产品优势区域 -->
      <div class="advantages-section">
        <h2 class="section-title">我们的优势</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">
              <el-icon><Shield /></el-icon>
            </div>
            <h3>完全匿名</h3>
            <p>保护隐私，无需担心个人信息泄露</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">
              <el-icon><Heart /></el-icon>
            </div>
            <h3>温暖陪伴</h3>
            <p>同龄人理解，温暖互助的社区氛围</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">
              <el-icon><Star /></el-icon>
            </div>
            <h3>科学专业</h3>
            <p>基于心理学理论，提供科学有效的工具</p>
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
            @click="goToRegister"
            class="primary-btn"
          >
            <el-icon><UserFilled /></el-icon>
            立即注册
          </el-button>
          <el-button 
            size="large" 
            @click="goToLogin"
            class="secondary-btn"
          >
            <el-icon><User /></el-icon>
            已有账户？登录
          </el-button>
        </div>
        
        <div class="privacy-info">
          <p class="privacy-text">
            注册即表示您同意我们的
            <el-button type="text" @click="showPrivacy" class="privacy-link">
              《隐私政策》
            </el-button>
            和
            <el-button type="text" @click="showAgreement" class="privacy-link">
              《用户协议》
            </el-button>
          </p>
        </div>
      </div>
    </div>
    
    <!-- 功能详情对话框 -->
    <el-dialog
      v-model="featureDetailVisible"
      :title="selectedFeature?.title"
      width="60%"
      class="feature-dialog"
    >
      <div class="feature-detail-content" v-if="selectedFeature">
        <div class="feature-detail-header">
          <div class="feature-detail-icon">
            <el-icon :size="48"><component :is="selectedFeature.icon" /></el-icon>
          </div>
          <div class="feature-detail-info">
            <h3>{{ selectedFeature.title }}</h3>
            <p class="feature-detail-desc">{{ selectedFeature.description }}</p>
          </div>
        </div>
        
        <div class="feature-detail-body">
          <h4>功能特点</h4>
          <ul class="feature-features">
            <li v-for="feature in selectedFeature.features" :key="feature">{{ feature }}</li>
          </ul>
          
          <h4>使用场景</h4>
          <p class="feature-scenario">{{ selectedFeature.scenario }}</p>
          
          <h4>预期效果</h4>
          <p class="feature-effect">{{ selectedFeature.effect }}</p>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="featureDetailVisible = false">关闭</el-button>
        <el-button type="primary" @click="goToFeature">立即体验</el-button>
      </template>
    </el-dialog>

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
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const privacyVisible = ref(false)
const agreementVisible = ref(false)
const featureDetailVisible = ref(false)
const selectedFeature = ref(null)

const features = ref([
  {
    id: 1,
    icon: 'Sunny',
    title: '情绪记录',
    description: '记录每日情绪变化，了解自己的心理状态',
    features: [
      '多种情绪类型选择',
      '情绪强度量化评分',
      '情绪触发因素记录',
      '情绪趋势可视化分析',
      '数据导出和备份'
    ],
    scenario: '当你感到焦虑、压力或情绪波动时，可以随时记录当下的情绪状态，分析情绪变化规律。',
    effect: '帮助你更好地了解自己的情绪模式，提升情绪管理能力，建立健康的心理状态。'
  },
  {
    id: 2,
    icon: 'Tools',
    title: '自助工具',
    description: '呼吸练习、正念冥想等科学有效的调节方法',
    features: [
      '引导式呼吸训练',
      '正念冥想音频',
      '认知重构练习',
      '放松技巧指导',
      '个性化推荐'
    ],
    scenario: '在考试前感到紧张、失眠时，或需要快速平复情绪时使用。',
    effect: '通过科学的心理调节方法，帮助你快速缓解压力，恢复内心平静。'
  },
  {
    id: 3,
    icon: 'ChatDotRound',
    title: '社区互助',
    description: '匿名分享心情，获得同龄人的理解和支持',
    features: [
      '匿名树洞分享',
      '互助小组讨论',
      '温暖留言系统',
      '经验分享平台',
      '专业志愿者指导'
    ],
    scenario: '当你感到孤独、需要倾诉或寻求建议时，可以在社区中找到理解和支持。',
    effect: '减少孤独感，获得情感支持，学习他人的应对经验，建立归属感。'
  },
  {
    id: 4,
    icon: 'TrendCharts',
    title: '成长记录',
    description: '追踪心理健康变化，见证自己的成长历程',
    features: [
      '个人成长档案',
      '成就徽章系统',
      '成长报告生成',
      '目标设定跟踪',
      '里程碑庆祝'
    ],
    scenario: '定期回顾自己的心理健康状况，设定成长目标，记录进步过程。',
    effect: '增强自我认知，提升成就感，激励持续的心理健康管理。'
  },
  {
    id: 5,
    icon: 'Reading',
    title: '专业资源',
    description: '心理健康知识、专业测试、危机干预资源',
    features: [
      '心理健康知识库',
      '专业心理测试',
      '危机干预指南',
      '专业机构推荐',
      '紧急联系方式'
    ],
    scenario: '需要了解心理健康知识、进行自我评估或遇到紧急情况时使用。',
    effect: '提供科学可靠的心理健康信息，帮助识别问题，获得专业指导。'
  },
  {
    id: 6,
    icon: 'User',
    title: '个性化推荐',
    description: '基于您的数据，提供个性化的内容和服务',
    features: [
      '智能内容推荐',
      '个性化学习路径',
      '使用提醒设置',
      '进度跟踪反馈',
      '定制化服务'
    ],
    scenario: '根据你的使用习惯和情绪状态，系统会推荐最适合的工具和内容。',
    effect: '提供更精准的服务，提高使用效果，增强用户体验。'
  }
])

const showFeatureDetail = (feature) => {
  selectedFeature.value = feature
  featureDetailVisible.value = true
}

const goToFeature = () => {
  featureDetailVisible.value = false
  // 根据功能类型跳转到对应页面
  switch (selectedFeature.value.id) {
    case 1:
      router.push('/emotion')
      break
    case 2:
      router.push('/tools')
      break
    case 3:
      router.push('/community')
      break
    case 4:
      router.push('/growth')
      break
    case 5:
      router.push('/resources')
      break
    case 6:
      router.push('/home')
      break
  }
}

const showPrivacy = () => {
  privacyVisible.value = true
}

const showAgreement = () => {
  agreementVisible.value = true
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
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
  margin-bottom: 60px;
}

.advantages-section {
  margin-bottom: 60px;
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
  cursor: pointer;
  position: relative;
  
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
  margin-bottom: 15px;
}

.feature-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #FF6B6B;
  font-size: 12px;
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.feature-card:hover .feature-hint {
  opacity: 1;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.advantage-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.2);
    border-color: #FF6B6B;
  }
  
  .advantage-icon {
    color: #FF6B6B;
    margin-bottom: 20px;
    
    .el-icon {
      font-size: 40px;
    }
  }
  
  h3 {
    color: #333;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    font-size: 14px;
    margin: 0;
  }
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

.privacy-confirmation {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  
  .privacy-link {
    color: #FF6B6B;
    padding: 0;
    font-weight: 500;
    
    &:hover {
      color: #FF5252;
    }
  }
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.primary-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  }
}

.secondary-btn {
  color: #FF6B6B;
  border-color: #FF6B6B;
  background: transparent;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  
  &:hover {
    background: #FF6B6B;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  }
}

.privacy-info {
  text-align: center;
  margin-top: 20px;
  
  .privacy-text {
    color: #666;
    font-size: 14px;
    margin: 0;
    
    .privacy-link {
      color: #FF6B6B;
      padding: 0;
      font-weight: 500;
      
      &:hover {
        color: #FF5252;
      }
    }
  }
}

.start-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
  }
  
  &:disabled {
    background: #E0E0E0;
    color: #999;
    cursor: not-allowed;
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

// 功能详情对话框样式
.feature-dialog {
  .feature-detail-content {
    .feature-detail-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #E0E0E0;
      
      .feature-detail-icon {
        color: #FF6B6B;
        flex-shrink: 0;
      }
      
      .feature-detail-info {
        h3 {
          color: #333;
          margin: 0 0 10px 0;
          font-size: 24px;
          font-weight: 600;
        }
        
        .feature-detail-desc {
          color: #666;
          margin: 0;
          font-size: 16px;
          line-height: 1.6;
        }
      }
    }
    
    .feature-detail-body {
      h4 {
        color: #FF6B6B;
        margin: 20px 0 15px 0;
        font-size: 18px;
        font-weight: 600;
      }
      
      .feature-features {
        list-style: none;
        padding: 0;
        margin: 0 0 20px 0;
        
        li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
          color: #666;
          line-height: 1.6;
          
          &::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #FF6B6B;
            font-weight: bold;
          }
        }
      }
      
      .feature-scenario,
      .feature-effect {
        color: #666;
        line-height: 1.6;
        margin: 0 0 15px 0;
        padding: 15px;
        background: #F8F9FA;
        border-radius: 8px;
        border-left: 4px solid #FF6B6B;
      }
    }
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
