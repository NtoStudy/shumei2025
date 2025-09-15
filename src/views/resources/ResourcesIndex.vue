<template>
  <div class="resources-page">
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
        </el-tab-pane>
        <el-tab-pane label="心理测试" name="tests">
        </el-tab-pane>
        <el-tab-pane label="危机干预" name="crisis">
        </el-tab-pane>
      </el-tabs>
      
      <!-- 子路由内容显示区域 -->
      <div class="tab-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeTab = ref('knowledge')

// 监听路由变化，更新活跃标签
watch(() => route.path, (newPath) => {
  if (newPath.includes('/resources/knowledge')) {
    activeTab.value = 'knowledge'
  } else if (newPath.includes('/resources/tests')) {
    activeTab.value = 'tests'
  } else if (newPath.includes('/resources/crisis')) {
    activeTab.value = 'crisis'
  }
}, { immediate: true })

const handleTabClick = (tab) => {
  // 根据标签切换路由
  router.push(`/resources/${tab.paneName}`)
}

// 组件挂载时设置正确的活跃标签
onMounted(() => {
  const currentPath = route.path
  if (currentPath.includes('/resources/tests')) {
    activeTab.value = 'tests'
  } else if (currentPath.includes('/resources/crisis')) {
    activeTab.value = 'crisis'
  } else {
    activeTab.value = 'knowledge'
  }
})
</script>

<style scoped lang="scss">
.resources-page {
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
  
  .tab-content {
    margin-top: 20px;
    min-height: 400px; // 确保有足够的高度显示内容
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
