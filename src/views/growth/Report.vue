<template>
  <div class="report-page">
    <div class="report-container">
      <!-- 报告生成控制 -->
      <div class="report-controls">
        <h3 class="section-title">生成成长报告</h3>
        <div class="control-panel">
          <div class="period-selector">
            <label class="period-label">报告周期：</label>
            <el-select v-model="selectedPeriod" @change="generateReport" class="period-select">
              <el-option label="最近一周" value="week" />
              <el-option label="最近一月" value="month" />
              <el-option label="最近三月" value="quarter" />
              <el-option label="最近一年" value="year" />
            </el-select>
          </div>
          <div class="report-actions">
            <el-button @click="exportReport" class="export-btn">
              <el-icon><Download /></el-icon>
              导出报告
            </el-button>
            <el-button @click="shareReport" class="share-btn">
              <el-icon><Share /></el-icon>
              分享报告
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 报告概览 -->
      <div class="report-overview" v-if="reportData">
        <h3 class="section-title">报告概览</h3>
        <div class="overview-cards">
          <div class="overview-card">
            <div class="card-icon">
              <el-icon><Sunny /></el-icon>
            </div>
            <div class="card-content">
              <h4>情绪记录</h4>
              <p class="card-number">{{ reportData.emotionCount }}</p>
              <p class="card-desc">条记录</p>
            </div>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="card-content">
              <h4>平均情绪</h4>
              <p class="card-number">{{ reportData.avgEmotion }}</p>
              <p class="card-desc">分（满分10分）</p>
            </div>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="card-content">
              <h4>练习时长</h4>
              <p class="card-number">{{ reportData.practiceTime }}</p>
              <p class="card-desc">分钟</p>
            </div>
          </div>
          <div class="overview-card">
            <div class="card-icon">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="card-content">
              <h4>完成目标</h4>
              <p class="card-number">{{ reportData.completedGoals }}</p>
              <p class="card-desc">个</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 情绪趋势分析 -->
      <div class="emotion-analysis" v-if="reportData">
        <h3 class="section-title">情绪趋势分析</h3>
        <div class="analysis-content">
          <div class="trend-chart">
            <div ref="emotionTrendChart" class="chart" id="emotionTrendChart"></div>
          </div>
          <div class="emotion-insights">
            <h4>情绪洞察</h4>
            <div class="insights-list">
              <div class="insight-item">
                <el-icon><TrendCharts /></el-icon>
                <div class="insight-content">
                  <h5>情绪稳定性</h5>
                  <p>{{ reportData.emotionStability }}</p>
                </div>
              </div>
              <div class="insight-item">
                <el-icon><Sunny /></el-icon>
                <div class="insight-content">
                  <h5>积极情绪比例</h5>
                  <p>{{ reportData.positiveRatio }}%</p>
                </div>
              </div>
              <div class="insight-item">
                <el-icon><Calendar /></el-icon>
                <div class="insight-content">
                  <h5>记录频率</h5>
                  <p>{{ reportData.recordFrequency }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 练习活动分析 -->
      <div class="practice-analysis" v-if="reportData">
        <h3 class="section-title">练习活动分析</h3>
        <div class="practice-content">
          <div class="practice-chart">
            <div ref="practiceChart" class="chart" id="practiceChart"></div>
          </div>
          <div class="practice-stats">
            <h4>练习统计</h4>
            <div class="stats-list">
              <div class="stat-item">
                <span class="stat-label">呼吸练习次数：</span>
                <span class="stat-value">{{ reportData.breathingCount }}次</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">冥想练习次数：</span>
                <span class="stat-value">{{ reportData.meditationCount }}次</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">平均练习时长：</span>
                <span class="stat-value">{{ reportData.avgPracticeTime }}分钟</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">最长连续练习：</span>
                <span class="stat-value">{{ reportData.maxStreak }}天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 成长建议 -->
      <div class="growth-suggestions" v-if="reportData">
        <h3 class="section-title">成长建议</h3>
        <div class="suggestions-list">
          <div 
            v-for="suggestion in reportData.suggestions" 
            :key="suggestion.id"
            class="suggestion-item"
            :class="suggestion.type"
          >
            <div class="suggestion-icon">
              <el-icon><component :is="suggestion.icon" /></el-icon>
            </div>
            <div class="suggestion-content">
              <h4>{{ suggestion.title }}</h4>
              <p>{{ suggestion.description }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 历史报告 -->
      <div class="history-reports">
        <h3 class="section-title">历史报告</h3>
        <div class="reports-list">
          <div 
            v-for="report in historyReports" 
            :key="report.id"
            class="report-item"
          >
            <div class="report-info">
              <h4>{{ report.period }}报告</h4>
              <p>{{ report.date }} - {{ report.summary }}</p>
            </div>
            <div class="report-actions">
              <el-button @click="viewHistoryReport(report.id)" size="small">
                查看
              </el-button>
              <el-button @click="downloadHistoryReport(report.id)" size="small">
                下载
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useEmotionStore } from '@/stores/emotion'
import { useUserStore } from '@/stores/user'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

const emotionStore = useEmotionStore()
const userStore = useUserStore()

const selectedPeriod = ref('week')
const reportData = ref(null)
const emotionTrendChart = ref(null)
const practiceChart = ref(null)

// 历史报告数据
const historyReports = ref([
  {
    id: 1,
    period: '最近一周',
    date: '2024-12-12',
    summary: '情绪稳定，练习积极'
  },
  {
    id: 2,
    period: '最近一月',
    date: '2024-11-19',
    summary: '情绪波动较大，需要更多练习'
  }
])

// 生成报告
const generateReport = () => {
  const period = selectedPeriod.value
  const emotions = emotionStore.emotions
  
  // 根据周期筛选数据
  const now = new Date()
  let startDate
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'quarter':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
  }
  
  const periodEmotions = emotions.filter(emotion => 
    new Date(emotion.timestamp) >= startDate
  )
  
  // 计算报告数据
  reportData.value = {
    emotionCount: periodEmotions.length,
    avgEmotion: periodEmotions.length > 0 
      ? (periodEmotions.reduce((sum, e) => sum + e.emotion.intensity, 0) / periodEmotions.length).toFixed(1)
      : 0,
    practiceTime: Math.floor(Math.random() * 200) + 50, // 模拟数据
    completedGoals: Math.floor(Math.random() * 10) + 1, // 模拟数据
    emotionStability: calculateEmotionStability(periodEmotions),
    positiveRatio: calculatePositiveRatio(periodEmotions),
    recordFrequency: calculateRecordFrequency(periodEmotions),
    breathingCount: Math.floor(Math.random() * 15) + 5, // 模拟数据
    meditationCount: Math.floor(Math.random() * 10) + 3, // 模拟数据
    avgPracticeTime: Math.floor(Math.random() * 20) + 10, // 模拟数据
    maxStreak: Math.floor(Math.random() * 15) + 3, // 模拟数据
    suggestions: generateSuggestions(periodEmotions)
  }
  
  // 生成图表
  nextTick(() => {
    initCharts()
  })
}

