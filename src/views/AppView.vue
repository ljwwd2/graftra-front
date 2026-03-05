<template>
  <div class="app-page">
    <!-- Navigation -->
    <nav class="navbar">
      <RouterLink to="/" class="navbar-logo">
        <Hexagon :size="28" />
        Graftra
      </RouterLink>
      <div class="navbar-actions">
        <button class="btn btn-ghost" @click="clearCache" title="清除缓存">
          <Trash2 :size="16" />
          清除缓存
        </button>
        <RouterLink to="/" class="btn btn-ghost">
          <Home :size="16" />
          返回首页
        </RouterLink>
        <UserMenu />
      </div>
    </nav>

    <!-- Main Content -->
    <div class="app-container">
      <div class="app-content">
        <!-- Stepper -->
        <div class="stepper">
          <div
            v-for="(step, index) in steps"
            :key="step.number"
            class="step-pill"
            :class="{ active: currentStep === step.number, completed: currentStep > step.number }"
            @click="goToStep(step.number)"
          >
            <div class="step-arrow-left"></div>
            <div class="step-pill-content">
              <div class="step-icon">
                <span class="step-num">{{ step.number }}</span>
                <Check class="step-check-icon" :size="18" />
              </div>
              <span class="step-name">{{ step.label }}</span>
            </div>
            <div class="step-arrow-right"></div>
          </div>
        </div>

        <!-- Step 1: Input Panel -->
        <div class="panel" :class="{ active: currentStep === 1 }">
          <div class="panel-header">
            <h1 class="panel-title">文档分析</h1>
            <p class="panel-desc">上传文档，AI 将自动提取核心图表并生成可视化建议</p>
          </div>

          <div class="input-grid">
            <!-- Left Column -->
            <div class="input-column">
              <!-- Document Upload -->
              <div class="input-section">
                <div class="section-label">
                  <FileUp :size="24" />
                  上传文档
                </div>
                <div
                  class="upload-zone"
                  :class="{ 'has-file': uploadedFile, 'dragover': isDragOver }"
                  @click="triggerFileInput"
                  @dragover.prevent="isDragOver = true"
                  @dragleave.prevent="isDragOver = false"
                  @drop.prevent="handleFileDrop"
                >
                  <div v-if="!uploadedFile" class="upload-icon">
                    <UploadCloud :size="32" />
                  </div>
                  <div v-if="!uploadedFile" class="upload-text">拖拽文件到此处或点击上传</div>
                  <div v-if="!uploadedFile" class="upload-hint">支持 Word、PDF、Markdown、TXT（最大 10MB）</div>
                  <div v-if="uploadedFile" class="file-info">
                    <FileText :size="32" :style="{ color: 'var(--primary)' }" />
                    <div>
                      <div class="file-name">{{ uploadedFile.name }}</div>
                      <div class="file-size">{{ formatFileSize(uploadedFile.size) }}</div>
                    </div>
                    <button @click.stop="removeFile" class="remove-file-btn" aria-label="移除文件">
                      <X :size="16" />
                    </button>
                  </div>
                  <input ref="fileInputRef" type="file" accept=".pdf,.doc,.docx,.md,.txt" style="display: none" @change="handleFileSelect">
                </div>
              </div>

              <!-- Text Input -->
              <div class="input-section">
                <div class="section-label">
                  <Type :size="24" />
                  输入文字片段（可选）
                </div>
                <textarea
                  v-model="textContent"
                  class="text-input"
                  placeholder="或者直接输入文字内容进行分析..."
                  rows="6"
                ></textarea>
              </div>
            </div>

            <!-- Right Column - API Info -->
            <div class="input-column">
              <div class="input-section">
                <div class="section-label">
                  <Info :size="24" />
                  分析说明
                </div>
                <div class="info-content">
                  <p class="info-text">AI 将自动分析您的文档并提取：</p>
                  <ul class="info-list">
                    <li><Check :size="16" class="check-icon" /> 流程图结构</li>
                    <li><Check :size="16" class="check-icon" /> 架构图类型</li>
                    <li><Check :size="16" class="check-icon" /> 模块关系图</li>
                    <li><Check :size="16" class="check-icon" /> 内容替换建议</li>
                  </ul>
                </div>
              </div>

              <!-- API Endpoint Display -->
              <div class="input-section">
                <div class="section-label">
                  <Server :size="24" />
                  API 端点
                </div>
                <div class="api-endpoint">
                  <code>{{ API_ENDPOINT }}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Analysis Panel -->
        <div class="panel" :class="{ active: currentStep === 2 }">
          <!-- Unified Layout -->
          <div class="step2-content">
            <!-- Left Panel -->
            <div class="step2-left">
              <!-- Loading Progress -->
              <div v-if="isAnalyzing" class="loading-progress-panel">
                <Loader2 :size="32" class="spinning" />
                <h3 class="loading-title">AI 正在分析文档...</h3>
                <p class="loading-subtitle">这可能需要几分钟时间，请耐心等待</p>
                <div class="loading-progress">
                  <div class="progress-step" :class="{ active: loadingStep >= 1 }">
                    <span class="step-number">1</span>
                    <span class="step-text">文档解析</span>
                  </div>
                  <div class="progress-divider"></div>
                  <div class="progress-step" :class="{ active: loadingStep >= 2 }">
                    <span class="step-number">2</span>
                    <span class="step-text">结构识别</span>
                  </div>
                  <div class="progress-divider"></div>
                  <div class="progress-step" :class="{ active: loadingStep >= 3 }">
                    <span class="step-number">3</span>
                    <span class="step-text">图表提取</span>
                  </div>
                </div>
              </div>

              <!-- Charts List -->
              <div v-else-if="analysisResult" class="results-charts">
                <div class="results-header">
                  <h2 class="results-title">识别到的图表</h2>
                  <span class="results-count">{{ analysisResult.data?.structured_data?.charts?.length || 0 }}</span>
                </div>

                <div class="charts-list">
                  <div
                    v-for="chart in analysisResult.data?.structured_data?.charts || []"
                    :key="chart.chart_id"
                    class="chart-item"
                    :class="{ selected: selectedChartIds.includes(chart.chart_id) }"
                    @click="selectChart(chart.chart_id)"
                  >
                    <div class="chart-checkbox">
                      <div class="checkbox">
                        <Check v-if="selectedChartIds.includes(chart.chart_id)" :size="12" />
                      </div>
                    </div>
                    <div class="chart-item-content">
                      <div class="chart-item-header">
                        <span class="chart-type" :class="`type-${chart.chart_type}`">
                          {{ getChartTypeLabel(chart.chart_type) }}
                        </span>
                        <span class="chart-score">{{ Math.round(chart.importance_score * 100) }}%</span>
                      </div>
                      <p class="chart-purpose">{{ chart.chart_purpose }}</p>
                      <p class="chart-position">{{ chart.insert_position }}</p>
                    </div>
                  </div>
                </div>

                <!-- Selection Info -->
                <div v-if="selectedChartIds.length > 0" class="selection-footer">
                  <span class="selection-text">已选择 <strong>{{ selectedChartIds.length }}</strong> 个图表</span>
                </div>
              </div>

              <!-- Empty State (when not analyzing and no results) -->
              <div v-else class="step2-left-empty">
                <FileSearch :size="48" class="empty-icon" />
                <p class="empty-text">等待分析...</p>
              </div>
            </div>

            <!-- Right Panel: Terminal -->
            <div class="step2-right">
              <div class="terminal-panel">
                <div class="terminal-header">
                  <span class="terminal-title">思考过程</span>
                  <div v-if="isAnalyzing" class="terminal-status-analyzing">
                    <span class="status-dot"></span>
                  </div>
                  <Check v-else :size="14" class="terminal-icon" />
                </div>
                <div
                  ref="thinkingContentRef"
                  class="terminal-body"
                >
                  <span v-if="!streamingThinking && !analysisResult?.data?.thinking" class="terminal-placeholder">等待 AI 开始思考...</span>
                  <span v-else class="terminal-text">{{ streamingThinking || analysisResult?.data?.thinking || '' }}</span>
                </div>
                <div v-if="analysisResult && !isAnalyzing" class="terminal-footer">
                  <span class="terminal-stat">{{ analysisResult.data?.tokens_used?.toLocaleString() || 'N/A' }} tokens</span>
                  <span class="terminal-stat">{{ analysisResult.data?.model || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-if="!isAnalyzing && analysisError" class="step2-error">
            <AlertCircle :size="48" class="error-icon" />
            <h3 class="error-title">分析失败</h3>
            <p class="error-message">{{ analysisError }}</p>
            <button class="btn btn-primary" @click="retryAnalysis">
              <RefreshCw :size="16" />
              重试
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="!isAnalyzing && !analysisError && !analysisResult" class="step2-empty">
            <FileSearch :size="56" class="empty-icon" />
            <h3 class="empty-title">等待分析</h3>
            <p class="empty-desc">请先上传文档或输入文字内容</p>
          </div>
        </div>

        <!-- Step 3: Chart Details Panel -->
        <div class="panel" :class="{ active: currentStep === 3 }">
          <!-- Empty State -->
          <div v-if="selectedCharts.length === 0" class="step3-empty">
            <MousePointer :size="48" class="empty-icon" />
            <h3 class="empty-title">请选择一个图表</h3>
            <p class="empty-desc">返回上一步选择要查看详情的图表</p>
            <button class="btn btn-secondary" @click="prevStep">
              <ArrowLeft :size="16" />
              返回选择
            </button>
          </div>

          <!-- Details Layout -->
          <div v-else class="step3-content">
            <!-- Left: Details Panel -->
            <div class="step3-details-panel">
              <!-- Header -->
              <div class="details-header">
                <div class="details-header-left">
                  <span class="details-type-badge" :class="`type-${selectedChart?.chart_type}`">
                    {{ selectedChart ? getChartTypeLabel(selectedChart.chart_type) : '' }}
                  </span>
                  <div class="details-score">{{ Math.round((selectedChart?.importance_score || 0) * 100) }}%</div>
                </div>
                <button v-if="!isEditing" class="btn-icon-edit" @click="startEditing">
                  <Edit2 :size="16" />
                  编辑
                </button>
                <div v-else class="edit-actions">
                  <button class="btn-icon-small" @click="cancelEditing">
                    <X :size="14" />
                    取消
                  </button>
                  <button class="btn-icon-small primary" @click="saveEditing">
                    <Check :size="14" />
                    保存
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="details-content">
                <!-- Chart Purpose -->
                <div class="detail-field">
                  <label class="field-label">图表用途</label>
                  <p v-if="!isEditing" class="field-value">{{ selectedChart?.chart_purpose }}</p>
                  <input v-else v-model="editForm.chart_purpose" class="field-input" />
                </div>

                <!-- Insert Position -->
                <div class="detail-field">
                  <label class="field-label">
                    <MapPin :size="14" />
                    建议插入文档位置
                  </label>
                  <p v-if="!isEditing" class="field-value">{{ selectedChart?.insert_position }}</p>
                  <input v-else v-model="editForm.insert_position" class="field-input" />
                </div>

                <!-- Template Search -->
                <div class="detail-field">
                  <label class="field-label">
                    <Search :size="14" />
                    模板搜索
                  </label>
                  <div v-if="!isEditing" class="field-code">{{ selectedChart?.template_search_query }}</div>
                  <input v-else v-model="editForm.template_search_query" class="field-input" />
                </div>

                <!-- Content Replacement Prompt -->
                <div class="detail-field">
                  <label class="field-label">
                    <FileText :size="14" />
                    内容替换提示
                  </label>
                  <div v-if="!isEditing" class="field-prompt">{{ selectedChart?.content_replacement_prompt }}</div>
                  <textarea v-else v-model="editForm.content_replacement_prompt" class="field-textarea" rows="4" />
                </div>
              </div>

              <!-- Reference Images Section -->
              <div class="reference-section">
                <div class="reference-section-header">
                  <label class="field-label">
                    <Image :size="14" />
                    参考图
                  </label>
                  <button class="btn btn-secondary btn-sm" @click="openUploadDialog(selectedChart?.chart_id || '')">
                    <Plus :size="14" />
                    上传参考图
                  </button>
                </div>

                <!-- Loading state -->
                <div v-if="isLoadingReferences" class="reference-loading">
                  <Loader2 :size="20" class="spinning" />
                  <span>正在搜索参考图...</span>
                </div>

                <!-- Error state -->
                <div v-else-if="referenceError" class="reference-error-state">
                  <AlertCircle :size="18" />
                  <span>{{ referenceError }}</span>
                  <button class="btn btn-primary btn-sm" @click="searchReferenceImages">重试</button>
                </div>

                <!-- Reference images for current chart -->
                <div v-else>
                  <!-- User uploaded image (shown independently of API results) -->
                  <div v-if="hasUploadedImage(selectedChart?.chart_id || '')" class="chart-reference-content">
                    <div class="reference-images-grid">
                      <div
                        class="reference-image-card uploaded"
                        :class="{ selected: isImageSelected(selectedChart?.chart_id || '', `uploaded-${selectedChart?.chart_id || ''}`) }"
                        @click="selectReferenceImage(selectedChart?.chart_id || '', `uploaded-${selectedChart?.chart_id || ''}`)"
                      >
                        <div class="reference-image-wrapper">
                          <img :src="getUploadedImageUrl(selectedChart?.chart_id || '')" alt="上传的参考图" />
                          <button
                            class="icon-btn zoom-image-btn-top"
                            @click.stop="openImagePreview(getUploadedImageUrl(selectedChart?.chart_id || '') || '')"
                            title="放大查看"
                          >
                            <Maximize :size="16" />
                          </button>
                          <div class="reference-image-overlay">
                            <div v-if="isImageSelected(selectedChart?.chart_id || '', `uploaded-${selectedChart?.chart_id || ''}`)" class="selected-badge">
                              <CheckCircle :size="28" />
                            </div>
                            <button
                              class="icon-btn remove-image-btn"
                              @click.stop="removeUploadedImage(selectedChart?.chart_id || '')"
                              title="移除图片"
                            >
                              <X :size="16" />
                            </button>
                          </div>
                        </div>
                        <div class="reference-image-info">
                          <p class="uploaded-badge">用户上传</p>
                          <p class="reference-description">{{ uploadingImages[selectedChart?.chart_id || '']?.name }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- API retrieved images -->
                  <div
                    v-for="result in getReferenceResultForChart(selectedChart?.chart_id || '')"
                    :key="result.chart_id"
                    class="chart-reference-content"
                  >
                    <!-- System retrieved images grid -->
                    <div v-if="result.reference_images && result.reference_images.length > 0" class="reference-images-grid">
                      <div
                        v-for="imageItem in result.reference_images"
                        :key="imageItem.id"
                        class="reference-image-card"
                        :class="{ selected: isImageSelected(result.chart_id, imageItem.id) }"
                        @click="selectReferenceImage(result.chart_id, imageItem.id)"
                      >
                        <div class="reference-image-wrapper">
                          <img :src="imageItem.image_url" :alt="imageItem.structure_description" />
                          <button
                            class="icon-btn zoom-image-btn-top"
                            @click.stop="openImagePreview(imageItem.image_url)"
                            title="放大查看"
                          >
                            <Maximize :size="16" />
                          </button>
                          <div class="reference-image-overlay">
                            <div v-if="isImageSelected(result.chart_id, imageItem.id)" class="selected-badge">
                              <CheckCircle :size="28" />
                            </div>
                          </div>
                        </div>
                        <div class="reference-image-info">
                          <p class="reference-similarity">相似度: {{ (imageItem.similarity * 100).toFixed(1) }}%</p>
                          <p class="reference-description">{{ imageItem.structure_description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div v-if="!hasUploadedImage(selectedChart?.chart_id || '') && !getReferenceResultForChart(selectedChart?.chart_id || '')?.length" class="no-reference-images">
                    <ImageOff :size="32" />
                    <p>暂无参考图，点击上方按钮上传</p>
                  </div>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="details-footer">
                <button class="btn btn-outline" @click="copyPrompt">
                  <Copy :size="16" />
                  复制提示词
                </button>
                <button class="btn btn-primary" @click="generateChart">
                  <Sparkles :size="16" />
                  生成图表
                </button>
              </div>
            </div>

            <!-- Right: Tab Navigation -->
            <div class="step3-tabs-panel">
              <div class="tabs-header">
                <h3 class="tabs-title">已选图表</h3>
                <span class="tabs-count">{{ selectedCharts.length }}</span>
              </div>

              <div class="tabs-list">
                <button
                  v-for="chart in selectedCharts"
                  :key="chart.chart_id"
                  class="tab-item"
                  :class="{ active: activeTabChartId === chart.chart_id }"
                  @click="setActiveTab(chart.chart_id)"
                >
                  <div class="tab-item-indicator"></div>
                  <div class="tab-item-content">
                    <div class="tab-item-header">
                      <span class="tab-item-type" :class="`type-${chart.chart_type}`">
                        {{ getChartTypeLabel(chart.chart_type) }}
                      </span>
                      <span class="tab-item-score">{{ Math.round(chart.importance_score * 100) }}%</span>
                    </div>
                    <p class="tab-item-text">{{ chart.chart_purpose }}</p>
                    <!-- Reference image selection indicator -->
                    <div class="tab-item-reference-status" :class="{ selected: hasSelectedReferenceImage(chart.chart_id) }">
                      <CheckCircle v-if="hasSelectedReferenceImage(chart.chart_id)" :size="14" class="status-icon selected" />
                      <ImageOff v-else :size="14" class="status-icon" />
                      <span class="status-text">{{ hasSelectedReferenceImage(chart.chart_id) ? '已选参考图' : '未选参考图' }}</span>
                    </div>
                    <div class="tab-item-count">
                      <span class="count-label">图表风格生成数</span>
                      <div class="count-control">
                        <button
                          class="count-btn-mini"
                          @click.stop="updateChartImageCount(chart.chart_id, -1)"
                          :disabled="getChartImageCount(chart.chart_id) <= 1"
                        >
                          <Minus :size="12" />
                        </button>
                        <span class="count-value">{{ getChartImageCount(chart.chart_id) }}</span>
                        <button
                          class="count-btn-mini"
                          @click.stop="updateChartImageCount(chart.chart_id, 1)"
                          :disabled="getChartImageCount(chart.chart_id) >= 4"
                        >
                          <Plus :size="12" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    class="tab-item-delete"
                    @click.stop="removeChart(chart.chart_id)"
                    title="移除此图表"
                  >
                    <X :size="14" />
                  </button>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload Image Dialog -->
        <div v-if="showUploadDialog" class="confirm-dialog-overlay" @click.self="closeUploadDialog">
          <div class="upload-dialog">
            <div class="upload-header">
              <h3 class="upload-title">上传参考图</h3>
              <button class="icon-btn close-btn" @click="closeUploadDialog">
                <X :size="20" />
              </button>
            </div>
            <div class="upload-body">
              <p class="upload-desc">选择一张本地图片作为该图表的参考图</p>
              <div class="upload-area" @click="triggerUploadInput" @drop.prevent="handleReferenceImageDrop" @dragover.prevent>
                <UploadCloud :size="48" />
                <p>点击选择或拖拽图片到此处</p>
                <p class="upload-hint">支持 JPG、PNG、WEBP 格式，最大 5MB</p>
              </div>
              <input
                ref="uploadInputRef"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleReferenceImageSelect"
              />
            </div>
            <div class="upload-footer">
              <button class="btn btn-secondary" @click="closeUploadDialog">取消</button>
            </div>
          </div>
        </div>

        <!-- Image Preview Dialog -->
        <div v-if="showImagePreview" class="image-preview-overlay" @click.self="closeImagePreview">
          <div class="image-preview-dialog">
            <button class="preview-close-btn" @click="closeImagePreview">
              <X :size="24" />
            </button>
            <img :src="previewImageUrl" alt="预览图片" class="preview-image" />
          </div>
        </div>

        <!-- Step 4: Result Panel -->
        <div class="panel" :class="{ active: currentStep === 4 }">
          <div class="panel-header">
            <h1 class="panel-title">生成结果</h1>
            <p class="panel-desc">AI 已为您生成的图表</p>
          </div>

          <!-- Error State -->
          <div v-if="generationError && !isGeneratingCharts" class="step4-empty">
            <AlertCircle :size="48" class="empty-icon" />
            <h3 class="empty-title">生成失败</h3>
            <p class="empty-desc">{{ generationError }}</p>
            <button class="btn btn-primary" @click="generateAllCharts">
              <RefreshCw :size="16" />
              重试生成
            </button>
          </div>

          <!-- Results Display -->
          <div v-else-if="chartGenerationResults.length > 0" class="step4-content">
            <!-- Progress Indicator (subtle, during generation) -->
            <div v-if="isGeneratingCharts" class="step4-progress">
              <Loader2 :size="16" class="spinning" />
              <span>正在生成中... {{ generationProgress }}%</span>
            </div>

            <!-- Results List -->
            <div class="step4-results">
              <div
                v-for="result in chartGenerationResults"
                :key="result.chart_id"
                class="step4-result-item"
              >
                <!-- Item Header -->
                <div class="result-item-header">
                  <div class="result-item-left">
                    <span class="result-type-badge" :class="`type-${result.chart_type}`">
                      {{ getChartTypeLabel(result.chart_type) }}
                    </span>
                    <div class="result-status" :class="{
                      success: result.is_loading ? false : result.success,
                      loading: result.is_loading,
                      error: !result.is_loading && !result.success
                    }">
                      <Loader2 v-if="result.is_loading" :size="14" class="spinning" />
                      <Check v-else-if="result.success" :size="14" />
                      <AlertCircle v-else :size="14" />
                      <span>{{ result.is_loading ? '生成中' : result.success ? '已完成' : '失败' }}</span>
                    </div>
                  </div>
                  <span class="result-count">{{ result.generated_image_urls.length }} 张</span>
                </div>

                <!-- Prompt -->
                <p class="result-prompt">{{ result.prompt }}</p>

                <!-- Images Grid -->
                <div v-if="result.is_loading" class="result-images-grid">
                  <div
                    v-for="i in getChartImageCount(result.chart_id)"
                    :key="'loading-' + i"
                    class="result-image-card loading"
                  >
                    <div class="skeleton-shimmer"></div>
                    <span class="image-number">{{ i }}</span>
                  </div>
                </div>

                <div v-else-if="result.success && result.generated_image_urls.length > 0" class="result-images-grid">
                  <div
                    v-for="(imageUrl, index) in result.generated_image_urls"
                    :key="index"
                    class="result-image-card"
                    @click="openImagePreview(imageUrl)"
                  >
                    <img :src="imageUrl" :alt="`生成图片 ${index + 1}`" loading="lazy" />
                    <div class="image-overlay">
                      <Maximize :size="18" />
                    </div>
                    <span class="image-number">{{ index + 1 }}</span>
                  </div>
                </div>

                <!-- Error State -->
                <div v-else-if="!result.success" class="result-error">
                  <div class="error-inline">
                    <AlertCircle :size="18" />
                    <span>{{ result.error_message || '生成失败' }}</span>
                  </div>
                  <button
                    v-if="result.is_sensitive_content_error"
                    class="btn-link"
                    @click="goToEditPrompt(result.chart_id)"
                  >
                    <Edit2 :size="14" />
                    修改提示词
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="step4-empty">
            <Image :size="48" class="empty-icon" />
            <h3 class="empty-title">暂无生成结果</h3>
            <p class="empty-desc">请返回上一步完成图表生成</p>
          </div>
        </div>

        <!-- Step 4 Action Bar (Fixed at bottom) -->
        <div v-if="currentStep === 4 && chartGenerationResults.length > 0" class="step4-actions">
          <button class="btn btn-secondary" @click="prevStep">
            <ArrowLeft :size="16" />
            返回修改
          </button>
          <button class="btn btn-primary" @click="handleExportAll">
            <Download :size="16" />
            导出全部图片
          </button>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div v-if="currentStep !== 4" class="action-bar">
      <div class="action-left">
        <button v-if="currentStep > 1 && !isAnalyzing" class="btn btn-secondary" @click="prevStep">
          <ArrowLeft :size="16" />
          上一步
        </button>
      </div>
      <div class="action-right">
        <div v-if="currentStep === 2 && selectedChartIds.length > 0" class="selection-badge">
          已选择 {{ selectedChartIds.length }} 个图表
        </div>
        <button
          class="btn btn-primary"
          :disabled="isAnalyzing || (currentStep === 1 && !uploadedFile && !textContent.trim())"
          @click="nextStep"
        >
          <template v-if="isAnalyzing">
            <Loader2 :size="16" class="spinning" />
            分析中...
          </template>
          <template v-else-if="currentStep < 4">
            下一步
            <ArrowRight :size="16" />
          </template>
          <template v-else>
            <Sparkles :size="16" />
            生成图表
          </template>
        </button>
      </div>
    </div>

    <!-- Go Back Confirmation Dialog -->
    <div v-if="showGoBackConfirmDialog" class="confirm-dialog-overlay" @click.self="cancelGoBack">
      <div class="confirm-dialog">
        <div class="confirm-header">
          <h3 class="confirm-title">确认返回上一步</h3>
        </div>
        <div class="confirm-body">
          <p class="confirm-message">
            <template v-if="currentStep === 2">
              返回上一步需要重新进行文档分析，当前分析内容将会丢失，确定要返回吗？
            </template>
            <template v-else-if="currentStep === 4">
              返回上一步将重新生成图表，已生成的内容将会保留，确定要返回修改吗？
            </template>
          </p>
        </div>
        <div class="confirm-footer">
          <button class="btn btn-secondary" @click="cancelGoBack">
            取消
          </button>
          <button class="btn btn-primary" @click="confirmGoBack">
            确认返回
          </button>
        </div>
      </div>
    </div>

    <!-- Generate Confirm Dialog -->
    <div v-if="showGenerateConfirmDialog" class="confirm-dialog-overlay" @click.self="cancelGenerate">
      <div class="confirm-dialog">
        <div class="confirm-header">
          <h3 class="confirm-title">{{ confirmDialogTitle }}</h3>
        </div>
        <div class="confirm-body">
          <p class="confirm-message">{{ confirmDialogMessage }}</p>
        </div>
        <div class="confirm-footer">
          <button class="btn btn-secondary" @click="cancelGenerate">
            取消
          </button>
          <button class="btn btn-primary" @click="confirmGenerate">
            确认生成
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast" :class="{ show: toast.show }">
      <div class="toast-icon" :class="toast.type">
        <Check v-if="toast.type === 'success'" :size="14" />
        <AlertCircle v-else :size="14" />
      </div>
      <div class="toast-message">{{ toast.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import UserMenu from '@/components/UserMenu.vue'
import {
  Hexagon, Home, FileUp, Type, Info, Server, UploadCloud, FileText, X, FileSearch,
  Sparkles, ArrowLeft, ArrowRight, Check, CheckCircle, AlertCircle, Image, FileCode,
  RefreshCw, Loader2, Brain, ChevronDown, Copy, MousePointer, MapPin, Search, Edit2, Plus, Minus, Trash2, ImageOff, Upload, Maximize, Download
} from 'lucide-vue-next'

// API Configuration
const API_ENDPOINT = 'http://localhost:8080/api/v1/document-analysis/analyze'
const SEARCH_API_ENDPOINT = 'http://localhost:8080/api/v1/chart-generation/search'
const GENERATION_API_ENDPOINT = 'http://localhost:8080/api/v1/chart-generation/create'
const NO_REFERENCE_API_ENDPOINT = 'http://localhost:8080/api/v1/chart-generation/create-no-reference'

// Helper function to get auth headers for fetch requests
const getAuthHeaders = (): Record<string, string> => {
  const session = localStorage.getItem('graftra_user_session')
  const token = session ? JSON.parse(session)?.token : null
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// Types
interface ChartData {
  chart_id: string
  chart_type: string
  chart_purpose: string
  importance_score: number
  insert_position: string
  template_search_query: string
  content_replacement_prompt: string
}

interface GenerationConfig {
  imageCount: number
}

interface AnalysisData {
  model: string
  thinking: string
  response: string
  structured_data: {
    charts: ChartData[]
  }
  request_id: string
  tokens_used: number
}

interface AnalysisResult {
  success: boolean
  message: string
  data: AnalysisData
}

// Reference Image Types
interface ReferenceImage {
  id: string
  image_url: string
  similarity: number
  structure_description: string
  metadata: string
}

interface ChartReferenceResult {
  chart_id: string
  chart_type: string
  success: boolean
  error_message: string | null
  reference_images: ReferenceImage[]
  search_query: string
}

interface ReferenceSearchResponse {
  success: boolean
  message: string
  data: {
    success: boolean
    message: string
    request_id: string
    analysis_id: string
    results: ChartReferenceResult[]
  }
}

// Chart Generation Types
interface ChartGenerationResponse {
  success: boolean
  message: string
  data: {
    success: boolean
    message: string
    request_id: string
    analysis_id: string
    chart_id: string
    chart_type: string
    generation_success: boolean
    reference_image_url: string
    prompt: string
    generated_image_urls: string[]
    generated_count: number
    model: string
  }
}

interface ChartGenerationResult {
  chart_id: string
  chart_type: string
  prompt: string
  success: boolean
  error_message?: string
  generated_image_urls: string[]
  generated_count: number
  reference_image_url?: string
  is_sensitive_content_error?: boolean // 标记是否为敏感词错误
  is_loading?: boolean // 标记是否正在加载中
}

// State
const currentStep = ref(1)
const totalSteps = 4
const isDragOver = ref(false)
const uploadedFile = ref<File | null>(null)
const textContent = ref('')
const selectedChartIds = ref<string[]>([]) // Changed to array for multi-select
const activeTabChartId = ref<string | null>(null) // Active tab in step 3
const selectedTool = ref('fix')
// generatedResult is now replaced by chartGenerationResults
const isAnalyzing = ref(false)
const loadingStep = ref(0)
const analysisError = ref<string | null>(null)
const analysisResult = ref<AnalysisResult | null>(null)
const streamingThinking = ref('')
const isStreaming = ref(false)

// Reference images state for step 4
const referenceResults = ref<ChartReferenceResult[]>([])
const isLoadingReferences = ref(false)
const referenceError = ref<string | null>(null)

// Image upload state for step 4
const uploadingImages = ref<Record<string, File | null>>({}) // chartId -> uploaded file
const uploadedImagePreviews = ref<Record<string, string>>({}) // chartId -> preview URL
const showUploadDialog = ref(false)
const currentUploadChartId = ref<string | null>(null)
const uploadInputRef = ref<HTMLInputElement | null>(null)

// Image preview state
const showImagePreview = ref(false)
const previewImageUrl = ref('')

// Selected reference images for each chart (chartId -> selected image ID)
const selectedReferenceImages = ref<Record<string, string>>({})

// Chart generation state
const isGeneratingCharts = ref(false)
const chartGenerationResults = ref<ChartGenerationResult[]>([])
const generationError = ref<string | null>(null)
const currentGeneratingChartIndex = ref(0)

// Fake progress bar state
const generationProgress = ref(0)
const progressInterval = ref<number | null>(null)

// Generate confirm dialog state
const showGenerateConfirmDialog = ref(false)
const confirmDialogTitle = ref('')
const confirmDialogMessage = ref('')

// Go back confirm dialog state
const showGoBackConfirmDialog = ref(false)

// Editing state for step 3
const isEditing = ref(false)
const editForm = ref({
  chart_purpose: '',
  insert_position: '',
  template_search_query: '',
  content_replacement_prompt: ''
})

// Generation config for step 3 - each chart has its own config
const chartGenerationConfigs = ref<Map<string, GenerationConfig>>(new Map())

// Refs
const fileInputRef = ref<HTMLInputElement | null>(null)
const thinkingContentRef = ref<HTMLDivElement | null>(null)

// Toast
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' })

// ============================================================
// LOCAL STORAGE PERSISTENCE
// ============================================================

const STORAGE_KEY = 'graftra_app_cache'

// Save data to localStorage
const saveToStorage = () => {
  try {
    // Convert uploadedFile to base64 for storage (small files only)
    let fileData = null
    if (uploadedFile.value && uploadedFile.value.size < 2 * 1024 * 1024) { // Only save files < 2MB
      const reader = new FileReader()
      reader.onload = () => {
        fileData = {
          name: uploadedFile.value!.name,
          size: uploadedFile.value!.size,
          type: uploadedFile.value!.type,
          base64: reader.result as string
        }
        persistData()
      }
      reader.readAsDataURL(uploadedFile.value)
    } else {
      persistData()
    }
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

const persistData = () => {
  try {
    const dataToSave = {
      currentStep: currentStep.value,
      textContent: textContent.value,
      uploadedFile: uploadedFile.value ? {
        name: uploadedFile.value.name,
        size: uploadedFile.value.size,
        type: uploadedFile.value.type
      } : null,
      selectedChartIds: selectedChartIds.value,
      analysisResult: analysisResult.value,
      streamingThinking: streamingThinking.value,
      // Convert Map to array for storage
      chartGenerationConfigs: Array.from(chartGenerationConfigs.value.entries()).map(([chartId, configs]) => [chartId, configs]),
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (e) {
    console.error('Failed to persist data:', e)
  }
}

// Load data from localStorage
const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)

      // Check if data is too old (more than 24 hours), if so, clear it
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      if (data.timestamp && Date.now() - data.timestamp > maxAge) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      // Restore data
      if (data.textContent) textContent.value = data.textContent
      if (data.selectedChartIds) selectedChartIds.value = data.selectedChartIds
      if (data.streamingThinking) streamingThinking.value = data.streamingThinking
      if (data.analysisResult) analysisResult.value = data.analysisResult
      if (data.chartGenerationConfigs) {
        // Migrate old data structure if needed
        const migratedConfigs = new Map()
        for (const [chartId, configs] of data.chartGenerationConfigs) {
          // Check if it's old structure (array) or new structure (object)
          if (Array.isArray(configs)) {
            // Old structure: migrate to new
            migratedConfigs.set(chartId, { imageCount: Math.min(4, configs.length || 3) })
          } else {
            // New structure: use imageCount only, ignore selectedStyles
            migratedConfigs.set(chartId, {
              imageCount: Math.max(1, Math.min(4, configs.imageCount || 3))
            })
          }
        }
        chartGenerationConfigs.value = migratedConfigs
      }

      // Note: We don't restore uploadedFile for security/size reasons
      // User needs to re-upload the file

      // Only restore currentStep if we have valid data
      if ((data.textContent || data.analysisResult) && data.currentStep) {
        currentStep.value = data.currentStep
      }

      console.log('Restored data from localStorage')
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e)
  }
}

// Clear cache
const clearCache = () => {
  localStorage.removeItem(STORAGE_KEY)
  currentStep.value = 1
  textContent.value = ''
  uploadedFile.value = null
  selectedChartIds.value = []
  analysisResult.value = null
  streamingThinking.value = ''
  chartGenerationConfigs.value.clear()
  showToast('缓存已清除', 'success')
}

// Watch for data changes and auto-save
watch([textContent, selectedChartIds, analysisResult, streamingThinking, chartGenerationConfigs], () => {
  saveToStorage()
}, { deep: true })

// Load from storage on mount
loadFromStorage()

// Cleanup on unmount
onUnmounted(() => {
  stopFakeProgress()
})

// Steps
const steps = [
  { number: 1, label: '上传文档' },
  { number: 2, label: '分析结果' },
  { number: 3, label: '图表详情' },
  { number: 4, label: '生成结果' }
]

// Computed
const progressWidth = computed(() => {
  return ((currentStep.value - 1) / (totalSteps - 1)) * 70 + '%'
})

const selectedChart = computed(() => {
  if (!analysisResult.value?.data?.structured_data?.charts) return null
  // Use activeTabChartId if available (step 3), otherwise use first selected chart
  const targetId = activeTabChartId.value || selectedChartIds.value[0] || null
  return analysisResult.value.data.structured_data.charts.find(
    c => c.chart_id === targetId
  ) || null
})

// Get selected charts for display in tabs
const selectedCharts = computed(() => {
  if (!analysisResult.value?.data?.structured_data?.charts) return []
  return analysisResult.value.data.structured_data.charts.filter(
    c => selectedChartIds.value.includes(c.chart_id)
  )
})

// Post process tools
const postProcessTools = [
  { id: 'fix', name: 'AI 修复文字', desc: '修复乱码和排版问题', icon: Sparkles, pro: false },
  { id: 'replace', name: '矢量图替换', desc: '智能替换矢量图标', icon: Image, pro: false },
  { id: 'editable', name: '可编辑导出', desc: '文字图层分离', icon: Type, pro: true },
  { id: 'redraw', name: 'AI 原图重绘', desc: '图→提示词→图', icon: RefreshCw, pro: true }
]

// Export options
const exportOptions = [
  { id: 'svg', name: 'SVG 矢量图', desc: '可缩放矢量格式', icon: FileCode, format: 'SVG' },
  { id: 'png', name: 'PNG 高清图', desc: '位图格式', icon: Image, format: 'PNG' },
  { id: 'pdf', name: 'PDF 文档', desc: '打印友好格式', icon: FileText, format: 'PDF' }
]

// Auto-scroll thinking content when it updates
watch(streamingThinking, async () => {
  await nextTick()
  if (thinkingContentRef.value) {
    thinkingContentRef.value.scrollTop = thinkingContentRef.value.scrollHeight
  }
})

// Methods
const goToStep = (step: number) => {
  if (step <= currentStep.value && !isAnalyzing.value) {
    currentStep.value = step
  }
}

const nextStep = async () => {
  console.log('nextStep called, currentStep:', currentStep.value, 'totalSteps:', totalSteps)
  console.log('uploadedFile:', uploadedFile.value, 'textContent:', textContent.value.trim())

  if (currentStep.value < totalSteps) {
    // When going from step 1 to step 2, first move to step 2, then start analysis
    if (currentStep.value === 1) {
      // Check if we have content before proceeding
      if (!uploadedFile.value && !textContent.value.trim()) {
        showToast('请先上传文档或输入文字内容', 'error')
        return
      }

      // Move to step 2 FIRST (so user sees the loading state)
      currentStep.value++
      console.log('Moved to step 2, starting analysis...')

      // Then start the analysis (will show loading in step 2)
      const success = await analyzeDocument()
      console.log('analyzeDocument returned:', success)

      if (!success) {
        // Go back to step 1 if analysis failed
        currentStep.value = 1
        return
      }

      // Auto-select first chart when analysis completes
      if (analysisResult.value?.data?.structured_data?.charts?.length) {
        const firstChart = analysisResult.value.data.structured_data.charts[0]
        if (firstChart?.chart_id) {
          selectedChartIds.value = [firstChart.chart_id]
        }
      }
    } else if (currentStep.value === 3) {
      // Moving from step 3 to step 4: show confirm dialog before generation
      showGenerateConfirm()
      return
    } else {
      // For other steps, just increment
      // When moving to step 3, set active tab to first selected chart and search for reference images
      if (currentStep.value === 2 && selectedChartIds.value.length > 0) {
        activeTabChartId.value = selectedChartIds.value[0]!
      }
      currentStep.value++

      // After moving to step 3, search for reference images
      if (currentStep.value === 3) {
        showToast('正在搜索参考图...', 'success')
        await searchReferenceImages()
      }
    }
    console.log('Current step:', currentStep.value)
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    // Show confirmation dialog when going back from step 2 to step 1
    if (currentStep.value === 2) {
      showGoBackConfirmDialog.value = true
      return
    }
    // Show confirmation dialog when going back from step 4 to step 3
    if (currentStep.value === 4) {
      showGoBackConfirmDialog.value = true
      return
    }
    // Clear active tab when going back from step 3
    if (currentStep.value === 3) {
      activeTabChartId.value = null
    }
    currentStep.value--
  }
}

const confirmGoBack = () => {
  showGoBackConfirmDialog.value = false
  // If going back from step 2 to step 1, clear analysis results
  if (currentStep.value === 2) {
    analysisResult.value = null
    streamingThinking.value = ''
    selectedChartIds.value = []
    activeTabChartId.value = null
    chartGenerationConfigs.value.clear()
  }
  // If going back from step 4 to step 3, just decrement step
  currentStep.value--
}

const cancelGoBack = () => {
  showGoBackConfirmDialog.value = false
}

// Generate confirm dialog functions
const getTotalImageCount = (): number => {
  let total = 0
  for (const chartId of selectedChartIds.value) {
    total += getChartImageCount(chartId)
  }
  return total
}

const showGenerateConfirm = () => {
  const totalCount = getTotalImageCount()
  confirmDialogTitle.value = '确认生成'
  confirmDialogMessage.value = `是否确定需要生成 ${totalCount} 张图表？`
  showGenerateConfirmDialog.value = true
}

const confirmGenerate = async () => {
  showGenerateConfirmDialog.value = false
  currentStep.value++

  // Start chart generation (returns immediately, runs in background)
  generateAllCharts()
}

// Generate all charts (concurrently with fake progress)
const generateAllCharts = async (): Promise<boolean> => {
  if (!analysisResult.value?.data?.structured_data?.charts) {
    showToast('没有可用的图表数据', 'error')
    return false
  }

  isGeneratingCharts.value = true
  generationError.value = null
  chartGenerationResults.value = []
  currentGeneratingChartIndex.value = 0
  generationProgress.value = 0

  try {
    const charts = analysisResult.value.data.structured_data.charts
      .filter(chart => selectedChartIds.value.includes(chart.chart_id))

    // Initialize placeholder results for all charts (so UI can show them immediately)
    const placeholderResults: ChartGenerationResult[] = charts.map(chart => ({
      chart_id: chart.chart_id,
      chart_type: chart.chart_type,
      prompt: chart.content_replacement_prompt,
      success: false,
      error_message: undefined,
      generated_image_urls: [],
      generated_count: 0,
      is_loading: true // Mark as loading
    }))
    chartGenerationResults.value = placeholderResults

    // Start fake progress bar (0% to 99% in ~60 seconds)
    startFakeProgress()

    // Generate all charts concurrently
    // Each chart result is added to results as it completes
    const generationPromises = charts.map(async (chart, index) => {
      const result = await generateSingleChart(chart)

      // Find and update the placeholder result with actual result
      // Use splice to trigger Vue's reactivity properly
      const placeholderIndex = chartGenerationResults.value.findIndex(r => r.chart_id === chart.chart_id)
      if (placeholderIndex !== -1) {
        chartGenerationResults.value.splice(placeholderIndex, 1, result)
      }

      // Update progress when each chart completes
      currentGeneratingChartIndex.value = index + 1

      // Mark this chart as completed visually
      await nextTick()

      return result
    })

    // Don't await Promise.all - let them complete independently
    // Just await a catch-all to handle any errors
    Promise.all(generationPromises).then((results) => {
      // All charts have completed
      stopFakeProgress()
      generationProgress.value = 100

      const hasErrors = results.some(r => !r.success)
      if (!hasErrors) {
        showToast('图表生成完成！', 'success')
      }
    }).catch((error) => {
      console.error('Generate charts error:', error)
      stopFakeProgress()
      if (error instanceof Error) {
        generationError.value = error.message
        showToast(`图表生成失败: ${error.message}`, 'error')
      }
    }).finally(() => {
      isGeneratingCharts.value = false
    })

    return true
  } catch (error: unknown) {
    console.error('Generate charts error:', error)
    if (error instanceof Error) {
      generationError.value = error.message
      showToast(`图表生成失败: ${error.message}`, 'error')
    } else {
      generationError.value = '未知错误'
      showToast('图表生成失败，请重试', 'error')
    }
    stopFakeProgress()
    return false
  }
}

// Start fake progress bar (0% to 99% in ~60 seconds)
const startFakeProgress = () => {
  generationProgress.value = 0

  // Clear any existing interval
  if (progressInterval.value !== null) {
    clearInterval(progressInterval.value)
  }

  // Progress increments: faster at start, slower near end
  const duration = 60000 // 60 seconds to reach ~99%
  const updateInterval = 200 // Update every 200ms
  const totalUpdates = duration / updateInterval

  let currentUpdate = 0
  progressInterval.value = window.setInterval(() => {
    currentUpdate++

    // Easing function: start fast, slow down as we approach 99%
    const progress = 1 - Math.pow(1 - currentUpdate / totalUpdates, 0.7)
    generationProgress.value = Math.min(Math.floor(progress * 99), 99)

    if (currentUpdate >= totalUpdates) {
      clearInterval(progressInterval.value!)
    }
  }, updateInterval) as unknown as number
}

// Stop fake progress bar
const stopFakeProgress = () => {
  if (progressInterval.value !== null) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
  generationProgress.value = 100
}

// Get total generated images count
const getTotalGeneratedImages = (): number => {
  let total = 0
  for (const result of chartGenerationResults.value) {
    if (result.success) {
      total += result.generated_count
    }
  }
  return total
}

// Handle export all images
const handleExportAll = () => {
  showToast('正在准备导出...', 'success')
  // TODO: Implement export functionality
  setTimeout(() => {
    showToast('导出功能开发中...', 'error')
  }, 500)
}

// Go back to step 3 and edit prompt for a specific chart
const goToEditPrompt = (chartId: string) => {
  // Go back to step 3
  currentStep.value = 3

  // Set the active chart to the one with sensitive content error
  activeTabChartId.value = chartId

  // Start editing mode
  startEditing()

  // Pre-fill the edit form
  const chart = getChartById(chartId)
  if (chart) {
    editForm.value = {
      chart_purpose: chart.chart_purpose,
      insert_position: chart.insert_position,
      template_search_query: chart.template_search_query,
      content_replacement_prompt: chart.content_replacement_prompt
    }
  }

  showToast('请修改提示词后重新生成', 'info')
}

// Generate a single chart
const generateSingleChart = async (chart: ChartData): Promise<ChartGenerationResult> => {
  try {
    const chartId = chart.chart_id
    const generationCount = getChartImageCount(chartId)
    const selectedImageId = selectedReferenceImages.value[chartId]
    const hasReferenceImage = !!selectedImageId

    // Get reference image URL or file
    let referenceImageUrl: string | undefined
    let referenceImageFile: File | undefined

    if (selectedImageId?.startsWith('uploaded-')) {
      // User uploaded image
      const file = uploadingImages.value[chartId]
      if (file) {
        referenceImageFile = file
      }
    } else if (selectedImageId) {
      // System retrieved image - find the URL
      const chartResult = referenceResults.value.find(r => r.chart_id === chartId)
      if (chartResult) {
        const refImage = chartResult.reference_images?.find(img => img.id === selectedImageId)
        if (refImage) {
          referenceImageUrl = refImage.image_url
        }
      }
    }

    const requestBody = {
      chart_id: chartId,
      chart_type: chart.chart_type,
      content_replacement_prompt: chart.content_replacement_prompt,
      generation_count: generationCount,
      size: '2K',
      watermark: false,
      request_id: analysisResult.value?.data?.request_id || `req_${Date.now()}`,
      analysis_id: analysisResult.value?.data?.request_id || `analysis_${Date.now()}`
    }

    let response: Response

    if (hasReferenceImage) {
      // Use FormData for file upload or URL reference
      const formData = new FormData()

      formData.append('chart_id', chartId)
      formData.append('chart_type', chart.chart_type)
      formData.append('content_replacement_prompt', chart.content_replacement_prompt)
      formData.append('generation_count', generationCount.toString())
      formData.append('size', '2K')
      formData.append('watermark', 'false')
      formData.append('request_id', analysisResult.value?.data?.request_id || `req_${Date.now()}`)
      formData.append('analysis_id', analysisResult.value?.data?.request_id || `analysis_${Date.now()}`)

      if (referenceImageFile) {
        formData.append('reference_image_file', referenceImageFile)
      } else if (referenceImageUrl) {
        formData.append('reference_image_url', referenceImageUrl)
      }

      response = await fetch(GENERATION_API_ENDPOINT, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })
    } else {
      // No reference image - use the no-reference endpoint
      const formData = new FormData()
      formData.append('prompt', chart.content_replacement_prompt)
      formData.append('generation_count', generationCount.toString())
      formData.append('size', '2K')
      formData.append('watermark', 'false')

      response = await fetch(NO_REFERENCE_API_ENDPOINT, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })
    }

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
    }

    const result: ChartGenerationResponse = await response.json()
    console.log('Chart generation response:', result)

    // Check for sensitive content error
    if (result.error?.code === 'InputTextSensitiveContentDetected') {
      return {
        chart_id: chartId,
        chart_type: chart.chart_type,
        prompt: chart.content_replacement_prompt,
        success: false,
        error_message: result.error.message || '提示词中包含敏感内容，请修改提示词后重试',
        generated_image_urls: [],
        generated_count: 0,
        is_sensitive_content_error: true,
        is_loading: false  // 标记加载完成
      }
    }

    if (result.success && result.data?.generation_success) {
      return {
        chart_id: chartId,
        chart_type: chart.chart_type,
        prompt: result.data.prompt || chart.content_replacement_prompt,
        success: true,
        generated_image_urls: result.data.generated_image_urls || [],
        generated_count: result.data.generated_count || 0,
        reference_image_url: result.data.reference_image_url,
        is_loading: false  // 标记加载完成
      }
    } else {
      return {
        chart_id: chartId,
        chart_type: chart.chart_type,
        prompt: chart.content_replacement_prompt,
        success: false,
        error_message: result.message || '图表生成失败',
        generated_image_urls: [],
        generated_count: 0,
        is_loading: false  // 标记加载完成
      }
    }
  } catch (error: unknown) {
    console.error('Generate single chart error:', error)
    return {
      chart_id: chart.chart_id,
      chart_type: chart.chart_type,
      prompt: chart.content_replacement_prompt,
      success: false,
      error_message: error instanceof Error ? error.message : '未知错误',
      generated_image_urls: [],
      generated_count: 0,
      is_loading: false  // 标记加载完成
    }
  }
}

const cancelGenerate = () => {
  showGenerateConfirmDialog.value = false
}

const selectChart = (chartId: string) => {
  const index = selectedChartIds.value.indexOf(chartId)
  if (index > -1) {
    // Deselect if already selected (but keep at least one selected)
    if (selectedChartIds.value.length > 1) {
      selectedChartIds.value.splice(index, 1)
    }
  } else {
    // Select if not selected
    selectedChartIds.value.push(chartId)
  }
}

const setActiveTab = (chartId: string) => {
  activeTabChartId.value = chartId
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    if (file.size > 10 * 1024 * 1024) {
      showToast('文件大小不能超过 10MB', 'error')
      return
    }
    uploadedFile.value = file
    showToast('文档上传成功', 'success')
  }
}

const handleFileDrop = (e: DragEvent) => {
  isDragOver.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0]
    if (file.size > 10 * 1024 * 1024) {
      showToast('文件大小不能超过 10MB', 'error')
      return
    }
    uploadedFile.value = file
    showToast('文档上传成功', 'success')
  }
}

const removeFile = () => {
  uploadedFile.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const selectTool = (tool: { id: string; name: string; pro: boolean }) => {
  if (tool.pro) {
    showToast('此功能需要升级到专业版', 'error')
  } else {
    selectedTool.value = tool.id
    showToast('已选择 ' + tool.name, 'success')
  }
}

const handleExport = (format: string) => {
  showToast(`正在导出 ${format} 格式...`, 'success')
}

const copyPrompt = () => {
  if (selectedChart.value?.content_replacement_prompt) {
    navigator.clipboard.writeText(selectedChart.value.content_replacement_prompt)
    showToast('提示词已复制到剪贴板', 'success')
  }
}

const generateChart = () => {
  showGenerateConfirm()
}

const retryAnalysis = async () => {
  analysisError.value = null
  await analyzeDocument()
}

// Editing methods for step 3
const startEditing = () => {
  if (selectedChart.value) {
    editForm.value = {
      chart_purpose: selectedChart.value.chart_purpose,
      insert_position: selectedChart.value.insert_position,
      template_search_query: selectedChart.value.template_search_query,
      content_replacement_prompt: selectedChart.value.content_replacement_prompt
    }
    isEditing.value = true
  }
}

const cancelEditing = () => {
  isEditing.value = false
  editForm.value = {
    chart_purpose: '',
    insert_position: '',
    template_search_query: '',
    content_replacement_prompt: ''
  }
}

const saveEditing = () => {
  if (selectedChart.value && analysisResult.value?.data?.structured_data?.charts) {
    // Find and update the chart in the array
    const chartIndex = analysisResult.value.data.structured_data.charts.findIndex(
      c => c.chart_id === selectedChart.value!.chart_id
    )
    if (chartIndex !== -1) {
      analysisResult.value.data.structured_data.charts[chartIndex] = {
        ...analysisResult.value.data.structured_data.charts[chartIndex],
        chart_purpose: editForm.value.chart_purpose,
        insert_position: editForm.value.insert_position,
        template_search_query: editForm.value.template_search_query,
        content_replacement_prompt: editForm.value.content_replacement_prompt
      }
    }
    isEditing.value = false
    showToast('保存成功', 'success')
  }
}

const removeChart = (chartId: string) => {
  const index = selectedChartIds.value.indexOf(chartId)
  if (index > -1) {
    selectedChartIds.value.splice(index, 1)

    // If we removed the active tab, switch to another chart
    if (activeTabChartId.value === chartId) {
      if (selectedChartIds.value.length > 0) {
        activeTabChartId.value = selectedChartIds.value[0]
      } else {
        activeTabChartId.value = null
      }
    }

    showToast('图表已移除', 'success')
  }
}

// Generation config methods
const getChartImageCount = (chartId: string): number => {
  if (!chartGenerationConfigs.value.has(chartId)) {
    // First chart defaults to 3, subsequent charts default to 1
    const isFirstChart = analysisResult.value?.data?.structured_data?.charts?.[0]?.chart_id === chartId
    const defaultCount = isFirstChart ? 3 : 1
    chartGenerationConfigs.value.set(chartId, { imageCount: defaultCount })
  }
  return chartGenerationConfigs.value.get(chartId)?.imageCount || 3
}

const updateChartImageCount = (chartId: string, delta: number) => {
  const currentCount = getChartImageCount(chartId)
  const newCount = currentCount + delta
  if (newCount >= 1 && newCount <= 4) {
    chartGenerationConfigs.value.get(chartId)!.imageCount = newCount
  }
}

// Get chart by ID from analysis results
const getChartById = (chartId: string): ChartData | undefined => {
  return analysisResult.value?.data?.structured_data?.charts?.find(c => c.chart_id === chartId)
}

// Open upload dialog for a specific chart
const openUploadDialog = (chartId: string) => {
  currentUploadChartId.value = chartId
  showUploadDialog.value = true
}

// Close upload dialog
const closeUploadDialog = () => {
  showUploadDialog.value = false
  currentUploadChartId.value = null
}

// Open image preview
const openImagePreview = (imageUrl: string) => {
  previewImageUrl.value = imageUrl
  showImagePreview.value = true
}

// Close image preview
const closeImagePreview = () => {
  showImagePreview.value = false
  previewImageUrl.value = ''
}

// Handle file selection for reference image upload
const handleReferenceImageSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Check file type
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'error')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过 5MB', 'error')
      return
    }

    if (currentUploadChartId.value) {
      uploadingImages.value[currentUploadChartId.value] = file

      // Create preview URL
      if (uploadedImagePreviews.value[currentUploadChartId.value]) {
        URL.revokeObjectURL(uploadedImagePreviews.value[currentUploadChartId.value])
      }
      uploadedImagePreviews.value[currentUploadChartId.value] = URL.createObjectURL(file)

      // Auto-select the uploaded image
      selectedReferenceImages.value[currentUploadChartId.value] = `uploaded-${currentUploadChartId.value}`

      showToast('图片上传成功', 'success')
      closeUploadDialog()
    }
  }

  // Reset input
  if (target) {
    target.value = ''
  }
}

