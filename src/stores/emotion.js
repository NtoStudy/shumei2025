import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEmotionStore = defineStore('emotion', () => {
  // 状态
  const emotions = ref([])
  const currentEmotion = ref(null)
  const emotionStats = ref({})

  // 计算属性
  const todayEmotions = computed(() => {
    const today = new Date().toDateString()
    return emotions.value.filter(emotion => 
      new Date(emotion.timestamp).toDateString() === today
    )
  })

  const emotionTrend = computed(() => {
    const last7Days = emotions.value.slice(-7)
    return last7Days.map(emotion => ({
      date: emotion.timestamp,
      intensity: emotion.emotion.intensity,
      type: emotion.emotion.type
    }))
  })

  const emotionDistribution = computed(() => {
    const distribution = {}
    emotions.value.forEach(emotion => {
      const type = emotion.emotion.type
      distribution[type] = (distribution[type] || 0) + 1
    })
    return distribution
  })

  // 方法
  const addEmotion = (emotionData) => {
    const emotion = {
      id: generateId(),
      userId: 'anonymous_id',
      emotion: {
        type: emotionData.type,
        intensity: emotionData.intensity,
        emoji: emotionData.emoji,
        color: emotionData.color
      },
      content: emotionData.content || '',
      triggers: emotionData.triggers || [],
      timestamp: new Date().toISOString(),
      tags: emotionData.tags || [],
      isPrivate: true
    }
    emotions.value.push(emotion)
    updateStats()
  }

  const updateStats = () => {
    const total = emotions.value.length
    const avgIntensity = emotions.value.reduce((sum, e) => sum + e.emotion.intensity, 0) / total || 0
    
    emotionStats.value = {
      total,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      lastRecord: emotions.value[emotions.value.length - 1]?.timestamp
    }
  }

  const getEmotionTrend = (period = 'week') => {
    const now = new Date()
    let startDate
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }
    
    return emotions.value
      .filter(emotion => new Date(emotion.timestamp) >= startDate)
      .map(emotion => ({
        date: emotion.timestamp,
        intensity: emotion.emotion.intensity,
        type: emotion.emotion.type
      }))
  }

  const exportData = () => {
    return {
      emotions: emotions.value,
      stats: emotionStats.value,
      exportDate: new Date().toISOString()
    }
  }

  const clearData = () => {
    emotions.value = []
    currentEmotion.value = null
    emotionStats.value = {}
  }

  // 工具函数
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    emotions,
    currentEmotion,
    emotionStats,
    todayEmotions,
    emotionTrend,
    emotionDistribution,
    addEmotion,
    updateStats,
    getEmotionTrend,
    exportData,
    clearData
  }
}, {
  persist: true
})
