<template>
  <div class="emotion-regulation-page">
    <AppHeader />
    
    <div class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><MagicStick /></el-icon>
            情绪调节
          </h1>
          <p class="page-desc">学习科学的情绪调节技巧，有效应对各种情绪状态</p>
        </div>
        
        <div class="emotion-regulation-container">
          <!-- 情绪选择 -->
          <div class="emotion-selector">
            <h3 class="section-title">你当前的情绪是？</h3>
            <div class="emotion-grid">
              <div 
                v-for="emotion in emotions" 
                :key="emotion.id"
                class="emotion-card"
                :class="{ active: selectedEmotion === emotion.id }"
                @click="selectEmotion(emotion.id)"
              >
                <div class="emotion-icon" :style="{ backgroundColor: emotion.color }">
                  <el-icon><component :is="emotion.icon" /></el-icon>
                </div>
                <h4 class="emotion-name">{{ emotion.name }}</h4>
              </div>
            </div>
          </div>
          
          <!-- 情绪调节策略 -->
          <div class="strategies-container" v-if="selectedEmotion">
            <div class="strategies-header">
              <h3 class="strategies-title">
                <span :style="{ color: currentEmotion.color }">{{ currentEmotion.name }}</span> 的调节策略
              </h3>
              <p class="strategies-desc">{{ currentEmotion.description }}</p>
            </div>
            
            <div class="strategies-grid">
              <div 
                v-for="strategy in currentEmotion.strategies" 
                :key="strategy.id"
                class="strategy-card"
                @click="selectStrategy(strategy.id)"
                :class="{ active: selectedStrategy === strategy.id }"
              >
                <div class="strategy-icon" :style="{ backgroundColor: currentEmotion.color }">
                  <el-icon><component :is="strategy.icon" /></el-icon>
                </div>
                <div class="strategy-content">
                  <h4 class="strategy-name">{{ strategy.name }}</h4>
                  <p class="strategy-desc">{{ strategy.shortDescription }}</p>
                </div>
              </div>
            </div>
            
            <!-- 选中的策略详情 -->
            <div class="strategy-details" v-if="selectedStrategy && currentStrategy">
              <div class="details-header">
                <h3 class="details-title" :style="{ color: currentEmotion.color }">
                  {{ currentStrategy.name }}
                </h3>
                <p class="details-desc">{{ currentStrategy.description }}</p>
              </div>
              
              <div class="steps-container">
                <h4 class="steps-title">实践步骤</h4>
                <ol class="steps-list">
                  <li v-for="(step, index) in currentStrategy.steps" :key="index" class="step-item">
                    <div class="step-number" :style="{ backgroundColor: currentEmotion.color }">{{ index + 1 }}</div>
                    <div class="step-content">{{ step }}</div>
                  </li>
                </ol>
              </div>
              
              <div class="tips-container" v-if="currentStrategy.tips && currentStrategy.tips.length > 0">
                <h4 class="tips-title">实用提示</h4>
                <ul class="tips-list">
                  <li v-for="(tip, index) in currentStrategy.tips" :key="index" class="tip-item">
                    <el-icon><InfoFilled /></el-icon>
                    <span>{{ tip }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="practice-container">
                <h4 class="practice-title">记录你的实践</h4>
                <div class="practice-form">
                  <div class="form-group">
                    <label>你的感受</label>
                    <el-input 
                      v-model="practiceNote.feeling" 
                      type="textarea" 
                      rows="3"
                      placeholder="描述使用这个策略后你的感受..."
                    ></el-input>
                  </div>
                  
                  <div class="form-group">
                    <label>效果评分 (1-5)</label>
                    <el-rate 
                      v-model="practiceNote.rating" 
                      :colors="rateColors"
                      :texts="rateTexts"
                      show-text
                    ></el-rate>
                  </div>
                  
                  <div class="form-actions">
                    <el-button 
                      type="primary" 
                      @click="savePracticeNote"
                      :disabled="!isPracticeNoteValid"
                      :style="{ backgroundColor: currentEmotion.color, borderColor: currentEmotion.color }"
                    >
                      保存记录
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 实践记录 -->
          <div class="practice-records">
            <h3 class="section-title">实践记录</h3>
            <div class="records-list" v-if="practiceRecords.length > 0">
              <div 
                v-for="record in practiceRecords" 
                :key="record.id"
                class="record-item"
                :style="{ borderLeftColor: getEmotionColor(record.emotionId) }"
              >
                <div class="record-header">
                  <div class="record-emotion" :style="{ backgroundColor: getEmotionColor(record.emotionId) }">
                    {{ getEmotionName(record.emotionId) }}
                  </div>
                  <div class="record-strategy">
                    {{ getStrategyName(record.emotionId, record.strategyId) }}
                  </div>
                  <div class="record-date">
                    {{ formatDate(record.date) }}
                  </div>
                </div>
                
                <div class="record-body">
                  <div class="record-feeling">
                    <h5>我的感受</h5>
                    <p>{{ record.feeling }}</p>
                  </div>
                  
                  <div class="record-rating">
                    <h5>效果评分</h5>
                    <el-rate 
                      v-model="record.rating" 
                      disabled 
                      :colors="rateColors"
                    ></el-rate>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="no-records" v-else>
              <el-icon class="no-records-icon"><MagicStick /></el-icon>
              <p>还没有实践记录</p>
              <p>选择一种情绪和调节策略，开始你的情绪调节之旅吧！</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AppFooter from '@/components/common/AppFooter.vue'

// 情绪数据
const emotions = ref([
  {
    id: 'anxiety',
    name: '焦虑',
    color: '#FFD166',
    icon: 'Loading',
    description: '焦虑是对未来不确定性的担忧和恐惧，常伴随着紧张、不安和生理反应。',
    strategies: [
      {
        id: 'deep-breathing',
        name: '深呼吸练习',
        icon: 'WindPower',
        shortDescription: '通过有意识的深呼吸，缓解焦虑症状',
        description: '深呼吸是一种简单有效的放松技巧，可以帮助你在焦虑时平静下来。通过控制呼吸节奏，你可以降低心率，减轻身体紧张感。',
        steps: [
          '找一个安静、舒适的地方坐下或躺下',
          '将一只手放在胸口，另一只手放在腹部',
          '缓慢地通过鼻子吸气，感受腹部隆起（而非胸部）',
          '屏住呼吸几秒钟',
          '然后通过嘴巴缓慢呼气，感受腹部收缩',
          '重复这个过程5-10分钟，专注于呼吸的感觉'
        ],
        tips: [
          '尝试使用4-7-8呼吸法：吸气4秒，屏住呼吸7秒，呼气8秒',
          '在日常生活中定期练习，而不仅仅是在焦虑发作时',
          '可以配合轻柔的背景音乐增强放松效果'
        ]
      },
      {
        id: 'grounding',
        name: '5-4-3-2-1接地练习',
        icon: 'Aim',
        shortDescription: '通过感官体验将注意力拉回当下',
        description: '接地练习是一种正念技巧，通过引导你关注当下的感官体验，帮助你从焦虑思维中脱离出来，重新与当前时刻建立联系。',
        steps: [
          '找到5个你能看到的东西，并在心里默念它们',
          '找到4个你能触摸到的东西，感受它们的质地',
          '找到3个你能听到的声音，专注倾听',
          '找到2个你能闻到的气味',
          '找到1个你能尝到的味道',
          '完成后，注意观察你的焦虑是否有所减轻'
        ],
        tips: [
          '在任何地方都可以进行这个练习，无需特殊设备',
          '尽可能详细地描述每个感官体验',
          '如果在公共场合，可以在心里默默进行'
        ]
      },
      {
        id: 'thought-challenge',
        name: '思维挑战',
        icon: 'QuestionFilled',
        shortDescription: '识别并质疑焦虑思维模式',
        description: '思维挑战是一种认知行为疗法技巧，通过识别和质疑引起焦虑的负面自动化思维，帮助你建立更平衡、更现实的思维方式。',
        steps: [
          '识别引发焦虑的具体想法（例如："我一定会失败"）',
          '评估这个想法的证据：有什么证据支持或反对这个想法？',
          '考虑替代解释：还有哪些其他可能的解释？',
          '思考最坏情况：如果最坏的情况发生了，你能应对吗？',
          '制定应对计划：如果担心的事情发生，你会如何处理？',
          '用更平衡的想法替换原来的想法'
        ],
        tips: [
          '尝试将你的想法写下来，这样更容易客观分析',
          '想象你在给朋友提建议，而不是评判自己',
          '定期练习这种技巧，它会随着时间变得更加自然'
        ]
      }
    ]
  },
  {
    id: 'anger',
    name: '愤怒',
    color: '#EF476F',
    icon: 'Lightning',
    description: '愤怒是一种强烈的情绪反应，通常源于感到被冒犯、不公平对待或受到威胁。',
    strategies: [
      {
        id: 'timeout',
        name: '暂停冷静',
        icon: 'Timer',
        shortDescription: '暂时离开触发情境，给自己冷静的时间',
        description: '暂停冷静是一种简单但有效的愤怒管理技巧，通过暂时离开引发愤怒的情境，给自己一个冷静下来的机会，防止说出或做出后悔的事情。',
        steps: [
          '当你感到愤怒上升时，告诉自己或他人你需要暂停一下',
          '离开当前环境，找一个安静的地方',
          '深呼吸几次，放松身体紧张的肌肉',
          '给自己至少10-20分钟的冷静时间',
          '在冷静后，思考如何以建设性的方式回应情况',
          '当你感觉准备好了，再回到情境中'
        ],
        tips: [
          '提前与家人、朋友或同事约定"暂停"信号',
          '在暂停期间避免反复思考激怒你的事情',
          '使用这段时间进行深呼吸或简短的放松练习'
        ]
      },
      {
        id: 'reframe',
        name: '认知重构',
        icon: 'RefreshRight',
        shortDescription: '改变对情境的解释和看法',
        description: '认知重构是一种通过改变对情境的解释和看法来管理愤怒的技巧。它帮助你识别和挑战引发愤怒的不合理想法，用更平衡的视角替代它们。',
        steps: [
          '识别引发愤怒的具体想法（例如："他故意让我难堪"）',
          '质疑这个想法：你有什么证据支持这个想法？有没有其他可能的解释？',
          '考虑对方的视角和可能的动机',
          '思考更合理、更平衡的解释',
          '用新的解释替换原来的想法',
          '注意观察你的愤怒是否有所减轻'
        ],
        tips: [
          '避免使用"总是"、"从不"等绝对词汇',
          '尝试将情境视为问题而非人身攻击',
          '记住，理解他人并不意味着你必须同意他们'
        ]
      },
      {
        id: 'expression',
        name: '适当表达',
        icon: 'ChatDotRound',
        shortDescription: '以建设性的方式表达愤怒情绪',
        description: '适当表达是一种通过以建设性、非攻击性的方式表达愤怒情绪的技巧。它帮助你清晰地传达你的感受和需求，而不会伤害关系。',
        steps: [
          '等到你足够冷静，能够理性交流',
          '使用"我"陈述句表达你的感受（例如："当...发生时，我感到..."）',
          '具体描述行为，而不是评判对方的性格',
          '表达你的需求和期望',
          '倾听对方的回应，保持开放的态度',
          '寻找双方都能接受的解决方案'
        ],
        tips: [
          '避免指责、威胁或侮辱性语言',
          '注意你的语调和肢体语言',
          '选择适当的时间和地点进行对话'
        ]
      }
    ]
  },
  {
    id: 'sadness',
    name: '悲伤',
    color: '#118AB2',
    icon: 'Cloudy',
    description: '悲伤是对失去或失败的自然情绪反应，可能伴随着失落感、无力感和退缩行为。',
    strategies: [
      {
        id: 'self-compassion',
        name: '自我关怀',
        icon: 'Star',
        shortDescription: '以友善和理解的态度对待自己',
        description: '自我关怀是一种通过以友善、理解和接纳的态度对待自己的悲伤情绪的技巧。它帮助你在困难时刻对自己保持温和和支持。',
        steps: [
          '承认并接纳你的悲伤感受，不要压抑或否认它们',
          '提醒自己悲伤是人类共同的体验，你并不孤单',
          '对自己说一些鼓励和安慰的话，就像对待好朋友一样',
          '关注自己的需求，做一些能带来舒适和安慰的事情',
          '给自己一些空间和时间来处理情绪',
          '避免自我批评和苛责'
        ],
        tips: [
          '尝试写一封给自己的友善信',
          '想象如果好朋友处于你的情况，你会对他们说什么',
          '在感到悲伤时，更加注意自我照顾（如充足睡眠、健康饮食）'
        ]
      },
      {
        id: 'gratitude',
        name: '感恩练习',
        icon: 'Present',
        shortDescription: '关注生活中积极的方面',
        description: '感恩练习是一种通过有意识地关注和欣赏生活中积极方面来调节悲伤情绪的技巧。它帮助你拓宽视角，不仅看到损失，也看到仍然存在的美好。',
        steps: [
          '每天花几分钟时间思考或记录你感恩的事物',
          '尝试找出至少3-5件你感到感激的事情，无论大小',
          '具体描述为什么你对这些事物感到感激',
          '注意感恩时的身体感受',
          '随着时间的推移，尝试发现新的感恩事物，而不仅仅是重复相同的内容',
          '考虑与他人分享你的感恩'
        ],
        tips: [
          '创建一个感恩日记，定期记录',
          '即使在困难时期，也尝试找出一些小的感恩事项',
          '将感恩练习融入日常生活，如在睡前回顾'
        ]
      },
      {
        id: 'social-connection',
        name: '社交连接',
        icon: 'UserFilled',
        shortDescription: '寻求社会支持和连接',
        description: '社交连接是一种通过与他人建立和维持有意义的联系来应对悲伤的技巧。社会支持可以提供情感安慰、实际帮助和不同的视角。',
        steps: [
          '识别你信任和感到舒适的人',
          '主动联系朋友、家人或支持群体',
          '坦诚分享你的感受和经历',
          '明确表达你需要的支持类型（倾听、建议、陪伴等）',
          '也关注他人的需求，保持互惠的关系',
          '参与社交活动或志愿服务，增强归属感'
        ],
        tips: [
          '不要等到感觉非常糟糕时才寻求支持',
          '记住，寻求帮助是力量的表现，而非软弱',
          '如果面对面交流困难，可以考虑电话、短信或视频通话'
        ]
      }
    ]
  },
  {
    id: 'stress',
    name: '压力',
    color: '#073B4C',
    icon: 'Histogram',
    description: '压力是身体和心理对要求和挑战的反应，可能来自工作、学习、人际关系等多个方面。',
    strategies: [
      {
        id: 'time-management',
        name: '时间管理',
        icon: 'Calendar',
        shortDescription: '有效规划和利用时间',
        description: '时间管理是一种通过有效规划和利用时间来减轻压力的技巧。它帮助你优先处理重要任务，避免拖延，并在繁忙的日程中创造平衡。',
        steps: [
          '列出所有需要完成的任务',
          '根据重要性和紧急性对任务进行分类',
          '设定明确、具体、可实现的目标',
          '创建日程表或使用时间管理工具',
          '将大任务分解为小步骤',
          '设置适当的休息时间',
          '定期回顾和调整你的计划'
        ],
        tips: [
          '使用番茄工作法：专注工作25分钟，然后休息5分钟',
          '学会说"不"，避免过度承诺',
          '识别并减少时间浪费活动'
        ]
      },
      {
        id: 'physical-activity',
        name: '身体活动',
        icon: 'Place',
        shortDescription: '通过运动释放压力',
        description: '身体活动是一种通过运动来减轻压力的有效技巧。运动可以释放内啡肽，改善心情，增强身体健康，并提供从压力源中暂时分离的机会。',
        steps: [
          '选择你喜欢的运动形式（如散步、跑步、游泳、瑜伽等）',
          '设定现实的运动目标，从小开始',
          '在日程表中安排固定的运动时间',
          '注意运动过程中的身体感受',
          '运动后留意心情和压力水平的变化',
          '逐渐增加运动的频率和强度'
        ],
        tips: [
          '即使只有10分钟的短暂活动也有益处',
          '尝试户外运动，结合自然环境的额外好处',
          '考虑与朋友一起运动，增加社交元素和坚持动力'
        ]
      },
      {
        id: 'mindfulness',
        name: '正念练习',
        icon: 'MagicStick',
        shortDescription: '专注当下，不加评判',
        description: '正念是一种通过有意识地关注当下体验，不加评判地觉察思想、情绪和感受的技巧。它帮助你从压力思维中脱离，减少对过去的懊悔和对未来的担忧。',
        steps: [
          '找一个安静、舒适的地方坐下',
          '将注意力集中在呼吸上，感受空气的进出',
          '当思绪wandering时，温和地将注意力带回呼吸',
          '扩展觉察到身体感受、声音、思想和情绪',
          '以开放、接纳的态度观察这些体验，不做评判',
          '开始时练习5-10分钟，逐渐延长时间'
        ],
        tips: [
          '可以使用引导式冥想应用或音频辅助练习',
          '将正念融入日常活动，如正念进食、正念行走',
          '记住，走神是正常的，关键是温和地将注意力带回'
        ]
      }
    ]
  },
  {
    id: 'fear',
    name: '恐惧',
    color: '#6A4C93',
    icon: 'Warning',
    description: '恐惧是面对威胁或危险时的自然反应，可能源于实际危险或对未知的担忧。',
    strategies: [
      {
        id: 'exposure',
        name: '渐进式暴露',
        icon: 'Promotion',
        shortDescription: '逐步面对恐惧源',
        description: '渐进式暴露是一种通过逐步、系统地面对恐惧源来减轻恐惧的技巧。它基于这样的原理：通过反复接触恐惧对象而不发生负面后果，恐惧反应会逐渐减弱。',
        steps: [
          '创建一个恐惧阶梯，从最轻微到最强烈的恐惧情境',
          '从最低级别的恐惧开始',
          '在每个级别上，保持暴露直到焦虑明显减轻（通常15-30分钟）',
          '使用放松技巧帮助管理暴露过程中的不适',
          '只有当你能够相对舒适地处理当前级别时，才移动到下一级',
          '定期练习，保持一致性'
        ],
        tips: [
          '可以先从想象暴露开始，再过渡到实际暴露',
          '设定现实的期望，恐惧减轻是渐进的过程',
          '考虑寻求专业人士的指导，特别是对于严重恐惧'
        ]
      },
      {
        id: 'reality-testing',
        name: '现实检验',
        icon: 'Search',
        shortDescription: '评估恐惧的真实风险',
        description: '现实检验是一种通过客观评估恐惧的真实风险和可能性来减轻不合理恐惧的技巧。它帮助你区分真实威胁和被夸大的担忧。',
        steps: [
          '明确识别你的具体恐惧（例如："我害怕在公共场合讲话会出丑"）',
          '评估这种情况发生的实际可能性',
          '考虑最坏情况、最好情况和最可能的情况',
          '收集证据支持或反驳你的恐惧',
          '思考过去类似情况的实际结果',
          '制定应对计划，如果担心的情况确实发生'
        ],
        tips: [
          '尝试以第三人称思考问题，增加客观性',
          '咨询他人的观点，获得不同视角',
          '记录你的恐惧和实际结果，建立证据库'
        ]
      },
      {
        id: 'visualization',
        name: '积极想象',
        icon: 'PictureFilled',
        shortDescription: '想象成功应对恐惧情境',
        description: '积极想象是一种通过在心中生动地想象自己成功应对恐惧情境的技巧。它帮助你建立信心，减轻恐惧，并为实际情况做好心理准备。',
        steps: [
          '找一个安静、舒适的地方，闭上眼睛',
          '进行几次深呼吸，放松身体',
          '想象自己面对恐惧情境的场景，尽可能生动详细',
          '在想象中，看到自己冷静、自信地应对情况',
          '感受成功克服恐惧后的积极情绪',
          '定期练习这种想象，特别是在面对实际情境前'
        ],
        tips: [
          '使用所有感官进行想象：视觉、听觉、触觉等',
          '如果想象中出现负面场景，温和地将其转向积极结果',
          '结合放松技巧，如深呼吸或渐进式肌肉放松'
        ]
      }
    ]
  },
  {
    id: 'joy',
    name: '喜悦',
    color: '#06D6A0',
    icon: 'Sunny',
    description: '喜悦是一种积极的情绪体验，通常伴随着满足感、幸福感和活力。',
    strategies: [
      {
        id: 'savoring',
        name: '品味体验',
        icon: 'IceCream',
        shortDescription: '充分体验和延长积极情绪',
        description: '品味是一种通过有意识地关注、欣赏和延长积极体验来增强喜悦的技巧。它帮助你从日常生活中获取更多的快乐和满足。',
        steps: [
          '识别值得品味的积极体验（可以是过去、现在或未来的事件）',
          '放慢脚步，全神贯注于这个体验',
          '使用所有感官去感受：看到、听到、触摸、味道和气味',
          '表达你的喜悦，与他人分享',
          '拍照或记录下来，创造持久的记忆',
          '反思这个体验对你的意义'
        ],
        tips: [
          '尝试品味日常小事，如一杯好茶、阳光或友善的微笑',
          '避免在品味时分心，如查看手机',
          '创建"品味相册"收集美好时刻的照片或记忆'
        ]
      },
      {
        id: 'kindness',
        name: '善行实践',
        icon: 'GoodsFilled',
        shortDescription: '通过帮助他人增强喜悦',
        description: '善行实践是一种通过帮助他人来增强自身喜悦的技巧。研究表明，利他行为不仅对接受者有益，也能提升施予者的幸福感和满足感。',
        steps: [
          '思考你可以如何帮助或支持他人',
          '选择一个符合你能力和兴趣的善行',
          '付诸行动，不期待回报',
          '注意行动过程中和之后的感受',
          '反思这个经历对你和他人的影响',
          '将善行融入日常生活习惯'
        ],
        tips: [
          '善行不必是大事，小小的帮助和关心也很有价值',
          '尝试匿名行善，关注纯粹的给予感受',
          '寻找与你价值观一致的志愿服务机会'
        ]
      },
      {
        id: 'flow',
        name: '心流体验',
        icon: 'Ship',
        shortDescription: '全身心投入有挑战性的活动',
        description: '心流是一种全身心投入有挑战性且有意义的活动时的最佳体验状态。在心流状态中，你会感到时间飞逝，完全专注，并从活动本身获得内在满足。',
        steps: [
          '识别能让你进入心流状态的活动（通常是有挑战性但又在你能力范围内的活动）',
          '创造无干扰的环境',
          '设定明确的目标',
          '全身心投入活动，不分心',
          '关注过程而非结果',
          '活动后反思你的体验'
        ],
        tips: [
          '寻找技能和挑战平衡的活动',
          '定期安排时间进行这些活动',
          '注意调整活动难度，保持适当挑战性'
        ]
      }
    ]
  }
])

// 状态管理
const selectedEmotion = ref('')
const selectedStrategy = ref('')
const practiceNote = ref({
  feeling: '',
  rating: 3
})
const practiceRecords = ref([])

// 评分颜色和文本
const rateColors = ['#F56C6C', '#E6A23C', '#E6A23C', '#67C23A', '#67C23A']
const rateTexts = ['很差', '较差', '一般', '良好', '很好']

// 计算属性
const currentEmotion = computed(() => {
  return emotions.value.find(emotion => emotion.id === selectedEmotion.value) || {}
})

const currentStrategy = computed(() => {
  if (!currentEmotion.value.strategies) return null
  return currentEmotion.value.strategies.find(strategy => strategy.id === selectedStrategy.value) || null
})

const isPracticeNoteValid = computed(() => {
  return practiceNote.value.feeling.trim() !== ''
})

// 方法
const selectEmotion = (emotionId) => {
  selectedEmotion.value = emotionId
  selectedStrategy.value = ''
}

const selectStrategy = (strategyId) => {
  selectedStrategy.value = strategyId
  
  // 重置实践记录表单
  practiceNote.value = {
    feeling: '',
    rating: 3
  }
}

const savePracticeNote = () => {
  if (!isPracticeNoteValid.value || !selectedEmotion.value || !selectedStrategy.value) return
  
  const newRecord = {
    id: Date.now().toString(),
    emotionId: selectedEmotion.value,
    strategyId: selectedStrategy.value,
    feeling: practiceNote.value.feeling.trim(),
    rating: practiceNote.value.rating,
    date: new Date()
  }
  
  practiceRecords.value.unshift(newRecord)
  savePracticeRecords()
  
  // 重置表单
  practiceNote.value = {
    feeling: '',
    rating: 3
  }
  
  // 显示成功消息
  ElMessage.success('记录已保存！')
}

// 辅助函数
const getEmotionColor = (emotionId) => {
  const emotion = emotions.value.find(e => e.id === emotionId)
  return emotion ? emotion.color : '#999'
}

const getEmotionName = (emotionId) => {
  const emotion = emotions.value.find(e => e.id === emotionId)
  return emotion ? emotion.name : '未知情绪'
}

const getStrategyName = (emotionId, strategyId) => {
  const emotion = emotions.value.find(e => e.id === emotionId)
  if (!emotion || !emotion.strategies) return '未知策略'
  
  const strategy = emotion.strategies.find(s => s.id === strategyId)
  return strategy ? strategy.name : '未知策略'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 本地存储
const loadPracticeRecords = () => {
  try {
    const savedRecords = localStorage.getItem('emotionRegulationRecords')
    if (savedRecords) {
      practiceRecords.value = JSON.parse(savedRecords)
    }
  } catch (error) {
    console.error('加载实践记录失败:', error)
  }
}

const savePracticeRecords = () => {
  try {
    localStorage.setItem('emotionRegulationRecords', JSON.stringify(practiceRecords.value))
  } catch (error) {
    console.error('保存实践记录失败:', error)
  }
}

onMounted(() => {
  // 加载保存的记录
  loadPracticeRecords()
})
</script>

<style scoped lang="scss">
.emotion-regulation-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
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
    color: #6A4C93;
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

.emotion-regulation-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.emotion-selector {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.section-title {
  color: #6A4C93;
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.emotion-card {
  background: #FAFAFA;
  border: 2px solid #E0E0E0;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: currentColor;
    background: rgba(106, 76, 147, 0.05);
  }
}

.emotion-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  color: white;
  
  .el-icon {
    font-size: 30px;
  }
}

.emotion-name {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.strategies-container {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.strategies-header {
  text-align: center;
  margin-bottom: 30px;
  
  .strategies-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .strategies-desc {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

.strategies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.strategy-card {
  background: #FAFAFA;
  border: 2px solid #E0E0E0;
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: currentColor;
    background: rgba(106, 76, 147, 0.05);
  }
}

.strategy-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  
  .el-icon {
    font-size: 24px;
  }
}

.strategy-content {
  flex: 1;
}

.strategy-name {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.strategy-desc {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.strategy-details {
  background: #FAFAFA;
  border-radius: 15px;
  padding: 30px;
  margin-top: 20px;
}

.details-header {
  margin-bottom: 25px;
  
  .details-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .details-desc {
    color: #333;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
  }
}

.steps-container, .tips-container {
  margin-bottom: 30px;
}

.steps-title, .tips-title, .practice-title {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.steps-list {
  padding-left: 0;
  list-style: none;
  counter-reset: step-counter;
}

.step-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 15px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
  color: #333;
  line-height: 1.6;
  padding-top: 5px;
}

.tips-list {
  list-style: none;
  padding-left: 0;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  color: #666;
  
  .el-icon {
    color: #6A4C93;
    margin-right: 10px;
    margin-top: 3px;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.practice-container {
  background: white;
  border-radius: 15px;
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
  }
}

.form-actions {
  text-align: right;
}

.practice-records {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.record-item {
  background: #FAFAFA;
  border-radius: 10px;
  padding: 20px;
  border-left: 4px solid #6A4C93;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.record-emotion {
  padding: 4px 12px;
  border-radius: 15px;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.record-strategy {
  color: #333;
  font-weight: 500;
}

.record-date {
  color: #999;
  font-size: 14px;
}

.record-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  
  h5 {
    color: #6A4C93;
    margin: 0 0 10px 0;
    font-size: 14px;
  }
  
  p {
    color: #333;
    margin: 0;
    line-height: 1.5;
  }
}

.no-records {
  text-align: center;
  padding: 40px;
  color: #666;
  
  .no-records-icon {
    font-size: 48px;
    color: #6A4C93;
    margin-bottom: 15px;
  }
  
  p {
    margin: 5px 0;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .emotion-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .strategies-grid {
    grid-template-columns: 1fr;
  }
  
  .strategy-details {
    padding: 20px;
  }
}
</style>