<template>
  <div class="crisis-page">
    <div class="crisis-container">
      <!-- 紧急联系信息 -->
      <div class="emergency-section">
        <div class="section-header">
          <el-icon class="header-icon"><Warning /></el-icon>
          <h2>紧急危机干预</h2>
        </div>
        
        <div class="emergency-message">
          <p>如果你或身边的人正在经历严重的心理危机，请立即寻求专业帮助。</p>
          <p class="highlight">如有自杀意念或行为，请立即拨打以下紧急电话：</p>
        </div>
        
        <div class="emergency-contacts">
          <div class="contact-card">
            <div class="contact-icon">
              <el-icon><Phone /></el-icon>
            </div>
            <div class="contact-info">
              <h3>全国心理危机干预热线</h3>
              <p class="phone-number">400-161-9995</p>
              <p>24小时服务</p>
            </div>
          </div>
          
          <div class="contact-card">
            <div class="contact-icon">
              <el-icon><Phone /></el-icon>
            </div>
            <div class="contact-info">
              <h3>全国自杀干预热线</h3>
              <p class="phone-number">800-810-1117</p>
              <p>24小时服务</p>
            </div>
          </div>
          
          <div class="contact-card">
            <div class="contact-icon">
              <el-icon><FirstAid /></el-icon>
            </div>
            <div class="contact-info">
              <h3>紧急救援</h3>
              <p class="phone-number">120 / 110</p>
              <p>医疗急救 / 警察</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 危机识别 -->
      <div class="crisis-identification-section">
        <div class="section-header">
          <el-icon class="header-icon"><Search /></el-icon>
          <h2>危机识别</h2>
        </div>
        
        <p class="section-desc">了解以下危机信号可以帮助你及时识别自己或他人的心理危机状态</p>
        
        <el-collapse>
          <el-collapse-item title="自杀风险信号" name="suicide">
            <div class="warning-signs">
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><ChatDotRound /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>言语信号</h4>
                  <ul>
                    <li>直接或间接表达想要结束生命的想法</li>
                    <li>谈论感到无望、无助或成为他人的负担</li>
                    <li>表示"很快就不会再烦恼了"或类似话语</li>
                    <li>反复谈论死亡或自杀</li>
                  </ul>
                </div>
              </div>
              
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><Opportunity /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>行为信号</h4>
                  <ul>
                    <li>赠送珍贵物品或安排后事</li>
                    <li>突然从抑郁状态转为平静</li>
                    <li>收集自杀工具（如药物、武器等）</li>
                    <li>突然疏远亲友或社交隔离</li>
                    <li>冒险行为或自我伤害行为增加</li>
                  </ul>
                </div>
              </div>
              
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><Cloudy /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>情绪信号</h4>
                  <ul>
                    <li>持续的悲伤、抑郁或绝望感</li>
                    <li>情绪剧烈波动</li>
                    <li>表现出明显的焦虑或烦躁</li>
                    <li>表现出无法承受的痛苦或内心挣扎</li>
                  </ul>
                </div>
              </div>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="抑郁危机信号" name="depression">
            <div class="warning-signs">
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><MoonNight /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>情绪变化</h4>
                  <ul>
                    <li>持续的悲伤、空虚或绝望感</li>
                    <li>对曾经喜欢的活动失去兴趣</li>
                    <li>易怒或烦躁</li>
                    <li>感到内疚或无价值感</li>
                  </ul>
                </div>
              </div>
              
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><Sunrise /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>生理变化</h4>
                  <ul>
                    <li>睡眠模式改变（失眠或睡眠过多）</li>
                    <li>食欲和体重显著变化</li>
                    <li>精力明显下降或疲劳</li>
                    <li>说话或行动速度变慢</li>
                  </ul>
                </div>
              </div>
              
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><Cpu /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>认知变化</h4>
                  <ul>
                    <li>注意力不集中或难以做决定</li>
                    <li>反复出现死亡或自杀的想法</li>
                    <li>消极思维模式</li>
                    <li>记忆力下降</li>
                  </ul>
                </div>
              </div>
            </div>
          </el-collapse-item>
          
          <el-collapse-item title="焦虑危机信号" name="anxiety">
            <div class="warning-signs">
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><Lightning /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>身体症状</h4>
                  <ul>
                    <li>心跳加速或心悸</li>
                    <li>呼吸急促或感到窒息</li>
                    <li>出汗、颤抖或发抖</li>
                    <li>胸痛或不适</li>
                    <li>头晕或眩晕</li>
                  </ul>
                </div>
              </div>
              
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><Alarm /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>恐慌发作</h4>
                  <ul>
                    <li>突然的强烈恐惧</li>
                    <li>失控或即将死亡的感觉</li>
                    <li>非现实感或与自我分离感</li>
                    <li>急性焦虑症状群发</li>
                  </ul>
                </div>
              </div>
              
              <div class="sign-item">
                <div class="sign-icon">
                  <el-icon><CircleClose /></el-icon>
                </div>
                <div class="sign-content">
                  <h4>行为改变</h4>
                  <ul>
                    <li>回避引发焦虑的情境</li>
                    <li>过度寻求安全感或保证</li>
                    <li>烦躁不安或易怒</li>
                    <li>难以放松或保持静止</li>
                  </ul>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      
      <!-- 危机干预指南 -->
      <div class="crisis-intervention-section">
        <div class="section-header">
          <el-icon class="header-icon"><Guide /></el-icon>
          <h2>危机干预指南</h2>
        </div>
        
        <p class="section-desc">以下是在面对心理危机时可以采取的步骤</p>
        
        <el-tabs>
          <el-tab-pane label="自我干预" name="self">
            <div class="intervention-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>认识危机状态</h4>
                  <p>承认并接受你正在经历心理危机。识别你的情绪、想法和身体感受，这是寻求帮助的第一步。</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>确保安全</h4>
                  <p>如果你有自伤或自杀的想法，立即采取行动确保安全：</p>
                  <ul>
                    <li>拨打危机干预热线</li>
                    <li>联系信任的亲友</li>
                    <li>去最近的急诊室</li>
                    <li>移除周围可能的危险物品</li>
                  </ul>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>使用应对技巧</h4>
                  <p>尝试以下技巧来稳定情绪：</p>
                  <ul>
                    <li>深呼吸：慢慢吸气4秒，屏住2秒，呼气6秒</li>
                    <li>5-4-3-2-1感官练习：找出5样你能看到的东西，4样你能触摸的东西，3样你能听到的声音，2样你能闻到的气味，1样你能尝到的味道</li>
                    <li>身体放松：从脚到头逐渐放松每组肌肉</li>
                  </ul>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>寻求专业帮助</h4>
                  <p>危机状态需要专业干预。联系：</p>
                  <ul>
                    <li>心理咨询师或精神科医生</li>
                    <li>危机干预热线</li>
                    <li>社区心理健康中心</li>
                    <li>医院急诊科</li>
                  </ul>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <h4>制定安全计划</h4>
                  <p>与专业人士一起制定危机安全计划，包括：</p>
                  <ul>
                    <li>识别危机触发因素和预警信号</li>
                    <li>列出有效的应对策略</li>
                    <li>准备紧急联系人清单</li>
                    <li>确定安全环境和支持资源</li>
                  </ul>
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="帮助他人" name="others">
            <div class="intervention-steps">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>识别危机信号</h4>
                  <p>留意他人的危机信号，如情绪剧烈变化、绝望言论、行为改变或自杀表达。</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>直接询问</h4>
                  <p>如果担心某人有自杀想法，直接但温和地询问。例如："你最近看起来很痛苦，你是否有过伤害自己的想法？"</p>
                  <p class="note">注意：询问自杀想法不会增加自杀风险，反而可能给对方表达痛苦的机会。</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>积极倾听</h4>
                  <p>提供无判断的倾听：</p>
                  <ul>
                    <li>给予充分关注</li>
                    <li>不打断或轻视他们的感受</li>
                    <li>避免提供简单的解决方案</li>
                    <li>表达理解和关心</li>
                    <li>肯定他们寻求帮助的勇气</li>
                  </ul>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>确保安全</h4>
                  <p>如果确认存在自杀风险：</p>
                  <ul>
                    <li>不要让对方独处</li>
                    <li>移除危险物品（药物、武器等）</li>
                    <li>联系专业危机干预服务</li>
                    <li>在必要时拨打急救电话</li>
                  </ul>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-number">5</div>
                <div class="step-content">
                  <h4>协助寻求专业帮助</h4>
                  <p>帮助对方联系专业资源：</p>
                  <ul>
                    <li>提供危机热线号码</li>
                    <li>帮助联系心理健康专业人士</li>
                    <li>必要时陪同就医</li>
                    <li>协助制定安全计划</li>
                  </ul>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 资源列表 -->
      <div class="resources-section">
        <div class="section-header">
          <el-icon class="header-icon"><Link /></el-icon>
          <h2>危机干预资源</h2>
        </div>
        
        <div class="resources-grid">
          <div class="resource-card" v-for="(resource, index) in crisisResources" :key="index">
            <div class="resource-icon">
              <el-icon><component :is="resource.icon" /></el-icon>
            </div>
            <div class="resource-content">
              <h4>{{ resource.title }}</h4>
              <p>{{ resource.description }}</p>
              <div class="resource-link">
                <a :href="resource.link" target="_blank" rel="noopener noreferrer">
                  <el-button type="primary" size="small">访问资源</el-button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 安全计划工具 -->
      <div class="safety-plan-section">
        <div class="section-header">
          <el-icon class="header-icon"><DocumentChecked /></el-icon>
          <h2>个人安全计划</h2>
        </div>
        
        <p class="section-desc">制定个人安全计划可以帮助你在危机发生时知道如何应对</p>
        
        <el-button type="primary" @click="showSafetyPlanDialog = true">创建安全计划</el-button>
        
        <el-dialog
          v-model="showSafetyPlanDialog"
          title="个人安全计划"
          width="80%"
        >
          <div class="safety-plan-form">
            <p class="form-intro">填写以下内容，创建你的个人安全计划。完成后可以保存或打印。</p>
            
            <el-form :model="safetyPlan" label-position="top">
              <el-form-item label="1. 我的危机预警信号（想法、情绪、行为等）">
                <el-input 
                  v-model="safetyPlan.warningSigns" 
                  type="textarea" 
                  :rows="3"
                  placeholder="例如：睡眠困难、食欲下降、回避社交、负面想法增加..."
                />
              </el-form-item>
              
              <el-form-item label="2. 我可以自行使用的应对策略">
                <el-input 
                  v-model="safetyPlan.copingStrategies" 
                  type="textarea" 
                  :rows="3"
                  placeholder="例如：深呼吸练习、冥想、听音乐、散步..."
                />
              </el-form-item>
              
              <el-form-item label="3. 能分散我注意力的人和地方">
                <el-input 
                  v-model="safetyPlan.distractions" 
                  type="textarea" 
                  :rows="3"
                  placeholder="例如：公园、图书馆、咖啡厅、朋友家..."
                />
              </el-form-item>
              
              <el-form-item label="4. 我可以求助的人（姓名和联系方式）">
                <el-input 
                  v-model="safetyPlan.supportPeople" 
                  type="textarea" 
                  :rows="3"
                  placeholder="例如：张三（好友）123-4567-8901、李四（家人）123-4567-8902..."
                />
              </el-form-item>
              
              <el-form-item label="5. 专业帮助联系方式">
                <el-input 
                  v-model="safetyPlan.professionals" 
                  type="textarea" 
                  :rows="3"
                  placeholder="例如：心理咨询师王医生 123-4567-8903、社区心理健康中心 123-4567-8904..."
                />
              </el-form-item>
              
              <el-form-item label="6. 紧急联系方式">
                <el-input 
                  v-model="safetyPlan.emergency" 
                  type="textarea" 
                  :rows="2"
                  placeholder="例如：全国心理危机干预热线 400-161-9995、急救电话 120..."
                />
              </el-form-item>
              
              <el-form-item label="7. 如何让我的环境更安全">
                <el-input 
                  v-model="safetyPlan.safeSurroundings" 
                  type="textarea" 
                  :rows="2"
                  placeholder="例如：移除危险物品、确保有人陪伴、避免酒精和药物..."
                />
              </el-form-item>
            </el-form>
            
            <div class="form-actions">
              <el-button @click="showSafetyPlanDialog = false">取消</el-button>
              <el-button type="primary" @click="saveSafetyPlan">保存</el-button>
              <el-button type="success" @click="printSafetyPlan">打印</el-button>
            </div>
          </div>
        </el-dialog>
        
        <div v-if="hasSavedPlan" class="saved-plan-info">
          <el-alert
            title="你已创建安全计划"
            type="success"
            :closable="false"
          >
            <template #default>
              <p>你已经创建了个人安全计划。在危机时刻，请参考你的计划采取行动。</p>
              <div class="plan-actions">
                <el-button size="small" @click="showSafetyPlanDialog = true">查看/编辑</el-button>
                <el-button size="small" type="success" @click="printSafetyPlan">打印</el-button>
              </div>
            </template>
          </el-alert>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Warning,
  Phone,
  FirstAid,
  Search,
  ChatDotRound,
  Opportunity,
  Cloudy,
  MoonNight,
  Sunrise,
  Cpu,
  Lightning,
  Alarm,
  CircleClose,
  Guide,
  Link,
  DocumentChecked,
  Promotion,
  Reading,
  OfficeBuilding,
  Headset,
  Notebook
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// 危机资源列表
const crisisResources = [
  {
    title: '中国心理学会',
    description: '提供心理健康资源、专业机构推荐和心理危机干预指南',
    icon: 'Promotion',
    link: 'https://www.cpsbeijing.org/'
  },
  {
    title: '壹心理',
    description: '在线心理咨询平台，提供专业心理咨询服务和心理健康资讯',
    icon: 'Reading',
    link: 'https://www.xinli001.com/'
  },
  {
    title: '北京心理危机研究与干预中心',
    description: '提供心理危机干预服务、培训和研究',
    icon: 'OfficeBuilding',
    link: 'http://www.crisis.org.cn/'
  },
  {
    title: '中国精神卫生协会',
    description: '提供精神健康资源和服务机构信息',
    icon: 'Headset',
    link: 'http://www.camh.org.cn/'
  },
  {
    title: '自杀干预手册',
    description: '世界卫生组织(WHO)自杀干预指南中文版',
    icon: 'Notebook',
    link: 'https://apps.who.int/iris/bitstream/handle/10665/131056/9789245548607_chi.pdf'
  }
]

