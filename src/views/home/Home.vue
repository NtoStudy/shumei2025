<template>
  <div class="home-page">
    <AppHeader />
    
    <div class="main-content">
      <div class="content-container">
        <!-- 欢迎区域 -->
        <div class="welcome-section">
          <div class="welcome-card">
            <div class="welcome-content">
              <h2 class="welcome-title">
                <el-icon><Sunny /></el-icon>
                你好，{{ userStore.profile.nickname || '朋友' }}！
              </h2>
              <p class="welcome-desc">今天感觉怎么样？记录一下你的心情吧</p>
            </div>
            <div class="welcome-actions">
              <el-button type="primary" @click="quickRecord" class="record-btn" size="large">
                <el-icon class="record-icon"><Edit /></el-icon>
                快速记录情绪
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 今日情绪状态 -->
        <div class="emotion-section">
          <h3 class="section-title">
            <el-icon><TrendCharts /></el-icon>
            今日情绪状态
          </h3>
          <div class="emotion-cards">
            <div class="emotion-card" v-if="todayEmotion">
              <div class="emotion-info">
                <div class="emotion-emoji">{{ todayEmotion.emotion.emoji }}</div>
                <div class="emotion-details">
                  <h4>{{ getEmotionLabel(todayEmotion.emotion.type) }}</h4>
                  <p>强度: {{ todayEmotion.emotion.intensity }}/10</p>
                  <p class="emotion-time">{{ formatTime(todayEmotion.timestamp) }}</p>
                </div>
              </div>
              <div class="emotion-content" v-if="todayEmotion.content">
                <p>{{ todayEmotion.content }}</p>
              </div>
            </div>
            <div class="no-emotion-card" v-else>
              <el-icon class="no-emotion-icon"><Sunny /></el-icon>
              <p>还没有记录今天的心情</p>
              <el-button type="primary" @click="quickRecord">立即记录</el-button>
            </div>
          </div>
        </div>
        
        <!-- 快速操作 -->
        <div class="quick-actions-section">
          <h3 class="section-title">
            <el-icon><Tools /></el-icon>
            快速操作
          </h3>
          <div class="actions-grid">
            <div class="action-card" @click="goToBreathing">
              <div class="action-icon">
                <el-icon><WindPower /></el-icon>
              </div>
              <h4>呼吸练习</h4>
              <p>缓解焦虑，放松心情</p>
            </div>
            <div class="action-card" @click="goToMeditation">
              <div class="action-icon">
                <el-icon><Headphones /></el-icon>
              </div>
              <h4>正念冥想</h4>
              <p>提升专注力，平静内心</p>
            </div>
            <div class="action-card" @click="goToTreehole">
              <div class="action-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <h4>匿名树洞</h4>
              <p>分享心情，获得支持</p>
            </div>
            <div class="action-card" @click="goToChart">
              <div class="action-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <h4>情绪图谱</h4>
              <p>查看情绪变化趋势</p>
            </div>
          </div>
        </div>
        
        <!-- 推荐内容 -->
        <div class="recommendations-section">
          <h3 class="section-title">
            <el-icon><Star /></el-icon>
            为你推荐
          </h3>
          <div class="recommendations-grid">
            <div class="recommendation-card" v-for="item in recommendations" :key="item.id">
              <div class="recommendation-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
                <div class="recommendation-meta">
                  <span class="recommendation-type">{{ item.type }}</span>
                  <span class="recommendation-time">{{ item.time }}</span>
                </div>
              </div>
              <el-button type="text" @click="viewRecommendation(item)">
                查看详情
                <el-icon><Right /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        
        <!-- 成长进度 -->
        <div class="progress-section">
          <h3 class="section-title">
            <el-icon><Trophy /></el-icon>
            成长进度
          </h3>
          <div class="progress-cards">
            <div class="progress-card">
              <div class="progress-info">
                <h4>连续记录</h4>
                <p class="progress-number">{{ userStore.profile.achievements.length }}</p>
                <p class="progress-desc">天</p>
              </div>
              <div class="progress-icon">
                <el-icon><Calendar /></el-icon>
              </div>
            </div>
            <div class="progress-card">
              <div class="progress-info">
                <h4>情绪记录</h4>
                <p class="progress-number">{{ emotionStore.emotions.length }}</p>
                <p class="progress-desc">条</p>
              </div>
              <div class="progress-icon">
                <el-icon><Sunny /></el-icon>
              </div>
            </div>
            <div class="progress-card">
              <div class="progress-info">
                <h4>社区互动</h4>
                <p class="progress-number">{{ communityStore.userPosts.length }}</p>
                <p class="progress-desc">次</p>
              </div>
              <div class="progress-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useEmotionStore } from '@/stores/emotion'
