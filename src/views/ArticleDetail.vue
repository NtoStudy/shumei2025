<template>
  <div class="article-detail-page">
    <div class="article-container">
      <!-- 返回按钮 -->
      <div class="back-section">
        <el-button @click="goBack" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>
      
      <!-- 文章头部 -->
      <div class="article-header" v-if="article">
        <div class="article-meta">
          <el-tag :type="getCategoryType(article.category)" size="small">
            {{ getCategoryLabel(article.category) }}
          </el-tag>
          <span class="article-date">{{ formatDate(article.date) }}</span>
          <span class="read-time">
            <el-icon><Timer /></el-icon>
            {{ article.readTime }}分钟阅读
          </span>
        </div>
        
        <h1 class="article-title">{{ article.title }}</h1>
        <p class="article-summary">{{ article.summary }}</p>
        
        <!-- 文章操作 -->
        <div class="article-actions">
          <el-button @click="bookmarkArticle" :type="article.isBookmarked ? 'primary' : 'default'">
            <el-icon><Star /></el-icon>
            {{ article.isBookmarked ? '已收藏' : '收藏文章' }}
          </el-button>
          <el-button @click="shareArticle">
            <el-icon><Share /></el-icon>
            分享文章
          </el-button>
        </div>
      </div>
      
      <!-- 文章内容 -->
      <div class="article-content" v-if="article">
        <div class="content-body" v-html="article.content"></div>
      </div>
      
      <!-- 相关推荐 -->
      <div class="related-articles" v-if="relatedArticles.length > 0">
        <h3 class="section-title">相关推荐</h3>
        <div class="related-grid">
          <div 
            v-for="relatedArticle in relatedArticles" 
            :key="relatedArticle.id"
            class="related-item"
            @click="viewRelatedArticle(relatedArticle.id)"
          >
            <div class="related-image">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="related-content">
              <h4>{{ relatedArticle.title }}</h4>
              <p>{{ relatedArticle.summary }}</p>
              <div class="related-meta">
                <span class="read-time">{{ relatedArticle.readTime }}分钟</span>
                <el-tag :type="getCategoryType(relatedArticle.category)" size="small">
                  {{ getCategoryLabel(relatedArticle.category) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 评论区 -->
      <div class="comments-section">
        <h3 class="section-title">评论交流</h3>
        
        <!-- 评论输入 -->
        <div class="comment-input">
          <el-input
            v-model="newComment"
            type="textarea"
            :rows="3"
            placeholder="分享你的想法和感受..."
            class="comment-textarea"
          />
          <div class="comment-actions">
            <el-button type="primary" @click="submitComment" :disabled="!newComment.trim()">
              发表评论
            </el-button>
          </div>
        </div>
        
        <!-- 评论列表 -->
        <div class="comments-list" v-if="comments.length > 0">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-avatar">
              <el-avatar :size="40">
                {{ comment.author.charAt(0) }}
              </el-avatar>
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
              <div class="comment-actions">
                <el-button 
                  type="text" 
                  size="small" 
                  @click="likeComment(comment.id)"
                  :class="{ 'liked': comment.isLiked }"
                >
                  <el-icon><Like /></el-icon>
                  {{ comment.likes }}
                </el-button>
                <el-button type="text" size="small" @click="replyToComment(comment.id)">
                  <el-icon><ChatDotRound /></el-icon>
                  回复
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="no-comments">
          <el-icon class="no-comments-icon"><ChatDotRound /></el-icon>
          <p>还没有评论，来发表第一条评论吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const article = ref(null)
const newComment = ref('')
const comments = ref([])

// 文章数据库（实际应该从API获取）
const articles = [
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
      
      <h2>何时寻求帮助</h2>
      <p>如果焦虑症状严重影响到日常生活和学习，建议及时寻求专业心理咨询师的帮助。记住，寻求帮助是勇敢的表现，不是软弱。</p>
    `,
    category: 'anxiety',
    date: '2024-12-15',
    readTime: 8,
    isBookmarked: false
  },
  {
    id: 2,
    title: '正念呼吸练习指南',
    summary: '正念呼吸是一种简单而有效的放松技巧，可以帮助你在紧张时刻快速平静心情。',
    content: `
      <h2>什么是正念呼吸？</h2>
      <p>正念呼吸是一种专注于呼吸过程的冥想练习，通过观察和感受呼吸来培养当下的觉察力。</p>
      
      <h2>正念呼吸的好处</h2>
      <ul>
        <li>降低压力和焦虑水平</li>
        <li>提高注意力和专注力</li>
        <li>改善睡眠质量</li>
        <li>增强情绪调节能力</li>
        <li>促进身心健康</li>
      </ul>
      
      <h2>基础练习方法</h2>
      <h3>1. 准备阶段</h3>
      <p>找一个安静舒适的地方坐下，保持背部挺直但不紧张。可以闭上眼睛或轻柔地注视前方。</p>
      
      <h3>2. 观察呼吸</h3>
      <p>将注意力集中在呼吸上。不要试图改变呼吸的节奏，只是观察它的自然流动。</p>
      
      <h3>3. 处理分心</h3>
      <p>当发现思维游走时，温和地将注意力带回到呼吸上。这是正常的，不要批评自己。</p>
      
      <h3>4. 结束练习</h3>
      <p>练习结束时，慢慢睁开眼睛，感受身体的放松和心情的平静。</p>
      
      <h2>进阶技巧</h2>
      <h3>数息法</h3>
      <p>在呼气时默数1到10，然后重新开始。这可以帮助保持专注。</p>
      
      <h3>身体扫描</h3>
      <p>结合身体感受，从头到脚逐步放松身体各部位。</p>
      
      <h2>日常应用</h2>
      <p>正念呼吸不仅可以作为正式的冥想练习，也可以在日常生活中随时使用：</p>
      <ul>
        <li>考试前的紧张时刻</li>
        <li>人际冲突后的情绪调节</li>
        <li>睡前的放松练习</li>
        <li>工作间隙的短暂休息</li>
      </ul>
    `,
    category: 'meditation',
    date: '2024-12-14',
    readTime: 6,
    isBookmarked: false
  },
  {
    id: 3,
    title: '大学生情绪管理完全指南',
    summary: '大学生活充满挑战，学会管理情绪是成功的关键。本文提供实用的情绪管理策略。',
    content: `
      <h2>为什么情绪管理很重要？</h2>
      <p>情绪管理是指识别、理解和有效调节自己情绪的能力。对大学生来说，良好的情绪管理能力可以：</p>
      <ul>
        <li>提高学习效率和成绩</li>
        <li>改善人际关系</li>
        <li>增强心理韧性</li>
        <li>预防心理健康问题</li>
      </ul>
      
      <h2>常见的情绪挑战</h2>
      <h3>学业压力</h3>
      <p>考试、作业、竞争等学业压力可能导致焦虑、紧张和挫败感。</p>
      
      <h3>人际关系</h3>
      <p>室友关系、恋爱关系、友谊等人际问题可能引发愤怒、嫉妒或孤独感。</p>
      
      <h3>未来不确定性</h3>
      <p>对就业、职业发展的担忧可能产生恐惧和迷茫情绪。</p>
      
      <h2>情绪管理策略</h2>
      <h3>1. 情绪识别</h3>
      <p>学会准确识别和命名自己的情绪。可以使用情绪词汇表来帮助表达。</p>
      
      <h3>2. 认知重构</h3>
      <p>识别和挑战消极的思维模式，用更平衡的观点看待问题。</p>
      
      <h3>3. 情绪表达</h3>
      <p>通过适当的方式表达情绪，如写日记、与朋友交流、艺术创作等。</p>
      
      <h3>4. 放松技巧</h3>
      <p>学习各种放松方法，如深呼吸、渐进性肌肉放松、瑜伽等。</p>
      
      <h3>5. 问题解决</h3>
      <p>将注意力从情绪转向解决问题，制定具体的行动计划。</p>
      
      <h2>建立情绪支持系统</h2>
      <h3>社交支持</h3>
      <p>建立和维护良好的人际关系，有可以倾诉的朋友和家人。</p>
      
      <h3>专业帮助</h3>
      <p>当情绪问题严重时，不要犹豫寻求心理咨询师的专业帮助。</p>
      
      <h3>自我关爱</h3>
      <p>培养自我关爱的习惯，包括充足的睡眠、健康饮食、规律运动等。</p>
    `,
    category: 'emotion',
    date: '2024-12-13',
    readTime: 12,
    isBookmarked: false
  }
]

// 获取文章
const getArticle = (id) => {
  return articles.find(article => article.id === parseInt(id))
}

// 获取相关文章
const relatedArticles = computed(() => {
  if (!article.value) return []
  
  return articles
    .filter(a => a.id !== article.value.id && a.category === article.value.category)
    .slice(0, 3)
})

// 分类类型映射
const getCategoryType = (category) => {
  const types = {
    'anxiety': 'warning',
    'meditation': 'success',
    'emotion': 'primary',
    'stress': 'info',
    'relationships': 'success',
    'self-care': 'primary'
  }
  return types[category] || 'info'
}

// 分类标签映射
const getCategoryLabel = (category) => {
  const labels = {
    'anxiety': '焦虑管理',
    'meditation': '正念冥想',
    'emotion': '情绪管理',
    'stress': '压力管理',
    'relationships': '人际关系',
    'self-care': '自我关爱'
  }
  return labels[category] || category
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化时间
const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return `${days}天前`
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 收藏文章
const bookmarkArticle = () => {
  if (article.value) {
    article.value.isBookmarked = !article.value.isBookmarked
    ElMessage.success(article.value.isBookmarked ? '收藏成功！' : '取消收藏！')
  }
}

// 分享文章
const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: article.value.title,
      text: article.value.summary,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    ElMessage.success('链接已复制到剪贴板！')
  }
}

// 查看相关文章
const viewRelatedArticle = (articleId) => {
  router.push(`/article/${articleId}`)
}

// 提交评论
const submitComment = () => {
  if (!newComment.value.trim()) return
  
  const comment = {
    id: Date.now(),
    author: '匿名用户', // 实际应该从用户状态获取
    content: newComment.value.trim(),
    timestamp: new Date(),
    likes: 0,
    isLiked: false
  }
  
  comments.value.unshift(comment)
  newComment.value = ''
  ElMessage.success('评论发表成功！')
}

// 点赞评论
const likeComment = (commentId) => {
  const comment = comments.value.find(c => c.id === commentId)
  if (comment) {
    comment.isLiked = !comment.isLiked
    comment.likes += comment.isLiked ? 1 : -1
  }
}

// 回复评论
const replyToComment = (commentId) => {
  ElMessage.info('回复功能开发中...')
}

// 页面初始化
onMounted(() => {
  const articleId = route.params.id
  article.value = getArticle(articleId)
  
  if (!article.value) {
    ElMessage.error('文章不存在')
    router.push('/resources/knowledge')
  }
  
  // 模拟加载评论
  comments.value = [
    {
      id: 1,
      author: '小明',
      content: '这篇文章写得很好，对我很有帮助！特别是呼吸练习的部分，我会试试看。',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
      likes: 5,
      isLiked: false
    },
    {
      id: 2,
      author: '心理学爱好者',
      content: '非常实用的建议，我觉得正念冥想确实有效果。希望能看到更多这样的文章。',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5小时前
      likes: 3,
      isLiked: false
    }
  ]
})
</script>

<style scoped lang="scss">
.article-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px 0;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-section {
  margin-bottom: 30px;
  
  .back-btn {
    color: #666;
    border-color: #ddd;
    
    &:hover {
      color: #FF6B6B;
      border-color: #FF6B6B;
    }
  }
}

.article-header {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  margin-bottom: 30px;
  
  .article-meta {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    
    .article-date {
      color: #999;
      font-size: 14px;
    }
    
    .read-time {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #999;
      font-size: 14px;
      
      .el-icon {
        font-size: 16px;
      }
    }
  }
  
  .article-title {
    color: #333;
    font-size: 28px;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 15px 0;
  }
  
  .article-summary {
    color: #666;
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 25px 0;
  }
  
  .article-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.article-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  margin-bottom: 30px;
  
  .content-body {
    line-height: 1.8;
    color: #333;
    font-size: 16px;
    
    :deep(h2) {
      color: #FF6B6B;
      font-size: 24px;
      font-weight: 600;
      margin: 30px 0 15px 0;
      
      &:first-child {
        margin-top: 0;
      }
    }
    
    :deep(h3) {
      color: #333;
      font-size: 20px;
      font-weight: 600;
      margin: 25px 0 10px 0;
    }
    
    :deep(p) {
      margin: 15px 0;
    }
    
    :deep(ul) {
      margin: 15px 0;
      padding-left: 25px;
      
      li {
        margin: 8px 0;
        list-style-type: disc;
      }
    }
    
    :deep(ol) {
      margin: 15px 0;
      padding-left: 25px;
      
      li {
        margin: 8px 0;
      }
    }
    
    :deep(blockquote) {
      border-left: 4px solid #FF6B6B;
      padding-left: 20px;
      margin: 20px 0;
      color: #666;
      font-style: italic;
    }
  }
}

.related-articles {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  margin-bottom: 30px;
  
  .section-title {
    color: #FF6B6B;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 20px 0;
  }
  
  .related-grid {
    display: grid;
    gap: 20px;
  }
  
  .related-item {
    display: flex;
    padding: 20px;
    background: #fafafa;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      background: #f0f0f0;
      transform: translateY(-2px);
    }
    
    .related-image {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      flex-shrink: 0;
      
      .el-icon {
        font-size: 24px;
        color: #FF6B6B;
      }
    }
    
    .related-content {
      flex: 1;
      
      h4 {
        color: #333;
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }
      
      p {
        color: #666;
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 10px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .related-meta {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .read-time {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}

.comments-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  
  .section-title {
    color: #FF6B6B;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 25px 0;
  }
  
  .comment-input {
    margin-bottom: 30px;
    
    .comment-textarea {
      margin-bottom: 15px;
      
      :deep(.el-textarea__inner) {
        border-radius: 10px;
        border-color: #e0e0e0;
        
        &:focus {
          border-color: #FF6B6B;
        }
      }
    }
    
    .comment-actions {
      display: flex;
      justify-content: flex-end;
    }
  }
  
  .comments-list {
    .comment-item {
      display: flex;
      margin-bottom: 25px;
      
      .comment-avatar {
        margin-right: 15px;
        flex-shrink: 0;
      }
      
      .comment-content {
        flex: 1;
        
        .comment-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 8px;
          
          .comment-author {
            color: #333;
            font-weight: 600;
            font-size: 14px;
          }
          
          .comment-time {
            color: #999;
            font-size: 12px;
          }
        }
        
        .comment-text {
          color: #666;
          line-height: 1.6;
          margin: 0 0 10px 0;
        }
        
        .comment-actions {
          display: flex;
          gap: 15px;
          
          .el-button {
            padding: 0;
            height: auto;
            
            &.liked {
              color: #FF6B6B;
            }
          }
        }
      }
    }
  }
  
  .no-comments {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    
    .no-comments-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    p {
      margin: 0;
      font-size: 16px;
    }
  }
}

@media (max-width: 768px) {
  .article-container {
    padding: 0 15px;
  }
  
  .article-header {
    padding: 25px;
    
    .article-title {
      font-size: 24px;
    }
    
    .article-meta {
      gap: 10px;
    }
    
    .article-actions {
      justify-content: center;
    }
  }
  
  .article-content {
    padding: 25px;
    
    .content-body {
      font-size: 15px;
      
      :deep(h2) {
        font-size: 20px;
      }
      
      :deep(h3) {
        font-size: 18px;
      }
    }
  }
  
  .related-articles,
  .comments-section {
    padding: 20px;
  }
  
  .related-item {
    flex-direction: column;
    
    .related-image {
      width: 100%;
      height: 80px;
      margin-right: 0;
      margin-bottom: 15px;
    }
  }
}
</style>
