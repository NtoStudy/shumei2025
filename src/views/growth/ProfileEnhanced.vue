<template>
  <div class="growth-profile-page">
    <div class="profile-header">
      <h1 class="page-title">
        <el-icon><User /></el-icon>
        个人成长档案
      </h1>
      <p class="page-desc">记录你的心理健康成长历程，见证每一点进步</p>
    </div>

    <!-- 个人信息卡片 -->
    <div class="profile-card">
      <div class="profile-avatar">
        <div class="avatar-display">
          {{ userStore.profile.avatar || '😊' }}
        </div>
        <el-button @click="editProfile" type="text" class="edit-avatar">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
      </div>
      
      <div class="profile-info">
        <h2 class="profile-name">{{ userStore.profile.nickname || '向阳用户' }}</h2>
        <div class="profile-meta">
          <div class="meta-item">
            <el-icon><Calendar /></el-icon>
            <span>加入时间: {{ formatDate(userStore.profile.joinDate) }}</span>
          </div>
          <div class="meta-item">
            <el-icon><Star /></el-icon>
            <span>成长等级: Lv.{{ userStore.userLevel }}</span>
          </div>
          <div class="meta-item">
            <el-icon><Trophy /></el-icon>
            <span>获得成就: {{ userStore.profile.achievements.length }} 个</span>
          </div>
        </div>
      </div>
      
      <div class="profile-stats">
        <div class="stat-item">
          <div class="stat-number">{{ emotionStore.emotions.length }}</div>
          <div class="stat-label">情绪记录</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ toolsStore.totalUsageCount }}</div>
          <div class="stat-label">工具使用</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ communityStore.userPosts.length }}</div>
          <div class="stat-label">社区互动</div>
        </div>
      </div>
    </div>

    <!-- 成就徽章 -->
    <div class="achievements-section">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><Medal /></el-icon>
          成就徽章
        </h3>
        <el-button @click="viewAllAchievements" type="text" size="small">
          查看全部
        </el-button>
      </div>
      
      <div class="achievements-grid">
        <div 
          v-for="achievement in achievements" 
          :key="achievement.id"
          class="achievement-card"
          :class="{ unlocked: achievement.unlocked }"
          @click="showAchievementDetail(achievement)"
        >
          <div class="achievement-icon">
            {{ achievement.icon }}
          </div>
          <div class="achievement-info">
            <h4 class="achievement-name">{{ achievement.name }}</h4>
            <p class="achievement-desc">{{ achievement.description }}</p>
            <div class="achievement-progress" v-if="!achievement.unlocked">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${achievement.progress}%` }"
                ></div>
              </div>
              <span class="progress-text">{{ achievement.progress }}%</span>
            </div>
            <div class="achievement-date" v-if="achievement.unlocked">
              获得于 {{ formatDate(achievement.unlockedAt) }}
            </div>
          </div>
          <div class="achievement-badge" v-if="achievement.unlocked">
            <el-icon><Check /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人数据统计 -->
    <div class="personal-stats">
      <h3 class="section-title">
        <el-icon><DataAnalysis /></el-icon>
        个人数据统计
      </h3>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <h4>情绪健康度</h4>
            <el-icon><Sunny /></el-icon>
          </div>
          <div class="stat-content">
            <div class="health-score">
              <div class="score-circle" :style="{ '--progress': emotionHealthScore }">
                <span class="score-number">{{ emotionHealthScore }}</span>
                <span class="score-unit">分</span>
              </div>
              <div class="score-desc">
                <p>基于最近情绪记录计算</p>
                <p class="score-trend">
                  <el-icon><TrendCharts /></el-icon>
                  {{ getHealthTrend() }}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h4>活跃度</h4>
            <el-icon><Lightning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="activity-chart">
              <div class="chart-placeholder">
                <div class="activity-level" :class="getActivityLevel()">
                  {{ getActivityLevelText() }}
                </div>
                <div class="activity-desc">
                  <p>最近7天平均活跃度</p>
                  <p>{{ getActivityDetails() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-header">
            <h4>学习进度</h4>
            <el-icon><Reading /></el-icon>
          </div>
          <div class="stat-content">
            <div class="learning-progress">
              <div class="progress-items">
                <div class="progress-item">
                  <span class="item-label">工具掌握</span>
                  <div class="item-progress">
                    <el-progress 
                      :percentage="toolMasteryProgress" 
                      :stroke-width="8"
                      color="#10B981"
                    />
                  </div>
                </div>
                <div class="progress-item">
                  <span class="item-label">知识学习</span>
                  <div class="item-progress">
                    <el-progress 
                      :percentage="knowledgeProgress" 
                      :stroke-width="8"
                      color="#3B82F6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 个人资料编辑对话框 -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑个人资料"
      width="500px"
      class="edit-profile-dialog"
    >
      <div class="edit-form">
        <div class="form-group">
          <label>昵称</label>
          <el-input
            v-model="editForm.nickname"
            placeholder="请输入昵称"
            maxlength="20"
            show-word-limit
          />
        </div>
        
        <div class="form-group">
          <label>头像</label>
          <div class="avatar-selection">
            <div 
              v-for="avatar in avatarOptions" 
              :key="avatar"
              class="avatar-option"
              :class="{ selected: editForm.avatar === avatar }"
              @click="editForm.avatar = avatar"
            >
              {{ avatar }}
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-actions">
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" @click="saveProfile">
            <el-icon><Check /></el-icon>
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useEmotionStore } from '@/stores/emotion'
import { useToolsStore } from '@/stores/tools'
import { useCommunityStore } from '@/stores/community'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const emotionStore = useEmotionStore()
const toolsStore = useToolsStore()
const communityStore = useCommunityStore()

// 响应式数据
const showEditDialog = ref(false)
const editForm = reactive({
  nickname: '',
  avatar: ''
})

const avatarOptions = ['😊', '🌟', '🦋', '🌈', '🌸', '🌞', '💫', '🦄', '🎨', '🌺']

// 计算属性
const emotionHealthScore = computed(() => {
  if (!emotionStore.emotions.length) return 0
  
  const recentEmotions = emotionStore.emotions
    .filter(emotion => {
      const date = new Date(emotion.timestamp)
      const now = new Date()
      const daysDiff = (now - date) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    })
  
  if (!recentEmotions.length) return 0
  
  const avgIntensity = recentEmotions.reduce((sum, emotion) => sum + emotion.emotion.intensity, 0) / recentEmotions.length
  const positiveEmotions = recentEmotions.filter(emotion => 
    ['happy', 'excited', 'calm', 'relaxed'].includes(emotion.emotion.type)
  ).length
  
  const positiveRatio = positiveEmotions / recentEmotions.length
  const score = Math.round((avgIntensity * 0.6 + positiveRatio * 100 * 0.4))
  
  return Math.min(100, Math.max(0, score))
})

const achievements = computed(() => {
  const baseAchievements = [
    {
      id: 'first_emotion',
      name: '初次记录',
      description: '完成第一次情绪记录',
      icon: '🌱',
      unlocked: emotionStore.emotions.length > 0,
      progress: emotionStore.emotions.length > 0 ? 100 : 0,
      unlockedAt: emotionStore.emotions[0]?.timestamp
    },
    {
      id: 'emotion_week',
      name: '坚持一周',
      description: '连续7天记录情绪',
      icon: '📅',
      unlocked: getConsecutiveDays() >= 7,
      progress: Math.min(100, (getConsecutiveDays() / 7) * 100),
      unlockedAt: getConsecutiveDays() >= 7 ? Date.now() : null
    },
    {
      id: 'tool_master',
      name: '工具专家',
      description: '使用所有类型的工具',
      icon: '🛠️',
      unlocked: getUniqueToolsUsed().length >= 6,
      progress: (getUniqueToolsUsed().length / 6) * 100,
      unlockedAt: getUniqueToolsUsed().length >= 6 ? Date.now() : null
    },
    {
      id: 'community_helper',
      name: '社区助手',
      description: '在社区发布10次内容',
      icon: '🤝',
      unlocked: communityStore.userPosts.length >= 10,
      progress: Math.min(100, (communityStore.userPosts.length / 10) * 100),
      unlockedAt: communityStore.userPosts.length >= 10 ? Date.now() : null
    },
    {
      id: 'breathing_expert',
      name: '呼吸大师',
      description: '完成100分钟呼吸练习',
      icon: '🧘',
      unlocked: getBreathingMinutes() >= 100,
      progress: Math.min(100, (getBreathingMinutes() / 100) * 100),
      unlockedAt: getBreathingMinutes() >= 100 ? Date.now() : null
    },
    {
      id: 'emotional_stability',
      name: '情绪稳定',
      description: '连续一周情绪健康度超过80',
      icon: '🌈',
      unlocked: emotionHealthScore.value >= 80,
      progress: Math.min(100, emotionHealthScore.value),
      unlockedAt: emotionHealthScore.value >= 80 ? Date.now() : null
    }
  ]
  
  return baseAchievements
})

const toolMasteryProgress = computed(() => {
  const uniqueTools = getUniqueToolsUsed().length
  const totalTools = 6 // 假设有6种工具
  return Math.round((uniqueTools / totalTools) * 100)
})

const knowledgeProgress = computed(() => {
  // 基于用户活动计算知识学习进度
  const activities = emotionStore.emotions.length + toolsStore.totalUsageCount + communityStore.userPosts.length
  return Math.min(100, Math.round(activities / 50 * 100))
})

// 方法
const getConsecutiveDays = () => {
  // 计算连续记录天数的简化版本
  const dates = new Set()
  emotionStore.emotions.forEach(emotion => {
    const date = new Date(emotion.timestamp).toDateString()
    dates.add(date)
  })
  return dates.size
}

const getUniqueToolsUsed = () => {
  const toolTypes = new Set()
  toolsStore.usageRecords.forEach(record => {
    toolTypes.add(record.toolType)
  })
  return Array.from(toolTypes)
}

const getBreathingMinutes = () => {
  return toolsStore.usageRecords
    .filter(record => record.toolType === 'breathing')
    .reduce((total, record) => total + (record.duration || 0), 0)
}

const getHealthTrend = () => {
  // 简化的趋势计算
  if (emotionHealthScore.value >= 80) return '状态良好 ↗'
  if (emotionHealthScore.value >= 60) return '正在改善 →'
  return '需要关注 ↘'
}

const getActivityLevel = () => {
  const recentActivity = toolsStore.usageRecords.filter(record => {
    const date = new Date(record.timestamp)
    const now = new Date()
    return (now - date) <= 7 * 24 * 60 * 60 * 1000
  }).length
  
  if (recentActivity >= 10) return 'high'
  if (recentActivity >= 5) return 'medium'
  return 'low'
}

const getActivityLevelText = () => {
  const level = getActivityLevel()
  const texts = {
    'high': '非常活跃',
    'medium': '适度活跃',
    'low': '偶尔使用'
  }
  return texts[level] || '暂无数据'
}

const getActivityDetails = () => {
  const recentUsage = toolsStore.usageRecords.filter(record => {
    const date = new Date(record.timestamp)
    const now = new Date()
    return (now - date) <= 7 * 24 * 60 * 60 * 1000
  }).length
  
  return `最近7天使用了${recentUsage}次工具`
}

const formatDate = (timestamp) => {
  if (!timestamp) return '未知'
  return new Date(timestamp).toLocaleDateString('zh-CN')
}

const editProfile = () => {
  editForm.nickname = userStore.profile.nickname || ''
  editForm.avatar = userStore.profile.avatar || '😊'
  showEditDialog.value = true
}

const cancelEdit = () => {
  showEditDialog.value = false
}

const saveProfile = () => {
  if (!editForm.nickname.trim()) {
    ElMessage.warning('请输入昵称')
    return
  }
  
  userStore.updateProfile({
    nickname: editForm.nickname,
    avatar: editForm.avatar
  })
  
  ElMessage.success('个人资料更新成功！')
  showEditDialog.value = false
}

const showAchievementDetail = (achievement) => {
  if (achievement.unlocked) {
    ElMessage.success(`🎉 恭喜获得成就：${achievement.name}！`)
  } else {
    ElMessage.info(`进度：${achievement.progress}% - ${achievement.description}`)
  }
}

const viewAllAchievements = () => {
  ElMessage.info('查看全部成就功能开发中...')
}

onMounted(() => {
  // 初始化数据
  toolsStore.initializeStore()
})
</script>

<style scoped lang="scss">
.growth-profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
  
  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #6B46C1;
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

.section-title {
  color: #6B46C1;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(107, 70, 193, 0.1);
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 30px;
  
  .profile-avatar {
    text-align: center;
    
    .avatar-display {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6B46C1, #9333EA);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      margin-bottom: 10px;
    }
    
    .edit-avatar {
      color: #6B46C1;
      font-size: 14px;
    }
  }
  
  .profile-info {
    flex: 1;
    
    .profile-name {
      color: #111827;
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 15px 0;
    }
    
    .profile-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #6B7280;
        font-size: 14px;
        
        .el-icon {
          color: #6B46C1;
        }
      }
    }
  }
  
  .profile-stats {
    display: flex;
    gap: 30px;
    
    .stat-item {
      text-align: center;
      
      .stat-number {
        color: #6B46C1;
        font-size: 24px;
        font-weight: 600;
        display: block;
      }
      
      .stat-label {
        color: #6B7280;
        font-size: 12px;
        margin-top: 5px;
      }
    }
  }
}

.achievements-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(107, 70, 193, 0.1);
  margin-bottom: 30px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  border: 2px solid #E5E7EB;
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    border-color: #6B46C1;
    box-shadow: 0 8px 25px rgba(107, 70, 193, 0.15);
    transform: translateY(-2px);
  }
  
  &.unlocked {
    border-color: #10B981;
    background: #F0FDF4;
    
    .achievement-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #10B981;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
  }
  
  .achievement-icon {
    font-size: 48px;
    text-align: center;
    margin-bottom: 15px;
  }
  
  .achievement-info {
    .achievement-name {
      color: #111827;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }
    
    .achievement-desc {
      color: #6B7280;
      font-size: 14px;
      line-height: 1.5;
      margin: 0 0 15px 0;
    }
    
    .achievement-progress {
      .progress-bar {
        width: 100%;
        height: 8px;
        background: #E5E7EB;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 5px;
        
        .progress-fill {
          height: 100%;
          background: #6B46C1;
          border-radius: 4px;
          transition: width 0.3s;
        }
      }
      
      .progress-text {
        color: #6B7280;
        font-size: 12px;
      }
    }
    
    .achievement-date {
      color: #10B981;
      font-size: 12px;
      font-weight: 500;
    }
  }
}

.personal-stats {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(107, 70, 193, 0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
}

.stat-card {
  background: #F8FAFC;
  border-radius: 15px;
  padding: 25px;
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h4 {
      color: #374151;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }
    
    .el-icon {
      color: #6B46C1;
      font-size: 24px;
    }
  }
  
  .stat-content {
    .health-score {
      display: flex;
      align-items: center;
      gap: 20px;
      
      .score-circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: conic-gradient(#6B46C1 calc(var(--progress) * 1%), #E5E7EB 0);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          inset: 10px;
          border-radius: 50%;
          background: white;
        }
        
        .score-number {
          color: #6B46C1;
          font-size: 24px;
          font-weight: 600;
          z-index: 1;
        }
        
        .score-unit {
          color: #6B7280;
          font-size: 12px;
          z-index: 1;
        }
      }
      
      .score-desc {
        flex: 1;
        
        p {
          color: #6B7280;
          font-size: 14px;
          margin: 0 0 5px 0;
          
          &.score-trend {
            color: #10B981;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }
      }
    }
    
    .activity-chart {
      .chart-placeholder {
        text-align: center;
        
        .activity-level {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 10px;
          
          &.high {
            background: #D1FAE5;
            color: #065F46;
          }
          
          &.medium {
            background: #FEF3C7;
            color: #92400E;
          }
          
          &.low {
            background: #FEE2E2;
            color: #991B1B;
          }
        }
        
        .activity-desc {
          p {
            color: #6B7280;
            font-size: 14px;
            margin: 0;
          }
        }
      }
    }
    
    .learning-progress {
      .progress-items {
        display: flex;
        flex-direction: column;
        gap: 20px;
        
        .progress-item {
          .item-label {
            display: block;
            color: #374151;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
          }
          
          .item-progress {
            :deep(.el-progress-bar__outer) {
              background: #E5E7EB;
            }
          }
        }
      }
    }
  }
}

.edit-profile-dialog {
  :deep(.el-dialog) {
    border-radius: 15px;
  }
  
  .edit-form {
    .form-group {
      margin-bottom: 20px;
      
      label {
        display: block;
        color: #374151;
        font-weight: 500;
        margin-bottom: 8px;
      }
      
      .avatar-selection {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
        
        .avatar-option {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #F3F4F6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s;
          border: 2px solid transparent;
          
          &:hover {
            background: #E5E7EB;
          }
          
          &.selected {
            border-color: #6B46C1;
            background: #EDE9FE;
          }
        }
      }
    }
  }
  
  .dialog-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .growth-profile-page {
    padding: 15px;
  }
  
  .profile-header .page-title {
    font-size: 24px;
  }
  
  .profile-card {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    
    .profile-stats {
      justify-content: center;
      gap: 20px;
    }
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>
