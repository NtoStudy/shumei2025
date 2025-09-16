/**
 * Kimi AI情绪分析引擎
 * 纯Kimi API实现，简洁高效
 */

class EmotionAI {
  constructor() {
    this.isInitialized = false
    // Kimi API配置
    this.apiKey = 'sk-TnLf9nqDgsFAuJ4fArErcFj7bqLkSH894RhWGLYGqiNMnnod'
    // 使用Vite代理路径避免CORS问题
    this.baseURL = '/api/kimi/v1/chat/completions'
    this.model = 'moonshot-v1-8k'
    
    this.emotionLabels = [
      'happy',     // 快乐
      'sad',       // 悲伤
      'angry',     // 愤怒
      'fear',      // 恐惧
      'surprise',  // 惊讶
      'disgust',   // 厌恶
      'neutral'    // 中性
    ]
  }

  /**
   * 初始化Kimi AI引擎
   */
  async initialize() {
    try {
      console.log('🧠 初始化Kimi AI情绪分析引擎...')
      console.log('🔑 API Key状态:', this.apiKey ? '已配置' : '未配置')
      console.log('🌐 网络环境检查...')
      
      // 检查网络连接
      if (!navigator.onLine) {
        console.warn('⚠️ 网络连接不可用')
        this.isInitialized = true
        return true
      }
      
      // 测试API连接
      console.log('🔗 开始测试API连接...')
      const isConnected = await this.testConnection()
      if (isConnected) {
        console.log('✅ Kimi API连接成功')
      } else {
        console.warn('⚠️ Kimi API连接失败，但引擎仍可使用（将返回错误结果）')
      }
      
      this.isInitialized = true
      console.log('✅ AI情绪分析引擎初始化完成，状态:', this.isInitialized)
      
      return true
    } catch (error) {
      console.error('❌ AI初始化过程中发生异常:')
      console.error('- 错误类型:', error.name)
      console.error('- 错误消息:', error.message)
      console.error('- 错误栈:', error.stack)
      this.isInitialized = true
      return true
    }
  }

  /**
   * 测试API连接
   */
  async testConnection() {
    try {
      console.log('🔍 测试连接详情:')
      console.log('- API Key:', this.apiKey ? this.apiKey.substring(0, 10) + '...' : '未设置')
      console.log('- Base URL:', this.baseURL)
      console.log('- Model:', this.model)
      
      const requestBody = {
        model: this.model,
        messages: [
          {
            role: 'user',
            content: '测试连接'
          }
        ],
        max_tokens: 10
      }
      
      console.log('📤 发送请求:', JSON.stringify(requestBody, null, 2))
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })
      