// Handle drag and drop for reference image upload
const handleReferenceImageDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0]

    // Check file type
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件', 'error')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('图片大小不能超过 5MB', 'error')
      return
    }

    if (currentUploadChartId.value) {
      uploadingImages.value[currentUploadChartId.value] = file

      // Create preview URL
      if (uploadedImagePreviews.value[currentUploadChartId.value]) {
        URL.revokeObjectURL(uploadedImagePreviews.value[currentUploadChartId.value])
      }
      uploadedImagePreviews.value[currentUploadChartId.value] = URL.createObjectURL(file)

      // Auto-select the uploaded image
      selectedReferenceImages.value[currentUploadChartId.value] = `uploaded-${currentUploadChartId.value}`

      showToast('图片上传成功', 'success')
      closeUploadDialog()
    }
  }
}

// Trigger file input click
const triggerUploadInput = () => {
  uploadInputRef.value?.click()
}

// Remove uploaded reference image
const removeUploadedImage = (chartId: string) => {
  if (uploadedImagePreviews.value[chartId]) {
    URL.revokeObjectURL(uploadedImagePreviews.value[chartId])
  }
  delete uploadingImages.value[chartId]
  delete uploadedImagePreviews.value[chartId]
  // Also clear selection if this was the selected image
  if (selectedReferenceImages.value[chartId] === `uploaded-${chartId}`) {
    delete selectedReferenceImages.value[chartId]
  }
  showToast('已移除上传的图片', 'success')
}

