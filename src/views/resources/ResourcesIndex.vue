<template>
  <div class="resources-page">
    <AppHeader />
    
    <div class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><Reading /></el-icon>
            专业资源
          </h1>
          <p class="page-desc">科学可靠的心理健康知识和专业资源</p>
        </div>
        
        <div class="resources-tabs">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="知识库" name="knowledge">
              <Knowledge />
            </el-tab-pane>
            <el-tab-pane label="心理测试" name="tests">
              <Tests />
            </el-tab-pane>
            <el-tab-pane label="危机干预" name="crisis">
              <Crisis />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import Knowledge from './Knowledge.vue'
import Tests from './Tests.vue'
import Crisis from './Crisis.vue'

const activeTab = ref('knowledge')

const handleTabClick = (tab) => {
  // 可以在这里添加切换标签页的逻辑
}
</script>

<style scoped lang="scss">
.resources-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 100%);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

.resources-tabs {
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
  
  .resources-tabs {
    padding: 20px;
  }
}
</style>
