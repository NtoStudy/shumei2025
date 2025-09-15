<script setup>
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'

const userStore = useUserStore()
const settingsStore = useSettingsStore()
</script>

<template>
  <div id="app" :class="{ 'dark-mode': settingsStore.isDarkMode }">
    <router-view />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  &.dark-mode {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: #ecf0f1;
  }
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #FFB6C1;
  border-radius: 4px;
  
  &:hover {
    background: #FF6B6B;
  }
}

// Element Plus 主题定制
:root {
  --el-color-primary: #FF6B6B;
  --el-color-primary-light-3: #FF8E8E;
  --el-color-primary-light-5: #FFB6C1;
  --el-color-primary-light-7: #FFC0CB;
  --el-color-primary-light-8: #FFD1DC;
  --el-color-primary-light-9: #FFE2E7;
  --el-color-primary-dark-2: #FF5252;
}

// 动画效果
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
