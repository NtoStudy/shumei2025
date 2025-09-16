<template>
  <div class="home-page">
        <!-- AI情绪分析（精简版） -->
        <div class="ai-analysis-section">
          <div class="quick-analysis">
            <h3>
              <el-icon><MagicStick /></el-icon>
              AI情绪分析
            </h3>
            <div class="quick-input">
              <el-input
                v-model="quickAnalysisText"
                type="textarea"
                :rows="2"
                placeholder="简单描述一下现在的感受..."
                @input="onQuickAnalysisInput"
                maxlength="200"
              />
              <div class="quick-actions">
                <el-button 
                  @click="quickAnalyze" 
                  type="primary" 
                  size="small"
                  :loading="isQuickAnalyzing"
                  :disabled="!quickAnalysisText.trim()"
                >
                  分析
                </el-button>
                <el-button @click="goToFullAnalysis" size="small">完整分析</el-button>
              </div>
            </div>
            <div class="quick-result" v-if="quickResult">
              <div class="result-emotion">
                <span class="emotion-emoji">{{ getEmotionEmoji(quickResult.dominant) }}</span>
                <span class="emotion-name">{{ getEmotionLabel(quickResult.dominant) }}</span>
                <span class="emotion-confidence">{{ (quickResult.confidence * 100).toFixed(0) }}%</span>
              </div>
              <div class="result-actions">
                <el-button @click="saveQuickResult" size="small" type="text">保存</el-button>
                <el-button @click="clearQuickResult" size="small" type="text">清除</el-button>
              </div>
            </div>
          </div>
        </div>

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
            <div class="action-card universe-card" @click="goToUniverse">
              <div class="action-icon universe-icon">
                <el-icon><MagicStick /></el-icon>
              </div>
              <div class="action-info">
                <h4>3D情绪宇宙</h4>
                <p>在三维空间探索情绪世界</p>
              </div>
              <div class="action-badge">NEW</div>
            </div>
            <div class="action-card" @click="goToBreathing">
              <div class="action-icon">
                <el-icon><WindPower /></el-icon>
              </div>
              <h4>呼吸练习</h4>
              <p>缓解焦虑，放松心情</p>
            </div>
            <div class="action-card" @click="goToMeditation">
              <div class="action-icon">
                <el-icon><Headset /></el-icon>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useEmotionStore } from '@/stores/emotion'
import { useCommunityStore } from '@/stores/community'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const emotionStore = useEmotionStore()
const communityStore = useCommunityStore()

// AI分析相关数据
const quickAnalysisText = ref('')
const quickResult = ref(null)
const isQuickAnalyzing = ref(false)
const debounceTimer = ref(null)

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
    title: '正念呼吸练习指南',
    description: '正念呼吸是一种简单而有效的放松技巧，可以帮助你在紧张时刻快速平静心情',
    type: '文章',
    time: '6分钟阅读' 
  },
  {
    id: 3,
    title: '大学生情绪管理完全指南',
    description: '大学生活充满挑战，学会管理情绪是成功的关键',
    type: '文章',
    time: '12分钟阅读'
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

const goToUniverse = () => {
  router.push('/emotion/universe')
  ElMessage.info('正在进入3D情绪宇宙...')
}

const viewRecommendation = (item) => {
  // 根据推荐类型跳转到不同页面
  switch (item.type) {
    case '文章':
      // 跳转到具体文章详情页面
      router.push(`/article/${item.id}`)
      break
    case '音频':
      router.push('/tools/meditation')
      break
    case '社区':
      router.push('/community/groups')
      break
  }
}

// AI分析相关方法
const onQuickAnalysisInput = () => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    if (quickAnalysisText.value.trim().length > 5) {
      quickAnalyze()
    }
  }, 1500)
}

