<template>
  <div class="emotion-page">
    <AppHeader />
    
    <div class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><Sunny /></el-icon>
            情绪记录
          </h1>
          <p class="page-desc">记录你的情绪变化，了解自己的心理状态</p>
        </div>
        
        <div class="emotion-tabs">
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="情绪日记" name="diary">
              <EmotionDiary />
            </el-tab-pane>
            <el-tab-pane label="情绪图谱" name="chart">
              <EmotionChart />
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
import { useRouter } from 'vue-router'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import EmotionDiary from './EmotionDiary.vue'
import EmotionChart from './EmotionChart.vue'

const router = useRouter()
const activeTab = ref('diary')

const handleTabClick = (tab) => {
  // 可以在这里添加切换标签页的逻辑
}
</script>

<style scoped lang="scss">
.emotion-page {
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

.emotion-tabs {
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
  
  .emotion-tabs {
    padding: 20px;
  }
}
</style>
