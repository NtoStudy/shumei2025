<template>
  <div class="ai-insights-page">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><TrendCharts /></el-icon>
        AI情绪洞察
      </h1>
      <p class="page-desc">通过人工智能深度分析你的情绪模式</p>
    </div>

    <!-- AI状态 -->
    <div class="ai-status-card" v-if="!emotionStore.isAIInitialized">
      <div class="status-content">
        <el-icon class="status-icon"><Loading /></el-icon>
        <div class="status-text">
          <h3>AI分析引擎初始化中...</h3>
          <p>请稍等片刻，我们正在为您启动智能分析服务</p>
        </div>
      </div>
    </div>

    <!-- AI洞察内容 -->
    <div class="insights-content" v-else>
      <!-- 总体分析 -->
      <div class="insight-card overview-card">
        <div class="card-header">
          <h3>
            <el-icon><DataAnalysis /></el-icon>
            总体分析
          </h3>
          <el-tag :type="getOverallTrendType(insights.trend?.trend_direction)" v-if="insights.hasData">
            {{ getTrendLabel(insights.trend?.trend_direction) }}
          </el-tag>
        </div>

        <div class="card-content" v-if="insights.hasData">
          <div class="metrics-grid">
            <div class="metric-item">
              <div class="metric-value">{{ insights.totalAnalyzed }}</div>
              <div class="metric-label">AI分析记录</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ (insights.averageIntensity * 10).toFixed(1) }}</div>
              <div class="metric-label">平均情绪强度</div>
            </div>
            <div class="metric-item">
              <div class="metric-value">{{ getEmotionLabel(insights.mostFrequentEmotion) }}</div>
              <div class="metric-label">主要情绪</div>
            </div>
          </div>

          <!-- 情绪分布图 -->
          <div class="emotion-distribution-chart">
            <h4>情绪分布分析</h4>
            <div class="distribution-bars">
              <div 
                v-for="(value, emotion) in insights.trend.emotion_distribution" 
                :key="emotion"
                class="distribution-bar"
              >
                <div class="bar-info">
                  <span class="emotion-name">{{ getEmotionLabel(emotion) }}</span>
                  <span class="emotion-percentage">{{ (value * 100).toFixed(1) }}%</span>
                </div>
                <div class="bar-container">
                  <div 
                    class="bar-fill"
                    :style="{ 
                      width: `${value * 100}%`,
                      backgroundColor: getEmotionColor(emotion)
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="no-data-message" v-else>
          <el-icon><DocumentRemove /></el-icon>
          <h4>暂无AI分析数据</h4>
          <p>{{ insights.message }}</p>
          <el-button type="primary" @click="goToEmotionDiary">开始记录情绪</el-button>
        </div>
      </div>

      <!-- 情绪模式分析 -->
      <div class="insight-card patterns-card" v-if="insights.hasData">
        <div class="card-header">
          <h3>
            <el-icon><Connection /></el-icon>
            情绪模式分析
          </h3>
        </div>

        <div class="card-content">
          <div class="patterns-grid">
            <div class="pattern-item">
              <h5>最近情绪趋势</h5>
              <div class="pattern-chart">
                <div class="trend-line">
                  <div 
                    v-for="(emotion, index) in insights.trend.dominant_emotions.slice(-7)" 
                    :key="index"
                    class="trend-point"
                    :style="{ backgroundColor: getEmotionColor(emotion) }"
                    :title="getEmotionLabel(emotion)"
                  ></div>
                </div>
                <div class="trend-labels">
                  <span>7天前</span>
                  <span>今天</span>
                </div>
              </div>
            </div>

            <div class="pattern-item">
              <h5>情绪频次分析</h5>
              <div class="frequency-list">
                <div 
                  v-for="(count, emotion) in insights.recentPatterns" 
                  :key="emotion"
                  class="frequency-item"
                >
                  <span class="frequency-emotion">
                    <span class="emotion-emoji">{{ getEmotionEmoji(emotion) }}</span>
                    {{ getEmotionLabel(emotion) }}
                  </span>
                  <span class="frequency-count">{{ count }}次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI建议 -->
      <div class="insight-card suggestions-card" v-if="insights.hasData && insights.suggestions">
        <div class="card-header">
          <h3>
            <el-icon><Lightbulb /></el-icon>
            个性化建议
          </h3>
        </div>

        <div class="card-content">
          <el-tabs v-model="activeTab" class="suggestion-tabs">
            <el-tab-pane label="推荐工具" name="tools">
              <div class="suggestions-grid">
                <div 
                  v-for="tool in insights.suggestions.tools" 
                  :key="tool"
                  class="suggestion-item tool-item"
                  @click="goToTool(tool)"
                >
                  <el-icon><Tools /></el-icon>
                  <span>{{ tool }}</span>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="推荐活动" name="activities">
              <div class="suggestions-grid">
                <div 
                  v-for="activity in insights.suggestions.activities" 
                  :key="activity"
                  class="suggestion-item activity-item"
                >
                  <el-icon><Star /></el-icon>
                  <span>{{ activity }}</span>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="实用提示" name="tips">
              <div class="tips-list">
                <div 
                  v-for="tip in insights.suggestions.tips" 
                  :key="tip"
                  class="tip-item"
                >
                  <el-icon><InfoFilled /></el-icon>
                  <span>{{ tip }}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 情绪词云 -->
      <div class="insight-card wordcloud-card" v-if="insights.hasData && emotionWords.length > 0">
        <div class="card-header">
          <h3>
            <el-icon><ChatDotRound /></el-icon>
            情绪关键词
          </h3>
        </div>

        <div class="card-content">
          <div class="word-cloud">
            <span 
              v-for="word in emotionWords" 
              :key="word.text"
              class="word-item"
              :style="{ 
                fontSize: `${Math.max(12, word.weight * 20)}px`,
                color: getEmotionColor(word.emotion)
              }"
            >
              {{ word.text }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 刷新按钮 -->
    <div class="refresh-section">
      <el-button @click="refreshInsights" :loading="isRefreshing" type="primary">
        <el-icon><Refresh /></el-icon>
        刷新分析
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmotionStore } from '@/stores/emotion'