      console.log('📥 响应状态:', response.status, response.statusText)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ API连接测试成功, 响应数据:', data)
        return true
      } else {
        let errorData
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { message: '无法解析错误响应' }
        }
        console.error('❌ API连接测试失败:')
        console.error('- 状态码:', response.status)
        console.error('- 状态文本:', response.statusText)
        console.error('- 错误详情:', errorData)
        return false
      }
    } catch (error) {
      console.error('❌ API连接测试异常:')
      console.error('- 错误类型:', error.name)
      console.error('- 错误消息:', error.message)
      console.error('- 错误栈:', error.stack)
      return false
    }
  }

  /**
   * 分析文本情绪 - 主入口
   */
  async analyzeEmotion(text) {
    // 如果未初始化，尝试初始化
    if (!this.isInitialized) {
      console.log('🔄 AI引擎未初始化，正在初始化...')
      try {
        await this.initialize()
      } catch (error) {
        console.warn('⚠️ AI引擎初始化失败:', error)
      }
    }

    if (!text || text.trim().length === 0) {
      return this.getDefaultResult()
    }

    try {
      console.log('🔍 开始Kimi AI情绪分析...')
      const result = await this.analyzeWithKimi(text)
      console.log('✅ Kimi AI分析完成')
      return result
    } catch (error) {
      console.error('❌ Kimi API分析失败:', error)
      return this.getErrorResult(error)
    }
  }

  /**
   * 使用Kimi API进行情绪分析
   */
  async analyzeWithKimi(text) {
    const prompt = `请分析以下中文文本的情绪，并严格按照JSON格式返回结果。

文本：${text}

请返回以下格式的JSON（只返回JSON，不要任何其他文字）：
{
  "emotions": {
    "happy": 0.0,
    "sad": 0.0,
    "angry": 0.0,
    "fear": 0.0,
    "surprise": 0.0,
    "disgust": 0.0,
    "neutral": 1.0
  },
  "dominant": "neutral",
  "confidence": 0.85,
  "intensity": 0.4,
  "keywords": ["关键词1", "关键词2"],
  "reasoning": "分析理由"
}

要求：
1. emotions中各项数值为0.0-1.0之间，总和必须等于1.0
2. dominant为emotions中得分最高的情绪类型
3. confidence为分析置信度(0.0-1.0)
4. intensity为情绪强度(0.0-1.0)
5. keywords为识别出的关键情绪词汇（最多5个）
6. reasoning为简短分析理由（不超过50字）
7. 必须严格按照JSON格式返回，不要包含任何其他内容`

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.1
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Kimi API请求失败: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content

      if (!content) {
        throw new Error('Kimi API返回内容为空')
      }

      // 解析JSON
      let analysisResult
      try {
        // 尝试直接解析
        analysisResult = JSON.parse(content.trim())
      } catch (e) {
        // 尝试提取JSON部分
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('无法从Kimi响应中提取有效JSON: ' + content)
        }
      }

      // 构建标准格式结果
      const result = {
        emotions: analysisResult.emotions || this.getDefaultEmotions(),
        dominant: analysisResult.dominant || 'neutral',
        confidence: analysisResult.confidence || 0.5,
        intensity: analysisResult.intensity || 0.5,
        analysis: {
          keywords: analysisResult.keywords || [],
          reasoning: analysisResult.reasoning || '无分析理由',
          textLength: text.length,
          source: 'kimi'
        },
        timestamp: Date.now()
      }

      // 验证和修正数据
      this.validateResult(result)
      return result

    } catch (error) {
      console.error('Kimi API调用详细错误:', error)
      throw error
    }
  }

  /**
   * 验证和修正分析结果
   */
  validateResult(result) {
    // 确保所有情绪标签都存在
    this.emotionLabels.forEach(emotion => {
      if (typeof result.emotions[emotion] !== 'number' || 
          isNaN(result.emotions[emotion]) || 
          result.emotions[emotion] < 0) {
        result.emotions[emotion] = 0
      }
      if (result.emotions[emotion] > 1) {
        result.emotions[emotion] = 1
      }
    })

    // 归一化情绪得分，确保总和为1
    const total = Object.values(result.emotions).reduce((sum, score) => sum + score, 0)
    if (total > 0) {
      Object.keys(result.emotions).forEach(emotion => {
        result.emotions[emotion] = result.emotions[emotion] / total
      })
    } else {
      // 如果所有得分都是0，设置neutral为1
      result.emotions = this.getDefaultEmotions()
    }

    // 重新计算主导情绪
    const maxScore = Math.max(...Object.values(result.emotions))
    result.dominant = Object.keys(result.emotions).find(
      emotion => result.emotions[emotion] === maxScore
    ) || 'neutral'

    // 确保置信度和强度在合理范围内
    result.confidence = Math.max(0, Math.min(1, result.confidence || maxScore))
    result.intensity = Math.max(0, Math.min(1, result.intensity || 0.5))

    // 确保关键词是数组
    if (!Array.isArray(result.analysis.keywords)) {
      result.analysis.keywords = []
    }
  }

  /**
   * 获取默认情绪分布
   */
  getDefaultEmotions() {
    const emotions = {}
    this.emotionLabels.forEach(emotion => {
      emotions[emotion] = emotion === 'neutral' ? 1.0 : 0.0
    })
    return emotions
  }

  /**
   * 获取默认结果
   */
  getDefaultResult() {
    return {
      emotions: this.getDefaultEmotions(),
      dominant: 'neutral',
      confidence: 0.5,
      intensity: 0.5,
      analysis: {
        keywords: [],
        reasoning: '无文本内容',
        textLength: 0,
        source: 'default'
      },
      timestamp: Date.now()
    }
  }

  /**
   * 获取错误结果
   */
  getErrorResult(error) {
    // 根据错误类型提供更友好的提示
    let reasoning = '分析暂时不可用'
    if (error.message.includes('Failed to fetch')) {
      reasoning = '网络连接问题，请检查网络后重试'
    } else if (error.message.includes('401')) {
      reasoning = 'API密钥验证失败，请检查配置'
    } else if (error.message.includes('429')) {
      reasoning = 'API调用频率过高，请稍后重试'
    } else if (error.message.includes('500')) {
      reasoning = 'AI服务暂时不可用，请稍后重试'
    }
    
    return {
      emotions: this.getDefaultEmotions(),
      dominant: 'neutral',
      confidence: 0.3,
      intensity: 0.3,
      analysis: {
        keywords: [],
        reasoning: reasoning,
        textLength: 0,
        source: 'error',
        error_type: error.name,
        retry_suggested: true
      },
      timestamp: Date.now()
    }
  }

  /**
   * 批量分析情绪
   */
  async batchAnalyze(texts) {
    const results = []
    for (const text of texts) {
      try {
        const result = await this.analyzeEmotion(text)
        results.push(result)
        // 添加延迟避免API限流
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error('批量分析失败:', error)
        results.push(this.getErrorResult(error))
      }
    }
    return results
  }

  /**
   * 获取情绪趋势
   */
  getEmotionTrend(results) {
    if (!results || results.length === 0) {
      return null
    }

    const trend = {
      dominant_emotions: [],
      average_intensity: 0,
      emotion_distribution: {},
      trend_direction: 'stable'
    }

    // 初始化情绪分布
    this.emotionLabels.forEach(emotion => {
      trend.emotion_distribution[emotion] = 0
    })

    // 计算平均值
    results.forEach(result => {
      trend.dominant_emotions.push(result.dominant)
      trend.average_intensity += result.intensity
      
      Object.keys(result.emotions).forEach(emotion => {
        if (trend.emotion_distribution[emotion] !== undefined) {
          trend.emotion_distribution[emotion] += result.emotions[emotion]
        }
      })
    })

    trend.average_intensity /= results.length

    // 归一化情绪分布
    Object.keys(trend.emotion_distribution).forEach(emotion => {
      trend.emotion_distribution[emotion] /= results.length
    })

    // 计算趋势方向
    if (results.length >= 3) {
      const recent = results.slice(-2)
      const older = results.slice(0, -2)
      
      if (recent.length > 0 && older.length > 0) {
        const recentAvg = recent.reduce((sum, r) => sum + r.intensity, 0) / recent.length
        const olderAvg = older.reduce((sum, r) => sum + r.intensity, 0) / older.length
        
        if (recentAvg > olderAvg + 0.1) {
          trend.trend_direction = 'improving'
        } else if (recentAvg < olderAvg - 0.1) {
          trend.trend_direction = 'declining'
        }
      }
    }

    return trend
  }

  /**
   * 获取情绪建议
   */
  getEmotionSuggestions(result) {
    const suggestions = {
      tools: [],
      activities: [],
      tips: []
    }

    const { dominant, intensity } = result

    switch (dominant) {
      case 'sad':
        suggestions.tools = ['呼吸练习', '正念冥想', '音乐疗法']
        suggestions.activities = ['写日记', '听音乐', '与朋友聊天', '户外散步']
        suggestions.tips = ['允许自己感受悲伤', '寻求社会支持', '保持规律作息']
        break
        
      case 'angry':
        suggestions.tools = ['深呼吸', '肌肉放松', '认知重构']
        suggestions.activities = ['运动发泄', '听舒缓音乐', '冥想', '写下感受']
        suggestions.tips = ['暂停反应', '识别触发因素', '用"我"句式表达']
        break
        
      case 'fear':
        suggestions.tools = ['呼吸练习', '渐进式肌肉放松', '正念练习']
        suggestions.activities = ['制定计划', '分解任务', '寻求支持', '适度运动']
        suggestions.tips = ['关注当下', '挑战负面想法', '接受不确定性']
        break
        
      case 'happy':
        suggestions.tools = ['感恩练习', '分享快乐', '记录美好']
        suggestions.activities = ['与他人分享', '做喜欢的事', '帮助他人', '庆祝成就']
        suggestions.tips = ['珍惜当下', '记录美好时刻', '传递正能量']
        break
        
      default:
        suggestions.tools = ['情绪觉察', '正念练习', '自我关怀']
        suggestions.activities = ['反思自己', '设定目标', '培养兴趣', '社交互动']
        suggestions.tips = ['保持觉察', '接纳自己', '寻找意义']
    }

    // 根据强度调整建议
    if (intensity > 0.7) {
      suggestions.tips.unshift('当前情绪较强烈，建议先进行放松练习')
    }

    return suggestions
  }

  /**
   * 销毁引擎，释放资源
   */
  dispose() {
    this.isInitialized = false
    console.log('🧠 Kimi AI情绪分析引擎已释放')
  }
}

// 创建全局实例
const emotionAI = new EmotionAI()

// 自动初始化
emotionAI.initialize().catch(error => {
  console.warn('AI自动初始化失败:', error)
})

// 导出
export default emotionAI
export { EmotionAI }