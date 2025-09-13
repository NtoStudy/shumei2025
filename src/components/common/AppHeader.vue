<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <el-icon class="logo-icon"><Sunny /></el-icon>
        <h1 class="app-title">向阳而生</h1>
      </div>
      
      <nav class="nav-menu">
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect"
          class="nav-menu-item"
        >
          <el-menu-item index="/home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/emotion">
            <el-icon><Sunny /></el-icon>
            <span>情绪记录</span>
          </el-menu-item>
          <el-menu-item index="/tools">
            <el-icon><Tools /></el-icon>
            <span>自助工具</span>
          </el-menu-item>
          <el-menu-item index="/community">
            <el-icon><ChatDotRound /></el-icon>
            <span>社区</span>
          </el-menu-item>
          <el-menu-item index="/growth">
            <el-icon><TrendCharts /></el-icon>
            <span>成长记录</span>
          </el-menu-item>
          <el-menu-item index="/resources">
            <el-icon><Reading /></el-icon>
            <span>专业资源</span>
          </el-menu-item>
        </el-menu>
      </nav>
      
      <div class="user-section">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :src="userStore.profile.avatar" :size="32">
              <el-icon><User /></el-icon>
            </el-avatar>
            <span class="username">{{ userStore.profile.nickname || '匿名用户' }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item command="help">
                <el-icon><QuestionFilled /></el-icon>
                帮助
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const activeIndex = computed(() => route.path)

const handleSelect = (key) => {
  router.push(key)
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/growth/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'help':
      router.push('/help')
      break
    case 'logout':
      userStore.resetProfile()
      router.push('/')
      break
  }
}
</script>

<style scoped lang="scss">
.app-header {
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%);
  box-shadow: 0 2px 12px rgba(255, 182, 193, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .logo-icon {
    font-size: 24px;
    color: #FF6B6B;
  }
  
  .app-title {
    font-size: 20px;
    font-weight: 600;
    color: #FF6B6B;
    margin: 0;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  
  .nav-menu-item {
    background: transparent;
    border: none;
    
    :deep(.el-menu-item) {
      color: #666;
      font-weight: 500;
      
      &:hover {
        color: #FF6B6B;
        background: rgba(255, 107, 107, 0.1);
      }
      
      &.is-active {
        color: #FF6B6B;
        background: rgba(255, 107, 107, 0.1);
      }
    }
  }
}

.user-section {
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 20px;
    transition: background-color 0.3s;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .username {
      font-weight: 500;
      color: #666;
    }
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 10px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .app-title {
    font-size: 18px;
  }
}
</style>
