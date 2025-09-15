<template>
  <div class="growth-page">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><TrendCharts /></el-icon>
        成长记录
      </h1>
      <p class="page-desc">追踪你的心理健康变化，见证成长历程</p>
    </div>
    
    <div class="growth-tabs">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="个人档案" name="profile">
          <Profile />
        </el-tab-pane>
        <el-tab-pane label="成长报告" name="report">
          <Report />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Profile from './Profile.vue'
import Report from './Report.vue'

const activeTab = ref('profile')

const handleTabClick = (tab) => {
  // 可以在这里添加切换标签页的逻辑
}
</script>

<style scoped lang="scss">
.growth-page {
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

.growth-tabs {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  
  :deep(.el-tabs__header) {
    margin-bottom: 30px;
  }
  
  :deep(.el-tabs__nav-wrap) {
    padding: 0 20px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 16px;
    font-weight: 500;
    color: #666;
    
    &.is-active {
      color: #FF6B6B;
    }
  }
  
  :deep(.el-tabs__active-bar) {
    background: #FF6B6B;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .growth-tabs {
    padding: 20px;
  }
}
</style>