// 安全计划对话框控制
const showSafetyPlanDialog = ref(false)

// 安全计划表单数据
const safetyPlan = ref({
  warningSigns: '',
  copingStrategies: '',
  distractions: '',
  supportPeople: '',
  professionals: '',
  emergency: '',
  safeSurroundings: ''
})

// 检查是否有保存的安全计划
const hasSavedPlan = ref(false)

// 保存安全计划
const saveSafetyPlan = () => {
  // 在实际应用中，这里应该将数据保存到用户的个人数据中
  // 这里简化为设置标志位
  hasSavedPlan.value = true
  
  // 保存到本地存储
  localStorage.setItem('safetyPlan', JSON.stringify(safetyPlan.value))
  
  showSafetyPlanDialog.value = false
  
  ElMessage({
    message: '安全计划已保存',
    type: 'success'
  })
}

// 打印安全计划
const printSafetyPlan = () => {
  // 创建打印内容
  const printContent = `
    <html>
    <head>
      <title>个人安全计划</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; }
        .section-content { margin-left: 20px; }
      </style>
    </head>
    <body>
      <h1>个人安全计划</h1>
      
      <div class="section">
        <div class="section-title">1. 我的危机预警信号（想法、情绪、行为等）</div>
        <div class="section-content">${safetyPlan.value.warningSigns || '未填写'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">2. 我可以自行使用的应对策略</div>
        <div class="section-content">${safetyPlan.value.copingStrategies || '未填写'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">3. 能分散我注意力的人和地方</div>
        <div class="section-content">${safetyPlan.value.distractions || '未填写'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">4. 我可以求助的人（姓名和联系方式）</div>
        <div class="section-content">${safetyPlan.value.supportPeople || '未填写'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">5. 专业帮助联系方式</div>
        <div class="section-content">${safetyPlan.value.professionals || '未填写'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">6. 紧急联系方式</div>
        <div class="section-content">${safetyPlan.value.emergency || '未填写'}</div>
      </div>
      
      <div class="section">
        <div class="section-title">7. 如何让我的环境更安全</div>
        <div class="section-content">${safetyPlan.value.safeSurroundings || '未填写'}</div>
      </div>
      
      <div style="margin-top: 40px; text-align: center;">
        <p>创建日期: ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `
  
  // 创建打印窗口
  const printWindow = window.open('', '_blank')
  printWindow.document.write(printContent)
  printWindow.document.close()
  
  // 等待资源加载完成后打印
  printWindow.onload = function() {
    printWindow.print()
  }
}

