<template>
  <div class="help-page">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><QuestionFilled /></el-icon>
            帮助中心
          </h1>
          <p class="page-desc">常见问题解答和使用指南</p>
        </div>
        
        <div class="help-container">
          <!-- 搜索区域 -->
          <div class="search-section">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索帮助内容..."
              @input="searchHelp"
              class="search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          
          <!-- 帮助分类 -->
          <div class="help-categories">
            <div class="category-card" @click="selectCategory('getting-started')">
              <div class="category-icon">
                <el-icon><Star /></el-icon>
              </div>
              <h3>快速开始</h3>
              <p>了解如何开始使用向阳而生</p>
            </div>
            
            <div class="category-card" @click="selectCategory('features')">
              <div class="category-icon">
                <el-icon><Tools /></el-icon>
              </div>
              <h3>功能使用</h3>
              <p>学习各项功能的使用方法</p>
            </div>
            
            <div class="category-card" @click="selectCategory('privacy')">
              <div class="category-icon">
                <el-icon><Lock /></el-icon>
              </div>
              <h3>隐私安全</h3>
              <p>了解数据保护和隐私设置</p>
            </div>
            
            <div class="category-card" @click="selectCategory('troubleshooting')">
              <div class="category-icon">
                <el-icon><Warning /></el-icon>
              </div>
              <h3>问题解决</h3>
              <p>常见问题的解决方案</p>
            </div>
          </div>
          
          <!-- 帮助内容 -->
          <div class="help-content">
            <div class="content-section" v-if="selectedCategory === 'getting-started'">
              <h2 class="content-title">快速开始指南</h2>
              
              <div class="faq-list">
                <div class="faq-item">
                  <h3 class="faq-question">如何开始使用向阳而生？</h3>
                  <div class="faq-answer">
                    <p>1. 首次使用时会看到欢迎页面，了解产品理念</p>
                    <p>2. 设置你的匿名昵称和头像</p>
                    <p>3. 开始记录你的情绪状态</p>
                    <p>4. 探索各种自助工具和社区功能</p>
                  </div>
                </div>
                
                <div class="faq-item">
                  <h3 class="faq-question">为什么选择匿名使用？</h3>
                  <div class="faq-answer">
                    <p>匿名使用可以让你更自由地表达内心感受，不用担心被他人发现或评判。我们承诺保护你的隐私，所有数据都存储在本地。</p>
                  </div>
                </div>
                
                <div class="faq-item">
                  <h3 class="faq-question">如何获得最佳体验？</h3>
                  <div class="faq-answer">
                    <p>• 每天记录情绪状态，了解自己的情绪模式</p>
                    <p>• 定期使用呼吸练习和冥想工具</p>
                    <p>• 积极参与社区讨论，获得同伴支持</p>
                    <p>• 查看情绪图谱，追踪成长变化</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="content-section" v-if="selectedCategory === 'features'">
              <h2 class="content-title">功能使用指南</h2>
              
              <div class="feature-guide">
                <div class="guide-item">
                  <h3>情绪记录</h3>
                  <p>选择当前的情绪状态，设置强度，记录触发因素和感受。这些数据会帮助你更好地了解自己的情绪模式。</p>
                </div>
                
                <div class="guide-item">
                  <h3>呼吸练习</h3>
                  <p>选择适合的呼吸模式，跟随动画指导进行练习。建议每天练习5-10分钟，有助于缓解焦虑和压力。</p>
                </div>
                
                <div class="guide-item">
                  <h3>社区互助</h3>
                  <p>在匿名树洞分享心情，加入互助小组讨论，获得同龄人的理解和支持。记住保持友善和尊重。</p>
                </div>
                
                <div class="guide-item">
                  <h3>成长记录</h3>
                  <p>查看情绪变化趋势，了解自己的成长历程。定期回顾可以帮助你发现进步和需要改进的地方。</p>
                </div>
              </div>
            </div>
            
            <div class="content-section" v-if="selectedCategory === 'privacy'">
              <h2 class="content-title">隐私与安全</h2>
              
              <div class="privacy-info">
                <div class="privacy-item">
                  <h3>数据存储</h3>
                  <p>所有数据都存储在您的设备本地，不会上传到任何服务器。您可以随时导出或删除数据。</p>
                </div>
                
                <div class="privacy-item">
                  <h3>匿名保护</h3>
                  <p>在社区中使用匿名身份，保护您的真实身份。我们不会收集任何个人身份信息。</p>
                </div>
                
                <div class="privacy-item">
                  <h3>数据安全</h3>
                  <p>数据经过加密存储，只有您自己可以访问。我们采用行业标准的安全措施保护您的数据。</p>
                </div>
                
                <div class="privacy-item">
                  <h3>权限管理</h3>
                  <p>应用只请求必要的权限，您可以随时在设置中管理权限。我们遵循最小权限原则。</p>
                </div>
              </div>
            </div>
            
            <div class="content-section" v-if="selectedCategory === 'troubleshooting'">
              <h2 class="content-title">常见问题解决</h2>
              
              <div class="troubleshooting-list">
                <div class="trouble-item">
                  <h3>应用运行缓慢怎么办？</h3>
                  <p>• 清理浏览器缓存</p>
                  <p>• 关闭不必要的标签页</p>
                  <p>• 重启浏览器</p>
                  <p>• 检查网络连接</p>
                </div>
                
                <div class="trouble-item">
                  <h3>数据丢失了怎么办？</h3>
                  <p>• 检查浏览器是否启用了本地存储</p>
                  <p>• 查看是否有数据备份</p>
                  <p>• 联系技术支持</p>
                </div>
                
                <div class="trouble-item">
                  <h3>无法保存设置？</h3>
                  <p>• 检查浏览器权限设置</p>
                  <p>• 确保有足够的存储空间</p>
                  <p>• 尝试重新登录</p>
                </div>
                
                <div class="trouble-item">
                  <h3>社区功能异常？</h3>
                  <p>• 刷新页面重试</p>
                  <p>• 检查网络连接</p>
                  <p>• 清除浏览器缓存</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 联系我们 -->
          <div class="contact-section">
            <h2 class="section-title">联系我们</h2>
            <div class="contact-info">
              <div class="contact-item">
                <el-icon><Message /></el-icon>
                <span>邮箱：support@xiangyang.com</span>
              </div>
              <div class="contact-item">
                <el-icon><Phone /></el-icon>
                <span>热线：400-123-4567</span>
              </div>
              <div class="contact-item">
                <el-icon><Clock /></el-icon>
                <span>服务时间：9:00-21:00</span>
              </div>
            </div>
          </div>
        </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchKeyword = ref('')
