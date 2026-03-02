# Graftra API 接口文档

## 基本信息

- **Base URL**: `https://api.graftra.com`
- **API Version**: `v1`
- **Content-Type**: `application/json`
- **Authorization**: `Bearer {token}`

---

# 目录

- [一、认证接口](#一认证接口)
  - [1. 邮箱登录](#1-邮箱登录)
  - [2. 用户注册](#2-用户注册)
  - [3. 微信登录](#3-微信登录)
  - [4. 退出登录](#4-退出登录)
  - [5. 刷新令牌](#5-刷新令牌)
  - [6. 获取当前用户信息](#6-获取当前用户信息)
  - [7. 忘记密码](#7-忘记密码)
  - [8. 重置密码](#8-重置密码)
- [二、流程图生成接口](#二流程图生成接口)
  - [1. 上传文档](#二流程图生成接口-1-上传文档)
  - [2. AI 分析结构](#二流程图生成接口-2-ai-分析结构)
  - [3. 匹配图标](#二流程图生成接口-3-匹配图标)
  - [4. 生成流程图](#二流程图生成接口-4-生成流程图)
  - [5. 后处理工具](#二流程图生成接口-5-后处理工具)
  - [6. 导出流程图](#二流程图生成接口-6-导出流程图)
  - [7. 保存/获取用户作品](#二流程图生成接口-7-保存获取用户作品)
- [三、支付接口](#三支付接口)
  - [1. 创建支付订单](#三支付接口-1-创建支付订单)
  - [2. 查询支付状态](#三支付接口-2-查询支付状态)
  - [3. 获取用户订阅信息](#三支付接口-3-获取用户订阅信息)
- [四、用户管理接口](#四用户管理接口)
  - [1. 获取用户设置](#四用户管理接口-1-获取用户设置)
  - [2. 更新用户设置](#四用户管理接口-2-更新用户设置)
  - [3. 修改密码](#四用户管理接口-3-修改密码)
- [五、图标库接口](#五图标库接口)
  - [1. 获取图标库](#五图标库接口-1-获取图标库)
  - [2. 搜索图标](#五图标库接口-2-搜索图标)
- [六、作品管理扩展接口](#六作品管理扩展接口)
  - [1. 更新作品](#六作品管理扩展接口-1-更新作品)
  - [2. 删除作品](#六作品管理扩展接口-2-删除作品)
  - [3. 复制作品](#六作品管理扩展接口-3-复制作品)
- [七、标签管理接口](#七标签管理接口)
  - [1. 获取用户标签](#七标签管理接口-1-获取用户标签)
  - [2. 创建标签](#七标签管理接口-2-创建标签)
  - [3. 删除标签](#七标签管理接口-3-删除标签)
- [八、统计分析接口](#八统计分析接口)
  - [1. 获取使用统计](#八统计分析接口-1-获取使用统计)
  - [2. 查询配额](#八统计分析接口-2-查询配额)
- [九、帮助文档接口](#九帮助文档接口)
  - [1. 获取帮助文档](#九帮助文档接口-1-获取帮助文档)
- [附录](#附录)
  - [错误码说明](#错误码说明)
  - [Token 使用说明](#token-使用说明)
  - [安全说明](#安全说明)  - [3. 获取用户订阅信息](#3-获取用户订阅信息)
- [附录](#附录)
  - [错误码说明](#错误码说明)
  - [Token 使用说明](#token-使用说明)
  - [安全说明](#安全说明)

---

# 一、认证接口

## 1. 邮箱登录

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 邮箱密码登录 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/auth/login` |
| **是否需要认证** | 否 |

### 请求头

| Header | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `Content-Type` | string | 是 | 固定值: `application/json` |
| `X-Device-ID` | string | 否 | 设备唯一标识 |
| `X-Client-Version` | string | 否 | 客户端版本号 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `email` | string | Body | 是 | 邮箱地址 |
| `password` | string | Body | 是 | 用户密码（加密传输） |
| `remember` | boolean | Body | 否 | 是否记住登录状态，默认 false |

### 请求示例

```json
{
  "email": "user@example.com",
  "password": "hashed_password_here",
  "remember": true
}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 请求是否成功 |
| `message` | string | 提示信息（失败时） |
| `data` | object | 成功时返回的数据 |
| `data.user` | object | 用户信息 |
| `data.user.id` | string | 用户ID |
| `data.user.name` | string | 用户名称 |
| `data.user.email` | string | 用户邮箱 |
| `data.user.avatar` | string | 用户头像URL（可选） |
| `data.user.createdAt` | string | 注册时间（ISO 8601） |
| `data.token` | string | JWT访问令牌 |
| `data.refreshToken` | string | 刷新令牌（可选） |
| `data.expiresIn` | number | 令牌过期时间（秒） |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1234567890",
      "name": "张三",
      "email": "user@example.com",
      "avatar": "https://cdn.graftra.com/avatars/user_1234567890.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "rt_1234567890abcdef",
    "expiresIn": 604800
  }
}
```

### 失败响应示例

```json
{
  "success": false,
  "message": "邮箱或密码错误",
  "code": "INVALID_CREDENTIALS"
}
```

---

## 2. 用户注册

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 用户注册 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/auth/register` |
| **是否需要认证** | 否 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `name` | string | Body | 是 | 用户名称（2-50字符） |
| `email` | string | Body | 是 | 邮箱地址 |
| `password` | string | Body | 是 | 用户密码（8位以上） |
| `agreeToTerms` | boolean | Body | 是 | 是否同意服务条款 |

### 请求示例

```json
{
  "name": "张三",
  "email": "user@example.com",
  "password": "hashed_password_here",
  "agreeToTerms": true
}
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1234567890",
      "name": "张三",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

---

## 3. 微信登录

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 微信授权登录 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/auth/wechat` |
| **是否需要认证** | 否 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `code` | string | Body | 是 | 微信授权码 |
| `state` | string | Body | 否 | 状态参数（防CSRF） |

### 请求示例

```json
{
  "code": "071aBcDe1234567",
  "state": "optional_state_value"
}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.isNewUser` | boolean | 是否为新用户（可选） |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "wechat_1234567890",
      "name": "微信用户",
      "email": "wx_user@example.com",
      "avatar": "https://thirdwx.qlogo.cn/...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800,
    "isNewUser": false
  }
}
```

---

## 4. 退出登录

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 退出登录 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/auth/logout` |
| **是否需要认证** | 是 |

### 请求示例

```bash
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 请求是否成功 |
| `message` | string | 提示信息 |

### 成功响应示例

```json
{
  "success": true,
  "message": "退出成功"
}
```

---

## 5. 刷新令牌

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 刷新访问令牌 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/auth/refresh` |
| **是否需要认证** | 否 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `refreshToken` | string | Body | 是 | 刷新令牌 |

### 请求示例

```json
{
  "refreshToken": "rt_1234567890abcdef"
}
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "rt_new_refresh_token_here",
    "expiresIn": 604800
  }
}
```

---

## 6. 获取当前用户信息

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取当前登录用户信息 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/auth/me` |
| **是否需要认证** | 是 |

### 请求示例

```bash
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_1234567890",
      "name": "张三",
      "email": "user@example.com",
      "avatar": "https://cdn.graftra.com/avatars/user_1234567890.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```


## 7. 忘记密码

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 忘记密码/重置密码 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/auth/forgot-password` |
| **是否需要认证** | 否 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `email` | string | Body | 是 | 用户邮箱地址 |

### 请求示例

```json
{
  "email": "user@example.com"
}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 请求是否成功 |
| `message` | string | 提示信息 |
| `data.resetToken` | string | 重置令牌（用于验证，返回给前端） |
| `data.expiresIn` | number | 令牌过期时间（秒），默认 3600（1小时） |

### 成功响应示例

```json
{
  "success": true,
  "message": "重置邮件已发送",
  "data": {
    "resetToken": "reset_abc123xyz",
    "expiresIn": 3600
  }
}
```

### 失败响应示例

```json
{
  "success": false,
  "message": "邮箱地址不存在",
  "code": "EMAIL_NOT_FOUND"
}
```

---

## 8. 重置密码（验证后）

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 通过令牌重置密码 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/auth/reset-password` |
| **是否需要认证** | 否 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `token` | string | Body | 是 | 重置令牌（通过邮件获取） |
| `newPassword` | string | Body | 是 | 新密码（8位以上） |

### 请求示例

```json
{
  "token": "reset_abc123xyz",
  "newPassword": "NewSecurePass123"
}
```

### 成功响应示例

```json
{
  "success": true,
  "message": "密码重置成功"
}
```

### 失败响应示例

```json
{
  "success": false,
  "message": "重置令牌已过期",
  "code": "RESET_TOKEN_EXPIRED"
}
```

---
---

# 二、流程图生成接口

## 1. 上传文档

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 上传文档文件 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/upload/document` |
| **是否需要认证** | 是 |
| **Content-Type** | `multipart/form-data` |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `file` | File | Body | 是 | 文档文件（PDF、Word、MD、TXT） |
| `maxSize` | number | Query | 否 | 最大文件大小（字节），默认 10MB |

### 请求示例

```bash
POST /api/v1/upload/document?maxSize=10485760
Authorization: Bearer {token}
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="document.pdf"
Content-Type: application/pdf

[file content]
------WebKitFormBoundary--
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.fileId` | string | 文件ID |
| `data.fileName` | string | 文件名 |
| `data.fileSize` | number | 文件大小（字节） |
| `data.fileType` | string | 文件类型 |
| `data.content` | string | 提取的文本内容（可选） |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "fileId": "file_abc123xyz",
    "fileName": "document.pdf",
    "fileSize": 524288,
    "fileType": "application/pdf",
    "content": "提取的文档内容..."
  }
}
```

---

## 2. AI 分析结构

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | AI 分析文本结构 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/analyze/structure` |
| **是否需要认证** | 是 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `content` | string | Body | 是 | 待分析的文本内容 |
| `fileId` | string | Body | 否 | 关联的文件ID |

### 请求示例

```json
{
  "content": "用户注册流程：1.用户填写注册信息...",
  "fileId": "file_abc123xyz"
}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.isFlow` | boolean | 是否为流程图内容 |
| `data.nodeCount` | number | 节点数量 |
| `data.hasLoop` | boolean | 是否包含循环 |
| `data.coreNodes` | string[] | 核心节点列表 |
| `data.vectorTags` | string[] | 向量化标签（用于图标匹配） |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "isFlow": true,
    "nodeCount": 8,
    "hasLoop": true,
    "coreNodes": ["开始", "用户注册", "数据库", "结束"],
    "vectorTags": ["user", "database", "arrow", "check"]
  }
}
```

---

## 3. 匹配图标

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 匹配流程图图标 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/match/icons` |
| **是否需要认证** | 是 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `structureInfo` | object | Body | 是 | 结构信息（来自分析接口） |
| `style` | string | Body | 否 | 图标风格，默认 `minimal` |

### 请求示例

```json
{
  "structureInfo": {
    "isFlow": true,
    "nodeCount": 8,
    "coreNodes": ["开始", "用户注册", "数据库", "结束"],
    "vectorTags": ["user", "database", "arrow", "check"]
  },
  "style": "minimal"
}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.matches` | array | 图标匹配结果 |
| `data.matches[].name` | string | 节点名称 |
| `data.matches[].src` | string | 图标URL |
| `data.matches[].score` | string | 匹配度 |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "name": "用户注册",
        "src": "https://cdn.graftra.com/icons/user.svg",
        "score": "0.95"
      },
      {
        "name": "数据库",
        "src": "https://cdn.graftra.com/icons/database.svg",
        "score": "0.98"
      }
    ]
  }
}
```

---

## 4. 生成流程图

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 生成流程图 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/generate/flowchart` |
| **是否需要认证** | 是 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `content` | string | Body | 是 | 文本内容 |
| `style` | string | Body | 否 | 流程图风格，默认 `minimal` |
| `iconMatches` | array | Body | 否 | 图标匹配结果 |
| `fileId` | string | Body | 否 | 关联的文件ID |

### 支持的风格

| 风格 | 说明 |
|------|------|
| `minimal` | 极简风格 |
| `professional` | 商务风格 |
| `colorful` | 多彩风格 |
| `dark` | 暗黑风格 |
| `cute` | 可爱风格 |

### 请求示例

```json
{
  "content": "用户注册流程：1.用户填写注册信息...",
  "style": "minimal",
  "iconMatches": [
    {
      "name": "用户注册",
      "src": "https://cdn.graftra.com/icons/user.svg"
    }
  ],
  "fileId": "file_abc123xyz"
}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.flowchartId` | string | 流程图ID |
| `data.previewUrl` | string | 预览图URL |
| `data.svgUrl` | string | SVG源码URL（可选） |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "flowchartId": "fc_xyz789abc",
    "previewUrl": "https://cdn.graftra.com/previews/fc_xyz789abc.png",
    "svgUrl": "https://cdn.graftra.com/svg/fc_xyz789abc.svg"
  }
}
```

---

## 5. 后处理工具

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 流程图后处理 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/process/{type}` |
| **是否需要认证** | 是 |

### 支持的处理类型

| 类型 | 路径 | 说明 |
|------|------|------|
| `fix` | `/api/v1/process/fix` | 修复文字（AI优化排版） |
| `replace` | `/api/v1/process/replace` | 替换图标 |
| `editable` | `/api/v1/process/editable` | 转为可编辑格式 |
| `redraw` | `/api/v1/process/redraw` | 重新生成（不同布局） |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `flowchartId` | string | Body | 是 | 流程图ID |
| `params` | object | Body | 否 | 处理参数（根据类型不同） |

### 请求示例（修复文字）

```json
{
  "flowchartId": "fc_xyz789abc",
  "params": {
    "optimize": true,
    "fontSize": "medium"
  }
}
```

### 请求示例（替换图标）

```json
{
  "flowchartId": "fc_xyz789abc",
  "params": {
    "iconStyle": "colorful"
  }
}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.resultUrl` | string | 处理后的流程图URL |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "resultUrl": "https://cdn.graftra.com/processed/fc_xyz789abc_fixed.svg"
  }
}
```

---

## 6. 导出流程图

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 导出流程图 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/export/{format}` |
| **是否需要认证** | 是 |

### 支持的导出格式

| 格式 | 路径 | Content-Type |
|------|------|-------------|
| `svg` | `/api/v1/export/svg` | `image/svg+xml` |
| `png` | `/api/v1/export/png` | `image/png` |
| `pdf` | `/api/v1/export/pdf` | `application/pdf` |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `flowchartId` | string | Body | 是 | 流程图ID |
| `quality` | string | Body | 否 | 导出质量（low/medium/high），默认 high |
| `scale` | number | Body | 否 | 缩放比例，默认 1 |

### 请求示例

```json
{
  "flowchartId": "fc_xyz789abc",
  "quality": "high",
  "scale": 2
}
```

### 响应

**注意**: 此接口返回文件流，非JSON响应

### 成功响应

| Header | 说明 |
|--------|------|
| `Content-Type` | 根据格式返回对应的 MIME 类型 |
| `Content-Disposition` | `attachment; filename="flowchart.{ext}"` |
| `Content-Length` | 文件大小 |

---

## 7. 保存/获取用户作品

### 7.1 保存作品

#### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 保存用户作品 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/works` |
| **是否需要认证** | 是 |

#### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `flowchartId` | string | Body | 是 | 流程图ID |
| `title` | string | Body | 是 | 作品标题 |
| `description` | string | Body | 否 | 作品描述 |
| `tags` | string[] | Body | 否 | 标签列表 |

#### 请求示例

```json
{
  "flowchartId": "fc_xyz789abc",
  "title": "用户注册流程图",
  "description": "展示用户从注册到完成的完整流程",
  "tags": ["注册", "用户流程", "业务"]
}
```

#### 成功响应示例

```json
{
  "success": true,
  "data": {
    "workId": "work_abc123xyz",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 7.2 获取作品列表

#### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取用户作品列表 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/works` |
| **是否需要认证** | 是 |

#### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `page` | number | Query | 否 | 页码，默认 1 |
| `pageSize` | number | Query | 否 | 每页数量，默认 20 |
| `tag` | string | Query | 否 | 按标签筛选 |

#### 请求示例

```bash
GET /api/v1/works?page=1&pageSize=20
Authorization: Bearer {token}
```

#### 成功响应示例

```json
{
  "success": true,
  "data": {
    "works": [
      {
        "workId": "work_abc123xyz",
        "flowchartId": "fc_xyz789abc",
        "title": "用户注册流程图",
        "previewUrl": "https://cdn.graftra.com/previews/fc_xyz789abc.png",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "total": 45,
    "page": 1,
    "pageSize": 20
  }
}
```

### 7.3 获取单个作品

#### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取单个作品详情 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/works/{workId}` |
| **是否需要认证** | 是 |

#### 请求示例

```bash
GET /api/v1/works/work_abc123xyz
Authorization: Bearer {token}
```

#### 成功响应示例

```json
{
  "success": true,
  "data": {
    "workId": "work_abc123xyz",
    "flowchartId": "fc_xyz789abc",
    "title": "用户注册流程图",
    "description": "展示用户从注册到完成的完整流程",
    "tags": ["注册", "用户流程", "业务"],
    "svgUrl": "https://cdn.graftra.com/svg/fc_xyz789abc.svg",
    "previewUrl": "https://cdn.graftra.com/previews/fc_xyz789abc.png",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

---

# 三、支付接口

## 1. 创建支付订单

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 创建支付订单 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/payment/create` |
| **是否需要认证** | 是 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `plan` | string | Body | 是 | 套餐类型：`month`(月付) 或 `year`(年付) |
| `method` | string | Body | 是 | 支付方式：`wechat`(微信) 或 `alipay`(支付宝) |

### 请求示例

```json
{
  "plan": "month",
  "method": "wechat"
}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.orderId` | string | 订单ID |
| `data.qrCodeUrl` | string | 二维码URL（扫码支付） |
| `data.amount` | number | 支付金额（分） |
| `data.expiresAt` | string | 订单过期时间 |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "orderId": "order_xyz789abc",
    "qrCodeUrl": "https://api.graftra.com/payment/qrcode/order_xyz789abc.png",
    "amount": 2900,
    "expiresAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

## 2. 查询支付状态

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 查询订单支付状态 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/payment/status/{orderId}` |
| **是否需要认证** | 是 |

### 路径参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `orderId` | string | 是 | 订单ID |

### 请求示例

```bash
GET /api/v1/payment/status/order_xyz789abc
Authorization: Bearer {token}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.status` | string | 支付状态：`pending`(待支付)、`success`(成功)、`failed`(失败)、`expired`(已过期) |
| `data.paidAt` | string | 支付时间（ISO 8601，成功时） |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "orderId": "order_xyz789abc",
    "status": "success",
    "paidAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

## 3. 获取用户订阅信息

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取用户订阅状态 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/subscription` |
| **是否需要认证** | 是 |

### 请求示例

```bash
GET /api/v1/subscription
Authorization: Bearer {token}
```

### 响应参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `data.plan` | string | 当前套餐：`free`(免费)、`pro`(专业版)、`enterprise`(企业版) |
| `data.status` | string | 订阅状态：`active`(活跃)、`expired`(过期)、`cancelled`(已取消) |
| `data.expiresAt` | string | 过期时间 |
| `data.renewAt` | string | 下次续费时间 |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "plan": "pro",
    "status": "active",
    "expiresAt": "2024-02-15T00:00:00.000Z",
    "renewAt": "2024-02-15T10:30:00.000Z"
  }
}
```

# 四、用户管理接口

## 1. 获取用户设置

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取用户设置信息 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/user/settings` |
| **是否需要认证** | 是 |

### 请求示例

```bash
GET /api/v1/user/settings
Authorization: Bearer {token}
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "nickname": "张三",
    "avatar": "https://cdn.graftra.com/avatars/user_1234567890.jpg",
    "bio": "Graftra重度用户"
  }
}
```

---

## 2. 更新用户设置

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 更新用户设置信息 |
| **请求方式** | `PUT` |
| **接口路径** | `/api/v1/user/settings` |
| **是否需要认证** | 是 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `nickname` | string | Body | 否 | 用户昵称 |
| `avatar` | string | Body | 否 | 头像URL |
| `bio` | string | Body | 否 | 个人简介 |

### 请求示例

```json
{
  "nickname": "新昵称",
  "avatar": "https://cdn.graftra.com/avatars/new.jpg",
  "bio": "更新后的简介"
}
```

### 成功响应示例

```json
{
  "success": true,
  "message": "设置更新成功"
}
```

---

## 3. 修改密码

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 修改用户密码 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/user/change-password` |
| **是否需要认证** | 是 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `oldPassword` | string | Body | 是 | 原密码 |
| `newPassword` | string | Body | 是 | 新密码（8位以上） |

### 请求示例

```json
{
  "oldPassword": "old_password_hash",
  "newPassword": "new_password_hash"
}
```

### 成功响应示例

```json
{
  "success": true,
  "message": "密码修改成功"
}
```

---

# 五、图标库接口

## 1. 获取图标库

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取矢量图标库 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/icons/library` |
| **是否需要认证** | 否 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `category` | string | Query | 否 | 图标分类 |
| `page` | number | Query | 否 | 页码，默认1 |
| `pageSize` | number | Query | 否 | 每页数量，默认50 |

### 请求示例

```bash
GET /api/v1/icons/library?category=business&page=1&pageSize=50
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "icons": [
      {
        "id": "icon_user_001",
        "name": "user",
        "category": "business",
        "src": "https://cdn.graftra.com/icons/user.svg",
        "preview": "https://cdn.graftra.com/icons/previews/user.png"
      }
    ],
    "total": 256,
    "page": 1,
    "pageSize": 50
  }
}
```

---

## 2. 搜索图标

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 搜索矢量图标 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/icons/search` |
| **是否需要认证** | 否 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `keyword` | string | Query | 是 | 搜索关键词 |
| `category` | string | Query | 否 | 图标分类 |

### 请求示例

```bash
GET /api/v1/icons/search?keyword=house&category=business
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "icons": [
      {
        "id": "icon_house_001",
        "name": "house",
        "src": "https://cdn.graftra.com/icons/house.svg"
      }
    ]
  }
}
```

---

# 六、作品管理扩展接口

## 1. 更新作品

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 更新作品信息 |
| **请求方式** | `PUT` |
| **接口路径** | `/api/v1/works/{workId}` |
| **是否需要认证** | 是 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `title` | string | Body | 否 | 作品标题 |
| `description` | string | Body | 否 | 作品描述 |
| `tags` | string[] | Body | 否 | 标签列表 |

### 请求示例

```json
{
  "title": "更新后的标题",
  "description": "更新后的描述",
  "tags": ["注册", "流程图"]
}
```

### 成功响应示例

```json
{
  "success": true,
  "message": "作品更新成功",
  "data": {
    "workId": "work_abc123xyz",
    "updatedAt": "2024-01-15T14:00:00.000Z"
  }
}
```

---

## 2. 删除作品

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 删除用户作品 |
| **请求方式** | `DELETE` |
| **接口路径** | `/api/v1/works/{workId}` |
| **是否需要认证** | 是 |

### 请求示例

```bash
DELETE /api/v1/works/work_abc123xyz
Authorization: Bearer {token}
```

### 成功响应示例

```json
{
  "success": true,
  "message": "作品删除成功"
}
```

---

## 3. 复制作品

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 复制用户作品 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/works/{workId}/duplicate` |
| **是否需要认证** | 是 |

### 请求示例

```bash
POST /api/v1/works/work_abc123xyz/duplicate
Authorization: Bearer {token}
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "newWorkId": "work_xyz789abc",
    "message": "作品复制成功"
  }
}
```

---

# 七、标签管理接口

## 1. 获取用户标签

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取用户常用标签 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/tags` |
| **是否需要认证** | 是 |

### 请求示例

```bash
GET /api/v1/tags
Authorization: Bearer {token}
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "tags": ["注册", "流程图", "业务", "用户管理"]
  }
}
```

---

## 2. 创建标签

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 创建新标签 |
| **请求方式** | `POST` |
| **接口路径** | `/api/v1/tags` |
| **是否需要认证** | 是 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `name` | string | Body | 是 | 标签名称 |
| `color` | string | Body | 否 | 标签颜色（hex值） |

### 请求示例

```json
{
  "name": "新业务",
  "color": "#10b981"
}
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "tagId": "tag_abc123",
    "name": "新业务",
    "color": "#10b981"
  }
}
```

---

## 3. 删除标签

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 删除用户标签 |
| **请求方式** | `DELETE` |
| **接口路径** | `/api/v1/tags/{tagId}` |
| **是否需要认证** | 是 |

### 请求示例

```bash
DELETE /api/v1/tags/tag_abc123
Authorization: Bearer {token}
```

### 成功响应示例

```json
{
  "success": true,
  "message": "标签删除成功"
}
```

---

# 八、统计分析接口

## 1. 获取使用统计

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取用户使用统计 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/stats/usage` |
| **是否需要认证** | 是 |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "totalGenerated": 156,
    "totalExported": 89,
    "totalSaved": 67,
    "storageUsed": "245.8 MB",
    "storageLimit": "1024 MB"
  }
}
```

---

## 2. 查询配额

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取用户当前配额 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/stats/quota` |
| **是否需要认证** | 是 |

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "plan": "pro",
    "generationsLimit": -1,
    "generationsUsed": 156,
    "exportsLimit": -1,
    "exportsUsed": 89,
    "storageLimit": "1024 MB",
    "storageUsed": "245.8 MB"
  }
}
```

---

# 九、帮助文档接口

## 1. 获取帮助文档

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口名称** | 获取帮助文档/常见问题 |
| **请求方式** | `GET` |
| **接口路径** | `/api/v1/help` |
| **是否需要认证** | 否 |

### 请求参数

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| `category` | string | Query | 否 | 文档分类 |

### 请求示例

```bash
GET /api/v1/help?category=payment
```

### 成功响应示例

```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "help_001",
        "title": "如何支付？",
        "content": "支持微信和支付宝两种支付方式...",
        "category": "payment"
      }
    ]
  }
}
```

---
---

# 附录

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| `INVALID_CREDENTIALS` | 邮箱或密码错误 |
| `EMAIL_ALREADY_EXISTS` | 邮箱已被注册 |
| `WEAK_PASSWORD` | 密码强度不足 |
| `AUTH_CODE_EXPIRED` | 微信授权码已过期 |
| `UNAUTHORIZED` | 未授权访问 |
| `TOKEN_EXPIRED` | 访问令牌已过期 |
| `REFRESH_TOKEN_EXPIRED` | 刷新令牌已过期 |
| `INVALID_REQUEST` | 请求参数错误 |
| `RATE_LIMIT_EXCEEDED` | 请求频率超限 |
| `FILE_TOO_LARGE` | 文件超过大小限制 |
| `UNSUPPORTED_FILE_TYPE` | 不支持的文件类型 |
| `WORKS_NOT_FOUND` | 作品不存在 |
| `PAYMENT_FAILED` | 支付失败 |
| `ORDER_EXPIRED` | 订单已过期 |
| `SERVER_ERROR` | 服务器内部错误 |
| `OLD_PASSWORD_INCORRECT` | 原密码错误 |
| `TAG_NOT_FOUND` | 标签不存在 |
| `TAG_ALREADY_EXISTS` | 标签已存在 |
| `WORK_DELETE_FORBIDDEN` | 作品禁止删除 |
| `STORAGE_LIMIT_EXCEEDED` | 存储空间超限 |
| `QUOTA_EXCEEDED` | 生成配额已用完 |
| `ICON_NOT_FOUND` | 图标不存在 |

## Token 使用说明

### 访问令牌 (Access Token)

- 有效期：7天（604800秒）
- 使用方式：放在请求头 `Authorization: Bearer {token}`
- 用于：需要认证的接口

### 刷新令牌 (Refresh Token)

- 有效期：30天
- 使用方式：调用刷新接口时作为参数传递
- 用于：获取新的访问令牌

## 安全说明

1. **密码传输**: 密码必须在客户端使用 RSA 或其他加密方式加密后再传输
2. **Token 存储**: 访问令牌应存储在内存中，刷新令牌可存储在 localStorage
3. **HTTPS**: 生产环境必须使用 HTTPS
4. **Token 过期**: 客户端应监听 token 过期，及时调用刷新接口

## 测试环境

- **测试 Base URL**: `https://api-staging.graftra.com`
- **测试账号**: `test@graftra.com` / `Test@123456`

## 套餐定价参考

| 套餐 | 月付 | 年付 | 功能 |
|------|------|------|------|
| 免费版 | - | - | 基础流程图生成，5个作品 |
| 专业版 | ¥29/月 | ¥290/年 | 无限生成，所有风格，优先导出 |
| 企业版 | - | ¥990/年 | 专业版全部 + API接入 + 团队协作 |

---

*文档版本: v1.0.0*
*最后更新: 2024-01-15*