// Get reference result for a specific chart
const getReferenceResultForChart = (chartId: string): ChartReferenceResult[] => {
  if (!chartId) return []
  return referenceResults.value.filter(r => r.chart_id === chartId)
}

// Select reference image for a chart
const selectReferenceImage = (chartId: string, imageId: string) => {
  selectedReferenceImages.value[chartId] = imageId
}

// Check if an image is selected for a chart
const isImageSelected = (chartId: string, imageId: string): boolean => {
  return selectedReferenceImages.value[chartId] === imageId
}

// Check if a chart has a selected reference image
const hasSelectedReferenceImage = (chartId: string): boolean => {
  return !!selectedReferenceImages.value[chartId]
}

// Replace reference image (opens upload dialog)
const replaceReferenceImage = (chartId: string, imageId: string) => {
  openUploadDialog(chartId)
}

// Check if chart has uploaded image
const hasUploadedImage = (chartId: string): boolean => {
  return !!uploadingImages.value[chartId]
}

// Get uploaded image URL for preview
const getUploadedImageUrl = (chartId: string): string | null => {
  return uploadedImagePreviews.value[chartId] || null
}

// Get all images (user uploaded + system retrieved) for a chart, with user uploaded first
const getAllImagesForChart = (chartId: string, result: ChartReferenceResult) => {
  const images: Array<{ id: string; type: 'uploaded' | 'system'; data?: any }> = []

  // Add user uploaded image first
  if (hasUploadedImage(chartId)) {
    images.push({
      id: `uploaded-${chartId}`,
      type: 'uploaded'
    })
  }

  // Add system retrieved images
  if (result.reference_images && result.reference_images.length > 0) {
    for (const image of result.reference_images) {
      images.push({
        id: image.id,
        type: 'system',
        data: image
      })
    }
  }

  return images
}