// 在组件挂载时检查是否有保存的安全计划
onMounted(() => {
  const savedPlan = localStorage.getItem('safetyPlan')
  if (savedPlan) {
    safetyPlan.value = JSON.parse(savedPlan)
    hasSavedPlan.value = true
  }
})
</script>

<style scoped lang="scss">
.crisis-page {
  padding: 2rem 0;
}

.crisis-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  
  .header-icon {
    font-size: 24px;
    color: #e74c3c;
    margin-right: 0.5rem;
  }
  
  h2 {
    font-size: 1.8rem;
    color: #2c3e50;
    margin: 0;
  }
}

.section-desc {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

/* 紧急联系信息样式 */
.emergency-section {
  background-color: #fef2f2;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.emergency-message {
  margin-bottom: 1.5rem;
  
  p {
    font-size: 1.1rem;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }
  
  .highlight {
    font-weight: bold;
    color: #e53e3e;
  }
}

.emergency-contacts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.contact-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .contact-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fed7d7;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    
    .el-icon {
      font-size: 24px;
      color: #e53e3e;
    }
  }
  
  .contact-info {
    h3 {
      font-size: 1.1rem;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }
    
    .phone-number {
      font-size: 1.3rem;
      font-weight: bold;
      color: #e53e3e;
      margin-bottom: 0.3rem;
    }
    
    p {
      color: #718096;
      margin: 0;
    }
  }
}