import { useCommunityStore } from '@/stores/community'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const router = useRouter()
const userStore = useUserStore()
const emotionStore = useEmotionStore()
const communityStore = useCommunityStore()

const recommendations = ref([
  {
    id: 1,
    title: '如何应对考试焦虑',
    description: '分享一些实用的缓解考试焦虑的方法',
    type: '文章',
    time: '5分钟阅读'
  },
  {
    id: 2,
    title: '正念呼吸练习',
    description: '跟着音频进行5分钟的正念呼吸练习',
    type: '音频',
    time: '5分钟'
  },
  {
    id: 3,
    title: '情绪管理小组',
    description: '加入我们的情绪管理讨论小组',
    type: '社区',
    time: '随时参与'
  }
])

const todayEmotion = computed(() => {
  const today = new Date().toDateString()
  return emotionStore.emotions.find(emotion => 
    new Date(emotion.timestamp).toDateString() === today
  )
})

const getEmotionLabel = (type) => {
  const labels = {
    'happy': '开心',
    'sad': '难过',
    'anxious': '焦虑',
    'angry': '愤怒',
    'calm': '平静',
    'excited': '兴奋',
    'tired': '疲惫',
    'confused': '困惑'
  }
  return labels[type] || type
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const quickRecord = () => {
  router.push('/emotion')
}

const goToBreathing = () => {
  router.push('/tools/breathing')
}

const goToMeditation = () => {
  router.push('/tools/meditation')
}

const goToTreehole = () => {
  router.push('/community/treehole')
}

const goToChart = () => {
  router.push('/emotion/chart')
}

const viewRecommendation = (item) => {
  // 根据推荐类型跳转到不同页面
  switch (item.type) {
    case '文章':
      router.push('/resources/knowledge')
      break
    case '音频':
      router.push('/tools/meditation')
      break
    case '社区':
      router.push('/community/groups')
      break
  }
}

onMounted(() => {
  // 页面加载时的初始化逻辑
  emotionStore.updateStats()
})
</script>

<style scoped lang="scss">
.home-page {
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.welcome-section {
  margin-bottom: 30px;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.welcome-content {
  flex: 1;
  
  .welcome-title {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #FF6B6B;
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 600;
  }
  
  .welcome-desc {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

.record-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  font-size: 16px;
  border-radius: 50px;
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
  
  .record-icon {
    margin-right: 8px;
    font-size: 18px;
  }
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
  }
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #FF6B6B;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.emotion-section {
  margin-bottom: 30px;
}

.emotion-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.emotion-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.emotion-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  
  .emotion-emoji {
    font-size: 32px;
  }
  
  .emotion-details {
    h4 {
      color: #333;
      margin: 0 0 5px 0;
      font-size: 18px;
    }
    
    p {
      color: #666;
      margin: 0;
      font-size: 14px;
    }
  }
}

.emotion-content {
  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
}

.no-emotion-card {
  background: white;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
  
  .no-emotion-icon {
    font-size: 48px;
    color: #FFB6C1;
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    margin-bottom: 20px;
  }
}

.quick-actions-section {
  margin-bottom: 30px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(255, 107, 107, 0.2);
  }
  
  .action-icon {
    color: #FF6B6B;
    margin-bottom: 15px;
    
    .el-icon {
      font-size: 32px;
    }
  }
  
  h4 {
    color: #333;
    margin-bottom: 10px;
    font-size: 16px;
  }
  
  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
}

.recommendations-section {
  margin-bottom: 30px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.recommendation-content {
  flex: 1;
  
  h4 {
    color: #333;
    margin: 0 0 8px 0;
    font-size: 16px;
  }
  
  p {
    color: #666;
    font-size: 14px;
    margin: 0 0 10px 0;
  }
}

.recommendation-meta {
  display: flex;
  gap: 15px;
  
  .recommendation-type {
    background: #FFB6C1;
    color: white;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  .recommendation-time {
    color: #999;
    font-size: 12px;
  }
}

.progress-section {
  margin-bottom: 30px;
}

.progress-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.progress-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-info {
  h4 {
    color: #333;
    margin: 0 0 10px 0;
    font-size: 14px;
  }
  
  .progress-number {
    color: #FF6B6B;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
  
  .progress-desc {
    color: #666;
    font-size: 12px;
    margin: 0;
  }
}

.progress-icon {
  color: #FFB6C1;
  
  .el-icon {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    text-align: center;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-cards {
    grid-template-columns: 1fr;
  }
}
</style>