// 计算情绪稳定性
const calculateEmotionStability = (emotions) => {
  if (emotions.length < 2) return '数据不足'
  
  const intensities = emotions.map(e => e.emotion.intensity)
  const variance = calculateVariance(intensities)
  
  if (variance < 2) return '非常稳定'
  if (variance < 4) return '比较稳定'
  if (variance < 6) return '一般稳定'
  return '波动较大'
}

// 计算积极情绪比例
const calculatePositiveRatio = (emotions) => {
  if (emotions.length === 0) return 0
  
  const positiveEmotions = emotions.filter(e => 
    ['happy', 'excited', 'calm'].includes(e.emotion.type)
  )
  
  return Math.round((positiveEmotions.length / emotions.length) * 100)
}

// 计算记录频率
const calculateRecordFrequency = (emotions) => {
  if (emotions.length === 0) return '无记录'
  
  const days = Math.ceil((new Date() - new Date(emotions[0].timestamp)) / (1000 * 60 * 60 * 24))
  const frequency = emotions.length / days
  
  if (frequency >= 1) return '每天记录'
  if (frequency >= 0.5) return '经常记录'
  if (frequency >= 0.2) return '偶尔记录'
  return '很少记录'
}

// 计算方差
const calculateVariance = (values) => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  return variance
}

