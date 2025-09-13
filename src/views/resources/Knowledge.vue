<template>
  <div class="knowledge-page">
    <div class="knowledge-container">
      <!-- 搜索和筛选 -->
      <div class="search-section">
        <div class="search-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索心理健康知识..."
            @input="searchKnowledge"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="filter-tabs">
          <el-radio-group v-model="selectedCategory" @change="filterByCategory">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="anxiety">焦虑管理</el-radio-button>
            <el-radio-button label="depression">抑郁应对</el-radio-button>
            <el-radio-button label="stress">压力管理</el-radio-button>
            <el-radio-button label="relationships">人际关系</el-radio-button>
            <el-radio-button label="self-care">自我关爱</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      
      <!-- 知识内容列表 -->
      <div class="knowledge-content">
        <div class="content-grid">
          <div 
            v-for="article in filteredArticles" 
            :key="article.id"
            class="article-card"
            @click="viewArticle(article)"
          >
            <div class="article-image">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="article-content">
              <div class="article-meta">
                <el-tag :type="getCategoryType(article.category)" size="small">
                  {{ getCategoryLabel(article.category) }}
                </el-tag>
                <span class="article-date">{{ formatDate(article.date) }}</span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-summary">{{ article.summary }}</p>
              <div class="article-stats">
                <span class="read-time">
                  <el-icon><Timer /></el-icon>
                  {{ article.readTime }}分钟阅读
                </span>
                <span class="difficulty">
                  <el-icon><Star /></el-icon>
                  {{ article.difficulty }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="pagination-section" v-if="totalPages > 1">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalArticles"
            layout="prev, pager, next"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      
      <!-- 推荐文章 -->
      <div class="recommended-section">
        <h3 class="section-title">推荐文章</h3>
        <div class="recommended-list">
          <div 
            v-for="article in recommendedArticles" 
            :key="article.id"
            class="recommended-item"
            @click="viewArticle(article)"
          >
            <div class="recommended-content">
              <h4>{{ article.title }}</h4>
              <p>{{ article.summary }}</p>
            </div>
            <div class="recommended-meta">
              <span class="read-time">{{ article.readTime }}分钟</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 文章详情对话框 -->
    <el-dialog
      v-model="articleDialogVisible"
      :title="selectedArticle?.title"
      width="80%"
      :before-close="handleCloseDialog"
    >
      <div class="article-detail" v-if="selectedArticle">
        <div class="article-header">
          <div class="article-meta">
            <el-tag :type="getCategoryType(selectedArticle.category)" size="small">
              {{ getCategoryLabel(selectedArticle.category) }}
            </el-tag>
            <span class="article-date">{{ formatDate(selectedArticle.date) }}</span>
            <span class="read-time">{{ selectedArticle.readTime }}分钟阅读</span>
          </div>
        </div>
        <div class="article-body">
          <div v-html="selectedArticle.content"></div>
        </div>
        <div class="article-actions">
          <el-button @click="bookmarkArticle(selectedArticle.id)">
            <el-icon><Bookmark /></el-icon>
            {{ selectedArticle.isBookmarked ? '已收藏' : '收藏' }}
          </el-button>
          <el-button @click="shareArticle(selectedArticle.id)">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const searchKeyword = ref('')
const selectedCategory = ref('all')
const currentPage = ref(1)
const pageSize = ref(12)
const articleDialogVisible = ref(false)
const selectedArticle = ref(null)

// 知识文章数据
const articles = ref([
  {
    id: 1,
    title: '如何应对考试焦虑',
    summary: '考试焦虑是大学生常见的问题，本文介绍了一些有效的应对策略，包括呼吸练习、正念冥想等。',
    content: `
      <h2>什么是考试焦虑？</h2>
      <p>考试焦虑是指在考试前或考试过程中出现的紧张、担心、恐惧等情绪反应。适度的焦虑有助于提高注意力，但过度的焦虑会影响正常发挥。</p>
      
      <h2>考试焦虑的表现</h2>
      <ul>
        <li>心跳加速、出汗</li>
        <li>注意力不集中</li>
        <li>记忆力下降</li>
        <li>失眠或睡眠质量差</li>
        <li>食欲不振或暴饮暴食</li>
      </ul>
      
      <h2>应对策略</h2>
      <h3>1. 呼吸练习</h3>
      <p>当感到焦虑时，可以尝试4-7-8呼吸法：吸气4秒，屏气7秒，呼气8秒。重复几次，有助于平静心情。</p>
      
      <h3>2. 正念冥想</h3>
      <p>每天花10-15分钟进行正念冥想，专注于当下，减少对未来的担忧。</p>
      
      <h3>3. 合理规划</h3>
      <p>制定合理的学习计划，避免临时抱佛脚。将大目标分解为小目标，逐步完成。</p>
      
      <h3>4. 保持健康的生活方式</h3>
      <p>保证充足的睡眠，均衡的饮食，适量的运动，这些都有助于缓解焦虑。</p>
    `,
    category: 'anxiety',
    date: '2024-12-15',
    readTime: 8,
    difficulty: '初级',
    isBookmarked: false
  },
  {
    id: 2,
    title: '大学生人际关系指南',
    summary: '大学是人际关系的重要阶段，学会如何与室友、同学、老师建立良好关系，对心理健康很重要。',
    content: `
      <h2>大学人际关系的特点</h2>
      <p>大学人际关系比中学更加复杂多样，需要处理与室友、同学、老师、社团成员等不同群体的关系。</p>
      
      <h2>建立良好关系的技巧</h2>
      <h3>1. 主动沟通</h3>
      <p>遇到问题时，主动与对方沟通，表达自己的想法和感受，避免误解。</p>
      
      <h3>2. 尊重差异</h3>
      <p>每个人都有自己的背景和价值观，学会尊重和理解他人的差异。</p>
      
      <h3>3. 建立边界</h3>
      <p>学会说"不"，保护自己的时间和精力，避免过度迁就他人。</p>
      
      <h3>4. 寻求共同点</h3>
      <p>寻找与他人的共同兴趣爱好，建立共同话题，增进了解。</p>
    `,
    category: 'relationships',
    date: '2024-12-12',
    readTime: 6,
    difficulty: '初级',
    isBookmarked: false
  },
  {
    id: 3,
    title: '压力管理的科学方法',
    summary: '压力是现代生活中不可避免的一部分，学会科学管理压力，有助于保持心理健康。',
    content: `
      <h2>压力的来源</h2>
      <p>大学生的压力主要来源于学业、人际关系、未来规划、经济等方面。</p>
      
      <h2>压力管理策略</h2>
      <h3>1. 时间管理</h3>
      <p>制定合理的时间表，优先处理重要且紧急的事务，避免拖延。</p>
      
      <h3>2. 放松技巧</h3>
      <p>学习肌肉放松、想象放松等技巧，在压力大时及时使用。</p>
      
      <h3>3. 寻求支持</h3>
      <p>与朋友、家人或心理咨询师分享自己的感受，获得情感支持。</p>
      
      <h3>4. 保持积极心态</h3>
      <p>关注问题的解决方案而非问题本身，培养乐观的心态。</p>
    `,
    category: 'stress',
    date: '2024-12-10',
    readTime: 10,
    difficulty: '中级',
    isBookmarked: false
  },
  {
    id: 4,
    title: '自我关爱的艺术',
    summary: '学会关爱自己，是维护心理健康的基础。本文介绍了一些实用的自我关爱方法。',
    content: `
      <h2>什么是自我关爱？</h2>
      <p>自我关爱是指主动关注和满足自己的身心需求，包括身体、情感、心理和精神层面的照顾。</p>
      
      <h2>自我关爱的维度</h2>
      <h3>1. 身体关爱</h3>
      <p>保证充足的睡眠、均衡的饮食、适量的运动，定期体检。</p>
      
      <h3>2. 情感关爱</h3>
      <p>允许自己感受各种情绪，不压抑也不过度放大，学会情绪调节。</p>
      
      <h3>3. 心理关爱</h3>
      <p>培养兴趣爱好，学习新技能，挑战自己，保持心理活力。</p>
      
      <h3>4. 精神关爱</h3>
      <p>思考人生的意义和价值，培养感恩之心，保持内心的平静。</p>
    `,
    category: 'self-care',
    date: '2024-12-08',
    readTime: 7,
    difficulty: '初级',
    isBookmarked: false
  }
])

// 推荐文章
const recommendedArticles = ref([
  {
    id: 5,
    title: '正念冥想的入门指南',
    summary: '正念冥想是一种简单有效的心理调节方法，适合初学者练习。',
    readTime: 5
  },
  {
    id: 6,
    title: '如何识别和应对抑郁情绪',
    summary: '了解抑郁情绪的表现，学会有效的应对策略。',
    readTime: 12
  },
  {
    id: 7,
    title: '睡眠质量与心理健康的关系',
    summary: '良好的睡眠对心理健康至关重要，本文介绍改善睡眠的方法。',
    readTime: 9
  }
])

// 计算属性
const filteredArticles = computed(() => {
  let filtered = articles.value
  
  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article => article.category === selectedCategory.value)
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(keyword) ||
      article.summary.toLowerCase().includes(keyword)
    )
  }
  
  return filtered
})