const router = useRouter()
const emotionStore = useEmotionStore()

// 响应式数据
const activeTab = ref('tools')
const isRefreshing = ref(false)

// 计算属性
const insights = computed(() => {
  return emotionStore.getAIInsights()
})

const emotionWords = computed(() => {
  if (!insights.value.hasData) return []
  
  // 从AI分析中提取关键词
  const emotions = emotionStore.emotions.filter(e => e.aiAnalysis)
  const words = []
  
  emotions.forEach(emotion => {
    if (emotion.aiAnalysis && emotion.aiAnalysis.analysis.tokens) {
      emotion.aiAnalysis.analysis.tokens.forEach(token => {
        if (token.emotion && token.word.length > 1) {
          const existing = words.find(w => w.text === token.word)
          if (existing) {
            existing.weight += token.weight || 0.5
          } else {
            words.push({
              text: token.word,
              emotion: token.emotion,
              weight: token.weight || 0.5
            })
          }
        }
      })
    }
  })
  
  // 按权重排序并限制数量
  return words
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 30)
})

// 情绪标签映射
const emotionLabels = {
  happy: '快乐',
  sad: '悲伤',
  angry: '愤怒',
  fear: '恐惧',
  surprise: '惊讶',
  disgust: '厌恶',
  neutral: '平静'
}

const emotionEmojis = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  fear: '😰',
  surprise: '😲',
  disgust: '🤢',
  neutral: '😐'
}

const emotionColors = {
  happy: '#FFD700',
  sad: '#4169E1',
  angry: '#FF6347',
  fear: '#FF1493',
  surprise: '#FF69B4',
  disgust: '#9ACD32',
  neutral: '#C0C0C0'
}

// 方法
const getEmotionLabel = (emotion) => emotionLabels[emotion] || emotion
const getEmotionEmoji = (emotion) => emotionEmojis[emotion] || '😐'
const getEmotionColor = (emotion) => emotionColors[emotion] || '#C0C0C0'

const getTrendLabel = (trend) => {
  const labels = {
    improving: '情绪改善',
    declining: '需要关注',
    stable: '状态稳定'
  }
  return labels[trend] || '状态稳定'
}

const getOverallTrendType = (trend) => {
  const types = {
    improving: 'success',
    declining: 'warning',
    stable: 'info'
  }
  return types[trend] || 'info'
}