// 生成建议
const generateSuggestions = (emotions) => {
  const suggestions = []
  
  if (emotions.length === 0) {
    suggestions.push({
      id: 1,
      type: 'info',
      icon: 'Sunny',
      title: '开始记录情绪',
      description: '建议每天记录一次情绪状态，了解自己的情绪变化模式'
    })
  } else {
    const avgIntensity = emotions.reduce((sum, e) => sum + e.emotion.intensity, 0) / emotions.length
    
    if (avgIntensity < 4) {
      suggestions.push({
        id: 1,
        type: 'warning',
        icon: 'Warning',
        title: '情绪偏低',
        description: '建议多进行积极活动，如运动、社交或兴趣爱好'
      })
    }
    
    if (avgIntensity > 7) {
      suggestions.push({
        id: 2,
        type: 'warning',
        icon: 'Warning',
        title: '情绪波动较大',
        description: '建议多进行呼吸练习和冥想，帮助稳定情绪'
      })
    }
    
    suggestions.push({
      id: 3,
      type: 'success',
      icon: 'Trophy',
      title: '保持记录习惯',
      description: '继续坚持记录情绪，这将帮助你更好地了解自己'
    })
  }
  
  return suggestions
}

// 初始化图表
const initCharts = async () => {
  await nextTick()
  // 延迟确保DOM完全渲染
  setTimeout(() => {
    initEmotionTrendChart()
    initPracticeChart()
  }, 100)
}

const initEmotionTrendChart = () => {
  if (!emotionTrendChart.value || !reportData.value) return
  
  const chart = echarts.init(emotionTrendChart.value)
  const emotions = emotionStore.emotions
  
  // 如果没有情绪数据，创建模拟数据
  let data = []
  if (emotions.length === 0) {
    // 生成模拟数据
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      data.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        intensity: Math.floor(Math.random() * 5) + 4, // 4-8分的随机情绪强度
        type: 'neutral'
      })
    }
  } else {
    data = emotions.slice(-7).map(emotion => ({
      date: new Date(emotion.timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      intensity: emotion.emotion.intensity,
      type: emotion.emotion.type
    }))
  }
  
  const option = {
    title: {
      text: '情绪变化趋势',
      left: 'center',
      textStyle: {
        color: '#FF6B6B',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const data = params[0]
        return `${data.axisValue}<br/>强度: ${data.value}/10`
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.date),
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 1,
      max: 10,
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      }
    },
    series: [{
      data: data.map(d => d.intensity),
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#FF6B6B',
        width: 3
      },
      itemStyle: {
        color: '#FF6B6B'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(255, 107, 107, 0.3)'
          }, {
            offset: 1,
            color: 'rgba(255, 107, 107, 0.1)'
          }]
        }
      }
    }]
  }
  
  chart.setOption(option)
  
  // 响应式处理
  const resizeHandler = () => {
    if (chart && !chart.isDisposed()) {
      chart.resize()
    }
  }
  
  window.addEventListener('resize', resizeHandler)
}

const initPracticeChart = () => {
  if (!practiceChart.value || !reportData.value) return
  
  const chart = echarts.init(practiceChart.value)
  
  // 确保数据不为空
  const breathingCount = reportData.value.breathingCount || 0
  const meditationCount = reportData.value.meditationCount || 0
  
  const option = {
    title: {
      text: '练习活动分布',
      left: 'center',
      textStyle: {
        color: '#FF6B6B',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}次 ({d}%)'
    },
    series: [{
      name: '练习类型',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: [
        { value: breathingCount, name: '呼吸练习' },
        { value: meditationCount, name: '正念冥想' },
        { value: Math.floor(Math.random() * 8) + 2, name: '放松训练' },
        { value: Math.floor(Math.random() * 6) + 1, name: '认知重构' }
      ].filter(item => item.value > 0), // 过滤掉值为0的项
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        show: true,
        formatter: '{b}: {c}'
      }
    }]
  }
  
  chart.setOption(option)
  
  // 响应式处理
  const resizeHandler = () => {
    if (chart && !chart.isDisposed()) {
      chart.resize()
    }
  }
  
  window.addEventListener('resize', resizeHandler)
}

