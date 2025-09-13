import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCommunityStore = defineStore('community', () => {
  // 状态
  const posts = ref([])
  const comments = ref([])
  const groups = ref([])
  const userPosts = ref([])

  // 计算属性
  const treeholePosts = computed(() => 
    posts.value.filter(post => post.type === 'treehole')
  )

  const discussionPosts = computed(() => 
    posts.value.filter(post => post.type === 'discussion')
  )

  const experiencePosts = computed(() => 
    posts.value.filter(post => post.type === 'experience')
  )

  const hotPosts = computed(() => 
    [...posts.value]
      .sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length))
      .slice(0, 10)
  )

  // 方法
  const addPost = (postData) => {
    const post = {
      id: generateId(),
      author: {
        nickname: postData.nickname || '匿名用户',
        avatar: postData.avatar || '/default-avatar.png',
        level: postData.level || 1
      },
      content: postData.content,
      type: postData.type || 'treehole',
      tags: postData.tags || [],
      likes: 0,
      comments: [],
      isAnonymous: postData.isAnonymous !== false,
      timestamp: new Date().toISOString(),
      status: 'published'
    }
    posts.value.unshift(post)
    userPosts.value.unshift(post)
  }

  const addComment = (postId, commentData) => {
    const comment = {
      id: generateId(),
      postId,
      author: {
        nickname: commentData.nickname || '匿名用户',
        avatar: commentData.avatar || '/default-avatar.png'
      },
      content: commentData.content,
      timestamp: new Date().toISOString(),
      isAnonymous: commentData.isAnonymous !== false
    }
    
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.comments.push(comment)
    }
    comments.value.push(comment)
  }

  const likePost = (postId) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.likes += 1
    }
  }

  const createGroup = (groupData) => {
    const group = {
      id: generateId(),
      name: groupData.name,
      description: groupData.description,
      tags: groupData.tags || [],
      members: [groupData.creatorId || 'anonymous'],
      posts: [],
      createdAt: new Date().toISOString(),
      isPrivate: groupData.isPrivate || false
    }
    groups.value.push(group)
    return group
  }

  const joinGroup = (groupId, userId = 'anonymous') => {
    const group = groups.value.find(g => g.id === groupId)
    if (group && !group.members.includes(userId)) {
      group.members.push(userId)
    }
  }

  const getPostComments = (postId) => {
    return comments.value.filter(comment => comment.postId === postId)
  }

  const searchPosts = (keyword) => {
    return posts.value.filter(post => 
      post.content.toLowerCase().includes(keyword.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    )
  }

  const getPostsByTag = (tag) => {
    return posts.value.filter(post => 
      post.tags.includes(tag)
    )
  }

  // 工具函数
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  return {
    posts,
    comments,
    groups,
    userPosts,
    treeholePosts,
    discussionPosts,
    experiencePosts,
    hotPosts,
    addPost,
    addComment,
    likePost,
    createGroup,
    joinGroup,
    getPostComments,
    searchPosts,
    getPostsByTag
  }
}, {
  persist: true
})
