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
        <el-dropdown @command="handleCommand" trigger="click">
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
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%, 
    rgba(248, 250, 252, 0.95) 50%,
    rgba(241, 245, 249, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 107, 107, 0.4) 25%,
      rgba(135, 206, 235, 0.4) 50%,
      rgba(255, 107, 107, 0.4) 75%,
      transparent 100%
    );
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 0, 0, 0.05) 50%, 
      transparent 100%
    );
  }
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 68px;
  position: relative;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  
  .logo-icon {
    font-size: 28px;
    color: #FF6B6B;
    filter: drop-shadow(0 2px 4px rgba(255, 107, 107, 0.2));
    transition: all 0.3s ease;
    
    &:hover {
      transform: rotate(10deg) scale(1.1);
      filter: drop-shadow(0 4px 8px rgba(255, 107, 107, 0.3));
    }
  }
  
  .app-title {
    font-size: 22px;
    font-weight: 700;
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 4px rgba(255, 107, 107, 0.1);
  }
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
  
  .nav-menu-item {
    background: transparent;
    border: none;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
 
    
    :deep(.el-menu-item) {
      color: #64748b;
      font-weight: 500;
      font-size: 15px;
      margin: 0 4px;
      border-radius: 12px;
      padding: 0 16px !important;
      height: 44px !important;
      line-height: 1 !important;
      position: relative;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid transparent;
      overflow: hidden;
    
      
      * {
        display: flex !important;
        align-items: center !important;
      }
      
      .el-icon {
        margin-right: 6px !important;
        font-size: 16px;
        transition: all 0.3s ease;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      span {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      // 强制覆盖Element Plus的内部样式
      &.el-menu-item {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        
        > * {
          display: flex !important;
          align-items: center !important;
        }
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, 
          rgba(255, 107, 107, 0.1) 0%, 
          rgba(255, 142, 142, 0.05) 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 11px;
      }
      
      &:hover {
        color: #FF6B6B;
        background: linear-gradient(135deg, 
          rgba(255, 107, 107, 0.1) 0%, 
          rgba(135, 206, 235, 0.05) 100%
        );
        border-color: rgba(255, 107, 107, 0.25);
        transform: translateY(-2px);
        box-shadow: 
          0 6px 20px rgba(255, 107, 107, 0.15),
          0 2px 8px rgba(135, 206, 235, 0.1);
        
        &::before {
          opacity: 1;
        }
        
        .el-icon {
          transform: scale(1.15) rotate(5deg);
        }
      }
      
      &.is-active {
        color: #FF6B6B;
        background: linear-gradient(135deg, 
          rgba(255, 107, 107, 0.15) 0%, 
          rgba(135, 206, 235, 0.08) 100%
        );
        border-color: rgba(255, 107, 107, 0.35);
        font-weight: 600;
        box-shadow: 
          0 4px 16px rgba(255, 107, 107, 0.25),
          0 2px 8px rgba(135, 206, 235, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        position: relative;
        
        &::before {
          opacity: 1;
        }
        
        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 2px;
          background: linear-gradient(90deg, #FF6B6B, #87CEEB);
          border-radius: 1px;
        }
        
        .el-icon {
          transform: scale(1.1);
          filter: drop-shadow(0 2px 4px rgba(255, 107, 107, 0.3));
        }
      }
    }
  }
}

.user-section {
  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 10px 16px;
    border-radius: 24px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 107, 107, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .username {
      font-weight: 500;
      color: #475569;
      font-size: 14px;
    }
    
    .el-icon {
      color: #94a3b8;
      transition: all 0.3s ease;
    }
    
    &:hover .el-icon {
      color: #FF6B6B;
      transform: rotate(180deg);
    }
  }
}

// 深色模式支持
.dark-mode .app-header {
  background: linear-gradient(135deg, 
    rgba(30, 41, 59, 0.95) 0%, 
    rgba(51, 65, 85, 0.95) 50%,
    rgba(71, 85, 105, 0.95) 100%
  );
  border-bottom-color: rgba(255, 255, 255, 0.1);
  
  .nav-menu-item :deep(.el-menu-item) {
    color: #cbd5e1;
    
    &:hover, &.is-active {
      color: #FF8E8E;
    }
  }
  
  .user-section .user-info {
    background: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
    
    .username {
      color: #cbd5e1;
    }
    
    &:hover {
      background: rgba(0, 0, 0, 0.3);
      border-color: rgba(255, 142, 142, 0.3);
    }
  }
}

// 全局覆盖Element Plus菜单样式 - 多重选择器确保生效
.app-header .nav-menu :deep(.el-menu--horizontal),
.app-header .nav-menu :deep(.el-menu),
:deep(.el-menu--horizontal) {
  .el-menu-item,
  li.el-menu-item {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 44px !important;
    line-height: 1 !important;
    vertical-align: middle !important;
    
    .el-icon {
      display: flex !important;
      align-items: center !important;
      vertical-align: middle !important;
    }
    
    span {
      display: flex !important;
      align-items: center !important;
      vertical-align: middle !important;
    }
    
    // 覆盖可能的内联样式
    &[style] {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    height: 60px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .logo-section {
    gap: 8px;
    
    .logo-icon {
      font-size: 24px;
    }
    
    .app-title {
      font-size: 18px;
    }
  }
  
  .user-section .user-info {
    padding: 8px 12px;
    
    .username {
      display: none;
    }
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 12px;
  }
  
  .logo-section .app-title {
    font-size: 16px;
  }
}
</style>
