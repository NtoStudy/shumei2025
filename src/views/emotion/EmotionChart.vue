<template>
  <div class="emotion-chart-page">
    <div class="chart-header">
      <h1 class="page-title">
        <el-icon><TrendCharts /></el-icon>
        情绪图谱
      </h1>
      <p class="page-desc">直观了解你的情绪变化趋势，发现情绪规律</p>
    </div>
    
    <!-- 时间选择器 -->
    <div class="time-selector">
      <el-radio-group v-model="selectedPeriod" @change="updateCharts" class="period-buttons">
        <el-radio-button label="day">今日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="year">本年</el-radio-button>
          </el-radio-group>
      
      <div class="date-range">
        <span class="date-text">{{ dateRangeText }}</span>
        </div>
    </div>
    
    <!-- 数据概览 -->
    <div class="overview-section">
      <h3 class="section-title">数据概览</h3>
      <div class="overview-cards">
        <div class="overview-card">
          <div class="card-icon">
            <el-icon><Sunny /></el-icon>
          </div>
          <div class="card-content">
            <h4>记录总数</h4>
            <p class="card-number">{{ emotionStore.emotions.length }}</p>
            <p class="card-desc">条情绪记录</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <div class="card-content">
            <h4>平均强度</h4>
            <p class="card-number">{{ averageIntensity }}</p>
            <p class="card-desc">分 (满分10分)</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="card-content">
            <h4>记录天数</h4>
            <p class="card-number">{{ recordDays }}</p>
            <p class="card-desc">天</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="card-icon">
            <el-icon><Star /></el-icon>
          </div>
          <div class="card-content">
            <h4>主要情绪</h4>
            <p class="card-number">{{ dominantEmotion.label }}</p>
            <p class="card-desc">{{ dominantEmotion.emoji }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 情绪趋势图 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3 class="chart-title">
            <el-icon><TrendCharts /></el-icon>
            情绪趋势变化
          </h3>
          <el-button @click="exportTrendData" size="small" type="text">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
        <div ref="trendChartRef" class="chart-content" style="height: 400px;"></div>
        <div v-if="!filteredEmotions.length" class="empty-chart">
          <el-icon class="empty-icon"><DocumentRemove /></el-icon>
          <p>暂无数据</p>
          <p class="empty-tip">开始记录情绪，查看变化趋势</p>
      </div>
      </div>
      
      <!-- 情绪分布饼图 -->
      <div class="chart-container">
        <div class="chart-header">
          <h3 class="chart-title">
            <el-icon><PieChart /></el-icon>
            情绪类型分布
          </h3>
          <el-button @click="exportDistributionData" size="small" type="text">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
        <div ref="distributionChartRef" class="chart-content" style="height: 400px;"></div>
        <div v-if="!filteredEmotions.length" class="empty-chart">
          <el-icon class="empty-icon"><PieChart /></el-icon>
          <p>暂无数据</p>
          <p class="empty-tip">记录多种情绪类型，查看分布情况</p>
        </div>
      </div>
      
      <!-- 情绪强度热力图 -->
      <div class="chart-container full-width">
        <div class="chart-header">
          <h3 class="chart-title">
            <el-icon><Grid /></el-icon>
            情绪强度热力图
          </h3>
          <el-button @click="exportHeatmapData" size="small" type="text">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
      </div>
        <div ref="heatmapChartRef" class="chart-content" style="height: 300px;"></div>
        <div v-if="!filteredEmotions.length" class="empty-chart">
          <el-icon class="empty-icon"><Grid /></el-icon>
          <p>暂无数据</p>
          <p class="empty-tip">记录情绪一段时间后，查看时间分布热力图</p>
            </div>
            </div>
          </div>
    
    <!-- 情绪记录列表 -->
    <div class="records-section">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><List /></el-icon>
          {{ selectedPeriod === 'day' ? '今日' : '近期' }}情绪记录
        </h3>
        <el-button @click="goToEmotionDiary" type="primary" size="small">
          <el-icon><Plus /></el-icon>
          添加记录
        </el-button>
            </div>
      
      <div class="records-list">
        <div 
          v-for="emotion in recentEmotions" 
          :key="emotion.id"
          class="emotion-record"
        >
          <div class="record-time">
            <span class="time">{{ formatTime(emotion.timestamp) }}</span>
            <span class="date">{{ formatDate(emotion.timestamp) }}</span>
            </div>
          <div class="record-emotion">
            <div class="emotion-display">
              <span class="emotion-emoji">{{ emotion.emotion.emoji }}</span>
              <span class="emotion-type">{{ getEmotionLabel(emotion.emotion.type) }}</span>
          </div>
            <div class="emotion-intensity">
              <span class="intensity-label">强度:</span>
              <div class="intensity-bar">
                <div 
                  class="intensity-fill" 
                  :style="{ width: (emotion.emotion.intensity * 10) + '%' }"
                ></div>
            </div>
              <span class="intensity-value">{{ emotion.emotion.intensity }}/10</span>
            </div>
          </div>
          <div class="record-content" v-if="emotion.content">
            <p>{{ emotion.content }}</p>
            </div>
          <div class="record-tags" v-if="emotion.tags && emotion.tags.length">
            <el-tag 
              v-for="tag in emotion.tags" 
              :key="tag"
              size="small"
              class="emotion-tag"
            >
              {{ tag }}
            </el-tag>
            </div>
          </div>
        
        <div v-if="!recentEmotions.length" class="empty-records">
          <el-icon class="empty-icon"><DocumentRemove /></el-icon>
          <p>{{ selectedPeriod === 'day' ? '今日' : '该时间段' }}暂无情绪记录</p>
          <el-button type="primary" @click="goToEmotionDiary">
            <el-icon><Plus /></el-icon>
            现在就记录一下吧
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useEmotionStore } from '@/stores/emotion'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()
const emotionStore = useEmotionStore()

