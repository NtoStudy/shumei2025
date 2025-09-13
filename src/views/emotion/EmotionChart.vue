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
  
  // 使用setTimeout确保DOM已完全渲染
  setTimeout(() => {
    initTrendChart()
    initDistributionChart()
    initHeatmapChart()
  }, 0)
}

const initTrendChart = () => {
  if (!trendChart.value) return
  
  // 确保DOM元素已经渲染完成并且有宽高
  if (trendChart.value.offsetHeight === 0 || trendChart.value.offsetWidth === 0) {
    // 如果DOM元素尚未完全渲染，设置一个默认尺寸
    trendChart.value.style.height = '400px'
    trendChart.value.style.width = '100%'
  }
  
  // 销毁之前的图表实例（如果存在）
  const existingChart = echarts.getInstanceByDom(trendChart.value)
  if (existingChart) {
    existingChart.dispose()
  }
  
  const chart = echarts.init(trendChart.value)
  const data = getTrendData()
  
  // 检查是否有数据
  const hasData = data && data.dates && data.dates.length > 0
  
  const option = {
    title: {
      text: '情绪强度变化',
      left: 'center',
      textStyle: {
        color: '#FF6B6B',
        fontSize: 16
      },
      subtext: hasData ? '' : '暂无数据',
      subtextStyle: {
        color: '#999',
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const data = params[0]
        return `${data.axisValue}<br/>强度: ${data.value}/10`
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      },
      axisLabel: {
        interval: 'auto',
        rotate: data.dates && data.dates.length > 7 ? 30 : 0
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
      data: data.intensities || [],
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
      },
      markPoint: hasData ? {
        data: [
          { type: 'max', name: '最高强度' },
          { type: 'min', name: '最低强度' }
        ]
      } : undefined
    }]
  }
  
  chart.setOption(option)
  
  // 立即执行一次resize确保图表正确渲染
  setTimeout(() => {
    chart.resize()
  }, 0)
  
  // 响应式调整
  const resizeHandler = () => {
    chart.resize()
  }
  window.removeEventListener('resize', resizeHandler)
  window.addEventListener('resize', resizeHandler)
}

