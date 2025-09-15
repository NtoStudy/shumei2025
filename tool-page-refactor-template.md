# 工具页面重构模板

## 需要重构的页面
- Cognition.vue
- Relaxation.vue  
- StressManagement.vue
- EmotionRegulation.vue

## 重构步骤

### 1. 移除Layout相关代码

**原来的结构：**
```vue
<template>
  <div class="tool-page">
    <AppHeader />
    
    <div class="main-content">
      <div class="content-container">
        <!-- 页面内容 -->
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>
```

**重构后的结构：**
```vue
<template>
  <div class="tool-page">
    <div class="page-header">
      <BackButton />
      <h1 class="page-title">
        <el-icon><ToolIcon /></el-icon>
        工具名称
      </h1>
      <p class="page-desc">工具描述</p>
    </div>
    
    <!-- 页面内容 -->
  </div>
</template>
```

### 2. 更新Script部分

**移除：**
```javascript
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'
```

**添加：**
```javascript
import BackButton from '@/components/common/BackButton.vue'
```

### 3. 更新样式

**移除：**
```scss
.tool-page {
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
```

**替换为：**
```scss
.tool-page {
  // Layout styles moved to ToolLayout component
}
```

## 已完成重构的页面
✅ Breathing.vue
✅ Meditation.vue

## 路径变更
原路径：/tools/breathing
新路径：/tool/breathing