const goToTool = (toolName) => {
  const toolRoutes = {
    '呼吸练习': '/tools/breathing',
    '正念冥想': '/tools/meditation',
    '认知重构': '/tools/cognition',
    '肌肉放松': '/tools/relaxation',
    '压力管理': '/tools/stress-management',
    '情绪调节': '/tools/emotion-regulation'
  }
  
  const route = toolRoutes[toolName]
  if (route) {
    router.push(route)
  }
}

const goToEmotionDiary = () => {
  router.push('/emotion/diary')
}

const refreshInsights = async () => {
  isRefreshing.value = true
  try {
    // 重新计算统计数据
    emotionStore.updateStats()
    
    // 模拟刷新延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
  } finally {
    isRefreshing.value = false
  }
}

// 生命周期
onMounted(async () => {
  try {
    await emotionStore.initializeAI()
  } catch (error) {
    console.warn('AI初始化失败:', error)
  }
})
</script>

<style scoped lang="scss">
.ai-insights-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  
  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 0 0 8px 0;
    font-size: 28px;
    color: #FF6B6B;
    font-weight: 600;
  }
  
  .page-desc {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

.ai-status-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  .status-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    
    .status-icon {
      font-size: 48px;
      color: #FF6B6B;
      animation: spin 1s linear infinite;
    }
    
    .status-text {
      h3 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 20px;
      }
      
      p {
        margin: 0;
        color: #666;
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.insights-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.insight-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    }
  }
}

.overview-card {
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
    
    .metric-item {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
      
      .metric-value {
        font-size: 24px;
        font-weight: 600;
        color: #FF6B6B;
        margin-bottom: 4px;
      }
      
      .metric-label {
        font-size: 14px;
        color: #666;
      }
    }
  }
  
  .emotion-distribution-chart {
    h4 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 16px;
    }
    
    .distribution-bars {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .distribution-bar {
        .bar-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
          font-size: 14px;
          
          .emotion-name {
            color: #333;
            font-weight: 500;
          }
          
          .emotion-percentage {
            color: #666;
          }
        }
        
        .bar-container {
          height: 8px;
          background: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
          
          .bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.3s ease;
          }
        }
      }
    }
  }
  
  .no-data-message {
    text-align: center;
    padding: 40px 20px;
    color: #666;
    
    .el-icon {
      font-size: 48px;
      color: #ddd;
      margin-bottom: 16px;
    }
    
    h4 {
      margin: 0 0 8px 0;
      color: #333;
    }
    
    p {
      margin: 0 0 16px 0;
    }
  }
}

.patterns-card {
  .patterns-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    
    .pattern-item {
      h5 {
        margin: 0 0 12px 0;
        color: #333;
        font-size: 14px;
        font-weight: 600;
      }
      
      .pattern-chart {
        .trend-line {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 8px;
          
          .trend-point {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            transition: transform 0.2s;
            
            &:hover {
              transform: scale(1.5);
            }
          }
        }
        
        .trend-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
        }
      }
      
      .frequency-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .frequency-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #f8f9fa;
          border-radius: 8px;
          
          .frequency-emotion {
            display: flex;
            align-items: center;
            gap: 8px;
            
            .emotion-emoji {
              font-size: 16px;
            }
          }
          
          .frequency-count {
            color: #666;
            font-size: 14px;
            font-weight: 500;
          }
        }
      }
    }
  }
}

.suggestions-card {
  .suggestion-tabs {
    :deep(.el-tabs__header) {
      margin: 0 0 20px 0;
    }
  }
  
  .suggestions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    
    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #f8f9fa;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: #e9ecef;
        transform: translateY(-2px);
      }
      
      &.tool-item:hover {
        background: rgba(255, 107, 107, 0.1);
        color: #FF6B6B;
      }
      
      .el-icon {
        font-size: 16px;
      }
      
      span {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
  
  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 12px;
      border-left: 4px solid #FF6B6B;
      
      .el-icon {
        color: #FF6B6B;
        margin-top: 2px;
        flex-shrink: 0;
      }
      
      span {
        line-height: 1.5;
        color: #333;
      }
    }
  }
}

.wordcloud-card {
  .word-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    justify-content: center;
    padding: 20px;
    min-height: 120px;
    
    .word-item {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      cursor: default;
      transition: transform 0.2s;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.refresh-section {
  text-align: center;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .ai-insights-page {
    padding: 16px;
  }
  
  .patterns-grid {
    grid-template-columns: 1fr !important;
  }
  
  .suggestions-grid {
    grid-template-columns: 1fr !important;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