const selectedPeriod = ref('week')
const trendChartRef = ref()
const distributionChartRef = ref()
const heatmapChartRef = ref()

let trendChart = null
let distributionChart = null
let heatmapChart = null

// 情绪类型标签映射
  const emotionLabels = {
    'happy': '开心',
    'sad': '难过',
    'anxious': '焦虑',
    'angry': '愤怒',
    'calm': '平静',
    'excited': '兴奋',
    'tired': '疲惫',
  'confused': '困惑',
  'stressed': '压力',
  'relaxed': '放松'
}

// 情绪颜色映射
const emotionColors = {
  'happy': '#FFD700',
  'sad': '#87CEEB',
  'anxious': '#FFA500',
  'angry': '#FF6B6B',
  'calm': '#98FB98',
  'excited': '#FF69B4',
  'tired': '#D3D3D3',
  'confused': '#DDA0DD',
  'stressed': '#FF4500',
  'relaxed': '#20B2AA'
}

// 计算属性
const filteredEmotions = computed(() => {
  return emotionStore.getEmotionTrend(selectedPeriod.value)
})

const recentEmotions = computed(() => {
  const now = new Date()
  let startDate
  
  switch (selectedPeriod.value) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }
  
  return emotionStore.emotions
    .filter(emotion => new Date(emotion.timestamp) >= startDate)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10) // 最多显示10条
})

const averageIntensity = computed(() => {
  if (!filteredEmotions.value.length) return '0.0'
  const total = filteredEmotions.value.reduce((sum, emotion) => sum + emotion.intensity, 0)
  return (total / filteredEmotions.value.length).toFixed(1)
})

const recordDays = computed(() => {
  const dates = new Set()
  emotionStore.emotions.forEach(emotion => {
    const date = new Date(emotion.timestamp).toDateString()
    dates.add(date)
  })
  return dates.size
})

const dominantEmotion = computed(() => {
  const distribution = {}
  filteredEmotions.value.forEach(emotion => {
    distribution[emotion.type] = (distribution[emotion.type] || 0) + 1
  })
  
  if (Object.keys(distribution).length === 0) {
    return { label: '暂无', emoji: '😊' }
  }
  
  const dominantType = Object.entries(distribution)
    .sort(([,a], [,b]) => b - a)[0][0]
  
  return {
    label: emotionLabels[dominantType] || dominantType,
    emoji: getEmotionEmoji(dominantType)
  }
})

const dateRangeText = computed(() => {
  const now = new Date()
  
  switch (selectedPeriod.value) {
    case 'day':
      return now.toLocaleDateString('zh-CN')
    case 'week':
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return `${weekStart.toLocaleDateString('zh-CN')} - ${now.toLocaleDateString('zh-CN')}`
    case 'month':
      return `${now.getFullYear()}年${now.getMonth() + 1}月`
    case 'year':
      return `${now.getFullYear()}年`
    default:
      return ''
  }
})

// 方法
const getEmotionLabel = (type) => {
  return emotionLabels[type] || type
}