const initDistributionChart = () => {
  if (!distributionChart.value) return
  
  // 确保DOM元素已经渲染完成并且有宽高
  if (distributionChart.value.offsetHeight === 0 || distributionChart.value.offsetWidth === 0) {
    // 如果DOM元素尚未完全渲染，设置一个默认尺寸
    distributionChart.value.style.height = '400px'
    distributionChart.value.style.width = '100%'
  }
  
  // 销毁之前的图表实例（如果存在）
  const existingChart = echarts.getInstanceByDom(distributionChart.value)
  if (existingChart) {
    existingChart.dispose()
  }
  
  const chart = echarts.init(distributionChart.value)
  const data = getDistributionData()
  
  // 检查是否有数据
  const hasData = data && data.length > 0
  
  const option = {
    title: {
      text: '情绪类型分布',
      left: 'center',
      textStyle: {
        color: '#FF6B6B',
        fontSize: 16
      },
      subtext: hasData ? '' : '暂无数据',
      subtextStyle: {
        color: '#999',
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '5%',
      left: 'center',
      type: 'scroll',
      pageIconColor: '#FF6B6B',
      pageTextStyle: {
        color: '#FF6B6B'
      }
    },
    series: [{
      name: '情绪分布',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      data: data || [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label: {
        show: true,
        formatter: '{b}: {c}',
        position: 'outside'
      },
      labelLine: {
        show: true,
        length: 10,
        length2: 10
      },
      itemStyle: {
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 2
      }
    }]
  }
  
  chart.setOption(option)
  
  // 立即执行一次resize确保图表正确渲染
  setTimeout(() => {
    chart.resize()
  }, 0)
  
  // 响应式调整
  const resizeHandler = () => {
    chart.resize()
  }
  window.removeEventListener('resize', resizeHandler)
  window.addEventListener('resize', resizeHandler)
}

const initHeatmapChart = () => {
  if (!heatmapChart.value) return
  
  // 确保DOM元素已经渲染完成并且有宽高
  if (heatmapChart.value.offsetHeight === 0 || heatmapChart.value.offsetWidth === 0) {
    // 如果DOM元素尚未完全渲染，设置一个默认尺寸
    heatmapChart.value.style.height = '400px'
    heatmapChart.value.style.width = '100%'
  }
  
  // 销毁之前的图表实例（如果存在）
  const existingChart = echarts.getInstanceByDom(heatmapChart.value)
  if (existingChart) {
    existingChart.dispose()
  }
  
  const chart = echarts.init(heatmapChart.value)
  const data = getHeatmapData()
  
  // 检查是否有数据
  const hasData = data && data.values && data.values.length > 0
  
  const option = {
    title: {
      text: '情绪强度热力图',
      left: 'center',
      textStyle: {
        color: '#FF6B6B',
        fontSize: 16
      },
      subtext: hasData ? '' : '暂无数据',
      subtextStyle: {
        color: '#999',
        fontSize: 14
      }
    },
    tooltip: {
      position: 'top',
      formatter: function(params) {
        return `${params.name || data.days[params.data[1]]}<br/>时间: ${params.data[0]}:00<br/>强度: ${params.data[2]}/10`
      }
    },
    grid: {
      height: '50%',
      top: '15%',
      left: '5%',
      right: '5%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.hours,
      splitArea: {
        show: true
      },
      axisLabel: {
        interval: 3,
        formatter: '{value}'
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
      bottom: '5%',
      inRange: {
        color: ['#FFB6C1', '#FF6B6B', '#FF4500']
      }
    },
    series: [{
      name: '情绪强度',
      type: 'heatmap',
      data: data.values,
      label: {
        show: false
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
  
  // 立即执行一次resize确保图表正确渲染
  setTimeout(() => {
    chart.resize()
  }, 0)
  
  // 移除之前的事件监听器，避免重复添加
  const resizeHandler = () => {
    chart.resize()
  }
  window.removeEventListener('resize', resizeHandler)
  window.addEventListener('resize', resizeHandler)
}

// 数据获取
const getTrendData = () => {
  const trendData = emotionStore.getEmotionTrend(selectedPeriod.value) || []
  
  // 如果没有数据，返回空数组
  if (!trendData || trendData.length === 0) {
    return { dates: [], intensities: [] }
  }
  
  const dates = trendData.map(item => {
    if (!item || !item.date) return ''
    
    const date = new Date(item.date)
    // 根据不同时间段使用不同的日期格式
    if (selectedPeriod.value === 'year') {
      return date.toLocaleDateString('zh-CN', { month: 'short' })
    } else if (selectedPeriod.value === 'month') {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    } else { // week
      return date.toLocaleDateString('zh-CN', { weekday: 'short', day: 'numeric' })
    }
  }).filter(date => date !== '')
  
  const intensities = trendData.map(item => {
    return item && typeof item.intensity === 'number' ? item.intensity : 0
  })
  
  return { dates, intensities }
}

const getDistributionData = () => {
  const distribution = emotionStore.emotionDistribution || {}
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
  
  // 如果没有数据，返回空数组
  if (!distribution || Object.keys(distribution).length === 0) {
    return []
  }
  
  // 情绪类型对应的颜色
  const emotionColors = {
    '开心': '#91CC75',
    '平静': '#73C0DE',
    '难过': '#5470C6',
    '愤怒': '#EE6666',
    '焦虑': '#FAC858',
    '困惑': '#9A60B4',
    '兴奋': '#FC8452',
    '疲惫': '#3BA272'
  }
  
  return Object.entries(distribution)
    .filter(([_, count]) => count > 0) // 过滤掉数量为0的情绪
    .map(([type, count]) => {
      const name = emotionLabels[type] || type
      return {
        name: name,
        value: count,
        itemStyle: {
          color: emotionColors[name] || '#FF6B6B' // 使用预定义颜色或默认颜色
        }
      }
    })
}

const getHeatmapData = () => {
  // 生成最近7天的热力图数据
  const emotions = emotionStore.emotions || []
  // 调整顺序为周一到周日
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const values = []
  
  // 如果没有数据，返回空结构
  if (!emotions || emotions.length === 0) {
    return { days, hours, values: [] }
  }
  
  // 过滤最近7天的数据
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  const recentEmotions = emotions.filter(emotion => {
    const date = new Date(emotion.timestamp)
    return date >= oneWeekAgo
  })
  
  // 根据时间分组处理数据
  recentEmotions.forEach(emotion => {
    if (!emotion || !emotion.intensity) return
    
    const date = new Date(emotion.timestamp)
    // 调整dayIndex: 0是周一，6是周日
    let dayIndex = date.getDay() - 1
    if (dayIndex < 0) dayIndex = 6 // 周日
    const hour = date.getHours()
    
    values.push([hour, dayIndex, emotion.intensity])
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
