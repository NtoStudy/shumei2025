<template>
  <div class="treehole-enhanced-page">
    <div class="treehole-header">
      <h1 class="page-title">
        <el-icon><ChatDotRound /></el-icon>
        温暖树洞
      </h1>
      <p class="page-desc">在这里，你可以安全地分享心情，获得温暖的支持</p>
    </div>

    <!-- 发布区域 -->
    <div class="post-composer">
      <div class="composer-header">
        <h3>
          <el-icon><Edit /></el-icon>
          分享此刻的心情
        </h3>
        <div class="anonymous-indicator">
          <el-icon><View /></el-icon>
          <span>匿名模式</span>
        </div>
      </div>
      
      <div class="composer-content">
        <el-input
          v-model="newPost.content"
          type="textarea"
          :rows="4"
          placeholder="在这里倾诉你的心情，不用担心被评判..."
          maxlength="500"
          show-word-limit
          class="post-textarea"
        />
        
        <div class="composer-options">
          <div class="mood-selector">
            <span class="option-label">当前心情：</span>
            <div class="mood-tags">
              <el-tag
                v-for="mood in moodOptions"
                :key="mood.id"
                :type="newPost.mood === mood.id ? 'primary' : 'info'"
                :effect="newPost.mood === mood.id ? 'dark' : 'plain'"
                @click="selectMood(mood.id)"
                class="mood-tag"
              >
                {{ mood.icon }} {{ mood.name }}
              </el-tag>
            </div>
          </div>
          
          <div class="support-type">
            <span class="option-label">希望获得：</span>
            <el-radio-group v-model="newPost.supportType" class="support-options">
              <el-radio label="listen">倾听</el-radio>
              <el-radio label="comfort">安慰</el-radio>
              <el-radio label="advice">建议</el-radio>
              <el-radio label="share">共鸣</el-radio>
            </el-radio-group>
          </div>
        </div>
        
        <div class="composer-actions">
          <el-button @click="clearPost" size="large">
            <el-icon><RefreshLeft /></el-icon>
            清空
          </el-button>
          <el-button 
            type="primary" 
            @click="publishPost" 
            size="large"
            :disabled="!newPost.content.trim()"
          >
            <el-icon><Position /></el-icon>
            投入树洞
          </el-button>
        </div>
      </div>
    </div>

    <!-- 筛选和排序 -->
    <div class="filter-section">
      <div class="filter-left">
        <el-radio-group v-model="activeFilter" @change="filterPosts">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="recent">最新</el-radio-button>
          <el-radio-button label="popular">热门</el-radio-button>
          <el-radio-button label="need-support">需要支持</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="filter-right">
        <el-select 
          v-model="moodFilter" 
          placeholder="按心情筛选"
          clearable
          @change="filterPosts"
          class="mood-filter"
        >
          <el-option
            v-for="mood in moodOptions"
            :key="mood.id"
            :label="`${mood.icon} ${mood.name}`"
            :value="mood.id"
          />
        </el-select>
      </div>
    </div>

    <!-- 树洞内容 -->
    <div class="posts-container">
      <div 
        v-for="post in filteredPosts" 
        :key="post.id"
        class="post-card"
        :class="{ 'need-support': post.supportType === 'listen' || post.supportType === 'comfort' }"
      >
        <div class="post-header">
          <div class="post-meta">
            <div class="anonymous-avatar">
              {{ getRandomAvatar() }}
            </div>
            <div class="post-info">
              <div class="anonymous-name">匿名用户</div>
              <div class="post-time">{{ formatTimeAgo(post.timestamp) }}</div>
            </div>
          </div>
          
          <div class="post-mood">
            <el-tag 
              :type="getMoodType(post.mood)"
              size="small"
              effect="light"
            >
              {{ getMoodIcon(post.mood) }} {{ getMoodName(post.mood) }}
            </el-tag>
          </div>
        </div>
        
        <div class="post-content">
          <p>{{ post.content }}</p>
        </div>
        
        <div class="post-support-tag" v-if="post.supportType">
          <el-tag 
            :type="getSupportTagType(post.supportType)"
            size="small"
            class="support-tag"
          >
            {{ getSupportText(post.supportType) }}
          </el-tag>
        </div>
        
        <div class="post-actions">
          <div class="action-buttons">
            <el-button 
              :type="post.liked ? 'primary' : 'default'"
              size="small"
              @click="toggleLike(post)"
              class="action-btn"
            >
              <el-icon><StarFilled v-if="post.liked" /><Star v-else /></el-icon>
              <span>{{ post.likes || 0 }}</span>
            </el-button>
            
            <el-button 
              size="small"
              @click="toggleComments(post)"
              class="action-btn"
            >
              <el-icon><ChatDotRound /></el-icon>
              <span>{{ post.comments?.length || 0 }}</span>
            </el-button>
            
            <el-button 
              size="small"
              @click="sendWarmth(post)"
              class="action-btn warmth-btn"
            >
              <el-icon><Sunny /></el-icon>
              <span>送温暖</span>
            </el-button>
          </div>
          
          <div class="warmth-display" v-if="post.warmthCount > 0">
            <span class="warmth-text">
              <el-icon><Sunny /></el-icon>
              收到了 {{ post.warmthCount }} 份温暖
            </span>
          </div>
        </div>
        
        <!-- 评论区域 -->
        <div class="comments-section" v-if="post.showComments">
          <div class="comments-list">
            <div 
              v-for="comment in post.comments" 
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-avatar">
                {{ getRandomAvatar() }}
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">匿名用户</span>
                  <span class="comment-time">{{ formatTimeAgo(comment.timestamp) }}</span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
              </div>
            </div>
          </div>
          
          <div class="comment-composer">
            <el-input
              v-model="commentTexts[post.id]"
              placeholder="发送一句温暖的话..."
              class="comment-input"
            >
              <template #append>
                <el-button 
                  @click="addComment(post)"
                  :disabled="!commentTexts[post.id]?.trim()"
                  class="send-comment-btn"
                >
                  <el-icon><Position /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </div>
      
      <div v-if="!filteredPosts.length" class="empty-state">
        <div class="empty-icon">🌳</div>
        <h3>暂时没有内容</h3>
        <p>成为第一个在树洞里分享心情的人吧！</p>
      </div>
    </div>

    <!-- 温暖提示对话框 -->
    <el-dialog
      v-model="showWarmthDialog"
      title="送出温暖"
      width="400px"
      class="warmth-dialog"
    >
      <div class="warmth-content">
        <div class="warmth-icon">🌟</div>
        <h3>选择一种温暖的方式</h3>
        <div class="warmth-options">
          <div 
            v-for="option in warmthOptions" 
            :key="option.id"
            class="warmth-option"
            @click="sendWarmthMessage(option)"
          >
            <div class="option-icon">{{ option.icon }}</div>
            <div class="option-text">{{ option.text }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useCommunityStore } from '@/stores/community'
