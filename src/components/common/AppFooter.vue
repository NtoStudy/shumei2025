<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>向阳而生</h3>
        <p>温暖、不说教、不尴尬的心理健康自助与互助平台</p>
        <div class="social-links">
          <el-icon class="social-icon"><ChatDotRound /></el-icon>
          <el-icon class="social-icon"><Message /></el-icon>
          <el-icon class="social-icon"><Share /></el-icon>
        </div>
      </div>
      
      <div class="footer-section">
        <h4>功能模块</h4>
        <ul>
          <li><router-link to="/emotion">情绪记录</router-link></li>
          <li><router-link to="/tools">自助工具</router-link></li>
          <li><router-link to="/community">社区互助</router-link></li>
          <li><router-link to="/growth">成长记录</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>专业资源</h4>
        <ul>
          <li><router-link to="/resources">知识库</router-link></li>
          <li><router-link to="/resources/tests">心理测试</router-link></li>
          <li><router-link to="/resources/crisis">危机干预</router-link></li>
          <li><router-link to="/help">帮助中心</router-link></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>联系我们</h4>
        <p>如有问题或建议，请联系我们</p>
        <p class="contact-info">
          <el-icon><Message /></el-icon>
          邮箱：support@xiangyang.com
        </p>
        <p class="contact-info">
          <el-icon><Phone /></el-icon>
          热线：400-123-4567
        </p>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2024 向阳而生. 让每一个心灵都能向阳而生</p>
      <div class="footer-links">
        <a href="#" @click.prevent>隐私政策</a>
        <a href="#" @click.prevent>用户协议</a>
        <a href="#" @click.prevent>免责声明</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// 无需额外逻辑
</script>

<style scoped lang="scss">
.app-footer {
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 100%);
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.footer-section {
  h3, h4 {
    color: #FF6B6B;
    margin-bottom: 15px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
  }
  
  ul {
    list-style: none;
    padding: 0;
    
    li {
      margin-bottom: 8px;
      
      a {
        color: #666;
        text-decoration: none;
        transition: color 0.3s;
        
        &:hover {
          color: #FF6B6B;
        }
      }
    }
  }
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  
  .social-icon {
    font-size: 20px;
    color: #FF6B6B;
    cursor: pointer;
    transition: transform 0.3s;
    
    &:hover {
      transform: scale(1.2);
    }
  }
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  margin-bottom: 8px;
  
  .el-icon {
    color: #FF6B6B;
  }
}

.footer-bottom {
  border-top: 1px solid #E0E0E0;
  padding: 20px;
  text-align: center;
  color: #666;
  
  p {
    margin-bottom: 10px;
  }
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  
  a {
    color: #666;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: #FF6B6B;
    }
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 30px 15px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
