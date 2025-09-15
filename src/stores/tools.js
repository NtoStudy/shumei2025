import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useToolsStore = defineStore('tools', () => {
  // 状态
  const usageRecords = ref([])
  const toolStats = ref({})
  
  // 计算属性
  const totalUsageTime = computed(() => {
    return usageRecords.value.reduce((total, record) => total + (record.duration || 0), 0)
  })
  
  const totalUsageCount = computed(() => {
    return usageRecords.value.length
  })
  
  const consecutiveDays = computed(() => {
    const dates = new Set()
    usageRecords.value.forEach(record => {
      const date = new Date(record.timestamp).toDateString()
      dates.add(date)
    })
    
    // 计算连续天数（简化版）
    const sortedDates = Array.from(dates).sort()
    if (sortedDates.length === 0) return 0
    
    let consecutive = 1
    let maxConsecutive = 1
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffTime = currDate.getTime() - prevDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      
      if (diffDays === 1) {
        consecutive++
        maxConsecutive = Math.max(maxConsecutive, consecutive)
      } else {
        consecutive = 1
      }
    }
    
    return maxConsecutive
  })
  
  const toolUsageStats = computed(() => {
    const stats = {}
    usageRecords.value.forEach(record => {
      if (!stats[record.toolType]) {
        stats[record.toolType] = {
          count: 0,
          totalDuration: 0,
          lastUsed: null
        }
      }
      stats[record.toolType].count++
      stats[record.toolType].totalDuration += (record.duration || 0)
      if (!stats[record.toolType].lastUsed || new Date(record.timestamp) > new Date(stats[record.toolType].lastUsed)) {
        stats[record.toolType].lastUsed = record.timestamp
      }
    })
    return stats
  })
  
  const recentUsage = computed(() => {
    return usageRecords.value
      .slice()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
  })
  
  // 方法
  const addUsageRecord = (toolData) => {
    const record = {
      id: generateId(),
      toolType: toolData.toolType,
      toolName: toolData.toolName,
      duration: toolData.duration || 0, // 使用时长（分钟）
      effectiveness: toolData.effectiveness || null, // 效果评分 1-5
      mood: toolData.mood || null, // 使用前后心情
      notes: toolData.notes || '',
      timestamp: new Date().toISOString(),
      settings: toolData.settings || {} // 工具特定设置
    }
    
    usageRecords.value.push(record)
    updateToolStats(toolData.toolType)
    return record
  }
  
  const updateUsageRecord = (recordId, updates) => {
    const index = usageRecords.value.findIndex(r => r.id === recordId)
    if (index > -1) {
      usageRecords.value[index] = { ...usageRecords.value[index], ...updates }
      updateToolStats(usageRecords.value[index].toolType)
    }
  }
  
  const updateToolStats = (toolType) => {
    const records = usageRecords.value.filter(r => r.toolType === toolType)
    
    toolStats.value[toolType] = {
      totalUsage: records.length,
      totalDuration: records.reduce((sum, r) => sum + (r.duration || 0), 0),
      averageDuration: records.length > 0 ? 
        Math.round(records.reduce((sum, r) => sum + (r.duration || 0), 0) / records.length) : 0,
      averageEffectiveness: records.filter(r => r.effectiveness).length > 0 ?
        Math.round(records.filter(r => r.effectiveness).reduce((sum, r) => sum + r.effectiveness, 0) / records.filter(r => r.effectiveness).length * 10) / 10 : 0,
      lastUsed: records.length > 0 ? 
        records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp : null,
      streak: calculateStreak(toolType)
    }
  }
  
  const calculateStreak = (toolType) => {
    const records = usageRecords.value
      .filter(r => r.toolType === toolType)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    
    if (records.length === 0) return 0
    
    const dates = new Set()
    records.forEach(record => {
      const date = new Date(record.timestamp).toDateString()
      dates.add(date)
    })
    
    const sortedDates = Array.from(dates).sort((a, b) => new Date(b) - new Date(a))
    let streak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = sortedDates[i]
      
      if (i === 0) {
        // 第一个日期必须是今天或昨天
        if (currentDate === today || currentDate === yesterday) {
          streak = 1
        } else {
          break
        }
      } else {
        // 检查是否连续
        const prevDate = new Date(sortedDates[i - 1])
        const currDate = new Date(currentDate)
        const diffTime = prevDate.getTime() - currDate.getTime()
        const diffDays = diffTime / (1000 * 60 * 60 * 24)
        
        if (diffDays === 1) {
          streak++
        } else {
          break
        }
      }
    }
    
    return streak
  }
  
  const getToolStats = (toolType) => {
    return toolStats.value[toolType] || {
      totalUsage: 0,
      totalDuration: 0,
      averageDuration: 0,
      averageEffectiveness: 0,
      lastUsed: null,
      streak: 0
    }
  }
  
  const getUsageHistory = (toolType, limit = 10) => {
    return usageRecords.value
      .filter(r => r.toolType === toolType)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  }
  
  const exportUsageData = () => {
    return {
      usageRecords: usageRecords.value,
      toolStats: toolStats.value,
      summary: {
        totalUsageTime: totalUsageTime.value,
        totalUsageCount: totalUsageCount.value,
        consecutiveDays: consecutiveDays.value
      },
      exportDate: new Date().toISOString()
    }
  }
  
  const clearUsageData = () => {
    usageRecords.value = []
    toolStats.value = {}
  }
  
  // 迁移localStorage数据的方法
  const migrateFromLocalStorage = () => {
    const localStorageKeys = [
      'timeMatrixTasks',
      'taskBreakdownProjects',
      'breathingRecords',
      'meditationRecords'
    ]
    
    let migratedCount = 0
    
    localStorageKeys.forEach(key => {
      const data = localStorage.getItem(key)
      if (data) {
        try {
          const parsed = JSON.parse(data)
          
          // 根据不同的数据类型进行迁移
          switch (key) {
            case 'timeMatrixTasks':
              migrateTimeMatrixData(parsed)
              break
            case 'taskBreakdownProjects':
              migrateTaskBreakdownData(parsed)
              break
            case 'breathingRecords':
              migrateBreathingData(parsed)
              break
            case 'meditationRecords':
              migrateMeditationData(parsed)
              break
          }
          
          migratedCount++
        } catch (error) {
          console.error(`迁移数据失败: ${key}`, error)
        }
      }
    })
    
    return migratedCount
  }
  
  const migrateTimeMatrixData = (data) => {
    // 将时间矩阵数据转换为使用记录
    Object.entries(data).forEach(([quadrant, tasks]) => {
      tasks.forEach(task => {
        if (task.completed) {
          addUsageRecord({
            toolType: 'stress-management',
            toolName: '时间管理矩阵',
            duration: 15, // 假设使用时长
            notes: `完成任务: ${task.content}`,
            settings: { quadrant, taskId: task.id }
          })
        }
      })
    })
  }
  
  const migrateTaskBreakdownData = (data) => {
    // 将任务分解数据转换为使用记录
    data.forEach(project => {
      if (project.subtasks) {
        const completedTasks = project.subtasks.filter(task => task.completed)
        if (completedTasks.length > 0) {
          addUsageRecord({
            toolType: 'stress-management',
            toolName: '任务分解',
            duration: completedTasks.length * 5, // 假设每个任务5分钟
            notes: `完成项目: ${project.name}`,
            settings: { projectId: project.id, completedTasks: completedTasks.length }
          })
        }
      }
    })
  }
  
  const migrateBreathingData = (data) => {
    // 迁移呼吸练习数据
    data.forEach(record => {
      addUsageRecord({
        toolType: 'breathing',
        toolName: '呼吸练习',
        duration: record.duration || 5,
        effectiveness: record.rating,
        notes: record.notes || '',
        timestamp: record.timestamp || new Date().toISOString(),
        settings: { pattern: record.pattern }
      })
    })
  }
  
  const migrateMeditationData = (data) => {
    // 迁移冥想数据
    data.forEach(record => {
      addUsageRecord({
        toolType: 'meditation',
        toolName: '正念冥想',
        duration: record.duration || 10,
        effectiveness: record.rating,
        notes: record.notes || '',
        timestamp: record.timestamp || new Date().toISOString(),
        settings: { theme: record.theme }
      })
    })
  }
  
  // 工具函数
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
  
  // 初始化时尝试迁移数据
  const initializeStore = () => {
    if (usageRecords.value.length === 0) {
      const migratedCount = migrateFromLocalStorage()
      if (migratedCount > 0) {
        console.log(`成功迁移 ${migratedCount} 个数据源到统一管理`)
      }
    }
  }
  
  return {
    // 状态
    usageRecords,
    toolStats,
    
    // 计算属性
    totalUsageTime,
    totalUsageCount,
    consecutiveDays,
    toolUsageStats,
    recentUsage,
    
    // 方法
    addUsageRecord,
    updateUsageRecord,
    getToolStats,
    getUsageHistory,
    exportUsageData,
    clearUsageData,
    migrateFromLocalStorage,
    initializeStore
  }
}, {
  persist: true
})