import { ElMessage } from 'element-plus'

const communityStore = useCommunityStore()

// 响应式数据
const newPost = reactive({
  content: '',
  mood: '',
  supportType: 'listen'
})

const activeFilter = ref('all')
const moodFilter = ref('')
const commentTexts = reactive({})
const showWarmthDialog = ref(false)
const selectedPost = ref(null)

// 配置数据
const moodOptions = [
  { id: 'sad', name: '难过', icon: '😢' },
  { id: 'anxious', name: '焦虑', icon: '😰' },
  { id: 'angry', name: '愤怒', icon: '😠' },
  { id: 'confused', name: '困惑', icon: '🤔' },
  { id: 'tired', name: '疲惫', icon: '😴' },
  { id: 'lonely', name: '孤独', icon: '😔' },
  { id: 'hopeful', name: '有希望', icon: '🌱' },
  { id: 'grateful', name: '感激', icon: '🙏' }
]

const warmthOptions = [
  { id: 'hug', icon: '🤗', text: '给你一个温暖的拥抱' },
  { id: 'support', icon: '💪', text: '我支持你，你很棒！' },
  { id: 'understand', icon: '❤️', text: '我理解你的感受' },
  { id: 'encourage', icon: '🌈', text: '一切都会好起来的' },
  { id: 'listen', icon: '👂', text: '我在这里倾听你' },
  { id: 'hope', icon: '🌟', text: '为你送上希望之光' }
]

const avatarEmojis = ['🐱', '🐶', '🐰', '🦊', '🐻', '🐼', '🐨', '🦄', '🌸', '🌺', '🌻', '🌷']

// 计算属性
const filteredPosts = computed(() => {
  let posts = [...communityStore.treeholePosts]
  
  // 按心情筛选
  if (moodFilter.value) {
    posts = posts.filter(post => post.mood === moodFilter.value)
  }
  
  // 按类型筛选
  switch (activeFilter.value) {
    case 'recent':
      posts = posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      break
    case 'popular':
      posts = posts.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      break
    case 'need-support':
      posts = posts.filter(post => 
        post.supportType === 'listen' || 
        post.supportType === 'comfort' ||
        (post.comments?.length || 0) < 2
      )
      break
    default:
      posts = posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }
  
  return posts
})

// 方法
const selectMood = (moodId) => {
  newPost.mood = newPost.mood === moodId ? '' : moodId
}

const clearPost = () => {
  newPost.content = ''
  newPost.mood = ''
  newPost.supportType = 'listen'
}