// API call for document analysis with streaming support
const analyzeDocument = async (): Promise<boolean> => {
  console.log('analyzeDocument called')
  console.log('uploadedFile:', uploadedFile.value?.name, 'textContent:', textContent.value.trim())

  // Note: Validation is done in nextStep before calling this function

  console.log('Starting analysis...')
  isAnalyzing.value = true
  isStreaming.value = true
  loadingStep.value = 1
  streamingThinking.value = ''
  analysisError.value = null
  analysisResult.value = null
  showToast('AI 正在分析文档，请稍候...', 'success')

  try {
    const formData = new FormData()
    console.log('Creating FormData...')

    if (uploadedFile.value) {
      console.log('Appending file to FormData:', uploadedFile.value.name)
      formData.append('document', uploadedFile.value)
    } else {
      console.log('Creating text file from content')
      const textFile = new File([textContent.value], 'content.txt', { type: 'text/plain' })
      formData.append('document', textFile)
    }

    console.log('Sending streaming request to:', API_ENDPOINT)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000) // 5分钟超时

    // Get token from localStorage for authentication
    const session = localStorage.getItem('graftra_user_session')
    const token = session ? JSON.parse(session)?.token : null

    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: formData,
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    console.log('Response received, status:', response.status)

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
    }

    // Check if response is streaming
    const contentType = response.headers.get('content-type')
    const isStreamingResponse = contentType?.includes('text/event-stream') ||
                                contentType?.includes('text/plain') ||
                                contentType?.includes('application/json')

    if (isStreamingResponse && response.body) {
      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulatedContent = '' // Accumulate the JSON content from chunks
      let currentEvent = '' // Track current SSE event type

      console.log('Starting to read stream...')

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          console.log('Stream completed')
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        // Parse SSE format line by line
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue // Skip empty lines

          console.log('Processing line:', line)

          // Handle SSE event: lines
          if (line.startsWith('event:')) {
            currentEvent = line.slice(6).trim()
            console.log('Event type:', currentEvent)

            if (currentEvent === 'start') {
              loadingStep.value = 1
            } else if (currentEvent === 'progress') {
              loadingStep.value = 2
            } else if (currentEvent === 'content') {
              loadingStep.value = 3
            }
            continue
          }

          // Handle SSE data: lines
          if (line.startsWith('data:')) {
            const dataLine = line.slice(5).trim()

            if (dataLine === '[DONE]') {
              console.log('Received [DONE] signal')
              continue
            }

            try {
              const parsed = JSON.parse(dataLine)
              console.log('Parsed data:', parsed)

              // Handle progress event
              if (currentEvent === 'progress') {
                console.log('Progress:', parsed.message)
                if (parsed.message) {
                  streamingThinking.value = `正在${parsed.message}...`
                }
              }
              // Handle thinking event - AI thinking content
              else if (currentEvent === 'thinking') {
                if (parsed.type === 'thinking' && parsed.text) {
                  streamingThinking.value += parsed.text
                }
              }
              // Handle content event (character-by-character JSON)
              else if (currentEvent === 'content') {
                if (parsed.type === 'content' && parsed.text) {
                  accumulatedContent += parsed.text
                }
              }
              // Handle chunk event - backward compatibility
              else if (currentEvent === 'chunk') {
                if (parsed.type === 'start') {
                  console.log('Chunk stream started')
                } else if (parsed.type === 'content' && parsed.text) {
                  accumulatedContent += parsed.text
                }
              }
              // Handle result event (final complete result)
              else if (currentEvent === 'result') {
                console.log('Received final result')
                console.log('Parsed structured_data:', parsed.structured_data)
                console.log('Parsed response:', parsed.response?.substring(0, 100))

                // Try to extract structured_data from response field if structured_data is null
                let structuredData = parsed.structured_data
                if (!structuredData || !structuredData.charts) {
                  console.log('structured_data is null or empty, trying to parse from response field...')
                  if (parsed.response) {
                    try {
                      // Remove markdown code blocks if present
                      let jsonStr = parsed.response
                      // Remove ```json and ``` markers
                      jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')
                      // Trim whitespace
                      jsonStr = jsonStr.trim()
                      console.log('Cleaned JSON string:', jsonStr.substring(0, 200))

                      // Parse the JSON
                      const responseParsed = JSON.parse(jsonStr)
                      if (responseParsed.charts && Array.isArray(responseParsed.charts)) {
                        structuredData = { charts: responseParsed.charts }
                        console.log('Successfully extracted charts from response field:', responseParsed.charts.length)
                      }
                    } catch (e) {
                      console.error('Failed to parse response field as JSON:', e)
                    }
                  }
                }

                // Convert backend format to our expected format
                const result: AnalysisResult = {
                  success: true,
                  message: 'Success',
                  data: {
                    model: parsed.model || '',
                    thinking: parsed.thinking || '',
                    response: parsed.response || '',
                    structured_data: structuredData || { charts: [] },
                    request_id: parsed.request_id || '',
                    tokens_used: parsed.tokens_used || 0
                  }
                }

                analysisResult.value = result
                loadingStep.value = 3
                console.log('Analysis complete, charts found:', result.data?.structured_data?.charts?.length)

                isStreaming.value = false
                return true
              }

            } catch (e) {
              console.log('Failed to parse JSON:', dataLine, e)
            }
          }
        }
      }

      // Check if we got a result from the result event
      if (analysisResult.value?.data) {
        console.log('Analysis successful, charts found:', analysisResult.value.data.structured_data?.charts?.length)
        isStreaming.value = false
        return true
      }

      // Fallback: try to parse accumulated content if we have it
      if (accumulatedContent) {
        console.log('Trying to parse accumulated content, length:', accumulatedContent.length)
        try {
          const parsed = JSON.parse(accumulatedContent)
          // Check if it has structured_data
          if (parsed.structured_data && parsed.structured_data.charts) {
            const result: AnalysisResult = {
              success: true,
              message: 'Success',
              data: {
                model: parsed.model || '',
                thinking: parsed.thinking || '',
                response: JSON.stringify(parsed),
                structured_data: parsed.structured_data,
                request_id: parsed.request_id || '',
                tokens_used: parsed.tokens_used || 0
              }
            }
            analysisResult.value = result
            loadingStep.value = 3
            isStreaming.value = false
            console.log('Analysis successful from accumulated content')
            return true
          }
        } catch (e) {
          console.log('Could not parse accumulated content as JSON')
        }
      }

      throw new Error('未能获取完整的分析结果')
    } else {
      // Handle non-streaming response (fallback)
      const result: AnalysisResult = await response.json()
      console.log('Response data:', result)

      if (result.success && result.data) {
        analysisResult.value = result
        loadingStep.value = 3
        console.log('Analysis successful, charts found:', result.data.structured_data?.charts?.length)
        isStreaming.value = false
        return true
      } else {
        throw new Error(result.message || '分析失败')
      }
    }
  } catch (error: unknown) {
    console.error('Analysis error:', error)
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        analysisError.value = '请求超时，请重试或联系管理员'
      } else {
        analysisError.value = error.message
      }
      showToast(`分析失败: ${error.message}`, 'error')
    } else {
      analysisError.value = '未知错误'
      showToast('分析失败，请重试', 'error')
    }
    isStreaming.value = false
    return false
  } finally {
    isAnalyzing.value = false
  }
}

