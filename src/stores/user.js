import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const profile = ref({
    nickname: '',
    avatar: '',
    joinDate: null,
    level: 1,
    achievements: []
  })
  
  const preferences = ref({
    theme: 'warm',
    notifications: true,
    privacy: 'anonymous'
  })

  // 计算属性
  const isFirstTime = computed(() => {
    const isFirst = !profile.value.nickname
    console.log('检查首次使用状态:', {
      nickname: profile.value.nickname,
      isFirstTime: isFirst
    })
    return isFirst
  })
  const userLevel = computed(() => profile.value.level)

  // 方法
  const updateProfile = (newProfile) => {
    profile.value = { ...profile.value, ...newProfile }
  }

  const updatePreferences = (newPreferences) => {
    preferences.value = { ...preferences.value, ...newPreferences }
  }

  const addAchievement = (achievement) => {
    if (!profile.value.achievements.includes(achievement)) {
      profile.value.achievements.push(achievement)
    }
  }

  const resetProfile = () => {
    profile.value = {
      nickname: '',
      avatar: '',
      joinDate: null,
      level: 1,
      achievements: []
    }
  }

  return {
    profile,
    preferences,
    isFirstTime,
    userLevel,
    updateProfile,
    updatePreferences,
    addAchievement,
    resetProfile
  }
}, {
  persist: true
})
