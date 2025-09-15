<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- 个人信息概览 -->
      <div class="profile-overview">
        <div class="profile-header">
          <div class="avatar-section">
            <el-avatar :size="80" :src="userStore.profile.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="user-info">
              <h2 class="username">{{ userStore.profile.nickname || '匿名用户' }}</h2>
              <p class="user-level">Lv.{{ userStore.profile.level }}</p>
              <p class="join-date">加入时间：{{ formatDate(userStore.profile.joinDate) }}</p>
            </div>
          </div>
          <div class="achievement-badges">
            <h3>成就徽章</h3>
            <div class="badges-list">
              <div 
                v-for="achievement in achievements" 
                :key="achievement.id"
                class="badge-item"
                :class="{ earned: userStore.profile.achievements.includes(achievement.id) }"
              >
                <el-icon><component :is="achievement.icon" /></el-icon>
                <span>{{ achievement.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 成长统计 -->
      <div class="growth-stats">
        <h3 class="section-title">成长统计</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Sunny /></el-icon>
            </div>
            <div class="stat-content">
              <h4>情绪记录</h4>
              <p class="stat-number">{{ emotionStore.emotions.length }}</p>
              <p class="stat-desc">条记录</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="stat-content">
              <h4>练习时长</h4>
              <p class="stat-number">{{ totalPracticeTime }}</p>
              <p class="stat-desc">分钟</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-content">
              <h4>连续天数</h4>
              <p class="stat-number">{{ consecutiveDays }}</p>
              <p class="stat-desc">天</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <div class="stat-content">
              <h4>社区互动</h4>
              <p class="stat-number">{{ communityStore.userPosts.length }}</p>
              <p class="stat-desc">次</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 成长时间线 -->
      <div class="growth-timeline">
        <h3 class="section-title">成长时间线</h3>
        <div class="timeline-container">
          <div 
            v-for="milestone in milestones" 
            :key="milestone.id"
            class="timeline-item"
            :class="{ completed: milestone.completed }"
          >
            <div class="timeline-marker">
              <el-icon><component :is="milestone.icon" /></el-icon>
            </div>
            <div class="timeline-content">
              <h4>{{ milestone.title }}</h4>
              <p>{{ milestone.description }}</p>
              <span class="timeline-date">{{ milestone.date }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 目标设定 -->
      <div class="goals-section">
        <h3 class="section-title">我的目标</h3>
        <div class="goals-container">
          <div class="add-goal">
            <el-input
              v-model="newGoal"
              placeholder="设定一个新的目标..."
              @keyup.enter="addGoal"
            >
              <template #append>
                <el-button @click="addGoal" type="primary">添加</el-button>
              </template>
            </el-input>
          </div>
          <div class="goals-list">
            <div 
              v-for="goal in goals" 
              :key="goal.id"
              class="goal-item"
              :class="{ completed: goal.completed }"
            >
              <div class="goal-content">
                <el-checkbox 
                  v-model="goal.completed" 
                  @change="toggleGoal(goal.id)"
                />
                <span class="goal-text">{{ goal.text }}</span>
              </div>
              <div class="goal-actions">
                <el-button 
                  type="text" 
                  @click="deleteGoal(goal.id)"
                  class="delete-btn"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useEmotionStore } from '@/stores/emotion'
import { useCommunityStore } from '@/stores/community'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const emotionStore = useEmotionStore()
const communityStore = useCommunityStore()

// 成就数据
const achievements = ref([
  { id: 'first_emotion', name: '首次记录', icon: 'Sunny' },
  { id: 'week_streak', name: '连续一周', icon: 'Calendar' },
  { id: 'month_streak', name: '连续一月', icon: 'Trophy' },
  { id: 'first_breathing', name: '呼吸练习', icon: 'WindPower' },
  { id: 'first_meditation', name: '冥想入门', icon: 'Headset' },
  { id: 'community_helper', name: '社区助手', icon: 'ChatDotRound' },
  { id: 'data_analyst', name: '数据分析师', icon: 'TrendCharts' },
  { id: 'goal_achiever', name: '目标达成者', icon: 'Star' }
])

// 成长里程碑
const milestones = ref([
  {
    id: 1,
    title: '加入向阳而生',
    description: '开始你的心理健康之旅',
    date: '2024-12-19',
    completed: true,
    icon: 'Sunny'
  },
  {
    id: 2,
    title: '首次情绪记录',
    description: '记录下你的第一个情绪状态',
    date: '2024-12-19',
    completed: emotionStore.emotions.length > 0,
    icon: 'Edit'
  },
  {
    id: 3,
    title: '完成第一次呼吸练习',
    description: '学会使用呼吸练习来调节情绪',
    date: '待完成',
    completed: false,
    icon: 'WindPower'
  },
  {
    id: 4,
    title: '连续记录一周',
    description: '坚持每天记录情绪状态',
    date: '待完成',
    completed: false,
    icon: 'Calendar'
  },
  {
    id: 5,
    title: '参与社区讨论',
    description: '在社区中分享或帮助他人',
    date: '待完成',
    completed: communityStore.userPosts.length > 0,
    icon: 'ChatDotRound'
  }
])

// 目标管理
const newGoal = ref('')
const goals = ref([
  { id: 1, text: '每天记录情绪状态', completed: false },
  { id: 2, text: '每周至少进行3次呼吸练习', completed: false },
  { id: 3, text: '完成一次正念冥想', completed: false }
])

// 计算属性
const totalPracticeTime = computed(() => {
  // 这里应该从练习记录中计算总时长
  return 0
})

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

// 方法
const formatDate = (date) => {
  if (!date) return '未知'
  return new Date(date).toLocaleDateString('zh-CN')
}

const addGoal = () => {
  if (newGoal.value.trim()) {
    goals.value.push({
      id: Date.now(),
      text: newGoal.value.trim(),
      completed: false
    })
    newGoal.value = ''
    ElMessage.success('目标添加成功！')
  }
}

const toggleGoal = (goalId) => {
  const goal = goals.value.find(g => g.id === goalId)
  if (goal) {
    if (goal.completed) {
      ElMessage.success('恭喜完成目标！')
    }
  }
}

const deleteGoal = (goalId) => {
  const index = goals.value.findIndex(g => g.id === goalId)
  if (index > -1) {
    goals.value.splice(index, 1)
    ElMessage.success('目标已删除')
  }
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style scoped lang="scss">
.profile-page {
  padding: 20px 0;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-overview {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  margin-bottom: 30px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  h2 {
    color: #333;
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin: 4px 0;
    font-size: 14px;
  }
}

.achievement-badges {
  h3 {
    color: #FF6B6B;
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: 600;
  }
}

.badges-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 2px solid #E0E0E0;
  border-radius: 10px;
  background: #FAFAFA;
  transition: all 0.3s;
  
  &.earned {
    border-color: #FF6B6B;
    background: #FFF0F0;
    
    .el-icon {
      color: #FF6B6B;
    }
  }
  
  .el-icon {
    font-size: 24px;
    color: #999;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 12px;
    color: #666;
    text-align: center;
  }
}

.section-title {
  color: #FF6B6B;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.growth-stats {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
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
  border-radius: 15px;
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
  
  .stat-desc {
    color: #999;
    font-size: 12px;
    margin: 0;
  }
}

.growth-timeline {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.timeline-container {
  position: relative;
  padding-left: 30px;
  
  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #E0E0E0;
  }
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  
  &.completed {
    .timeline-marker {
      background: #FF6B6B;
      color: white;
    }
    
    .timeline-content {
      h4 {
        color: #FF6B6B;
      }
    }
  }
}

.timeline-marker {
  position: absolute;
  left: -22px;
  top: 0;
  width: 30px;
  height: 30px;
  background: #E0E0E0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  
  .el-icon {
    font-size: 16px;
  }
}

.timeline-content {
  h4 {
    color: #333;
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin: 0 0 5px 0;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .timeline-date {
    color: #999;
    font-size: 12px;
  }
}

.goals-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.add-goal {
  margin-bottom: 20px;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.goal-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #FAFAFA;
  border-radius: 10px;
  border-left: 4px solid #E0E0E0;
  
  &.completed {
    border-left-color: #FF6B6B;
    background: #FFF0F0;
    
    .goal-text {
      text-decoration: line-through;
      color: #999;
    }
  }
}

.goal-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  
  .goal-text {
    color: #333;
    font-size: 14px;
  }
}

.delete-btn {
  color: #999;
  
  &:hover {
    color: #FF6B6B;
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .avatar-section {
    justify-content: center;
    text-align: center;
  }
  
  .badges-list {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
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