const totalArticles = computed(() => filteredArticles.value.length)
const totalPages = computed(() => Math.ceil(totalArticles.value / pageSize.value))

// 方法
const searchKnowledge = () => {
  currentPage.value = 1
}

const filterByCategory = () => {
  currentPage.value = 1
}

const getCategoryType = (category) => {
  const types = {
    'anxiety': 'warning',
    'depression': 'danger',
    'stress': 'info',
    'relationships': 'success',
    'self-care': 'primary'
  }
  return types[category] || 'info'
}

const getCategoryLabel = (category) => {
  const labels = {
    'anxiety': '焦虑管理',
    'depression': '抑郁应对',
    'stress': '压力管理',
    'relationships': '人际关系',
    'self-care': '自我关爱'
  }
  return labels[category] || category
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewArticle = (article) => {
  selectedArticle.value = article
  articleDialogVisible.value = true
}

const handleCloseDialog = () => {
  articleDialogVisible.value = false
  selectedArticle.value = null
}

const bookmarkArticle = (articleId) => {
  const article = articles.value.find(a => a.id === articleId)
  if (article) {
    article.isBookmarked = !article.isBookmarked
    ElMessage.success(article.isBookmarked ? '收藏成功！' : '取消收藏！')
  }
}

const shareArticle = (articleId) => {
  ElMessage.success('分享功能开发中...')
}

const handlePageChange = (page) => {
  currentPage.value = page
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style scoped lang="scss">
.knowledge-page {
  padding: 20px 0;
}

.knowledge-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.search-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.search-bar {
  margin-bottom: 20px;
  
  .search-input {
    max-width: 500px;
    margin: 0 auto;
    
    :deep(.el-input__inner) {
      border-radius: 25px;
      padding: 12px 20px;
    }
  }
}

.filter-tabs {
  display: flex;
  justify-content: center;
  
  :deep(.el-radio-group) {
    .el-radio-button__inner {
      border-color: #FF6B6B;
      color: #FF6B6B;
      
      &:hover {
        background: #FFF0F0;
      }
    }
    
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background: #FF6B6B;
      border-color: #FF6B6B;
    }
  }
}

.knowledge-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.article-card {
  border: 1px solid #E0E0E0;
  border-radius: 15px;
  padding: 20px;
  background: #FAFAFA;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(255, 107, 107, 0.15);
    transform: translateY(-2px);
  }
}

