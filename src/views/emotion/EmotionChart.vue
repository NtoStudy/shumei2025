<template>
  <div class="emotion-chart">
    <div class="chart-container">
      <!-- 图表控制面板 -->
      <div class="chart-controls">
        <div class="period-selector">
          <el-radio-group v-model="selectedPeriod" @change="updateChart">
            <el-radio-button label="week">最近一周</el-radio-button>
            <el-radio-button label="month">最近一月</el-radio-button>
            <el-radio-button label="year">最近一年</el-radio-button>
          </el-radio-group>
        </div>
        <div class="chart-actions">
          <el-button @click="exportData" class="export-btn">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
      </div>
      
      <!-- 情绪趋势图 -->
      <div class="chart-section">
        <h3 class="chart-title">情绪变化趋势</h3>
        <div ref="trendChart" class="chart" id="trendChart"></div>
      </div>
      
      <!-- 情绪分布图 -->
      <div class="chart-section">
        <h3 class="chart-title">情绪分布</h3>
        <div ref="distributionChart" class="chart" id="distributionChart"></div>
      </div>
      
      <!-- 情绪强度热力图 -->
      <div class="chart-section">
        <h3 class="chart-title">情绪强度热力图</h3>
        <div ref="heatmapChart" class="chart" id="heatmapChart"></div>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-section">
        <h3 class="chart-title">统计信息</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Sunny /></el-icon>
            </div>
            <div class="stat-content">
              <h4>总记录数</h4>
              <p class="stat-number">{{ emotionStore.emotions.length }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <div class="stat-content">
              <h4>平均强度</h4>
              <p class="stat-number">{{ emotionStore.emotionStats.avgIntensity || 0 }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-content">
              <h4>连续记录</h4>
              <p class="stat-number">{{ consecutiveDays }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-content">
              <h4>最常情绪</h4>
              <p class="stat-number">{{ mostCommonEmotion }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useEmotionStore } from '@/stores/emotion'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

const emotionStore = useEmotionStore()

const selectedPeriod = ref('week')
const trendChart = ref(null)
const distributionChart = ref(null)
const heatmapChart = ref(null)

// 计算属性
const consecutiveDays = computed(() => {
  // 计算连续记录天数
  const emotions = emotionStore.emotions
  if (emotions.length === 0) return 0
  
  let days = 1
  const today = new Date()
  
  for (let i = emotions.length - 1; i > 0; i--) {
    const currentDate = new Date(emotions[i].timestamp)
    const previousDate = new Date(emotions[i - 1].timestamp)
    const diffDays = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      days++
    } else {
      break
    }
  }
  
  return days
})

const mostCommonEmotion = computed(() => {
  const distribution = emotionStore.emotionDistribution
  if (Object.keys(distribution).length === 0) return '无'
  
  const emotionLabels = {
    'happy': '开心',
    'sad': '难过',
    'anxious': '焦虑',
    'angry': '愤怒',
    'calm': '平静',
    'excited': '兴奋',
    'tired': '疲惫',
    'confused': '困惑'
  }
  
  const mostCommon = Object.keys(distribution).reduce((a, b) => 
    distribution[a] > distribution[b] ? a : b
  )
  
  return emotionLabels[mostCommon] || mostCommon
})

// 图表初始化
const initCharts = async () => {
  await nextTick()
  initTrendChart()
  initDistributionChart()
  initHeatmapChart()
}

const initTrendChart = () => {
  if (!trendChart.value) return
  
  const chart = echarts.init(trendChart.value)
  const data = getTrendData()
  
  const option = {
    title: {
      text: '情绪强度变化',
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
      data: data.dates,
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
      data: data.intensities,
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
  
  // 响应式调整
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const initDistributionChart = () => {
  if (!distributionChart.value) return
  
  const chart = echarts.init(distributionChart.value)
  const data = getDistributionData()
  
  const option = {
    title: {
      text: '情绪类型分布',
      left: 'center',
      textStyle: {
        color: '#FF6B6B',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: '情绪分布',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      data: data,
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
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

const initHeatmapChart = () => {
  if (!heatmapChart.value) return
  
  const chart = echarts.init(heatmapChart.value)
  const data = getHeatmapData()
  
  const option = {
    title: {
      text: '情绪强度热力图',
      left: 'center',
      textStyle: {
        color: '#FF6B6B',
        fontSize: 16
      }
    },
    tooltip: {
      position: 'top',
      formatter: function(params) {
        return `${params.data[1]}<br/>强度: ${params.data[2]}/10`
      }
    },
    grid: {
      height: '50%',
      top: '10%'
    },
    xAxis: {
      type: 'category',
      data: data.hours,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: data.days,
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 1,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#FFB6C1', '#FF6B6B', '#FF4500']
      }
    },
    series: [{
      name: '情绪强度',
      type: 'heatmap',
      data: data.values,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

// 数据获取
const getTrendData = () => {
  const trendData = emotionStore.getEmotionTrend(selectedPeriod.value)
  const dates = trendData.map(item => {
    const date = new Date(item.date)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  })
  const intensities = trendData.map(item => item.intensity)
  
  return { dates, intensities }
}

const getDistributionData = () => {
  const distribution = emotionStore.emotionDistribution
  const emotionLabels = {
    'happy': '开心',
    'sad': '难过',
    'anxious': '焦虑',
    'angry': '愤怒',
    'calm': '平静',
    'excited': '兴奋',
    'tired': '疲惫',
    'confused': '困惑'
  }
  
  return Object.entries(distribution).map(([type, count]) => ({
    name: emotionLabels[type] || type,
    value: count
  }))
}

const getHeatmapData = () => {
  // 生成最近7天的热力图数据
  const emotions = emotionStore.emotions
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  
  const values = []
  
  // 简化版本，实际应该根据时间分组
  emotions.forEach(emotion => {
    const date = new Date(emotion.timestamp)
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1
    const hour = date.getHours()
    
    values.push([hour, dayIndex, emotion.emotion.intensity])
  })
  
  return { days, hours, values }
}

const updateChart = () => {
  initCharts()
}

const exportData = () => {
  const data = emotionStore.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `emotion-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('数据导出成功！')
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped lang="scss">
.emotion-chart {
  padding: 20px 0;
}

.chart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.period-selector {
  :deep(.el-radio-group) {
    .el-radio-button__inner {
      border-color: #FF6B6B;
      color: #FF6B6B;
      
      &:hover {
        background: #FFF0F0;
      }
    }
    
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background: #FF6B6B;
      border-color: #FF6B6B;
    }
  }
}

.export-btn {
  color: #FF6B6B;
  border-color: #FF6B6B;
  
  &:hover {
    background: #FF6B6B;
    color: white;
  }
}

.chart-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
  margin-bottom: 30px;
}

.chart-title {
  color: #FF6B6B;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.chart {
  width: 100%;
  height: 400px;
}

.stats-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #FAFAFA;
  border-radius: 10px;
  border-left: 4px solid #FF6B6B;
}

.stat-icon {
  color: #FF6B6B;
  
  .el-icon {
    font-size: 24px;
  }
}

.stat-content {
  h4 {
    color: #666;
    margin: 0 0 5px 0;
    font-size: 14px;
  }
  
  .stat-number {
    color: #FF6B6B;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .chart-controls {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .chart {
    height: 300px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
