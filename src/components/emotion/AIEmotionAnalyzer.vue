 <template>
  <div class="ai-emotion-analyzer">
    <!-- API Key设置 -->
    <div class="api-key-section" v-if="!hasApiKey">
      <div class="api-key-header">
        <h3>
          <el-icon><Key /></el-icon>
          配置Kimi API Key
        </h3>
        <el-tag type="warning">需要配置API Key才能使用AI分析</el-tag>
      </div>
      <div class="api-key-input">
        <el-input
          v-model="apiKeyInput"
          type="password"
          placeholder="请输入您的Kimi API Key"
          show-password
          @keyup.enter="setApiKey"
        />
        <el-button @click="setApiKey" type="primary" :disabled="!apiKeyInput.trim()">
          设置API Key
        </el-button>
      </div>
      <div class="api-key-help">
        <p>
          <el-icon><InfoFilled /></el-icon>
          如何获取API Key：
        </p>
        <ol>
          <li>访问 <a href="https://platform.moonshot.cn/" target="_blank">Kimi开放平台</a></li>
          <li>注册账号并完成认证</li>
          <li>创建API Key</li>
          <li>将API Key粘贴到上方输入框中</li>
        </ol>
      </div>
    </div>

    <!-- AI分析状态 -->
    <div class="ai-status" v-if="hasApiKey && !isAIReady">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>AI情绪分析引擎启动中...</span>
    </div>

    <!-- 实时分析输入区域 -->
    <div class="analysis-input" v-if="hasApiKey && isAIReady">
      <div class="input-header">
        <h3>
          <el-icon><MagicStick /></el-icon>
          AI情绪分析
        </h3>
        <el-tag :type="analysisResult ? 'success' : 'info'" size="small">
          {{ analysisResult ? '分析完成' : '等待输入' }}
        </el-tag>
      </div>

      <el-input
        v-model="inputText"
        type="textarea"
        :rows="4"
        placeholder="描述一下你现在的感受或今天发生的事情..."
        @input="onTextInput"
        class="emotion-input"
        maxlength="500"
        show-word-limit
      />

      <div class="input-actions">
        <el-button 
          @click="analyzeNow" 
          type="primary" 
          :loading="isAnalyzing"
          :disabled="!inputText.trim()"
          size="small"
        >
          <el-icon><MagicStick /></el-icon>
          立即分析
        </el-button>
        <el-button @click="clearInput" size="small">清空</el-button>
      </div>
    </div>

    <!-- 分析结果展示 -->
    <div class="analysis-result" v-if="analysisResult">
      <div class="result-header">
        <h4>
          <el-icon><TrendCharts /></el-icon>
          分析结果
        </h4>
        <el-tag :type="getEmotionTagType(analysisResult.dominant)" size="small">
          {{ getEmotionLabel(analysisResult.dominant) }}
        </el-tag>
      </div>

      <!-- 主导情绪 -->
      <div class="dominant-emotion">
        <div class="emotion-card">
          <div class="emotion-icon">
            {{ getEmotionEmoji(analysisResult.dominant) }}
          </div>
          <div class="emotion-info">
            <h5>{{ getEmotionLabel(analysisResult.dominant) }}</h5>
            <div class="emotion-metrics">
              <span class="confidence">置信度: {{ (analysisResult.confidence * 100).toFixed(1) }}%</span>
              <span class="intensity">强度: {{ (analysisResult.intensity * 10).toFixed(1) }}/10</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 情绪分布雷达图 -->
      <div class="emotion-distribution" v-if="showDetails">
        <h5>情绪分布</h5>
        <div class="emotion-bars">
          <div 
            v-for="(score, emotion) in analysisResult.emotions" 
            :key="emotion"
            class="emotion-bar"
          >
            <span class="emotion-name">{{ getEmotionLabel(emotion) }}</span>
            <div class="bar-container">
              <div 
                class="bar-fill" 
                :style="{ 
                  width: `${score * 100}%`,
                  backgroundColor: getEmotionColor(emotion)
                }"
              ></div>
            </div>
            <span class="emotion-score">{{ (score * 100).toFixed(0) }}%</span>
          </div>
        </div>
      </div>

      <!-- 分析详情 -->
      <div class="analysis-details" v-if="showDetails">
        <h5>分析详情</h5>
        <div class="details-grid">
          <div class="detail-item">
            <span class="label">识别词汇:</span>
            <div class="tokens">
              <el-tag 
                v-for="token in analysisResult.analysis.tokens" 
                :key="token.word"
                :type="getTokenType(token)"
                size="small"
                class="token-tag"
              >
                {{ token.word }}
              </el-tag>
            </div>
          </div>
          <div class="detail-item">
            <span class="label">文本长度:</span>
            <span class="value">{{ analysisResult.analysis.textLength }} 字符</span>
          </div>
          <div class="detail-item">
            <span class="label">分析时间:</span>
            <span class="value">{{ formatTime(analysisResult.timestamp) }}</span>
          </div>
        </div>
      </div>

      <!-- 建议区域 -->
      <div class="suggestions" v-if="suggestions">
        <h5>
          <el-icon><Star /></el-icon>
          AI建议
        </h5>
        <el-tabs v-model="activeTab" class="suggestion-tabs">
          <el-tab-pane label="推荐工具" name="tools">
            <div class="suggestion-list">
              <el-tag 
                v-for="tool in suggestions.tools" 
                :key="tool"
                type="primary"
                class="suggestion-tag"
                @click="goToTool(tool)"
              >
                <el-icon><Tools /></el-icon>
                {{ tool }}
              </el-tag>
            </div>
          </el-tab-pane>
          <el-tab-pane label="建议活动" name="activities">
            <div class="suggestion-list">
              <el-tag 
                v-for="activity in suggestions.activities" 
                :key="activity"
                type="success"
                class="suggestion-tag"
              >
                <el-icon><Star /></el-icon>
                {{ activity }}
              </el-tag>
            </div>
          </el-tab-pane>
          <el-tab-pane label="实用提示" name="tips">
            <div class="tips-list">
              <div 
                v-for="tip in suggestions.tips" 
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

      <!-- 操作按钮 -->
      <div class="result-actions">
        <el-button 
          @click="saveAsEmotion" 
          type="primary"
          :disabled="isSaving"
          :loading="isSaving"
        >
          <el-icon><DocumentAdd /></el-icon>
          保存为情绪记录
        </el-button>
        <el-button @click="toggleDetails">
          {{ showDetails ? '隐藏详情' : '查看详情' }}
        </el-button>
        <el-button @click="clearResult" type="text">清除结果</el-button>
      </div>
    </div>

    <!-- 历史分析记录 -->
    <div class="analysis-history" v-if="showHistory && analysisHistory.length > 0">
      <div class="history-header">
        <h4>
          <el-icon><Clock /></el-icon>
          分析历史
        </h4>
        <el-button @click="clearHistory" type="text" size="small">清空历史</el-button>
      </div>
      <div class="history-list">
        <div 
          v-for="item in analysisHistory.slice(-5)" 
          :key="item.timestamp"
          class="history-item"
          @click="loadHistoryItem(item)"
        >
          <div class="history-emotion">
            <span class="emotion-emoji">{{ getEmotionEmoji(item.dominant) }}</span>
            <span class="emotion-name">{{ getEmotionLabel(item.dominant) }}</span>
          </div>
          <div class="history-text">{{ item.text.substring(0, 30) }}...</div>
          <div class="history-time">{{ formatTime(item.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmotionStore } from '@/stores/emotion'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Key, InfoFilled, Loading, MagicStick, Star } from '@element-plus/icons-vue'
import emotionAI from '@/utils/emotionAI'

const router = useRouter()
const emotionStore = useEmotionStore()

// 响应式数据
const inputText = ref('')
const analysisResult = ref(null)
const suggestions = ref(null)
const isAnalyzing = ref(false)
const isSaving = ref(false)
const showDetails = ref(false)
const showHistory = ref(false)
const activeTab = ref('tools')
const analysisHistory = ref([])
const debounceTimer = ref(null)
const apiKeyInput = ref('')

// 计算属性
const isAIReady = computed(() => emotionStore.isAIInitialized)
const hasApiKey = computed(() => {
  return true // API Key已经配置好了
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
const setApiKey = async () => {
  if (!apiKeyInput.value.trim()) {
    ElMessage.warning('请输入API Key')
    return
  }

  try {
    // 设置API Key到emotionAI实例
    emotionAI.apiKey = apiKeyInput.value.trim()
    
    // 重新初始化AI引擎
    await emotionStore.initializeAI()
    
    ElMessage.success('API Key设置成功！')
    apiKeyInput.value = ''
  } catch (error) {
    console.error('API Key设置失败:', error)
    ElMessage.error('API Key设置失败，请检查是否正确')
  }
}

const initializeAI = async () => {
  try {
    await emotionStore.initializeAI()
  } catch (error) {
    console.error('AI初始化失败:', error)
    ElMessage.error('AI情绪分析引擎启动失败')
  }
}

const onTextInput = () => {
  // 防抖处理，避免频繁分析
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    if (inputText.value.trim().length > 10) {
      analyzeText()
    }
  }, 1000)
}

const analyzeNow = () => {
  if (inputText.value.trim()) {
    analyzeText()
  }
}

const analyzeText = async () => {
  if (!inputText.value.trim()) return

  isAnalyzing.value = true
  try {
    const result = await emotionStore.analyzeEmotionText(inputText.value)
    if (result) {
      analysisResult.value = result
      suggestions.value = emotionStore.getEmotionSuggestions({ aiAnalysis: result })
      
      // 保存到历史记录
      analysisHistory.value.push({
        ...result,
        text: inputText.value
      })
      
      // 限制历史记录数量
      if (analysisHistory.value.length > 20) {
        analysisHistory.value = analysisHistory.value.slice(-20)
      }
    }
  } catch (error) {
    console.error('分析失败:', error)
    ElMessage.error('情绪分析失败，请重试')
  } finally {
    isAnalyzing.value = false
  }
}

const clearInput = () => {
  inputText.value = ''
  analysisResult.value = null
  suggestions.value = null
}

const clearResult = () => {
  analysisResult.value = null
  suggestions.value = null
}

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}