// Search for reference images based on selected charts
const searchReferenceImages = async (): Promise<boolean> => {
  if (!analysisResult.value?.data?.structured_data?.charts) {
    showToast('没有可用的图表数据', 'error')
    return false
  }

  isLoadingReferences.value = true
  referenceError.value = null

  try {
    // Build request payload from selected charts
    const selectedCharts = analysisResult.value.data.structured_data.charts
      .filter(chart => selectedChartIds.value.includes(chart.chart_id))
      .map(chart => ({
        chart_id: chart.chart_id,
        chart_type: chart.chart_type,
        chart_purpose: chart.chart_purpose,
        importance_score: chart.importance_score,
        insert_position: chart.insert_position,
        template_search_query: chart.template_search_query,
        content_replacement_prompt: chart.content_replacement_prompt,
        generation_count: getChartImageCount(chart.chart_id)
      }))

    // Calculate total images
    let totalImages = 0
    for (const chart of selectedCharts) {
      totalImages += chart.generation_count
    }

    const requestBody = {
      selected_charts: selectedCharts,
      total_images: totalImages,
      document_context: {
        request_id: analysisResult.value.data.request_id || `req_${Date.now()}`,
        analysis_id: analysisResult.value.data.request_id || `analysis_${Date.now()}`
      }
    }

    console.log('Searching reference images with request:', requestBody)

    const response = await fetch(SEARCH_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status} ${response.statusText}`)
    }

    const result: ReferenceSearchResponse = await response.json()
    console.log('Reference images response:', result)

    if (result.success && result.data?.results) {
      referenceResults.value = result.data.results
      console.log('Reference images loaded:', result.data.results.length, 'charts')

      // Auto-select first reference image for each chart
      for (const chartResult of result.data.results) {
        if (chartResult.success && chartResult.reference_images && chartResult.reference_images.length > 0) {
          // Select the first system reference image
          selectedReferenceImages.value[chartResult.chart_id] = chartResult.reference_images[0].id
        }
      }

      return true
    } else {
      throw new Error(result.message || '搜索参考图失败')
    }
  } catch (error: unknown) {
    console.error('Search reference images error:', error)
    if (error instanceof Error) {
      referenceError.value = error.message
      showToast(`搜索参考图失败: ${error.message}`, 'error')
    } else {
      referenceError.value = '未知错误'
      showToast('搜索参考图失败，请重试', 'error')
    }
    return false
  } finally {
    isLoadingReferences.value = false
  }
}

const showToast = (message: string, type: 'success' | 'error') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Helper functions
const getChartTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    'flowchart': '流程图',
    'module_diagram': '模块图',
    'architecture_diagram': '架构图',
    'org_chart': '组织结构图',
    'hierarchy_diagram': '层级图',
    'sequence_diagram': '时序图',
    'mindmap': '思维导图'
  }
  return typeMap[type] || type || '未知类型'
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.app-page {
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
}

.navbar-logo :deep(svg) {
  color: var(--primary);
}

.navbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.3);
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: var(--text);
  border: 1px solid var(--slate-200);
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
}

.btn-ghost:hover {
  background: var(--slate-100);
  color: var(--primary);
}

/* Main Content */
.app-container {
  padding-top: 80px;
  min-height: 100vh;
  background: linear-gradient(180deg, var(--bg) 0%, var(--primary-50) 100%);
}

.app-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 60px 120px;
}

/* Stepper */
.stepper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-bottom: 50px;
  padding: 0 40px;
}

.step-pill {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.06));
}

.step-pill:hover {
  transform: translateY(-2px);
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
}

.step-arrow-left,
.step-arrow-right {
  width: 0;
  height: 0;
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
  transition: all 0.3s ease;
}

.step-arrow-left {
  border-right: 16px solid var(--slate-100);
}

.step-arrow-right {
  border-left: 16px solid var(--slate-100);
}

.step-pill-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  background: var(--slate-100);
  transition: all 0.3s ease;
}

.step-pill:first-child .step-arrow-left {
  border-right-color: transparent;
}

.step-pill:last-child .step-arrow-right {
  border-left-color: transparent;
}

.step-pill:first-child .step-pill-content {
  border-radius: 8px 0 0 8px;
  padding-left: 20px;
}

.step-pill:last-child .step-pill-content {
  border-radius: 0 8px 8px 0;
  padding-right: 20px;
}

.step-pill:not(:first-child):not(:last-child) .step-pill-content {
  padding: 12px 20px;
}

/* Active state */
.step-pill.active .step-arrow-left {
  border-right-color: var(--primary);
}

.step-pill.active .step-arrow-right {
  border-left-color: var(--primary);
}

.step-pill.active .step-pill-content {
  background: var(--primary);
}

.step-pill.active .step-num {
  color: white;
}

.step-pill.active .step-name {
  color: white;
  font-weight: 700;
}

/* Completed state */
.step-pill.completed .step-arrow-left {
  border-right-color: #d1fae5;
}

.step-pill.completed .step-arrow-right {
  border-left-color: #d1fae5;
}

.step-pill.completed .step-pill-content {
  background: #d1fae5;
}

.step-pill.completed .step-num {
  color: var(--primary);
}

.step-pill.completed .step-name {
  color: var(--primary);
}

.step-pill.completed .step-check-icon {
  opacity: 1;
  transform: scale(1);
}

.step-pill.completed .step-num {
  opacity: 0;
  transform: scale(0);
}

/* Step icon */
.step-icon {
  position: relative;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-num {
  font-size: 16px;
  font-weight: 700;
  color: var(--slate-500);
  transition: all 0.3s ease;
}

.step-check-icon {
  position: absolute;
  color: var(--primary);
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
}

.step-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--slate-600);
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

/* Panel */
.panel {
  display: none;
  animation: fadeIn 0.4s ease;
}

.panel.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-header {
  text-align: center;
  margin-bottom: 40px;
}

.panel-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text);
}

.panel-desc {
  font-size: 16px;
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto;
}

/* Input Grid */
.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 1024px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
}

.input-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-section {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(5, 150, 105, 0.08);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text);
}

.section-label :deep(svg) {
  color: var(--primary);
}

/* Upload Zone */
.upload-zone {
  border: 2px dashed var(--slate-200);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: var(--slate-50);
}

.upload-zone:hover,
.upload-zone.dragover {
  border-color: var(--primary);
  background: rgba(5, 150, 105, 0.03);
}

.upload-zone.has-file {
  border-style: solid;
  border-color: var(--primary-300);
  background: rgba(5, 150, 105, 0.05);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.upload-icon {
  color: var(--slate-400);
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  margin-top: 12px;
}

.upload-hint {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 8px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.file-name {
  font-weight: 600;
  color: var(--text);
  text-align: left;
}

.file-size {
  font-size: 13px;
  color: var(--text-muted);
  text-align: left;
}

.remove-file-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--slate-100);
  color: var(--slate-500);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-file-btn:hover {
  background: var(--danger-100);
  color: var(--danger);
}

/* Text Input */
.text-input {
  width: 100%;
  min-height: 160px;
  padding: 16px;
  border: 1px solid var(--slate-200);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: var(--primary);
}

/* Info Content */
.info-content {
  color: var(--text-muted);
}

.info-text {
  margin-bottom: 16px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.check-icon {
  color: var(--primary);
  flex-shrink: 0;
}

/* API Endpoint */
.api-endpoint {
  background: var(--slate-900);
  border-radius: 10px;
  padding: 16px;
  overflow-x: auto;
}

.api-endpoint code {
  color: #10b981;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', monospace;
  white-space: nowrap;
}

/* Analysis Loading */
.analysis-loading {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  color: var(--primary);
  margin-bottom: 24px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.loading-desc {
  color: var(--text-muted);
  margin-bottom: 32px;
}

.loading-steps {
  display: flex;
  justify-content: center;
  gap: 32px;
  max-width: 400px;
  margin: 0 auto;
}

.loading-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--slate-400);
  font-size: 13px;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--slate-200);
  transition: all 0.3s ease;
}

.loading-step.active .step-dot {
  background: var(--primary);
  box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.2);
}

.loading-step.active {
  color: var(--primary);
}

/* Thinking Section Wrapper - Separated from results */
.thinking-section-wrapper {
  margin-bottom: 32px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.08);
  background: white;
  border: 1px solid var(--slate-200);
}

.thinking-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, var(--slate-50) 0%, white 100%);
  border-bottom: 1px solid var(--slate-200);
}

.thinking-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.thinking-header-left :deep(svg) {
  color: var(--primary);
}

.thinking-section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.thinking-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.thinking-status:not(.completed) {
  background: rgba(5, 150, 105, 0.1);
  color: var(--primary);
}

.thinking-status.completed {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: statusPulse 1.5s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.thinking-status.completed .status-dot {
  animation: none;
}

.thinking-content-display {
  padding: 20px;
  min-height: 120px;
  max-height: 400px;
  overflow-y: auto;
  background: var(--slate-900);
  color: #10b981;
  font-family: 'Monaco', 'Menlo', 'SF Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;
}

.thinking-content-display::-webkit-scrollbar {
  width: 8px;
}

.thinking-content-display::-webkit-scrollbar-track {
  background: var(--slate-800);
  border-radius: 4px;
}

.thinking-content-display::-webkit-scrollbar-thumb {
  background: var(--slate-600);
  border-radius: 4px;
}

.thinking-content-display::-webkit-scrollbar-thumb:hover {
  background: var(--slate-500);
}

.thinking-placeholder {
  color: var(--slate-500);
  font-style: italic;
}

.thinking-text {
  color: #10b981;
}

.cursor-blink {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background: #10b981;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.thinking-content-display.is-streaming {
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
}

.thinking-content-display.is-streaming::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, var(--slate-900), transparent);
  pointer-events: none;
}

/* Analysis Results */
.analysis-results {
  animation: fadeIn 0.4s ease;
}

.analysis-info {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
  padding: 20px;
  background: var(--slate-50);
  border-radius: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.info-value.mono {
  font-family: 'Monaco', 'Menlo', monospace;
}

/* Charts Container */
.charts-container {
  margin-bottom: 32px;
}

.charts-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 20px;
}

.charts-title :deep(svg) {
  color: var(--primary);
}

.selected-count {
  padding: 4px 12px;
  background: rgba(5, 150, 105, 0.1);
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.chart-card {
  background: white;
  border: 2px solid var(--slate-200);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chart-card:hover {
  border-color: var(--primary-300);
  box-shadow: 0 4px 16px rgba(5, 150, 105, 0.1);
}

.chart-card.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.chart-type-badge.type-flowchart {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.chart-type-badge.type-module_diagram,
.chart-type-badge.type-architecture_diagram {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.chart-type-badge.type-org_chart,
.chart-type-badge.type-hierarchy_diagram {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.chart-type-badge.type-sequence_diagram {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.chart-type-badge.type-mindmap {
  background: rgba(236, 72, 153, 0.1);
  color: #ec4899;
}

.chart-score {
  padding: 4px 10px;
  background: var(--slate-100);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}

.chart-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chart-purpose {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
}

.chart-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
}

.detail-value {
  font-size: 13px;
  color: var(--slate-600);
  line-height: 1.4;
}

.chart-prompt-preview {
  margin-top: 8px;
}

.prompt-details {
  border: 1px solid var(--slate-200);
  border-radius: 10px;
  overflow: hidden;
}

.prompt-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  background: var(--slate-50);
}

.prompt-summary:hover {
  background: var(--slate-100);
}

.prompt-summary :deep(svg) {
  margin-left: auto;
  color: var(--slate-400);
}

.prompt-text {
  padding: 14px;
  font-size: 12px;
  color: var(--slate-600);
  line-height: 1.6;
  white-space: pre-wrap;
  background: white;
  border-top: 1px solid var(--slate-200);
}

/* Chart Checkbox for Multi-Select */
.chart-checkbox {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
}

.checkbox-indicator {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 2px solid var(--slate-300);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.chart-card.selected .checkbox-indicator {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.chart-card {
  position: relative;
  padding-left: 52px; /* Space for checkbox */
}

/* ============================================================
   STEP 3: CHART DETAILS STYLES
   ============================================================ */

/* Empty State */
.step3-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.step3-empty .empty-icon {
  color: var(--slate-200);
  margin-bottom: 20px;
}

/* Content Layout */
.step3-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

@media (max-width: 1024px) {
  .step3-content {
    grid-template-columns: 1fr;
  }
}

/* Left: Unified Details Panel */
.step3-details-panel {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* Details Header */
.details-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--slate-100);
  background: var(--slate-50);
}

.details-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.details-type-badge {
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.details-type-badge.type-flowchart {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.details-type-badge.type-module_diagram,
.details-type-badge.type-architecture_diagram {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

.details-type-badge.type-org_chart,
.details-type-badge.type-hierarchy_diagram {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.details-type-badge.type-sequence_diagram {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.details-type-badge.type-mindmap {
  background: rgba(236, 72, 153, 0.12);
  color: #ec4899;
}

.details-score {
  padding: 4px 10px;
  background: var(--slate-200);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}

.btn-icon-edit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--slate-200);
  border-radius: 8px;
  background: white;
  color: var(--text);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-icon-edit:hover {
  border-color: var(--slate-300);
  background: var(--slate-50);
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.btn-icon-small {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border: 1px solid var(--slate-200);
  border-radius: 6px;
  background: white;
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-icon-small:hover {
  border-color: var(--slate-300);
  background: var(--slate-50);
}

.btn-icon-small.primary {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.btn-icon-small.primary:hover {
  background: var(--primary-300);
}

/* Details Content */
.details-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field-label :deep(svg) {
  color: var(--primary);
}

.field-value {
  font-size: 14px;
  color: var(--text);
  line-height: 1.6;
  margin: 0;
}

.field-code {
  background: var(--slate-900);
  border-radius: 10px;
  padding: 14px;
  font-size: 13px;
  color: #10b981;
  font-family: 'Monaco', 'Menlo', monospace;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.field-prompt {
  font-size: 14px;
  color: var(--text);
  line-height: 1.7;
  padding: 14px;
  background: var(--slate-50);
  border-radius: 10px;
}

.field-input {
  padding: 10px 14px;
  border: 1px solid var(--slate-200);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text);
  transition: border-color 0.15s ease;
}

.field-input:focus {
  outline: none;
  border-color: var(--primary);
}

.field-textarea {
  padding: 12px 14px;
  border: 1px solid var(--slate-200);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text);
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.15s ease;
}

.field-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

/* Details Footer */
.details-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--slate-100);
  background: var(--slate-50);
}

/* Reference Section in Step 3 */
.reference-section {
  padding: 16px 20px;
  border-top: 1px solid var(--slate-100);
  background: var(--slate-50);
}

.reference-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.reference-section-header .field-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.reference-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  color: var(--slate-600);
  font-size: 14px;
}

.reference-error-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fef2f2;
  border-radius: 12px;
  color: #dc2626;
  font-size: 14px;
}

.chart-reference-content {
  margin-top: 12px;
}

.reference-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.reference-image-card {
  position: relative;
  background: white;
  border: 2px solid var(--slate-200);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reference-image-card:hover {
  border-color: var(--slate-300);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.reference-image-card.selected {
  border: 2px solid var(--primary);
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
}

.reference-image-card.selected .reference-image-wrapper::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  background: var(--primary);
  border-radius: 50%;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.reference-image-card.selected .reference-image-wrapper::after {
  content: '✓';
  position: absolute;
  top: 11px;
  left: 12px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  z-index: 11;
}

.reference-image-wrapper {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.reference-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reference-image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.reference-image-card:hover .reference-image-overlay {
  opacity: 1;
}

.reference-image-card.selected .reference-image-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.3);
}

.reference-image-card .icon-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.2s ease !important;
}

.reference-image-card .icon-btn:hover {
  background: #ffffff !important;
  transform: scale(1.05) !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25) !important;
}

.reference-image-info {
  padding: 10px;
  background: white;
}

.uploaded-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--primary-50);
  color: var(--primary);
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  margin-bottom: 4px;
}

.reference-similarity {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 4px;
}

.reference-description {
  font-size: 12px;
  color: var(--slate-600);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.no-reference-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: white;
  border-radius: 12px;
  border: 2px dashed var(--slate-200);
  color: var(--slate-400);
  font-size: 14px;
  gap: 12px;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 1px solid var(--slate-200);
  border-radius: 10px;
  background: white;
  color: var(--text);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-outline:hover {
  border-color: var(--slate-300);
  background: var(--slate-50);
}

/* Right: Tabs Panel */
.step3-tabs-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  height: fit-content;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid var(--slate-100);
  background: var(--slate-50);
}

.tabs-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.tabs-count {
  padding: 4px 10px;
  background: var(--slate-200);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}

.tabs-list {
  overflow-y: auto;
  padding: 10px;
}

.tabs-list::-webkit-scrollbar {
  width: 6px;
}

.tabs-list::-webkit-scrollbar-track {
  background: transparent;
}

.tabs-list::-webkit-scrollbar-thumb {
  background: var(--slate-300);
  border-radius: 3px;
}

.tab-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.tab-item:hover {
  background: var(--slate-50);
}

.tab-item.active {
  background: rgba(5, 150, 105, 0.08);
}

.tab-item-indicator {
  width: 4px;
  height: 100%;
  min-height: 40px;
  border-radius: 2px;
  background: transparent;
  flex-shrink: 0;
}

.tab-item.active .tab-item-indicator {
  background: var(--primary);
}

.tab-item-content {
  flex: 1;
  min-width: 0;
}

.tab-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.tab-item-type {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.tab-item-type.type-flowchart {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.tab-item-type.type-module_diagram,
.tab-item-type.type-architecture_diagram {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

.tab-item-type.type-org_chart,
.tab-item-type.type-hierarchy_diagram {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.tab-item-type.type-sequence_diagram {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.tab-item-type.type-mindmap {
  background: rgba(236, 72, 153, 0.12);
  color: #ec4899;
}

.tab-item-score {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
}

.tab-item-text {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tab-item.active .tab-item-text {
  color: var(--primary);
}

/* Tab Item Reference Status */
.tab-item-reference-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 4px 8px;
  background: var(--slate-100);
  border-radius: 6px;
  font-size: 11px;
  color: var(--slate-500);
  transition: all 0.2s ease;
}

.tab-item-reference-status.selected {
  background: rgba(5, 150, 105, 0.1);
  color: var(--primary);
}

.tab-item-reference-status .status-icon {
  flex-shrink: 0;
}

.tab-item-reference-status .status-icon.selected {
  color: var(--primary);
}

.tab-item-reference-status .status-text {
  font-weight: 500;
}

/* Tab Item Delete Button */
.tab-item-delete {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--slate-400);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  opacity: 0;
}

.tab-item:hover .tab-item-delete {
  opacity: 1;
}

.tab-item-delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}

/* Tab Item Image Count */
.tab-item-count {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--slate-100);
}

.count-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.count-control {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.count-btn-mini {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid var(--slate-200);
  background: white;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.count-btn-mini:hover:not(:disabled) {
  border-color: var(--primary);
  background: rgba(5, 150, 105, 0.05);
  color: var(--primary);
}

.count-btn-mini:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.count-value {
  min-width: 16px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  text-align: center;
}

/* Analysis Error */
.analysis-error {
  text-align: center;
  padding: 60px 20px;
}

.error-icon {
  color: var(--danger);
  margin-bottom: 20px;
}

.error-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
}

.error-message {
  color: var(--text-muted);
  margin-bottom: 24px;
}

/* Analysis Empty */
.analysis-empty {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  color: var(--slate-300);
  margin-bottom: 20px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.empty-desc {
  color: var(--text-muted);
}

/* Result Container */
.result-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(5, 150, 105, 0.08);
}

@media (max-width: 1024px) {
  .result-container {
    grid-template-columns: 1fr;
  }
}

.result-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.tool-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  position: relative;
}

.tool-item:hover {
  background: var(--slate-50);
}

.tool-item.active {
  background: rgba(5, 150, 105, 0.05);
  border-color: var(--primary-300);
}

.tool-item.pro {
  opacity: 0.7;
}

.tool-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--slate-100);
  border-radius: 8px;
  color: var(--slate-600);
}

.tool-item.active .tool-icon {
  background: var(--primary);
  color: white;
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.tool-desc {
  font-size: 12px;
  color: var(--text-muted);
}

.tool-pro-badge {
  padding: 2px 8px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 10px;
  font-weight: 700;
  border-radius: 10px;
}

.result-canvas {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--slate-50);
  border-radius: 16px;
  padding: 40px;
}

.result-placeholder,
.result-success {
  text-align: center;
}

.result-placeholder :deep(svg),
.result-success :deep(svg) {
  margin-bottom: 16px;
}

.result-placeholder p {
  color: var(--text-muted);
}

.success-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.success-desc {
  color: var(--text-muted);
}

/* Action Bar */
.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--slate-200);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
}

.action-left,
.action-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.selection-badge {
  padding: 8px 16px;
  background: rgba(5, 150, 105, 0.1);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}

/* Confirm Dialog */
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.confirm-dialog {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  min-width: 400px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.confirm-header {
  margin-bottom: 16px;
}

.confirm-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.confirm-body {
  margin-bottom: 24px;
}

.confirm-message {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0;
}

.confirm-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.confirm-footer .btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  padding: 12px 20px;
  border-radius: 12px;
  background: var(--slate-900);
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 2000;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-icon.success {
  background: #22c55e;
}

.toast-icon.error {
  background: var(--danger);
}

/* Loading and Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
}

.loading-state .loading-spinner,
.error-state svg {
  margin-bottom: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  color: #dc2626;
}

/* Reference Images Styles (Step 4) */
.reference-images-container {
  padding: 20px 0;
}

.chart-reference-section {
  margin-bottom: 40px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.chart-reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-reference-title {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.chart-reference-type {
  padding: 4px 12px;
  background: rgba(5, 150, 105, 0.1);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
}

.reference-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
}

.reference-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.reference-image-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
}

.reference-image-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reference-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.reference-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reference-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.reference-image-wrapper:hover .reference-image-overlay,
.reference-image-card.selected .reference-image-overlay {
  opacity: 1;
}

.reference-image-card.selected .reference-image-overlay {
  background: rgba(5, 150, 105, 0.25);
}

/* Action buttons container */
.reference-image-overlay .icon-btn {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.2s ease !important;
}

.reference-image-overlay .icon-btn:hover {
  background: #ffffff !important;
  transform: scale(1.05) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.reference-image-overlay .icon-btn:hover {
  background: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.replace-btn {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.replace-btn:hover {
  background: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.reference-image-info {
  padding: 12px 16px;
}

.reference-similarity {
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  margin: 0 0 8px 0;
}

.reference-description {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
}

/* User uploaded image special styles */
.reference-image-card.uploaded {
  border: 2px solid rgba(5, 150, 105, 0.5);
  order: -1; /* Always show first in flex/grid */
}

.uploaded-badge {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
  margin: 0 0 8px 0;
  padding: 4px 8px;
  background: rgba(5, 150, 105, 0.1);
  border-radius: 4px;
  display: inline-block;
}

.remove-image-btn {
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  color: #dc2626 !important;
}

.remove-image-btn:hover {
  background: #ffffff !important;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

/* Selected state styles */
.reference-image-card.selected {
  border: 3px solid var(--primary);
  box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.2);
}

.reference-image-card.selected .reference-image-wrapper::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  width: 28px;
  height: 28px;
  background: var(--primary);
  border-radius: 50%;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.reference-image-card.selected .reference-image-wrapper::after {
  content: '✓';
  position: absolute;
  top: 13px;
  left: 15px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  z-index: 11;
}

.selected-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  color: var(--primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: scaleIn 0.2s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.no-reference-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #94a3b8;
}

.no-reference-images svg {
  margin-bottom: 12px;
  opacity: 0.5;
}

.no-reference-images .upload-btn {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Upload Dialog Styles */
.upload-dialog {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  min-width: 500px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.upload-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
}

.upload-body {
  margin-bottom: 24px;
}

.upload-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: var(--primary);
  background: rgba(5, 150, 105, 0.05);
}

.upload-area svg {
  color: #94a3b8;
  margin-bottom: 12px;
}

.upload-area p {
  margin: 4px 0;
  color: #64748b;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

.upload-footer {
  display: flex;
  justify-content: flex-end;
}

/* Image Preview Dialog */
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 40px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.image-preview-dialog {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* Zoom button positioned at top-right corner */
.zoom-image-btn-top {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  color: #475569 !important;
  z-index: 5;
  opacity: 0;
  transition: all 0.2s ease;
}

.reference-image-card:hover .zoom-image-btn-top {
  opacity: 1;
}

.reference-image-card.selected .zoom-image-btn-top {
  opacity: 1;
}

.zoom-image-btn-top:hover {
  background: #ffffff !important;
  transform: scale(1.1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
}

.additional-upload-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

/* Icon buttons - base styles */
.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 12px 20px;
  }

  .app-content {
    padding: 24px 20px 100px;
  }

  .stepper::before,
  .stepper-progress {
    left: 10%;
    right: 10%;
  }

  .action-bar {
    padding: 12px 20px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }
}

/* ============================================================
   STEP 2: CLEAN LAYOUT STYLES
   ============================================================ */

/* Unified Layout */
.step2-content {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  height: 500px;
}

@media (max-width: 1024px) {
  .step2-content {
    grid-template-columns: 1fr;
    height: auto;
  }
}

/* Left Panel */
.step2-left {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-height: 500px;
}

/* Loading Progress Panel */
.loading-progress-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 40px;
}

.loading-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 20px 0 8px;
}

.loading-subtitle {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.loading-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--slate-300);
}

.progress-step.active {
  color: var(--primary);
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--slate-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background: var(--primary);
  color: white;
}

.step-text {
  font-size: 12px;
  font-weight: 500;
}

.progress-divider {
  width: 40px;
  height: 2px;
  background: var(--slate-200);
}

/* Left Panel Empty State */
.step2-left-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.step2-left-empty .empty-icon {
  color: var(--slate-200);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted);
}

/* Charts Panel (Left) */
.results-charts {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  flex: 1;
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid var(--slate-100);
}

.results-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.results-count {
  padding: 4px 10px;
  background: var(--slate-100);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}

.charts-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.chart-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  margin-bottom: 8px;
  background: var(--slate-50);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chart-item:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.chart-item.selected {
  background: rgba(5, 150, 105, 0.06);
  border: 1px solid var(--primary);
}

.chart-checkbox {
  flex-shrink: 0;
  padding-top: 2px;
}

.checkbox {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 2px solid var(--slate-300);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.chart-item.selected .checkbox {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.chart-item-content {
  flex: 1;
  min-width: 0;
}

.chart-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.chart-type {
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.chart-type.type-flowchart {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.chart-type.type-module_diagram,
.chart-type.type-architecture_diagram {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

.chart-type.type-org_chart,
.chart-type.type-hierarchy_diagram {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.chart-type.type-sequence_diagram {
  background: rgba(249, 115, 22, 0.12);
  color: #f97316;
}

.chart-type.type-mindmap {
  background: rgba(236, 72, 153, 0.12);
  color: #ec4899;
}

.chart-score {
  padding: 2px 6px;
  background: var(--slate-200);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
}

.chart-purpose {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.4;
  margin: 0 0 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chart-position {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selection-footer {
  padding: 14px 20px;
  border-top: 1px solid var(--slate-100);
  background: var(--slate-50);
}

.selection-text {
  font-size: 13px;
  color: var(--text-muted);
}

.selection-text strong {
  color: var(--primary);
}

/* Terminal Panel (Right) */
.step2-right {
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.terminal-panel {
  display: flex;
  flex-direction: column;
  background: var(--slate-900);
  border-radius: 16px;
  overflow: hidden;
  flex: 1;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.terminal-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--slate-400);
}

.terminal-status-analyzing {
  display: flex;
  align-items: center;
}

.terminal-status-analyzing .status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0);
  }
}

.terminal-icon {
  color: #22c55e;
}

.terminal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.terminal-placeholder {
  color: var(--slate-500);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  font-style: italic;
}

.terminal-text {
  color: #10b981;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.terminal-body::-webkit-scrollbar {
  width: 6px;
}

.terminal-body::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-body::-webkit-scrollbar-thumb {
  background: var(--slate-700);
  border-radius: 3px;
}

.terminal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.terminal-stat {
  font-size: 11px;
  color: var(--slate-500);
  font-family: 'Monaco', 'Menlo', monospace;
}

/* Error State */
.step2-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-icon {
  color: var(--danger);
  margin-bottom: 16px;
}

.error-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.error-message {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

/* Empty State */
.step2-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
}

.empty-icon {
  color: var(--slate-200);
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-muted);
}

/* CSS Variables */
:root {
  --primary: #059669;
  --primary-50: rgba(5, 150, 105, 0.05);
  --primary-300: rgba(5, 150, 105, 0.3);
  --secondary: #10b981;
  --bg: #ffffff;
  --text: #0f172a;
  --text-muted: #64748b;
  --slate-50: #f8fafc;
  --slate-100: #f1f5f9;
  --slate-200: #e2e8f0;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-600: #475569;
  --slate-900: #0f172a;
  --danger: #ef4444;
  --danger-100: rgba(239, 68, 68, 0.1);
}

/* Chart Generation Results Styles */
.generating-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 400px;
}

.generating-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 500px;
}

.generating-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text);
  margin: 24px 0 8px 0;
}

.generating-subtitle {
  font-size: 15px;
  color: var(--text-muted);
  margin: 0 0 40px 0;
}

/* Progress Bar */
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 40px;
}

.progress-bar-track {
  flex: 1;
  height: 8px;
  background: var(--slate-200);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  min-width: 45px;
  text-align: right;
}

/* Chart Progress Items */
.generating-charts-progress {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

.chart-progress-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: var(--slate-100);
  border-radius: 20px;
  font-size: 13px;
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.chart-progress-item.completed {
  background: rgba(5, 150, 105, 0.1);
  color: var(--primary);
}

.chart-progress-dot {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  flex-shrink: 0;
}

.chart-progress-name {
  font-weight: 500;
}

.generating-tip {
  font-size: 13px;
  color: var(--text-muted);
  background: var(--slate-50);
  padding: 12px 20px;
  border-radius: 8px;
  margin-top: 8px;
}

/* Error State */
.error-state-full {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: 400px;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.error-state-full svg {
  color: var(--danger);
  margin-bottom: 20px;
}

.error-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px 0;
}

.error-message {
  font-size: 15px;
  color: var(--text-muted);
  margin: 0 0 28px 0;
  max-width: 400px;
}

.btn-lg {
  padding: 12px 28px;
  font-size: 15px;
}

/* Results Wrapper */
.generation-results-wrapper {
  padding: 24px;
}

.generation-results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--slate-100);
}

.results-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.results-count {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  background: rgba(5, 150, 105, 0.1);
  padding: 6px 14px;
  border-radius: 20px;
}

/* Progress Section */
.generation-progress-section {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid rgba(5, 150, 105, 0.1);
}

.generating-tip-small {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 0;
  font-size: 13px;
  color: var(--slate-600);
}

.generation-results-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.chart-result-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.2s ease;
}

.chart-result-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.chart-result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: var(--slate-50);
  gap: 16px;
}

.chart-result-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.chart-result-type {
  align-self: flex-start;
  padding: 4px 12px;
  background: rgba(5, 150, 105, 0.1);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary);
}

.chart-result-prompt {
  font-size: 14px;
  color: var(--text);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.chart-result-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.chart-result-status.success {
  background: rgba(5, 150, 105, 0.1);
  color: var(--primary);
}

.chart-result-status.error {
  background: rgba(220, 38, 38, 0.1);
  color: var(--danger);
}

.chart-result-status.loading {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary);
}

.generated-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
  background: var(--slate-50);
}

.generated-image-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid var(--slate-200);
  transition: all 0.2s ease;
  background: white;
  min-height: 200px;
  max-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.generated-image-card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.generated-image-card img {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  display: block;
}

.generated-image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.generated-image-card:hover .generated-image-overlay {
  opacity: 1;
}

.generated-image-overlay span {
  font-size: 13px;
  font-weight: 500;
}

.generated-image-number {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

/* Loading skeleton styles */
.generated-image-card.loading-skeleton {
  cursor: default;
  background: #f8fafc;
}

.generated-image-card.loading-skeleton:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--slate-200);
}

.skeleton-image {
  width: 100%;
  height: 100%;
  min-height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.loading-hint {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 8px;
  margin-top: 8px;
  color: var(--primary);
  font-size: 14px;
}

.chart-result-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 16px;
  background: rgba(220, 38, 38, 0.05);
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
}

.error-text {
  flex: 1;
  text-align: left;
}

.error-text .error-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--danger);
  margin: 0 0 4px 0;
}

.error-text .error-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.5;
}

.modify-prompt-btn {
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
}

.chart-result-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: var(--text-muted);
  font-size: 14px;
}

.chart-result-empty svg {
  margin-bottom: 8px;
  opacity: 0.4;
}

/* Results Actions */
.step4-action-bar {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 60%, rgba(255, 255, 255, 0.8));
  border-top: 1px solid var(--slate-200);
  z-index: 10;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
}

.step4-action-bar .btn {
  min-width: 140px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
}

.step4-content-wrapper {
  padding: 24px;
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

/* Empty State */
.empty-state-full {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  min-height: 400px;
  text-align: center;
}

.empty-state-full svg {
  margin-bottom: 24px;
  opacity: 0.3;
}

.empty-state-full h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px 0;
}

.empty-state-full p {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

/* ============================================================
   STEP 4 - UPDATED STYLES (matches step 2/3 design)
   ============================================================ */

.step4-content {
  padding: 20px;
  max-height: 520px;
  overflow-y: auto;
}

.step4-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(59, 130, 246, 0.06);
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary);
}

.step4-results {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step4-result-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.result-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid var(--slate-100);
}

.result-item-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-status {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.result-status.success {
  background: rgba(5, 150, 105, 0.1);
  color: var(--primary);
}

.result-status.error {
  background: rgba(220, 38, 38, 0.1);
  color: var(--danger);
}

.result-status.loading {
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary);
}

.result-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
}

.result-prompt {
  padding: 10px 14px;
  margin: 0;
  font-size: 13px;
  color: var(--text);
  line-height: 1.5;
  border-bottom: 1px solid var(--slate-100);
}

.result-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  padding: 12px;
  background: var(--slate-50);
}

.result-image-card {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--slate-200);
  background: white;
}

.result-image-card:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-image-card.loading .skeleton-shimmer {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
}

.result-image-card:hover .image-overlay {
  opacity: 1;
}

.image-number {
  position: absolute;
  top: 6px;
  left: 6px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.result-error {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--danger);
  font-size: 13px;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background: none;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  transition: background 0.2s ease;
  align-self: flex-start;
}

.btn-link:hover {
  background: rgba(5, 150, 105, 0.1);
}

.step4-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.step4-empty .empty-icon {
  margin-bottom: 16px;
  opacity: 0.3;
  color: var(--text-muted);
}

.step4-empty .empty-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 8px 0;
}

.step4-empty .empty-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0 0 20px 0;
}

/* Step 4 Actions - Fixed Bottom Bar */
.step4-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 14px 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--slate-200);
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);
  z-index: 100;
}

.step4-actions .btn {
  min-width: 120px;
  padding: 10px 18px;
  font-size: 14px;
}
</style>
