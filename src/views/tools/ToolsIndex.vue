<template>
  <div class="tools-page">
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><Tools /></el-icon>
        自助工具
      </h1>
      <p class="page-desc">科学有效的心理调节方法，帮助你更好地管理情绪</p>
    </div>

        <div class="tools-grid">
          <div class="tool-card" @click="goToBreathing">
            <div class="tool-icon">
              <el-icon><WindPower /></el-icon>
            </div>
            <h3 class="tool-title">呼吸练习 Plus</h3>
            <p class="tool-desc">多种科学呼吸模式，统计分析，个性化设置</p>
            <div class="tool-meta">
              <span class="tool-duration">3-20分钟</span>
              <span class="tool-level">全级别</span>
            </div>
            <div class="tool-badge">增强版</div>
          </div>

          <div class="tool-card" @click="goToMeditation">
            <div class="tool-icon">
              <el-icon><Headset /></el-icon>
            </div>
            <h3 class="tool-title">正念冥想</h3>
            <p class="tool-desc">提升专注力，培养正念意识，平静内心</p>
            <div class="tool-meta">
              <span class="tool-duration">10-20分钟</span>
              <span class="tool-level">中级</span>
            </div>
          </div>

          <div class="tool-card" @click="goToCognition">
            <div class="tool-icon">
              <el-icon><Edit /></el-icon>
            </div>
            <h3 class="tool-title">认知重构</h3>
            <p class="tool-desc">识别和改变负面思维模式，建立积极认知</p>
            <div class="tool-meta">
              <span class="tool-duration">15-30分钟</span>
              <span class="tool-level">高级</span>
            </div>
          </div>

          <div class="tool-card" @click="goToRelaxation">
            <div class="tool-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <h3 class="tool-title">放松技巧</h3>
            <p class="tool-desc">肌肉放松、想象放松等实用技巧</p>
            <div class="tool-meta">
              <span class="tool-duration">10-15分钟</span>
              <span class="tool-level">初级</span>
            </div>
          </div>

          <div class="tool-card" @click="goToStressManagement">
            <div class="tool-icon">
              <el-icon><TrendCharts /></el-icon>
            </div>
            <h3 class="tool-title">压力管理</h3>
            <p class="tool-desc">时间管理、任务分解等压力缓解方法</p>
            <div class="tool-meta">
              <span class="tool-duration">20-30分钟</span>
              <span class="tool-level">中级</span>
            </div>
          </div>

          <div class="tool-card" @click="goToEmotionRegulation">
            <div class="tool-icon">
              <el-icon><Star /></el-icon>
            </div>
            <h3 class="tool-title">情绪调节</h3>
            <p class="tool-desc">针对不同情绪的具体应对策略</p>
            <div class="tool-meta">
              <span class="tool-duration">5-15分钟</span>
              <span class="tool-level">初级</span>
            </div>
          </div>
        </div>

        <!-- 使用统计 -->
        <div class="usage-stats">
          <h3 class="section-title">使用统计</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><Timer /></el-icon>
              </div>
              <div class="stat-content">
                <h4>总练习时间</h4>
                <p class="stat-number">{{ toolsStore.totalUsageTime }}</p>
                <p class="stat-desc">分钟</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><Trophy /></el-icon>
              </div>
              <div class="stat-content">
                <h4>完成次数</h4>
                <p class="stat-number">{{ toolsStore.totalUsageCount }}</p>
                <p class="stat-desc">次</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-content">
                <h4>连续天数</h4>
                <p class="stat-number">{{ toolsStore.consecutiveDays }}</p>
                <p class="stat-desc">天</p>
              </div>
            </div>
          </div>
  </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToolsStore } from '@/stores/tools'

const router = useRouter()
const toolsStore = useToolsStore()

const goToBreathing = () => {
  router.push('/tools/breathing')
}

const goToMeditation = () => {
  router.push('/tools/meditation')
}

const goToCognition = () => {
  router.push('/tools/cognition')
}

const goToRelaxation = () => {
  router.push('/tools/relaxation')
}

const goToStressManagement = () => {
  router.push('/tools/stress-management')
}

const goToEmotionRegulation = () => {
  router.push('/tools/emotion-regulation')
}

// 初始化工具数据
onMounted(() => {
  toolsStore.initializeStore()
})
</script>

<style scoped lang="scss">

.page-header {
  text-align: center;
  margin-bottom: 40px;

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

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.tool-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;

  &:hover:not(.coming-soon) {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.2);
  }

  &.coming-soon {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .tool-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    background: linear-gradient(135deg, #10B981, #34D399);
    color: white;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 500;
  }
}

.tool-icon {
  color: #FF6B6B;
  margin-bottom: 20px;

  .el-icon {
    font-size: 40px;
  }
}

.tool-title {
  color: #333;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
}

.tool-desc {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.tool-meta {
  display: flex;
  gap: 15px;

  .tool-duration,
  .tool-level {
    background: #FFB6C1;
    color: white;
    padding: 4px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
  }

  .tool-level {
    background: #87CEEB;
  }
}

.coming-soon-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #FF6B6B;
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

.usage-stats {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.section-title {
  color: #FF6B6B;
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #FAFAFA;
  border-radius: 15px;
  border-left: 4px solid #FF6B6B;
}

.stat-icon {
  color: #FF6B6B;

  .el-icon {
    font-size: 24px;
  }
}

.stat-content {
  h4 {
    color: #666;
    margin: 0 0 5px 0;
    font-size: 14px;
  }

  .stat-number {
    color: #FF6B6B;
    font-size: 24px;
    font-weight: 600;
    margin: 0;
  }

  .stat-desc {
    color: #999;
    font-size: 12px;
    margin: 0;
  }
}
</style>