.article-image {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%);
  border-radius: 10px;
  margin-bottom: 15px;
  
  .el-icon {
    font-size: 32px;
    color: #FF6B6B;
  }
}

.article-content {
  .article-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    .article-date {
      color: #999;
      font-size: 12px;
    }
  }
  
  .article-title {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 10px 0;
    line-height: 1.4;
  }
  
  .article-summary {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    margin: 0 0 15px 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .article-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    span {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #999;
      font-size: 12px;
      
      .el-icon {
        font-size: 14px;
      }
    }
  }
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.recommended-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.section-title {
  color: #FF6B6B;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
}

.recommended-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommended-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #FAFAFA;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: #FFF0F0;
  }
}

.recommended-content {
  flex: 1;
  
  h4 {
    color: #333;
    margin: 0 0 5px 0;
    font-size: 16px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
}

.recommended-meta {
  .read-time {
    color: #999;
    font-size: 12px;
  }
}

.article-detail {
  .article-header {
    margin-bottom: 20px;
    
    .article-meta {
      display: flex;
      gap: 15px;
      align-items: center;
      margin-bottom: 15px;
      
      .article-date, .read-time {
        color: #999;
        font-size: 14px;
      }
    }
  }
  
  .article-body {
    line-height: 1.8;
    color: #333;
    
    h2 {
      color: #FF6B6B;
      margin: 20px 0 10px 0;
      font-size: 20px;
    }
    
    h3 {
      color: #333;
      margin: 15px 0 8px 0;
      font-size: 16px;
    }
    
    p {
      margin: 10px 0;
    }
    
    ul {
      margin: 10px 0;
      padding-left: 20px;
      
      li {
        margin: 5px 0;
      }
    }
  }
  
  .article-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #E0E0E0;
  }
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-tabs {
    :deep(.el-radio-group) {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
  }
  
  .recommended-item {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .article-detail {
    .article-actions {
      flex-direction: column;
    }
  }
}
</style>
