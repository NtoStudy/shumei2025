<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-icon">
          <el-icon><QuestionFilled /></el-icon>
        </div>
        <h1 class="error-title">404</h1>
        <h2 class="error-subtitle">页面未找到</h2>
        <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
        <div class="error-actions">
          <el-button type="primary" @click="goHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-container {
  text-align: center;
  max-width: 500px;
}

.not-found-content {
  background: white;
  padding: 60px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.error-icon {
  color: #FFB6C1;
  margin-bottom: 20px;
  
  .el-icon {
    font-size: 80px;
  }
}

.error-title {
  color: #FF6B6B;
  font-size: 72px;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1;
}

.error-subtitle {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 15px 0;
}

.error-desc {
  color: #666;
  font-size: 16px;
  margin: 0 0 30px 0;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .error-title {
    font-size: 48px;
  }
  
  .error-subtitle {
    font-size: 20px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