/* 危机识别样式 */
.crisis-identification-section {
  margin-bottom: 3rem;
}

.warning-signs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sign-item {
  display: flex;
  
  .sign-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e6f7ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
    
    .el-icon {
      font-size: 20px;
      color: #1890ff;
    }
  }
  
  .sign-content {
    h4 {
      font-size: 1.1rem;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }
    
    ul {
      padding-left: 1.5rem;
      margin: 0;
      
      li {
        margin-bottom: 0.5rem;
        color: #4a5568;
      }
    }
  }
}

/* 危机干预指南样式 */
.crisis-intervention-section {
  margin-bottom: 3rem;
}

.intervention-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-item {
  display: flex;
  
  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #4299e1;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    font-weight: bold;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .step-content {
    h4 {
      font-size: 1.1rem;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }
    
    p {
      color: #4a5568;
      margin-bottom: 0.5rem;
    }
    
    ul {
      padding-left: 1.5rem;
      
      li {
        margin-bottom: 0.5rem;
        color: #4a5568;
      }
    }
    
    .note {
      font-style: italic;
      color: #718096;
      font-size: 0.9rem;
    }
  }
}

/* 资源列表样式 */
.resources-section {
  margin-bottom: 3rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.resource-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  
  .resource-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #ebf8ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
    
    .el-icon {
      font-size: 24px;
      color: #3182ce;
    }
  }
  
  .resource-content {
    flex: 1;
    
    h4 {
      font-size: 1.1rem;
      color: #2d3748;
      margin: 0 0 0.5rem 0;
    }
    
    p {
      color: #718096;
      margin-bottom: 1rem;
    }
    
    .resource-link {
      display: flex;
      justify-content: flex-end;
    }
  }
}

/* 安全计划样式 */
.safety-plan-section {
  margin-bottom: 3rem;
}

.safety-plan-form {
  .form-intro {
    color: #4a5568;
    margin-bottom: 1.5rem;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
}

.saved-plan-info {
  margin-top: 1.5rem;
  
  .plan-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
}
</style>