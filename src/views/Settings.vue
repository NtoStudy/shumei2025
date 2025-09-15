<template>
  <div class="settings-page">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><Setting /></el-icon>
            个人设置
          </h1>
          <p class="page-desc">管理你的个人信息和偏好设置</p>
        </div>
        
        <div class="settings-container">
          <!-- 个人信息 -->
          <div class="settings-section">
            <h3 class="section-title">个人信息</h3>
            <div class="settings-card">
              <div class="avatar-section">
                <el-avatar :size="80" :src="userStore.profile.avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <el-button type="primary" @click="changeAvatar">更换头像</el-button>
              </div>
              
              <div class="form-section">
                <el-form :model="profileForm" label-width="100px">
                  <el-form-item label="昵称">
                    <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
                  </el-form-item>
                  <el-form-item label="等级">
                    <el-tag type="primary">Lv.{{ userStore.profile.level }}</el-tag>
                  </el-form-item>
                  <el-form-item label="加入时间">
                    <span>{{ formatDate(userStore.profile.joinDate) }}</span>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
          
          <!-- 偏好设置 -->
          <div class="settings-section">
            <h3 class="section-title">偏好设置</h3>
            <div class="settings-card">
              <el-form :model="preferencesForm" label-width="120px">
                <el-form-item label="主题">
                  <el-radio-group v-model="preferencesForm.theme">
                    <el-radio label="warm">温暖</el-radio>
                    <el-radio label="cool">清新</el-radio>
                    <el-radio label="dark">深色</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="语言">
                  <el-select v-model="preferencesForm.language">
                    <el-option label="简体中文" value="zh-CN" />
                    <el-option label="English" value="en-US" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="字体大小">
                  <el-radio-group v-model="preferencesForm.fontSize">
                    <el-radio label="small">小</el-radio>
                    <el-radio label="medium">中</el-radio>
                    <el-radio label="large">大</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="动画效果">
                  <el-switch v-model="preferencesForm.animationEnabled" />
                </el-form-item>
              </el-form>
            </div>
          </div>
          
          <!-- 通知设置 -->
          <div class="settings-section">
            <h3 class="section-title">通知设置</h3>
            <div class="settings-card">
              <el-form :model="notificationsForm" label-width="120px">
                <el-form-item label="情绪提醒">
                  <el-switch v-model="notificationsForm.emotionReminder" />
                  <span class="form-desc">每日提醒记录情绪</span>
                </el-form-item>
                
                <el-form-item label="社区更新">
                  <el-switch v-model="notificationsForm.communityUpdates" />
                  <span class="form-desc">社区新消息通知</span>
                </el-form-item>
                
                <el-form-item label="成就解锁">
                  <el-switch v-model="notificationsForm.achievementUnlock" />
                  <span class="form-desc">获得新成就时通知</span>
                </el-form-item>
                
                <el-form-item label="每日签到">
                  <el-switch v-model="notificationsForm.dailyCheckIn" />
                  <span class="form-desc">每日签到提醒</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          
          <!-- 隐私设置 -->
          <div class="settings-section">
            <h3 class="section-title">隐私设置</h3>
            <div class="settings-card">
              <el-form :model="privacyForm" label-width="120px">
                <el-form-item label="匿名模式">
                  <el-switch v-model="privacyForm.anonymousMode" />
                  <span class="form-desc">在社区中匿名显示</span>
                </el-form-item>
                
                <el-form-item label="数据分享">
                  <el-switch v-model="privacyForm.dataSharing" />
                  <span class="form-desc">允许匿名数据用于产品改进</span>
                </el-form-item>
                
                <el-form-item label="个人资料可见性">
                  <el-radio-group v-model="privacyForm.profileVisibility">
                    <el-radio label="private">仅自己可见</el-radio>
                    <el-radio label="friends">好友可见</el-radio>
                    <el-radio label="public">公开</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
          </div>
          
          <!-- 数据管理 -->
          <div class="settings-section">
            <h3 class="section-title">数据管理</h3>
            <div class="settings-card">
              <div class="data-actions">
                <el-button @click="exportData" class="action-btn">
                  <el-icon><Download /></el-icon>
                  导出数据
                </el-button>
                <el-button @click="importData" class="action-btn">
                  <el-icon><Upload /></el-icon>
                  导入数据
                </el-button>
                <el-button @click="clearData" type="danger" class="action-btn">
                  <el-icon><Delete /></el-icon>
                  清除所有数据
                </el-button>
              </div>
              <p class="data-desc">所有数据都存储在您的设备本地，您可以随时导出或清除</p>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button @click="resetSettings" class="reset-btn">
              <el-icon><Refresh /></el-icon>
              重置设置
            </el-button>
            <el-button type="primary" @click="saveSettings" class="save-btn">
              <el-icon><Check /></el-icon>
              保存设置
            </el-button>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const settingsStore = useSettingsStore()

