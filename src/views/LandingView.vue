<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar">
      <RouterLink to="/" class="navbar-logo">
        <Hexagon :size="28" />
        Graftra
      </RouterLink>
      <div class="nav-links">
        <a href="#" class="nav-link" @click.prevent="scrollToSection('hero')">首页</a>
        <a href="#features" class="nav-link" @click.prevent="scrollToSection('features')">功能</a>
        <a href="#pricing" class="nav-link" @click.prevent="scrollToSection('pricing')">定价</a>

        <!-- Documents Dropdown -->
        <div class="nav-item">
          <a href="#" class="nav-link">
            <ChevronDown :size="16" />
            文档
          </a>
          <div class="nav-dropdown">
            <a href="#" class="dropdown-item disabled" @click.prevent>
              <div class="dropdown-icon">
                <BookOpen :size="20" />
              </div>
              <div class="dropdown-content">
                <div class="dropdown-title">
                  使用文档
                  <span class="coming-soon-tag"><Clock :size="10" />即将推出</span>
                </div>
                <div class="dropdown-desc">快速上手，了解所有功能</div>
              </div>
            </a>
            <a href="#" class="dropdown-item disabled" @click.prevent>
              <div class="dropdown-icon">
                <GraduationCap :size="20" />
              </div>
              <div class="dropdown-content">
                <div class="dropdown-title">
                  视频教程
                  <span class="coming-soon-tag"><Clock :size="10" />即将推出</span>
                </div>
                <div class="dropdown-desc">从入门到精通的视频指南</div>
              </div>
            </a>
          </div>
        </div>

        <!-- Community Dropdown -->
        <div class="nav-item">
          <a href="#" class="nav-link">
            <ChevronDown :size="16" />
            社区
          </a>
          <div class="nav-dropdown">
            <a href="#" class="dropdown-item disabled" @click.prevent>
              <div class="dropdown-icon">
                <MessageCircle :size="20" />
              </div>
              <div class="dropdown-content">
                <div class="dropdown-title">
                  用户社区
                  <span class="coming-soon-tag"><Clock :size="10" />即将推出</span>
                </div>
                <div class="dropdown-desc">与 10,000+ 用户交流经验</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="navbar-actions">
        <UserMenu />
        <RouterLink to="/app" class="btn btn-primary">
          开始使用
          <ArrowRight :size="16" />
        </RouterLink>
        <button class="mobile-menu-btn" aria-label="菜单">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="hero">
      <div class="hero-bg-pattern"></div>
      <div class="hero-bg-subtle"></div>

      <div class="hero-container">
        <div class="hero-left">
          <div class="hero-badge fade-in">
            <Sparkles :size="16" />
            AI 智能图表生成
          </div>
          <h1 class="hero-title fade-in stagger-1">
            Graftra・文字一键变专业图表
          </h1>
          <p class="hero-slogan fade-in stagger-2">
            不用排版、不用设计，复杂内容一眼看懂
          </p>
          <p class="hero-subtitle fade-in stagger-2">
            Graftra 让文字自动变成清晰、高级、可直接使用的流程图与示意图。不用动手画，不用懂设计，粘贴文字就能生成专业好看的可视化图表，还能轻松编辑、修改、导出。
          </p>
          <div class="hero-actions fade-in stagger-3">
            <RouterLink to="/app" class="btn btn-primary">
              立即免费使用
              <ArrowRight :size="16" />
            </RouterLink>
            <a href="#" class="btn btn-ghost">
              <PlayCircle :size="16" />
              观看演示
            </a>
          </div>
        </div>

        <div class="hero-right fade-in stagger-2">
          <div class="browser-mockup">
            <div class="browser-header">
              <div class="browser-dots">
                <div class="browser-dot"></div>
                <div class="browser-dot"></div>
                <div class="browser-dot"></div>
              </div>
              <div class="browser-address">graftra.app</div>
            </div>
            <div class="browser-content">
              <div class="flow-grid"></div>

              <!-- Input Text Area -->
              <div class="text-input-area">
                <div class="text-input-header">
                  <Type :size="16" />
                  <span>输入文本</span>
                </div>
                <div class="text-input-content">
                  <span class="text-line">用户访问落地页</span>
                  <span class="text-line">↓ 点击注册按钮</span>
                  <span class="text-line">填写表单信息</span>
                  <span class="text-line">↓ 提交注册</span>
                  <span class="text-line">获得免费资源</span>
                </div>
              </div>

              <!-- Convert Arrow -->
              <div class="convert-arrow">
                <ArrowDown :size="24" :stroke-width="2" style="color: #3B82F6" />
                <span class="convert-label">AI 生成</span>
              </div>

              <!-- Generated Flowchart -->
              <div class="generated-flowchart">
                <div class="flow-node inline-node start">
                  <div class="flow-node-icon">
                    <Home :size="16" />
                  </div>
                  <span class="flow-node-text">落地页</span>
                </div>
                <div class="flow-arrow-down"></div>
                <div class="flow-node inline-node">
                  <div class="flow-node-icon">
                    <MousePointer2 :size="16" />
                  </div>
                  <span class="flow-node-text">点击注册</span>
                </div>
                <div class="flow-arrow-down"></div>
                <div class="flow-node inline-node">
                  <div class="flow-node-icon">
                    <FileText :size="16" />
                  </div>
                  <span class="flow-node-text">填写信息</span>
                </div>
                <div class="flow-arrow-down"></div>
                <div class="flow-node inline-node success">
                  <div class="flow-node-icon">
                    <Gift :size="16" />
                  </div>
                  <span class="flow-node-text">获得资源</span>
                </div>
              </div>

              <div class="browser-footer">
                <div class="browser-control">+</div>
                <div class="browser-control">-</div>
                <div class="browser-control">⌂</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="section-header">
        <span class="section-label">核心功能</span>
        <h2 class="section-title">AI 智能图表生成</h2>
        <p class="section-desc">强大的 AI 功能，让您的工作效率倍增</p>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <Sparkles :size="32" />
          </div>
          <h3 class="feature-title">AI 核心功能</h3>
          <p class="feature-desc">智能识别内容结构，自动生成专业流程图</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <Wand2 :size="32" />
          </div>
          <h3 class="feature-title">AI 智能优化</h3>
          <p class="feature-desc">自动优化布局和样式，让图表更美观</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <Users :size="32" />
          </div>
          <h3 class="feature-title">团队协作</h3>
          <p class="feature-desc">支持多人协作编辑，实时同步更新</p>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process">
      <div class="section-header">
        <span class="section-label">使用流程</span>
        <h2 class="section-title">简单三步，轻松上手</h2>
        <p class="section-desc">无需专业设计技能，几分钟即可生成专业图表</p>
      </div>

      <div class="process-timeline">
        <div class="process-step">
          <div class="step-number">1</div>
          <h3 class="step-title">输入内容</h3>
          <p class="step-desc">上传文档或直接输入文字描述</p>
        </div>
        <div class="process-step">
          <div class="step-number">2</div>
          <h3 class="step-title">AI 生成</h3>
          <p class="step-desc">AI 自动分析并生成流程图</p>
        </div>
        <div class="process-step">
          <div class="step-number">3</div>
          <h3 class="step-title">导出使用</h3>
          <p class="step-desc">编辑优化后导出多种格式</p>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing">
      <div class="section-header">
        <span class="section-label fade-in">Pricing</span>
        <h2 class="section-title fade-in stagger-1">选择适合您的方案</h2>
        <p class="section-desc fade-in stagger-2">从免费开始，按需升级，随时取消</p>
      </div>

      <!-- Pricing Toggle -->
      <div class="pricing-toggle fade-in stagger-2">
        <span
          class="pricing-toggle-label"
          :class="{ active: billingPeriod === 'month' }"
          @click="billingPeriod = 'month'"
        >月付</span>
        <div
          class="pricing-toggle-switch"
          :class="{ active: billingPeriod === 'year' }"
          @click="billingPeriod = billingPeriod === 'month' ? 'year' : 'month'"
        ></div>
        <span
          class="pricing-toggle-label"
          :class="{ active: billingPeriod === 'year' }"
          @click="billingPeriod = 'year'"
        >年付 <span style="color: var(--accent-600); font-size: 13px;">省 20%</span></span>
      </div>

      <!-- Pricing Cards -->
      <div class="pricing-grid">
        <!-- Free Plan -->
        <div class="pricing-card fade-in stagger-1">
          <div class="pricing-plan">免费版</div>
          <div class="pricing-price">
            <span class="pricing-currency">¥</span>
            <span class="pricing-amount">0</span>
            <span class="pricing-period">/月</span>
          </div>
          <p class="pricing-desc">适合个人用户和轻度使用</p>
          <ul class="pricing-features">
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">每月 50 次生成</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">最多 5 个节点</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">基础样式模板</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">PNG/SVG 导出</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon excluded">
                <X :size="14" />
              </div>
              <span class="pricing-feature-text excluded">AI 后处理</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon excluded">
                <X :size="14" />
              </div>
              <span class="pricing-feature-text excluded">可编辑导出</span>
            </li>
          </ul>
          <RouterLink to="/app" class="pricing-cta pricing-cta-secondary">
            免费开始
          </RouterLink>
        </div>

        <!-- Pro Plan -->
        <div class="pricing-card popular fade-in stagger-2">
          <div class="pricing-card-popular">最受欢迎</div>
          <div class="pricing-plan">专业版</div>
          <div class="pricing-save">年付立减 ¥68</div>
          <div class="pricing-price">
            <span class="pricing-currency">¥</span>
            <span class="pricing-amount">{{ billingPeriod === 'month' ? 29 : 279 }}</span>
            <span class="pricing-period">/月</span>
          </div>
          <p class="pricing-desc">适合专业用户和小团队</p>
          <ul class="pricing-features">
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">每月 500 次生成</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">最多 50 个节点</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">全部样式模板</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">PNG/SVG/PDF 导出</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">AI 文字修复</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">矢量图替换</span>
            </li>
          </ul>
          <button class="pricing-cta pricing-cta-primary" @click="openPaymentModal">
            立即升级
          </button>
        </div>

        <!-- Enterprise Plan -->
        <div class="pricing-card fade-in stagger-3">
          <div class="pricing-badge">定制方案</div>
          <div class="pricing-plan">企业版</div>
          <div class="pricing-price">
            <span class="pricing-amount" style="font-size: 32px;">联系销售</span>
          </div>
          <p class="pricing-desc">适合大型团队和定制需求</p>
          <ul class="pricing-features">
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">无限次生成</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">无限节点数量</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">定制样式开发</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">API 接口访问</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">专属技术支持</span>
            </li>
            <li class="pricing-feature">
              <div class="pricing-feature-icon included">
                <Check :size="14" />
              </div>
              <span class="pricing-feature-text">私有化部署</span>
            </li>
          </ul>
          <a href="mailto:enterprise@graftra.com" class="pricing-cta pricing-cta-secondary">
            联系销售
          </a>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-bg"></div>
      <div class="cta-decoration cta-decoration-1"></div>
      <div class="cta-decoration cta-decoration-2"></div>
      <div class="cta-content">
        <h2 class="cta-title">立即开始使用</h2>
        <p class="cta-subtitle">免费体验 AI 智能图表生成的强大功能</p>
        <RouterLink to="/app" class="cta-btn">
          立即免费使用
          <ArrowRight :size="20" />
        </RouterLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-logo">
        <Hexagon :size="28" />
        Graftra
      </div>
      <div class="footer-links">
        <a href="#" class="footer-link">关于我们</a>
        <a href="#" class="footer-link">使用条款</a>
        <a href="#" class="footer-link">隐私政策</a>
        <a href="#" class="footer-link">联系我们</a>
      </div>
      <p class="footer-copyright">© 2024 Graftra. All rights reserved.</p>
    </footer>

    <!-- Payment Modal -->
    <div class="payment-modal-overlay" :class="{ active: paymentModal.show }" @click.self="closePaymentModal">
      <div class="payment-qr-modal" @click.stop>
        <div class="payment-modal-header">
          <h3 class="payment-modal-title">{{ paymentModal.method === 'wechat' ? '微信支付' : '支付宝支付' }}</h3>
          <button class="payment-modal-close" @click="closePaymentModal">
            <X :size="20" />
          </button>
        </div>

        <div class="payment-qr-body">
          <h4 class="payment-qr-title">请使用{{ paymentModal.method === 'wechat' ? '微信' : '支付宝' }}扫码支付</h4>
          <p class="payment-qr-desc">支付完成后将自动跳转</p>
          <div class="payment-qr-code">
            <div v-if="paymentModal.loadingQR" class="qr-placeholder">
              <Loader2 :size="48" class="loading-spinner" />
              <div>正在生成支付二维码...</div>
            </div>
            <img v-else :src="paymentModal.qrCodeData" alt="支付二维码" class="qr-image">
            <div v-if="paymentModal.paymentSuccess" class="qr-success-overlay">
              <CheckCircle :size="64" :style="{ color: 'var(--primary)' }" />
              <p>支付成功</p>
            </div>
          </div>
          <div class="payment-qr-tips">
            <Lightbulb :size="16" />
            <span>支付过程中请勿关闭窗口</span>
          </div>
          <div class="payment-qr-status" v-if="!paymentModal.paymentSuccess">
            <div v-if="!paymentModal.loadingQR" class="payment-qr-spinner"></div>
            <span>{{ paymentModal.loadingQR ? '准备中...' : paymentModal.paymentSuccess ? '支付成功' : '等待支付中...' }}</span>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="payment-order-summary">
          <div class="payment-order-title">订单信息</div>
          <div class="payment-order-plan">
            <div class="payment-order-plan-name">Graftra 专业版 - {{ paymentModal.period === 'month' ? '月付' : '年付' }}</div>
            <div class="payment-order-plan-price">¥{{ paymentModal.period === 'month' ? 29 : 279 }}</div>
          </div>
        </div>

        <!-- Success Modal Content -->
        <div v-if="paymentModal.paymentSuccess" class="payment-success-content">
          <p class="payment-success-title">升级成功！您现在是专业版用户</p>
          <p class="payment-success-desc">正在跳转到应用...</p>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" :class="{ show: toast.show }">
      <div class="toast-icon">
        <Check :size="14" />
      </div>
      <div class="toast-message">{{ toast.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import UserMenu from '@/components/UserMenu.vue'
import {
  Hexagon,
  ChevronDown,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Clock,
  ArrowRight,
  Sparkles,
  PlayCircle,
  Type,
  ArrowDown,
  Home,
  MousePointer2,
  FileText,
  Gift,
  Wand2,
  Users,
  Check,
  X,
  Loader2,
  Lightbulb,
  CheckCircle
} from 'lucide-vue-next'
import QRCode from 'qrcode'

const router = useRouter()
const billingPeriod = ref<'month' | 'year'>('month')
const toast = ref({ show: false, message: '' })

// Payment Modal State
const paymentModal = ref({
  show: false,
  method: 'wechat' as 'wechat' | 'alipay',
  period: 'month' as 'month' | 'year',
  loadingQR: false,
  qrCodeData: '',
  paymentSuccess: false
})

let paymentCheckTimer: number | null = null

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const navbarHeight = 80 // 导航栏高度
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - navbarHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showToast = (message: string) => {
  toast.value = { show: true, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Payment Modal Functions
const openPaymentModal = () => {
  paymentModal.value.show = true
  paymentModal.value.period = billingPeriod.value
  paymentModal.value.loadingQR = true
  paymentModal.value.paymentSuccess = false
  paymentModal.value.qrCodeData = ''
  document.body.style.overflow = 'hidden'

  // Generate QR Code
  generateQRCode()
}

const closePaymentModal = () => {
  paymentModal.value.show = false
  document.body.style.overflow = ''
  if (paymentCheckTimer) {
    clearInterval(paymentCheckTimer)
    paymentCheckTimer = null
  }
}

const generateQRCode = async () => {
  const orderId = 'GRAFTRA' + Date.now().toString(36).toUpperCase()
  const paymentUrl = `https://graftra.app/pay/${orderId}?method=${paymentModal.value.method}&period=${paymentModal.value.period}`

  try {
    paymentModal.value.qrCodeData = await QRCode.toDataURL(paymentUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    paymentModal.value.loadingQR = false
    startPaymentCheck()
  } catch (error) {
    console.error('Failed to generate QR code:', error)
    paymentModal.value.loadingQR = false
  }
}

const startPaymentCheck = () => {
  let count = 0
  const maxCount = 60 // 最多检查60次（3分钟）

  paymentCheckTimer = window.setInterval(() => {
    count++

    // 模拟支付成功（演示用）
    if (count >= 8) {
      if (paymentCheckTimer) {
        clearInterval(paymentCheckTimer)
        paymentCheckTimer = null
      }

      paymentModal.value.paymentSuccess = true

      // 2秒后跳转到应用
      setTimeout(() => {
        closePaymentModal()
        showToast('升级成功！您现在是专业版用户')
        router.push('/app')
      }, 2000)
    }
  }, 2000)
}
</script>

<style scoped>
.landing-page {
  width: 100%;
  min-height: 100vh;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(5, 150, 105, 0.1);
}

.navbar-logo {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--primary);
}

.navbar :deep(.navbar-logo) svg {
  color: var(--primary);
}

.nav-links {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-link {
  padding: 10px 16px;
  color: var(--text);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link:hover {
  background: rgba(5, 150, 105, 0.06);
  color: var(--primary);
}

.nav-item {
  position: relative;
}

.nav-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  min-width: 240px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--slate-100);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  padding: 8px;
}

.nav-item:hover .nav-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-item:hover:not(.disabled) {
  background: rgba(5, 150, 105, 0.06);
}

.dropdown-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.dropdown-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(5, 150, 105, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.dropdown-content {
  flex: 1;
}

.dropdown-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
}

.coming-soon-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  background: var(--slate-100);
  color: var(--slate-400);
  font-size: 9px;
  font-weight: 600;
  border-radius: 4px;
}

.dropdown-desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.navbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  width: 28px;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-menu-btn span {
  width: 100%;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 100px 60px 80px;
}

.hero-bg-subtle {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 20%, rgba(5, 150, 105, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(8, 145, 178, 0.04) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.hero-bg-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(5, 150, 105, 0.06) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.8;
  pointer-events: none;
  z-index: 1;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 10;
  align-items: center;
}

.hero-left {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
}

.hero-right {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(5, 150, 105, 0.1);
  border: 1px solid rgba(5, 150, 105, 0.2);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 28px;
  width: fit-content;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
  line-height: 1.1;
  color: var(--text);
}

.hero-slogan {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: 17px;
  color: var(--text-muted);
  margin-bottom: 32px;
  max-width: 480px;
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  position: relative;
  z-index: 10;
}

/* Browser Mockup */
.browser-mockup {
  width: 100%;
  max-width: 520px;
  background: white;
  border: 1px solid rgba(5, 150, 105, 0.15);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(5, 150, 105, 0.15), 0 0 0 1px rgba(5, 150, 105, 0.08);
  overflow: hidden;
  position: relative;
}

.browser-header {
  background: #f1f5f9;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(5, 150, 105, 0.1);
}

.browser-dots {
  display: flex;
  gap: 6px;
}

.browser-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #CBD5E1;
}

.browser-dot:nth-child(1) { background: #EF4444; }
.browser-dot:nth-child(2) { background: #F59E0B; }
.browser-dot:nth-child(3) { background: #22C55E; }

.browser-address {
  flex: 1;
  background: white;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--text-muted);
  text-align: center;
  margin-left: 12px;
}

.browser-content {
  padding: 24px;
  background: #f8fafc;
  position: relative;
  min-height: 320px;
}

.flow-grid {
  position: absolute;
  inset: 24px;
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Text Input Area */
.text-input-area {
  background: white;
  border: 2px solid rgba(5, 150, 105, 0.15);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(5, 150, 105, 0.08);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.text-input-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(5, 150, 105, 0.15);
}

.text-input-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.text-line {
  font-size: 12px;
  color: var(--text-muted);
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  line-height: 1.6;
}

/* Convert Arrow */
.convert-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0;
  position: relative;
  z-index: 1;
}

.convert-label {
  font-size: 11px;
  font-weight: 600;
  color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  margin-top: 4px;
}

/* Generated Flowchart */
.generated-flowchart {
  background: white;
  border: 2px solid rgba(5, 150, 105, 0.15);
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 2px 12px rgba(5, 150, 105, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.flow-node {
  background: white;
  border: 2px solid rgba(5, 150, 105, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 12px rgba(5, 150, 105, 0.1);
  position: relative;
  min-width: 140px;
  transition: transform 0.3s ease;
}

.flow-node:hover {
  transform: translateY(-2px);
  border-color: rgba(5, 150, 105, 0.4);
}

.flow-node-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.flow-node-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.flow-node.inline-node {
  min-width: auto;
  padding: 10px 16px;
}

.flow-node.inline-node.start {
  border-color: #22C55E;
}

.flow-node.inline-node.start .flow-node-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.flow-node.inline-node.success {
  border-color: #F97316;
}

.flow-node.inline-node.success .flow-node-icon {
  background: rgba(249, 115, 22, 0.1);
  color: #F97316;
}

.flow-arrow-down {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 10px solid #3B82F6;
}

.browser-footer {
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(5, 150, 105, 0.1);
}

.browser-control {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
}

.browser-control:hover {
  background: #e2e8f0;
}

/* Features Section */
.features {
  padding: 120px 40px;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-label {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(8, 145, 178, 0.08) 100%);
  border: 1px solid rgba(5, 150, 105, 0.2);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 20px;
  color: var(--text);
}

.section-desc {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 40px;
  background: white;
  border: 2px solid rgba(5, 150, 105, 0.1);
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 60px rgba(5, 150, 105, 0.15);
  border-color: rgba(5, 150, 105, 0.25);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text);
}

.feature-desc {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.7;
}

/* Process Section */
.process {
  padding: 120px 40px;
  background: linear-gradient(180deg, rgba(5, 150, 105, 0.03) 0%, rgba(8, 145, 178, 0.02) 100%);
}

.process-timeline {
  display: flex;
  justify-content: center;
  gap: 60px;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.process-timeline::before {
  content: '';
  position: absolute;
  top: 60px;
  left: 100px;
  right: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent);
}

.process-step {
  flex: 1;
  text-align: center;
  position: relative;
}

.step-number {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 32px;
  font-weight: 800;
  color: var(--primary);
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;
  box-shadow: 0 10px 30px rgba(5, 150, 105, 0.2);
}

.process-step:hover .step-number {
  transform: scale(1.1);
  box-shadow: 0 15px 40px rgba(5, 150, 105, 0.3);
  background: var(--primary);
  color: white;
}

.step-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text);
}

.step-desc {
  font-size: 14px;
  color: var(--text-muted);
}

/* CTA Section */
.cta {
  padding: 120px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}

.cta-content {
  position: relative;
  z-index: 10;
  color: white;
}

.cta-title {
  font-size: 52px;
  font-weight: 800;
  margin-bottom: 20px;
}

.cta-subtitle {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 40px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 18px 40px;
  background: white;
  color: var(--primary);
  border-radius: 16px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 10px 40px rgba(5, 150, 105, 0.2);
}

.cta-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 20px 60px rgba(5, 150, 105, 0.3);
}

.cta-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(5, 150, 105, 0.1);
}

.cta-decoration-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -100px;
}

.cta-decoration-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -50px;
}

/* Footer */
.footer {
  padding: 60px 40px;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.footer-logo {
  font-size: 28px;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.footer :deep(.footer-logo) svg {
  color: var(--primary);
}

.footer-links {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 30px;
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--primary);
}

.footer-copyright {
  color: var(--text-muted);
  font-size: 14px;
}

/* Pricing Section */
.pricing {
  padding: 120px 40px;
  background: linear-gradient(180deg, var(--bg) 0%, var(--primary-50) 100%);
  position: relative;
}

.pricing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
}

.pricing-toggle-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.3s ease;
  cursor: pointer;
}