const publishPost = () => {
  if (!newPost.content.trim()) {
    ElMessage.warning('请输入内容后再发布')
    return
  }
  
  const post = {
    id: Date.now(),
    content: newPost.content,
    mood: newPost.mood,
    supportType: newPost.supportType,
    timestamp: new Date().toISOString(),
    likes: 0,
    liked: false,
    comments: [],
    warmthCount: 0,
    showComments: false
  }
  
  communityStore.addTreeholePost(post)
  clearPost()
  ElMessage.success('已投入树洞，愿你的心情被温暖回应 🌟')
}

const filterPosts = () => {
  // 筛选逻辑在计算属性中处理
}

const toggleLike = (post) => {
  if (post.liked) {
    post.likes = Math.max(0, (post.likes || 0) - 1)
    post.liked = false
  } else {
    post.likes = (post.likes || 0) + 1
    post.liked = true
    ElMessage.success('已点亮小星星 ⭐')
  }
}

const toggleComments = (post) => {
  post.showComments = !post.showComments
}

const addComment = (post) => {
  const commentText = commentTexts[post.id]
  if (!commentText?.trim()) return
  
  const comment = {
    id: Date.now(),
    content: commentText,
    timestamp: new Date().toISOString()
  }
  
  if (!post.comments) {
    post.comments = []
  }
  
  post.comments.push(comment)
  commentTexts[post.id] = ''
  ElMessage.success('温暖的话语已送达 💕')
}

const sendWarmth = (post) => {
  selectedPost.value = post
  showWarmthDialog.value = true
}

const sendWarmthMessage = (option) => {
  if (!selectedPost.value) return
  
  selectedPost.value.warmthCount = (selectedPost.value.warmthCount || 0) + 1
  
  // 自动添加一条系统温暖评论
  const warmthComment = {
    id: Date.now(),
    content: option.text,
    timestamp: new Date().toISOString(),
    isWarmth: true
  }
  
  if (!selectedPost.value.comments) {
    selectedPost.value.comments = []
  }
  
  selectedPost.value.comments.push(warmthComment)
  showWarmthDialog.value = false
  selectedPost.value = null
  
  ElMessage.success(`${option.icon} ${option.text}`)
}

const getRandomAvatar = () => {
  return avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)]
}

const getMoodIcon = (moodId) => {
  const mood = moodOptions.find(m => m.id === moodId)
  return mood ? mood.icon : '😊'
}

const getMoodName = (moodId) => {
  const mood = moodOptions.find(m => m.id === moodId)
  return mood ? mood.name : '未知'
}

const getMoodType = (moodId) => {
  const negativeTypes = ['sad', 'anxious', 'angry', 'confused', 'tired', 'lonely']
  return negativeTypes.includes(moodId) ? 'warning' : 'success'
}

const getSupportTagType = (supportType) => {
  const types = {
    'listen': 'info',
    'comfort': 'warning',
    'advice': 'primary',
    'share': 'success'
  }
  return types[supportType] || 'info'
}

const getSupportText = (supportType) => {
  const texts = {
    'listen': '需要倾听',
    'comfort': '需要安慰',
    'advice': '寻求建议',
    'share': '寻找共鸣'
  }
  return texts[supportType] || '需要支持'
}