// 表单数据
const profileForm = reactive({
  nickname: '',
  avatar: ''
})

const preferencesForm = reactive({
  theme: 'warm',
  language: 'zh-CN',
  fontSize: 'medium',
  animationEnabled: true
})

const notificationsForm = reactive({
  emotionReminder: true,
  communityUpdates: true,
  achievementUnlock: true,
  dailyCheckIn: true
})

const privacyForm = reactive({
  anonymousMode: true,
  dataSharing: false,
  profileVisibility: 'private'
})

// 初始化表单数据
const initForms = () => {
  profileForm.nickname = userStore.profile.nickname
  profileForm.avatar = userStore.profile.avatar
  
  preferencesForm.theme = settingsStore.theme
  preferencesForm.language = settingsStore.language
  preferencesForm.fontSize = settingsStore.appSettings.fontSize
  preferencesForm.animationEnabled = settingsStore.appSettings.animationEnabled
  
  notificationsForm.emotionReminder = settingsStore.notifications.emotionReminder
  notificationsForm.communityUpdates = settingsStore.notifications.communityUpdates
  notificationsForm.achievementUnlock = settingsStore.notifications.achievementUnlock
  notificationsForm.dailyCheckIn = settingsStore.notifications.dailyCheckIn
  
  privacyForm.anonymousMode = settingsStore.privacy.anonymousMode
  privacyForm.dataSharing = settingsStore.privacy.dataSharing
  privacyForm.profileVisibility = settingsStore.privacy.profileVisibility
}

const changeAvatar = () => {
  ElMessage.info('头像更换功能开发中...')
}

const formatDate = (date) => {
  if (!date) return '未知'
  return new Date(date).toLocaleDateString('zh-CN')
}

const saveSettings = () => {
  // 保存用户信息
  userStore.updateProfile({
    nickname: profileForm.nickname,
    avatar: profileForm.avatar
  })
  
  // 保存偏好设置
  settingsStore.updateTheme(preferencesForm.theme)
  settingsStore.updateLanguage(preferencesForm.language)
  settingsStore.updateAppSettings({
    fontSize: preferencesForm.fontSize,
    animationEnabled: preferencesForm.animationEnabled
  })
  
  // 保存通知设置
  settingsStore.updateNotifications(notificationsForm)
  
  // 保存隐私设置
  settingsStore.updatePrivacy(privacyForm)
  
  ElMessage.success('设置保存成功！')
}

const resetSettings = () => {
  ElMessageBox.confirm('确定要重置所有设置吗？', '确认重置', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    settingsStore.resetSettings()
    initForms()
    ElMessage.success('设置已重置')
  })
}

const exportData = () => {
  const userData = {
    profile: userStore.profile,
    settings: settingsStore.exportSettings()
  }
  
  const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `向阳而生-数据备份-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('数据导出成功！')
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          // 这里可以添加数据导入逻辑
          ElMessage.success('数据导入成功！')
        } catch (error) {
          ElMessage.error('数据格式错误，导入失败')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

const clearData = () => {
  ElMessageBox.confirm('确定要清除所有数据吗？此操作不可恢复！', '确认清除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    userStore.resetProfile()
    settingsStore.resetSettings()
    initForms()
    ElMessage.success('数据已清除')
  })
}

onMounted(() => {
  initForms()
})
</script>

<style scoped lang="scss">
.settings-page {
  // Layout styles moved to DefaultLayout component
}

.page-header {
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

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.settings-section {
  .section-title {
    color: #FF6B6B;
    margin-bottom: 15px;
    font-size: 20px;
    font-weight: 600;
  }
}

.settings-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E0E0E0;
}

.form-section {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.form-desc {
  color: #999;
  font-size: 12px;
  margin-left: 10px;
}

.data-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.data-desc {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.reset-btn {
  color: #666;
  border-color: #E0E0E0;
  
  &:hover {
    color: #FF6B6B;
    border-color: #FF6B6B;
  }
}

.save-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 12px 30px;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .data-actions {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>