.pricing-toggle-label.active {
  color: var(--text);
}

.pricing-toggle-switch {
  width: 60px;
  height: 32px;
  background: var(--slate-200);
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pricing-toggle-switch.active {
  background: var(--primary);
}

.pricing-toggle-switch::after {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  background: white;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.pricing-toggle-switch.active::after {
  left: 31px;
}

.pricing-badge {
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-card {
  background: white;
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 4px 24px rgba(5, 150, 105, 0.08);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  border: 2px solid transparent;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(5, 150, 105, 0.15);
}

.pricing-card.popular {
  border-color: var(--primary);
  background: linear-gradient(180deg, rgba(5, 150, 105, 0.02) 0%, white 30%);
}

.pricing-card-popular {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 20px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  font-size: 13px;
  font-weight: 700;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pricing-plan {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.pricing-save {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(5, 150, 105, 0.1);
  color: var(--primary);
  font-size: 13px;
  font-weight: 600;
  border-radius: 12px;
  margin-bottom: 16px;
}

.pricing-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.pricing-currency {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
}

.pricing-amount {
  font-size: 56px;
  font-weight: 800;
  color: var(--text);
  line-height: 1;
}

.pricing-period {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-muted);
}

.pricing-desc {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 32px;
  line-height: 1.6;
}

.pricing-features {
  list-style: none;
  margin-bottom: 32px;
  padding: 0;
}

.pricing-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--slate-100);
}

.pricing-feature:last-child {
  border-bottom: none;
}

.pricing-feature-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pricing-feature-icon.included {
  background: rgba(5, 150, 105, 0.1);
  color: var(--primary);
}

.pricing-feature-icon.excluded {
  background: var(--slate-100);
  color: var(--slate-400);
}

.pricing-feature-text {
  font-size: 15px;
  color: var(--text);
}

.pricing-feature-text.excluded {
  color: var(--slate-400);
  text-decoration: line-through;
}

.pricing-cta {
  width: 100%;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.pricing-cta-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.25);
}

.pricing-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(5, 150, 105, 0.35);
}