const quickAnalyze = async () => {
  if (!quickAnalysisText.value.trim()) return

  isQuickAnalyzing.value = true
  try {
    const result = await emotionStore.analyzeEmotionText(quickAnalysisText.value)
    if (result) {
      quickResult.value = result
    }
  } catch (error) {
    console.error('快速分析失败:', error)
    ElMessage.error('分析失败，请重试')
  } finally {
    isQuickAnalyzing.value = false
  }
}

const saveQuickResult = async () => {
  if (!quickResult.value) return

  try {
    const emotionData = {
      type: quickResult.value.dominant,
      intensity: Math.round(quickResult.value.intensity * 10),
      emoji: getEmotionEmoji(quickResult.value.dominant),
      color: getEmotionColor(quickResult.value.dominant),
      content: quickAnalysisText.value,
      tags: ['快速分析']
    }

    await emotionStore.addEmotion(emotionData)
    ElMessage.success('情绪记录已保存')
    
    // 清空
    clearQuickResult()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  }
}

const clearQuickResult = () => {
  quickAnalysisText.value = ''
  quickResult.value = null
}

const goToFullAnalysis = () => {
  router.push('/emotion')
}

const getEmotionEmoji = (emotion) => {
  const emojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    fear: '😰',
    surprise: '😲',
    disgust: '🤢',
    neutral: '😐'
  }
  return emojis[emotion] || '😐'
}

const getEmotionColor = (emotion) => {
  const colors = {
    happy: '#FFD700',
    sad: '#4169E1',
    angry: '#FF6347',
    fear: '#FF1493',
    surprise: '#FF69B4',
    disgust: '#9ACD32',
    neutral: '#C0C0C0'
  }
  return colors[emotion] || '#C0C0C0'
}

onMounted(async () => {
  // 页面加载时的初始化逻辑
  emotionStore.updateStats()
  
  // 初始化AI引擎
  try {
    await emotionStore.initializeAI()
  } catch (error) {
    console.warn('AI初始化失败:', error)
  }
})
</script>

<style scoped lang="scss">
// Layout styles moved to DefaultLayout component

.ai-analysis-section {
  margin-bottom: 24px;
  
  .quick-analysis {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    
    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .quick-input {
      .el-textarea {
        margin-bottom: 12px;
        
        :deep(.el-textarea__inner) {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 12px;
          
          &::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
          
          &:focus {
            border-color: rgba(255, 255, 255, 0.5);
            background: rgba(255, 255, 255, 0.15);
          }
        }
      }
      
      .quick-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        
        .el-button {
          border-radius: 8px;
        }
      }
    }
    
    .quick-result {
      margin-top: 16px;
      padding: 16px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      
      .result-emotion {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
        
        .emotion-emoji {
          font-size: 24px;
        }
        
        .emotion-name {
          font-size: 16px;
          font-weight: 600;
        }
        
        .emotion-confidence {
          font-size: 14px;
          opacity: 0.8;
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
        }
      }
      
      .result-actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        
        .el-button {
          color: rgba(255, 255, 255, 0.8);
          
          &:hover {
            color: white;
          }
        }
      }
    }
  }
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
  position: relative;
  
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
  
  .action-info {
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
  
  .action-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
    color: white;
    font-size: 10px;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
    animation: pulse-badge 2s infinite;
  }
  
  &.universe-card {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
    color: white;
    border: 1px solid rgba(0, 212, 255, 0.3);
    
    &:hover {
      box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
      border-color: rgba(0, 212, 255, 0.5);
    }
    
    .universe-icon {
      color: #00d4ff;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        animation: universe-glow 3s ease-in-out infinite alternate;
      }
      
      .el-icon {
        position: relative;
        z-index: 1;
      }
    }
    
    .action-info {
      h4 {
        color: #00d4ff;
        font-weight: 600;
      }
      
      p {
        color: rgba(255, 255, 255, 0.8);
      }
    }
    
    .action-badge {
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      animation: universe-pulse 2s infinite;
    }
  }
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes universe-glow {
  0% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes universe-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(0, 212, 255, 0.5);
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