const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffTime = now - date
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 1) return '刚刚'
  if (diffMinutes < 60) return `${diffMinutes}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  // 初始化一些示例数据（如果需要）
  if (communityStore.treeholePosts.length === 0) {
    const samplePosts = [
      {
        id: 1,
        content: '最近总感觉很累，工作压力很大，不知道该怎么调节自己的情绪...',
        mood: 'tired',
        supportType: 'comfort',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 3,
        liked: false,
        comments: [
          {
            id: 1,
            content: '我也有过这样的感受，给你一个温暖的拥抱 🤗',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          }
        ],
        warmthCount: 2,
        showComments: false
      },
      {
        id: 2,
        content: '今天遇到了一些挫折，但是我觉得我会坚持下去的，为自己加油！',
        mood: 'hopeful',
        supportType: 'share',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        likes: 5,
        liked: false,
        comments: [],
        warmthCount: 1,
        showComments: false
      }
    ]
    
    samplePosts.forEach(post => {
      communityStore.addTreeholePost(post)
    })
  }
})
</script>

<style scoped lang="scss">
.treehole-enhanced-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.treehole-header {
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

.post-composer {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
  margin-bottom: 30px;
  
  .composer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      color: #FF6B6B;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .anonymous-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #10B981;
      font-size: 14px;
      background: #F0FDF4;
      padding: 4px 8px;
      border-radius: 10px;
    }
  }
  
  .composer-content {
    .post-textarea {
      margin-bottom: 20px;
      
      :deep(.el-textarea__inner) {
        border-radius: 12px;
        border: 2px solid #F3F4F6;
        font-size: 16px;
        line-height: 1.6;
        
        &:focus {
          border-color: #FF6B6B;
        }
      }
    }
    
    .composer-options {
      margin-bottom: 20px;
      
      .mood-selector,
      .support-type {
        margin-bottom: 15px;
        
        .option-label {
          color: #374151;
          font-weight: 500;
          margin-right: 10px;
        }
        
        .mood-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
          
          .mood-tag {
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover {
              transform: translateY(-1px);
            }
          }
        }
        
        .support-options {
          margin-top: 8px;
          
          :deep(.el-radio) {
            margin-right: 20px;
          }
        }
      }
    }
    
    .composer-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  }
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 5px;
  
  .filter-left {
    :deep(.el-radio-button__inner) {
      border-color: #FF6B6B;
      color: #FF6B6B;
    }
    
    :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
      background-color: #FF6B6B;
      border-color: #FF6B6B;
    }
  }
  
  .mood-filter {
    width: 150px;
  }
}

.posts-container {
  .post-card {
    background: white;
    border-radius: 15px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 8px 25px rgba(255, 107, 107, 0.15);
      transform: translateY(-1px);
    }
    
    &.need-support {
      border-left: 4px solid #F59E0B;
      background: linear-gradient(to right, #FEF3C7, white);
    }
    
    .post-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      
      .post-meta {
        display: flex;
        align-items: center;
        gap: 10px;
        
        .anonymous-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        
        .post-info {
          .anonymous-name {
            color: #374151;
            font-weight: 500;
            font-size: 14px;
          }
          
          .post-time {
            color: #9CA3AF;
            font-size: 12px;
          }
        }
      }
    }
    
    .post-content {
      margin-bottom: 15px;
      
      p {
        color: #374151;
        font-size: 16px;
        line-height: 1.6;
        margin: 0;
      }
    }
    
    .post-support-tag {
      margin-bottom: 15px;
      
      .support-tag {
        font-size: 12px;
        border-radius: 10px;
      }
    }
    
    .post-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .action-buttons {
        display: flex;
        gap: 10px;
        
        .action-btn {
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 15px;
          
          .el-icon {
            margin-right: 4px;
          }
          
          &.warmth-btn {
            background: linear-gradient(135deg, #F59E0B, #F97316);
            color: white;
            border: none;
            
            &:hover {
              background: linear-gradient(135deg, #D97706, #EA580C);
            }
          }
        }
      }
      
      .warmth-display {
        .warmth-text {
          color: #F59E0B;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
    
    .comments-section {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #F3F4F6;
      
      .comments-list {
        .comment-item {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          
          .comment-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10B981, #34D399);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            flex-shrink: 0;
          }
          
          .comment-content {
            flex: 1;
            
            .comment-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              
              .comment-author {
                color: #374151;
                font-weight: 500;
                font-size: 12px;
              }
              
              .comment-time {
                color: #9CA3AF;
                font-size: 11px;
              }
            }
            
            .comment-text {
              color: #6B7280;
              font-size: 14px;
              line-height: 1.4;
              margin: 0;
            }
          }
        }
      }
      
      .comment-composer {
        .comment-input {
          :deep(.el-input-group__append) {
            background: #FF6B6B;
            border-color: #FF6B6B;
            padding: 0 15px;
            
            .send-comment-btn {
              background: none;
              border: none;
              color: white;
              padding: 0;
              
              &:hover {
                background: rgba(255, 255, 255, 0.1);
              }
            }
          }
        }
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #9CA3AF;
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    h3 {
      color: #374151;
      font-size: 20px;
      margin: 0 0 10px 0;
    }
    
    p {
      margin: 0;
      font-size: 16px;
    }
  }
}

.warmth-dialog {
  :deep(.el-dialog) {
    border-radius: 15px;
  }
  
  .warmth-content {
    text-align: center;
    
    .warmth-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    
    h3 {
      color: #374151;
      font-size: 18px;
      margin: 0 0 20px 0;
    }
    
    .warmth-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      
      .warmth-option {
        padding: 15px;
        border: 2px solid #F3F4F6;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s;
        
        &:hover {
          border-color: #FF6B6B;
          background: #FEF2F2;
          transform: translateY(-2px);
        }
        
        .option-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        .option-text {
          color: #374151;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .treehole-enhanced-page {
    padding: 15px;
  }
  
  .treehole-header .page-title {
    font-size: 24px;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
    
    .filter-left {
      :deep(.el-radio-group) {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
    
    .mood-filter {
      width: 100%;
    }
  }
  
  .post-card {
    .post-actions {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
  }
  
  .warmth-options {
    grid-template-columns: 1fr !important;
  }
}
</style>