const exportReport = () => {
  ElMessage.success('报告导出功能开发中...')
}

const shareReport = () => {
  ElMessage.success('报告分享功能开发中...')
}

const viewHistoryReport = (reportId) => {
  ElMessage.info('查看历史报告功能开发中...')
}

const downloadHistoryReport = (reportId) => {
  ElMessage.info('下载历史报告功能开发中...')
}

onMounted(() => {
  generateReport()
})
</script>

<style scoped lang="scss">
.report-page {
  padding: 20px 0;
}

.report-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.report-controls {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.section-title {
  color: #FF6B6B;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.control-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.period-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
  
  .period-label {
    color: #666;
    font-weight: 500;
    font-size: 14px;
    white-space: nowrap;
    min-width: 80px;
  }
  
  .period-select {
    min-width: 120px;
    flex: 1;
  }
}

.report-actions {
  display: flex;
  gap: 10px;
}

.export-btn, .share-btn {
  color: #FF6B6B;
  border-color: #FF6B6B;
  
  &:hover {
    background: #FF6B6B;
    color: white;
  }
}

.report-overview {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #FAFAFA;
  border-radius: 15px;
  border-left: 4px solid #FF6B6B;
}

.card-icon {
  color: #FF6B6B;
  
  .el-icon {
    font-size: 24px;
  }
}

.card-content {
  h4 {
    color: #666;
    margin: 0 0 5px 0;
    font-size: 14px;
  }
  
  .card-number {
    color: #FF6B6B;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
  
  .card-desc {
    color: #999;
    font-size: 12px;
    margin: 0;
  }
}

.emotion-analysis, .practice-analysis {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.analysis-content, .practice-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.trend-chart, .practice-chart {
  .chart {
    width: 100%;
    height: 300px;
  }
}

.emotion-insights, .practice-stats {
  h4 {
    color: #FF6B6B;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
  }
}

.insights-list, .stats-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.insight-item, .stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #FAFAFA;
  border-radius: 10px;
}

.insight-item {
  .el-icon {
    color: #FF6B6B;
    font-size: 20px;
  }
  
  .insight-content {
    h5 {
      color: #333;
      margin: 0 0 5px 0;
      font-size: 14px;
      font-weight: 600;
    }
    
    p {
      color: #666;
      margin: 0;
      font-size: 12px;
    }
  }
}

.stat-item {
  justify-content: space-between;
  
  .stat-label {
    color: #666;
    font-size: 14px;
  }
  
  .stat-value {
    color: #FF6B6B;
    font-weight: 600;
    font-size: 14px;
  }
}

.growth-suggestions {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  border-radius: 15px;
  border-left: 4px solid #E0E0E0;
  
  &.info {
    background: #F0F8FF;
    border-left-color: #87CEEB;
  }
  
  &.warning {
    background: #FFF8DC;
    border-left-color: #FFD700;
  }
  
  &.success {
    background: #F0FFF0;
    border-left-color: #98FB98;
  }
}

.suggestion-icon {
  color: #FF6B6B;
  
  .el-icon {
    font-size: 20px;
  }
}

.suggestion-content {
  h4 {
    color: #333;
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
}

.history-reports {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #FAFAFA;
  border-radius: 15px;
  border-left: 4px solid #FF6B6B;
}

.report-info {
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
  }
}

.report-actions {
  display: flex;
  gap: 10px;
}

@media (max-width: 768px) {
  .control-panel {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .period-selector {
    min-width: auto;
    
    .period-label {
      min-width: auto;
      font-size: 16px;
    }
    
    .period-select {
      min-width: 150px;
    }
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .analysis-content, .practice-content {
    grid-template-columns: 1fr;
  }
  
  .trend-chart, .practice-chart {
    .chart {
      height: 250px;
    }
  }
  
  .report-item {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .report-actions {
    justify-content: center;
  }
}
</style>
