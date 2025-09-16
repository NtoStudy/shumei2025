import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import emotionAI from '@/utils/emotionAI'

export const useEmotionStore = defineStore('emotion', () => {
  // 状态
  const emotions = ref([])
  const currentEmotion = ref(null)
  const emotionStats = ref({})
  const aiAnalysisCache = ref({})
  const isAIInitialized = ref(false)

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
  const initializeAI = async () => {
    if (!isAIInitialized.value) {
      try {
        const success = await emotionAI.initialize()
        isAIInitialized.value = success
        console.log('🧠 情绪AI初始化:', success ? '成功' : '失败')
        return success
      } catch (error) {
        console.error('AI初始化错误:', error)
        return false
      }
    }
    return true
  }

  const analyzeEmotionText = async (text) => {
    if (!text || text.trim().length === 0) {
      return null
    }

    // 检查缓存
    const cacheKey = text.trim()
    if (aiAnalysisCache.value[cacheKey]) {
      return aiAnalysisCache.value[cacheKey]
    }

    try {
      // 确保AI已初始化
      await initializeAI()
      
      // 分析情绪
      const analysis = await emotionAI.analyzeEmotion(text)
      
      // 缓存结果
      aiAnalysisCache.value[cacheKey] = analysis
      
      return analysis
    } catch (error) {
      console.error('情绪分析失败:', error)
      return null
    }
  }

  const addEmotion = async (emotionData) => {
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
      isPrivate: true,
      aiAnalysis: null
    }

    // 如果有文本内容，进行AI分析
    if (emotion.content && emotion.content.trim().length > 0) {
      try {
        const analysis = await analyzeEmotionText(emotion.content)
        if (analysis) {
          emotion.aiAnalysis = analysis
          
          // 根据AI分析建议情绪类型（如果用户没有明确选择）
          if (!emotionData.type || emotionData.type === 'neutral') {
            const suggestedType = analysis.dominant
            if (suggestedType && suggestedType !== 'neutral') {
              emotion.emotion.type = suggestedType
              emotion.emotion.intensity = Math.max(emotion.emotion.intensity, analysis.intensity * 10)
            }
          }
        }
      } catch (error) {
        console.warn('AI分析失败，继续保存情绪记录:', error)
      }
    }

    emotions.value.push(emotion)
    updateStats()
    return emotion
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
    aiAnalysisCache.value = {}
  }

  const getAIEmotionTrend = () => {
    const emotionsWithAI = emotions.value.filter(e => e.aiAnalysis)
    if (emotionsWithAI.length === 0) return null

    const analyses = emotionsWithAI.map(e => e.aiAnalysis)
    return emotionAI.getEmotionTrend(analyses)
  }

  const getEmotionSuggestions = (emotionId) => {
    const emotion = emotions.value.find(e => e.id === emotionId)
    if (!emotion || !emotion.aiAnalysis) return null

    return emotionAI.getEmotionSuggestions(emotion.aiAnalysis)
  }

  const getAIInsights = () => {
    const emotionsWithAI = emotions.value.filter(e => e.aiAnalysis)
    if (emotionsWithAI.length === 0) {
      return {
        hasData: false,
        message: '暂无AI分析数据，开始记录带有文字描述的情绪日记吧！'
      }
    }

    const analyses = emotionsWithAI.map(e => e.aiAnalysis)
    const trend = emotionAI.getEmotionTrend(analyses)
    
    // 分析最近的情绪模式
    const recentAnalyses = analyses.slice(-7) // 最近7条
    const dominantEmotions = recentAnalyses.map(a => a.dominant)
    const emotionCounts = {}
    
    dominantEmotions.forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
    })

    const mostFrequentEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b
    )

    const insights = {
      hasData: true,
      trend: trend,
      mostFrequentEmotion,
      averageIntensity: trend.average_intensity,
      totalAnalyzed: analyses.length,
      recentPatterns: emotionCounts,
      suggestions: emotionAI.getEmotionSuggestions(recentAnalyses[recentAnalyses.length - 1])
    }

    return insights
  }

  // 工具函数
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    emotions,
    currentEmotion,
    emotionStats,
    aiAnalysisCache,
    isAIInitialized,
    todayEmotions,
    emotionTrend,
    emotionDistribution,
    addEmotion,
    updateStats,
    getEmotionTrend,
    exportData,
    clearData,
    initializeAI,
    analyzeEmotionText,
    getAIEmotionTrend,
    getEmotionSuggestions,
    getAIInsights
  }
}, {
  persist: true
})