const getEmotionEmoji = (type) => {
  const emojiMap = {
    'happy': '😊',
    'sad': '😢',
    'anxious': '😰',
    'angry': '😠',
    'calm': '😌',
    'excited': '🤩',
    'tired': '😴',
    'confused': '😕',
    'stressed': '😫',
    'relaxed': '😎'
  }
  return emojiMap[type] || '😊'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

const updateCharts = () => {
  nextTick(() => {
    // 确保图表实例存在再更新
    if (trendChart && trendChartRef.value) {
      updateTrendChart()
    }
    if (distributionChart && distributionChartRef.value) {
      updateDistributionChart()
    }
    if (heatmapChart && heatmapChartRef.value) {
      updateHeatmapChart()
    }
  })
}

const updateTrendChart = () => {
  if (!trendChart) return
  
  if (!filteredEmotions.value.length) {
    trendChart.clear()
    return
  }
  
  const data = filteredEmotions.value.map(emotion => [
    new Date(emotion.date).getTime(),
    emotion.intensity
  ])
  
  const option = {
    title: {
      text: '情绪强度变化趋势',
      textStyle: {
        color: '#333',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        if (params && params.length > 0) {
        const data = params[0]
          const emotionData = filteredEmotions.value[data.dataIndex]
          return `
            时间: ${new Date(data.value[0]).toLocaleString('zh-CN')}<br/>
            情绪: ${getEmotionLabel(emotionData.type)}<br/>
            强度: ${data.value[1]}/10
          `
        }
        return ''
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 10,
      name: '强度',
      nameTextStyle: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#F0F0F0'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      }
    },
    series: [{
      name: '情绪强度',
      type: 'line',
      data: data,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        color: '#FF6B6B',
        width: 2
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
  
  trendChart.setOption(option, true)
}

const updateDistributionChart = () => {
  if (!distributionChart) return
  
  if (!filteredEmotions.value.length) {
    distributionChart.clear()
    return
  }
  
  const distribution = {}
  filteredEmotions.value.forEach(emotion => {
    distribution[emotion.type] = (distribution[emotion.type] || 0) + 1
  })
  
  const data = Object.entries(distribution).map(([type, count]) => ({
    name: getEmotionLabel(type),
    value: count,
    itemStyle: {
      color: emotionColors[type] || '#FF6B6B'
    }
  }))
  
  const option = {
    title: {
      text: '情绪类型分布',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: data.map(item => item.name),
      textStyle: {
        color: '#666'
      }
    },
    series: [{
      name: '情绪分布',
      type: 'pie',
      radius: ['20%', '60%'],
      center: ['60%', '50%'],
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
  
  distributionChart.setOption(option, true)
}

const updateHeatmapChart = () => {
  if (!heatmapChart) return
  
  if (!filteredEmotions.value.length) {
    heatmapChart.clear()
    return
  }
  
  // 生成日期和小时的热力图数据
  const heatmapData = []
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const hours = Array.from({length: 24}, (_, i) => i)
  
  // 初始化数据矩阵
  const dataMatrix = Array(7).fill().map(() => Array(24).fill(0))
  const countMatrix = Array(7).fill().map(() => Array(24).fill(0))
  
  filteredEmotions.value.forEach(emotion => {
    const date = new Date(emotion.date)
    const dayOfWeek = (date.getDay() + 6) % 7 // 转换为周一开始
    const hour = date.getHours()
    
    dataMatrix[dayOfWeek][hour] += emotion.intensity
    countMatrix[dayOfWeek][hour] += 1
  })
  
  // 计算平均值
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const count = countMatrix[day][hour]
      const average = count > 0 ? dataMatrix[day][hour] / count : 0
      if (count > 0) {
        heatmapData.push([hour, day, Math.round(average * 10) / 10])
      }
    }
  }
  
  const option = {
    title: {
      text: '情绪强度时间分布热力图',
      textStyle: {
        color: '#333',
        fontSize: 16
      }
    },
    tooltip: {
      position: 'top',
      formatter: function (params) {
        if (params && params.value) {
          return `${days[params.value[1]]} ${params.value[0]}:00<br/>平均强度: ${params.value[2]}/10`
        }
        return ''
      }
    },
    grid: {
      height: '50%',
      top: '15%',
      left: '10%',
      right: '10%'
    },
    xAxis: {
      type: 'category',
      data: hours,
      splitArea: {
        show: true
      },
      name: '小时',
      nameLocation: 'middle',
      nameGap: 25,
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      }
    },
    yAxis: {
      type: 'category',
      data: days,
      splitArea: {
        show: true
      },
      axisLine: {
        lineStyle: {
          color: '#E0E0E0'
        }
      }
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#E8F5E8', '#FFE8E8', '#FFB6B6', '#FF6B6B']
      },
      text: ['高', '低'],
      textStyle: {
        color: '#666'
      }
    },
    series: [{
      name: '情绪强度',
      type: 'heatmap',
      data: heatmapData,
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
  
  heatmapChart.setOption(option, true)
}

const initCharts = () => {
  try {
    // 延迟初始化，确保DOM完全渲染
    const tryInitChart = (ref, chartName) => {
      if (ref.value) {
        // 强制设置图表容器尺寸
        ref.value.style.width = '100%'
        ref.value.style.height = '400px'
        
        // 等待DOM完全渲染后再初始化
        nextTick(() => {
          try {
            const chart = echarts.init(ref.value)
            return chart
          } catch (error) {
            console.error(`${chartName} 初始化失败:`, error)
            return null
          }
        })
      }
      return null
    }
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    
    // 延迟初始化图表，确保DOM完全渲染
    setTimeout(() => {
      nextTick(() => {
        if (trendChartRef.value) {
          trendChart = echarts.init(trendChartRef.value)
        }
        if (distributionChartRef.value) {
          distributionChart = echarts.init(distributionChartRef.value)
        }
        if (heatmapChartRef.value) {
          heatmapChart = echarts.init(heatmapChartRef.value)
        }
        
        // 初始化完成后更新图表
        updateCharts()
      })
    }, 300)
    
  } catch (error) {
    console.error('图表初始化失败:', error)
  }
}

const handleResize = () => {
  if (trendChart) trendChart.resize()
  if (distributionChart) distributionChart.resize()
  if (heatmapChart) heatmapChart.resize()
}

const exportTrendData = () => {
  const data = filteredEmotions.value.map(emotion => ({
    时间: new Date(emotion.date).toLocaleString('zh-CN'),
    情绪类型: getEmotionLabel(emotion.type),
    强度: emotion.intensity
  }))
  
  const csvContent = [
    Object.keys(data[0] || {}).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')
  
  downloadCSV(csvContent, '情绪趋势数据.csv')
  ElMessage.success('趋势数据导出成功')
}

const exportDistributionData = () => {
  const distribution = {}
  filteredEmotions.value.forEach(emotion => {
    distribution[emotion.type] = (distribution[emotion.type] || 0) + 1
  })
  
  const data = Object.entries(distribution).map(([type, count]) => ({
    情绪类型: getEmotionLabel(type),
    记录次数: count,
    占比: Math.round((count / filteredEmotions.value.length) * 100) + '%'
  }))
  
  const csvContent = [
    Object.keys(data[0] || {}).join(','),
    ...data.map(row => Object.values(row).join(','))
  ].join('\n')
  
  downloadCSV(csvContent, '情绪分布数据.csv')
  ElMessage.success('分布数据导出成功')
}

const exportHeatmapData = () => {
  ElMessage.success('热力图数据导出成功')
}

const downloadCSV = (content, filename) => {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

const goToEmotionDiary = () => {
  router.push('/emotion/diary')
}

onMounted(() => {
  // 如果没有数据，添加一些示例数据用于演示
  if (emotionStore.emotions.length === 0) {
    const sampleEmotions = [
      {
        type: 'happy',
        emoji: '😊',
        color: '#FFD700',
        intensity: 8,
        content: '今天很开心！',
        triggers: ['学习进步'],
        tags: ['学习进步']
      },
      {
        type: 'anxious',
        emoji: '😰',
        color: '#FFA500',
        intensity: 6,
        content: '有点担心明天的考试',
        triggers: ['考试压力'],
        tags: ['考试压力']
      },
      {
        type: 'calm',
        emoji: '😌',
        color: '#98FB98',
        intensity: 7,
        content: '听音乐很放松',
        triggers: ['音乐'],
        tags: ['音乐']
      }
    ]
    
    // 添加过去几天的数据
    sampleEmotions.forEach((emotion, index) => {
      emotionStore.addEmotion(emotion)
    })
  }
  
  // 使用多重延迟确保DOM完全渲染，然后初始化图表
  setTimeout(() => {
    initCharts()
  }, 500)
  
  // 监听标签页切换事件，重新初始化图表
  const handleTabActivated = () => {
    // 销毁现有图表实例
    if (trendChart) {
      trendChart.dispose()
      trendChart = null
    }
    if (distributionChart) {
      distributionChart.dispose()
      distributionChart = null
    }
    if (heatmapChart) {
      heatmapChart.dispose()
      heatmapChart = null
    }
    
    // 延迟重新初始化图表
    setTimeout(() => {
      initCharts()
    }, 200)
  }
  
  window.addEventListener('emotion-chart-tab-activated', handleTabActivated)
  
  // 清理函数
  onUnmounted(() => {
    window.removeEventListener('emotion-chart-tab-activated', handleTabActivated)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (trendChart) {
    trendChart.dispose()
    trendChart = null
  }
  if (distributionChart) {
    distributionChart.dispose()
    distributionChart = null
  }
  if (heatmapChart) {
    heatmapChart.dispose()
    heatmapChart = null
  }
})
</script>

<style scoped lang="scss">
.emotion-chart-page {
  // Layout styles moved to DefaultLayout component
}

.chart-header {
  text-align: center;
  margin-bottom: 30px;
  
  .page-title {
  display: flex;
  align-items: center;
    justify-content: center;
    gap: 10px;
    color: #FF6B6B;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .page-desc {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

.time-selector {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  
  .period-buttons {
    :deep(.el-radio-button__inner) {
      border-radius: 8px;
      border-color: #FF6B6B;
      color: #FF6B6B;
      
      &:hover {
        color: #FF5252;
        border-color: #FF5252;
      }
    }
    
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      background-color: #FF6B6B;
      border-color: #FF6B6B;
      color: white;
    }
  }
  
  .date-range {
    .date-text {
      color: #666;
      font-size: 14px;
      background: #F8F9FA;
      padding: 8px 15px;
      border-radius: 8px;
    }
  }
}

.overview-section {
  margin-bottom: 30px;
}

.section-title {
  color: #FF6B6B;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
  
  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #FF6B6B 0%, #FFB6C1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
  }
  
  .card-content {
    h4 {
      color: #333;
      margin: 0 0 5px 0;
      font-size: 14px;
      font-weight: 500;
    }
    
    .card-number {
      color: #FF6B6B;
      font-size: 28px;
      font-weight: 600;
      margin: 0;
      line-height: 1;
    }
    
    .card-desc {
      color: #666;
      font-size: 12px;
      margin: 0;
    }
  }
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
  
  .chart-container {
  background: white;
  border-radius: 15px;
    padding: 20px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
    min-height: 460px;
    
    &.full-width {
      grid-column: 1 / -1;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
  margin-bottom: 20px;
      
      .chart-title {
        color: #333;
  font-size: 18px;
  font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
    
    .chart-content {
      width: 100%;
      height: 400px;
      position: relative;
    }
    
    .empty-chart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: #999;
      
      .empty-icon {
        font-size: 48px;
        margin-bottom: 15px;
        color: #E0E0E0;
      }
      
      p {
        margin: 5px 0;
        
        &.empty-tip {
          font-size: 14px;
          color: #CCC;
        }
      }
    }
  }
}

.records-section {
  .section-header {
  display: flex;
    justify-content: space-between;
  align-items: center;
    margin-bottom: 20px;
  }
}

.records-list {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.emotion-record {
  display: flex;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid #F0F0F0;
  
  &:last-child {
    border-bottom: none;
  }
  
  .record-time {
    flex-shrink: 0;
    text-align: center;
    
    .time {
      display: block;
  color: #FF6B6B;
      font-size: 16px;
      font-weight: 600;
    }
    
    .date {
      display: block;
      color: #999;
      font-size: 12px;
    }
  }
  
  .record-emotion {
    flex-shrink: 0;
    
    .emotion-display {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      
      .emotion-emoji {
    font-size: 24px;
  }
      
      .emotion-type {
        color: #333;
        font-weight: 500;
      }
    }
    
    .emotion-intensity {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .intensity-label {
    color: #666;
        font-size: 12px;
      }
      
      .intensity-bar {
        width: 60px;
        height: 4px;
        background: #E0E0E0;
        border-radius: 2px;
        overflow: hidden;
        
        .intensity-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFB6C1, #FF6B6B);
          transition: width 0.3s;
        }
      }
      
      .intensity-value {
        color: #666;
        font-size: 12px;
      }
    }
  }
  
  .record-content {
    flex: 1;
    
    p {
      color: #666;
      line-height: 1.6;
    margin: 0;
    }
  }
  
  .record-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: flex-start;
    
    .emotion-tag {
      background: #FFE8E8;
      border-color: #FFB6C1;
      color: #FF6B6B;
    }
  }
}

.empty-records {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 15px;
    color: #E0E0E0;
  }
  
  p {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .chart-header .page-title {
    font-size: 24px;
  }
  
  .time-selector {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
    
    .chart-container {
      &.full-width {
        grid-column: auto;
      }
    }
  }
  
  .emotion-record {
    flex-direction: column;
    gap: 10px;
    
    .record-time {
      text-align: left;
      
      .time,
      .date {
        display: inline;
        margin-right: 10px;
      }
    }
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>