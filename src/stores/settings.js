import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 状态
  const theme = ref('warm')
  const language = ref('zh-CN')
  const notifications = ref({
    emotionReminder: true,
    communityUpdates: true,
    achievementUnlock: true,
    dailyCheckIn: true
  })
  const privacy = ref({
    anonymousMode: true,
    dataSharing: false,
    profileVisibility: 'private'
  })
  const appSettings = ref({
    autoSave: true,
    darkMode: false,
    fontSize: 'medium',
    animationEnabled: true
  })

  // 计算属性
  const isDarkMode = computed(() => appSettings.value.darkMode)
  const isAnonymousMode = computed(() => privacy.value.anonymousMode)

  // 方法
  const updateTheme = (newTheme) => {
    theme.value = newTheme
  }

  const updateLanguage = (newLanguage) => {
    language.value = newLanguage
  }

  const updateNotifications = (notificationSettings) => {
    notifications.value = { ...notifications.value, ...notificationSettings }
  }

  const updatePrivacy = (privacySettings) => {
    privacy.value = { ...privacy.value, ...privacySettings }
  }

  const updateAppSettings = (settings) => {
    appSettings.value = { ...appSettings.value, ...settings }
  }

  const toggleDarkMode = () => {
    appSettings.value.darkMode = !appSettings.value.darkMode
  }

  const toggleAnonymousMode = () => {
    privacy.value.anonymousMode = !privacy.value.anonymousMode
  }

  const resetSettings = () => {
    theme.value = 'warm'
    language.value = 'zh-CN'
    notifications.value = {
      emotionReminder: true,
      communityUpdates: true,
      achievementUnlock: true,
      dailyCheckIn: true
    }
    privacy.value = {
      anonymousMode: true,
      dataSharing: false,
      profileVisibility: 'private'
    }
    appSettings.value = {
      autoSave: true,
      darkMode: false,
      fontSize: 'medium',
      animationEnabled: true
    }
  }

  const exportSettings = () => {
    return {
      theme: theme.value,
      language: language.value,
      notifications: notifications.value,
      privacy: privacy.value,
      appSettings: appSettings.value,
      exportDate: new Date().toISOString()
    }
  }

  return {
    theme,
    language,
    notifications,
    privacy,
    appSettings,
    isDarkMode,
    isAnonymousMode,
    updateTheme,
    updateLanguage,
    updateNotifications,
    updatePrivacy,
    updateAppSettings,
    toggleDarkMode,
    toggleAnonymousMode,
    resetSettings,
    exportSettings
  }
}, {
  persist: true
})