.pricing-cta-secondary {
  background: var(--slate-100);
  color: var(--text);
}

.pricing-cta-secondary:hover {
  background: var(--slate-200);
}

/* Toast */
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  padding: 14px 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  opacity: 0;
  transition: all 0.3s ease;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-500);
}

.toast-icon svg {
  color: white;
}

.toast-message {
  font-size: 14px;
  font-weight: 500;
}

/* Payment Modal Overlay */
.payment-modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 2000;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.payment-modal-overlay.active {
  display: flex;
  opacity: 1;
}

.payment-qr-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.payment-modal-header {
  padding: 24px 28px;
  border-bottom: 1px solid var(--slate-100);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.payment-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.payment-modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--slate-100);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: var(--text-muted);
}

.payment-modal-close:hover {
  background: var(--slate-200);
}

.payment-qr-body {
  padding: 28px;
  text-align: center;
}

.payment-qr-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.payment-qr-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.payment-qr-code {
  width: 220px;
  height: 220px;
  margin: 0 auto 24px;
  border-radius: 16px;
  background: var(--slate-100);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.qr-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  padding: 20px;
}

.loading-spinner {
  animation: spin 1s linear infinite;
  color: var(--primary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.qr-image {
  width: 200px;
  height: 200px;
  border-radius: 12px;
}

.qr-success-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: fadeIn 0.3s ease;
}

.qr-success-overlay p {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary);
}