const selectedCategory = ref('getting-started')

const searchHelp = () => {
  // 搜索帮助内容的逻辑
  console.log('搜索:', searchKeyword.value)
}

const selectCategory = (category) => {
  selectedCategory.value = category
}
</script>

<style scoped lang="scss">
.help-page {
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

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

.help-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.search-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  text-align: center;
}

.search-input {
  max-width: 500px;
  margin: 0 auto;
  
  :deep(.el-input__inner) {
    border-radius: 25px;
    padding: 12px 20px;
  }
}

.help-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.category-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(255, 107, 107, 0.2);
  }
  
  .category-icon {
    color: #FF6B6B;
    margin-bottom: 20px;
    
    .el-icon {
      font-size: 40px;
    }
  }
  
  h3 {
    color: #333;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 14px;
    margin: 0;
  }
}

.help-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.content-title {
  color: #FF6B6B;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.faq-item {
  border: 1px solid #E0E0E0;
  border-radius: 15px;
  padding: 25px;
  background: #FAFAFA;
  
  .faq-question {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 15px;
  }
  
  .faq-answer {
    color: #666;
    line-height: 1.6;
    
    p {
      margin: 8px 0;
    }
  }
}

.feature-guide {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.guide-item {
  padding: 20px;
  background: #FAFAFA;
  border-radius: 15px;
  border-left: 4px solid #FF6B6B;
  
  h3 {
    color: #FF6B6B;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
}

.privacy-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.privacy-item {
  padding: 20px;
  background: #FAFAFA;
  border-radius: 15px;
  border-left: 4px solid #FF6B6B;
  
  h3 {
    color: #FF6B6B;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
    font-size: 14px;
  }
}

.troubleshooting-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.trouble-item {
  padding: 20px;
  background: #FAFAFA;
  border-radius: 15px;
  border-left: 4px solid #FF6B6B;
  
  h3 {
    color: #FF6B6B;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin: 5px 0;
    font-size: 14px;
  }
}

.contact-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  text-align: center;
}

.section-title {
  color: #FF6B6B;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 25px;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  
  .el-icon {
    color: #FF6B6B;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .help-categories {
    grid-template-columns: 1fr;
  }
  
  .privacy-info {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 15px;
  }
}
</style>