const saveAsEmotion = async () => {
  if (!analysisResult.value) return

  try {
    await ElMessageBox.confirm(
      '将此分析结果保存为情绪记录？',
      '确认保存',
      {
        confirmButtonText: '保存',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    isSaving.value = true

    const emotionData = {
      type: analysisResult.value.dominant,
      intensity: Math.round(analysisResult.value.intensity * 10),
      emoji: getEmotionEmoji(analysisResult.value.dominant),
      color: getEmotionColor(analysisResult.value.dominant),
      content: inputText.value,
      triggers: analysisResult.value.analysis.tokens.map(t => t.word),
      tags: ['AI分析']
    }

    await emotionStore.addEmotion(emotionData)
    
    ElMessage.success('情绪记录已保存')
    
    // 清空输入
    clearInput()
    
  } catch (error) {
    if (error !== 'cancel') {
      console.error('保存失败:', error)
      ElMessage.error('保存失败，请重试')
    }
  } finally {
    isSaving.value = false
  }
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

const loadHistoryItem = (item) => {
  inputText.value = item.text
  analysisResult.value = item
  suggestions.value = emotionStore.getEmotionSuggestions({ aiAnalysis: item })
}

const clearHistory = () => {
  analysisHistory.value = []
  ElMessage.success('历史记录已清空')
}

// 工具函数
const getEmotionLabel = (emotion) => emotionLabels[emotion] || emotion
const getEmotionEmoji = (emotion) => emotionEmojis[emotion] || '😐'
const getEmotionColor = (emotion) => emotionColors[emotion] || '#C0C0C0'

const getEmotionTagType = (emotion) => {
  const typeMap = {
    happy: 'success',
    sad: 'info',
    angry: 'danger',
    fear: 'warning',
    surprise: 'primary',
    disgust: 'warning',
    neutral: ''
  }
  return typeMap[emotion] || ''
}

const getTokenType = (token) => {
  if (token.type === 'intensity') {
    return token.level === 'high' ? 'danger' : token.level === 'medium' ? 'warning' : 'info'
  }
  return 'primary'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 生命周期
onMounted(() => {
  initializeAI()
})

onUnmounted(() => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>

<style scoped lang="scss">
.ai-emotion-analyzer {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.api-key-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  margin-bottom: 24px;
  
  .api-key-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .api-key-input {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    
    .el-input {
      flex: 1;
      
      :deep(.el-input__inner) {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        
        &::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }
        
        &:focus {
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.15);
        }
      }
      
      :deep(.el-input__suffix) {
        .el-input__suffix-inner {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
    
    .el-button {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
      
      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
      }
      
      &:disabled {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  
  .api-key-help {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 16px;
    
    p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px 0;
      font-weight: 500;
    }
    
    ol {
      margin: 0;
      padding-left: 20px;
      
      li {
        margin-bottom: 4px;
        line-height: 1.5;
        
        a {
          color: #FFD700;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

.ai-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.analysis-input {
  .input-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #FF6B6B;
      font-size: 18px;
    }
  }
  
  .emotion-input {
    margin-bottom: 16px;
    
    :deep(.el-textarea__inner) {
      border-radius: 12px;
      border: 2px solid #f0f0f0;
      transition: all 0.3s;
      
      &:focus {
        border-color: #FF6B6B;
        box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
      }
    }
  }
  
  .input-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
}

.analysis-result {
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #333;
    }
  }
}

.dominant-emotion {
  margin-bottom: 24px;
  
  .emotion-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 16px;
    border: 2px solid #FF6B6B;
    
    .emotion-icon {
      font-size: 48px;
      line-height: 1;
    }
    
    .emotion-info {
      flex: 1;
      
      h5 {
        margin: 0 0 8px 0;
        font-size: 20px;
        color: #333;
      }
      
      .emotion-metrics {
        display: flex;
        gap: 16px;
        font-size: 14px;
        color: #666;
        
        .confidence,
        .intensity {
          padding: 4px 8px;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 6px;
          font-weight: 500;
        }
      }
    }
  }
}

.emotion-distribution {
  margin-bottom: 24px;
  
  h5 {
    margin: 0 0 16px 0;
    color: #333;
  }
  
  .emotion-bars {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .emotion-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .emotion-name {
        width: 60px;
        font-size: 12px;
        color: #666;
      }
      
      .bar-container {
        flex: 1;
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
      
      .emotion-score {
        width: 40px;
        text-align: right;
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.analysis-details {
  margin-bottom: 24px;
  
  h5 {
    margin: 0 0 16px 0;
    color: #333;
  }
  
  .details-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      
      .label {
        font-weight: 500;
        color: #666;
        min-width: 80px;
      }
      
      .value {
        color: #333;
      }
      
      .tokens {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        
        .token-tag {
          font-size: 12px;
        }
      }
    }
  }
}

.suggestions {
  margin-bottom: 24px;
  
  h5 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 16px 0;
    color: #333;
  }
  
  .suggestion-tabs {
    :deep(.el-tabs__header) {
      margin: 0 0 16px 0;
    }
  }
  
  .suggestion-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .suggestion-tag {
      cursor: pointer;
      transition: transform 0.2s;
      
      &:hover {
        transform: translateY(-2px);
      }
    }
  }
  
  .tips-list {
    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.5;
      
      .el-icon {
        color: #FF6B6B;
        margin-top: 2px;
        flex-shrink: 0;
      }
    }
  }
}

.result-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.analysis-history {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  
  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      color: #333;
    }
  }
  
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .history-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover {
        background: #e9ecef;
      }
      
      .history-emotion {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 80px;
        
        .emotion-emoji {
          font-size: 16px;
        }
        
        .emotion-name {
          font-size: 12px;
          color: #666;
        }
      }
      
      .history-text {
        flex: 1;
        font-size: 14px;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .history-time {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

@media (max-width: 768px) {
  .ai-emotion-analyzer {
    padding: 16px;
    margin: 0 -10px 20px -10px;
    border-radius: 0;
  }
  
  .emotion-card {
    flex-direction: column;
    text-align: center;
    
    .emotion-info {
      .emotion-metrics {
        justify-content: center;
      }
    }
  }
  
  .result-actions {
    flex-direction: column;
  }
}
</style>