.payment-qr-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(5, 150, 105, 0.05);
  border-radius: 10px;
  font-size: 13px;
  color: var(--primary);
  margin-bottom: 12px;
}

.payment-qr-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 12px;
}

.payment-qr-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--slate-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.payment-order-summary {
  background: var(--slate-50);
  border-radius: 16px;
  padding: 20px;
  margin: 24px 28px 0;
}

.payment-order-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.payment-order-plan {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.payment-order-plan-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.payment-order-plan-price {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary);
}

.payment-success-content {
  text-align: center;
  padding: 16px 28px;
}

.payment-success-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.payment-success-desc {
  font-size: 14px;
  color: var(--text-muted);
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 60px;
  }
  .hero {
    padding: 80px 40px 60px;
  }
  .hero-title {
    font-size: 44px;
  }
  .browser-mockup {
    max-width: 100%;
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 12px 20px;
  }
  .navbar-logo {
    font-size: 20px;
  }
  .nav-links {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
  }
  .hero-title {
    font-size: 32px;
  }
  .hero-slogan {
    font-size: 18px;
  }
  .hero-subtitle {
    font-size: 15px;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .hero-actions .btn {
    width: 100%;
    justify-content: center;
  }
  .process-timeline {
    flex-direction: column;
    gap: 40px;
  }
  .process-timeline::before {
    display: none;
  }
  .section-title {
    font-size: 32px;
  }
  .section-desc {
    font-size: 16px;
  }
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
  .pricing-card {
    padding: 32px 24px;
  }
  .pricing-amount {
    font-size: 48px;
  }
}
</style>
