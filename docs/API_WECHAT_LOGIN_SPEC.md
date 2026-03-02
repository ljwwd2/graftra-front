# Graftra 微信登录 - 后端接口协议文档

## 概述

本文档定义了 Graftra 图表生成工具的微信登录相关后端接口，支持用户通过微信扫码登录。

---

## 1. 微信开放平台配置

### 前置条件

需要在微信开放平台（https://open.weixin.qq.com）完成以下配置：

1. **创建网站应用**
   - 应用名称：Graftra
   - 应用简介：AI 智能图表生成工具
   - 应用官网：https://your-domain.com
   - 审核回调域名：需要备案的域名

2. **获取开发信息**
   - **AppID**：应用唯一标识
   - **AppSecret**：应用密钥（需保密）

3. **配置授权回调域**
   - 授权成功后回调域名

### 微信开放平台 OAuth2.0 授权流程

```
┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
│  前端   │         │  微信   │         │  前端   │         │  后端   │
│ (Browser)│────────>│ (QR Code)│────────>│(Callback)│────────>│  Server  │
└─────────┘  重定向  └─────────┘   扫码授权 └─────────┘   发送code  └─────────┘
     │                              │                        │
     │  重定向到微信授权页面          │   微信回调前端，携带 code  │
     │                              │                        │
     └─────────── https://open.weixin.qq.com/connect/qrconnect ─────┘
                   ?appid=APPID
                   &redirect_uri=REDIRECT_URI
                   &response_type=code
                   &scope=snsapi_login
                   &state=STATE
```

---

## 2. 接口定义

### 2.1 微信登录

#### 接口信息
```
POST /api/auth/wechat
```

#### 请求参数

```typescript
{
  "code": string,      // 微信授权码（必填）
  "state": string      // 状态参数（可选，用于防止 CSRF 攻击）
}
```

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| code | string | 是 | 微信回调返回的授权码，有效期 10 分钟 |
| state | string | 否 | 前端生成随机字符串，回调时原样返回，用于防 CSRF |

#### 响应数据

**成功响应：**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-xxx",
      "name": "微信用户",           // 微信昵称
      "email": null,               // 微信登录默认无邮箱
      "avatar": "https://thirdwx.qlogo.cn/...",  // 微信头像
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "登录成功"
}
```

#### 后端处理流程

```
┌─────────────────────────────────────────────────────────────────┐
│                      后端微信登录处理流程                          │
└─────────────────────────────────────────────────────────────────┘

1. 接收前端传来的 code
   │
   ├─> 验证 code 是否存在
   │
2. 调用微信 API 获取 access_token
   │
   ├─> GET https://api.weixin.qq.com/sns/oauth2/access_token
   │   ?appid=APPID
   │   &secret=SECRET
   │   &code=CODE
   │   &grant_type=authorization_code
   │
   ├─< 返回：{
   │      "access_token": "ACCESS_TOKEN",
   │      "expires_in": 7200,
   │      "refresh_token": "REFRESH_TOKEN",
   │      "openid": "OPENID",
   │      "scope": "snsapi_login"
   │    }
   │
3. 获取用户信息
   │
   ├─> GET https://api.weixin.qq.com/sns/userinfo
   │   ?access_token=ACCESS_TOKEN
   │   &openid=OPENID
   │
   ├─< 返回：{
   │      "openid": "OPENID",
   │      "nickname": "微信昵称",
   │      "sex": 1,
   │      "province": "",
   │      "city": "",
   │      "country": "",
   │      "headimgurl": "https://thirdwx.qlogo.cn/...",
   │      "privilege": [],
   │      "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"  // 需要 UnionID 才返回
   │    }
   │
4. 查询或创建用户
   │
   ├─> 根据 openid 或 unionid 查询用户表
   │
   ├─> 如果用户不存在，创建新用户
   │      - 使用微信昵称作为初始 name
   │      - 使用微信头像作为 avatar
   │      - loginMethod 设置为 'wechat'
   │      - email 暂时为 null
   │
   ├─> 如果用户已存在，更新用户信息（昵称、头像等）
   │
5. 生成 JWT Token
   │
   ├─> Payload 包含: userId, email, loginMethod=wechat
   ├─> Token 有效期: 1 小时
   └─> RefreshToken 有效期: 30 天
   │
6. 返回登录响应
```

#### 数据库处理

**用户表结构：**
```sql
CREATE TYPE login_method AS ENUM ('email', 'wechat');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),              -- 微信登录此字段可为 NULL
  avatar TEXT,
  login_method login_method DEFAULT 'email',
  wechat_openid VARCHAR(255) UNIQUE,       -- 微信 openid
  wechat_unionid VARCHAR(255) UNIQUE,       -- 微信 unionid（如果有）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_wechat_openid ON users(wechat_openid);
CREATE INDEX idx_users_wechat_unionid ON users(wechat_unionid);
```

**处理逻辑：**
```typescript
// 1. 根据 openid 查询用户
let user = await db.query(
  'SELECT * FROM users WHERE wechat_openid = $1',
  [openid]
)

// 2. 如果不存在，创建新用户
if (!user) {
  user = await db.query(`
    INSERT INTO users (name, avatar, login_method, wechat_openid, wechat_unionid)
    VALUES ($1, $2, 'wechat', $3, $4)
    RETURNING *
  `, [nickname, headimgurl, openid, unionid])
}

// 3. 如果存在，更新信息
else {
  user = await db.query(`
    UPDATE users
    SET name = $1, avatar = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
  `, [nickname, headimgurl, user.id])
}
```

#### 错误处理

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| INVALID_CODE | 400 | 授权码无效或已过期 |
| INVALID_WECHAT_USER | 400 | 微信用户信息获取失败 |
| WECHAT_API_ERROR | 500 | 微信 API 调用失败 |
| VALIDATION_ERROR | 400 | 参数验证失败 |

---

## 3. 前端集成流程

### 3.1 前端需要实现的功能

#### 步骤 1：构造微信授权 URL

```typescript
const wechatAuthUrl = computed(() => {
  const params = new URLSearchParams({
    appid: 'YOUR_APPID',
    redirect_uri: encodeURIComponent('https://your-domain.com/login/wechat/callback'),
    response_type: 'code',
    scope: 'snsapi_login',
    state: generateRandomState() // 防 CSRF
  })
  return `https://open.weixin.qq.com/connect/qrconnect?${params}`
})
```

#### 步骤 2：跳转到微信授权页面

```typescript
// 用户点击"微信登录"按钮时
window.location.href = wechatAuthUrl.value
```

#### 步骤 3：处理微信回调（前端路由）

前端需要配置回调路由处理微信的回调：

```typescript
// 路由配置
{
  path: '/login/wechat/callback',
  name: 'WechatCallback',
  component: WechatCallbackView
}
```

```vue
<!-- WechatCallbackView.vue -->
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth } from '@/utils/auth'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const code = route.query.code as string
  const state = route.query.state as string

  if (!code) {
    // 没有 code，授权失败或取消
    router.push('/login?error=wechat_cancel')
    return
  }

  // TODO: 验证 state 是否匹配

  try {
    // 调用后端登录接口
    const result = await auth.wechatLogin({ code, state })

    if (result.success) {
      // 登录成功，跳转到应用首页
      router.push('/app')
    } else {
      // 登录失败，返回登录页并显示错误
      router.push(`/login?error=${encodeURIComponent(result.message || '微信登录失败')}`)
    }
  } catch (error) {
    console.error('WeChat login error:', error)
    router.push('/login?error=wechat_error')
  }
})
</script>
```

#### 步骤 4：当前登录页面显示二维码

在登录页面中显示二维码供用户扫描：

```vue
<template>
  <div class="wechat-qr-container">
    <!-- 使用 iframe 或后端生成的二维码图片 -->
    <iframe :src="wechatAuthUrl" class="wechat-iframe"></iframe>
    <p>请使用微信扫描二维码登录</p>
  </div>
</template>

<style scoped>
.wechat-iframe {
  width: 300px;
  height: 400px;
  border: none;
}
</style>
```

---

## 4. 微信 API 说明

### 4.1 获取 access_token

**接口地址：**
```
GET https://api.weixin.qq.com/sns/oauth2/access_token
```

**请求参数：**

| 参数 | 必填 | 说明 |
|------|------|------|
| appid | 是 | 应用唯一标识 |
| secret | 是 | 应用密钥 |
| code | 是 | 前端获取到的授权码 |
| grant_type | 是 | 固定为 authorization_code |

**响应示例：**
```json
{
  "access_token": "ACCESS_TOKEN",
  "expires_in": 7200,
  "refresh_token": "REFRESH_TOKEN",
  "openid": "OPENID",
  "scope": "snsapi_login"
}
```

### 4.2 获取用户信息

**接口地址：**
```
GET https://api.weixin.qq.com/sns/userinfo
```

**请求参数：**

| 参数 | 必填 | 说明 |
|------|------|------|
| access_token | 是 | 调用凭证 |
| openid | 是 | 用户唯一标识 |

**响应示例：**
```json
{
  "openid": "OPENID",
  "nickname": "张三",
  "sex": 1,
  "province": "广东",
  "city": "深圳",
  "country": "中国",
  "headimgurl": "https://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83r...",
  "privilege": [],
  "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
}
```

**字段说明：**

| 字段 | 说明 |
|------|------|
| openid | 用户在该应用下的唯一标识 |
| unionid | 用户在同一开放平台下的唯一标识（需绑定开放平台账号才有） |
| nickname | 微信昵称 |
| headimgurl | 微信头像 URL（0-46px、0-64px、0-96px、0-132px 多种尺寸） |
| sex | 性别：1 男性，2 女性，0 未知 |

---

## 5. 测试用例

### 接口测试

- [ ] 正常的微信授权码可以成功登录
- [ ] 重复使用同一 code 返回 INVALID_CODE
- [ ] 过期的 code 返回 INVALID_CODE
- [ ] 无效的 code 返回 INVALID_CODE
- [ ] 微信 API 调用失败返回 WECHAT_API_ERROR
- [ ] 首次微信登录自动创建用户
- [ ] 已存在的微信用户直接登录
- [ ] 用户信息（昵称、头像）更新到最新

### 安全测试

- [ ] state 参数验证防止 CSRF 攻击
- [ ] code 只能使用一次
- [ ] Token 过期后需要重新授权
- [ ] AppSecret 不暴露给前端

---

## 6. 注意事项

### 安全要求

1. **AppSecret 保密**
   - 绝对不能暴露给前端
   - 只能存储在后端服务器
   - 建议使用环境变量存储

2. **code 只能使用一次**
   - 微信的 code 只能换取一次 access_token
   - 使用后立即失效
   - 不要重复使用

3. **access_token 和 refresh_token**
   - access_token 有效期 2 小时
   - refresh_token 有效期 30 天
   - 建议缓存 access_token 避免频繁调用微信 API

4. **用户信息绑定**
   - 使用 openid 或 unionid 作为微信用户唯一标识
   - 建议使用 unionid（需要绑定开放平台）
   - 允许微信登录账号后续绑定邮箱/密码

### 常见问题

**Q: 微信登录后用户想要绑定邮箱/密码怎么办？**

A: 可以提供账号绑定功能：
1. 用户微信登录后，在设置中可以绑定邮箱和设置密码
2. 绑定后用户可以使用邮箱密码登录
3. 数据库中 login_method 保持为 'wechat'，但邮箱字段被填充

**Q: 如何处理微信头像过期问题？**

A: 微信头像 URL 是临时的，会过期：
1. 定期刷新用户头像（如每天）
2. 或在用户登录时更新头像
3. 也可以将头像下载到自己的服务器

**Q: 网站应用和公众号能否同时使用？**

A: 可以：
1. 网站应用用于 PC 网页扫码登录
2. 公众号用于移动端 H5 页面
3. 使用 unionid 可以打通两个平台的用户

---

## 7. 完整示例代码

### Node.js (Express) 示例

```javascript
const axios = require('axios')
const express = require('express')

// 微信配置
const WECHAT_CONFIG = {
  appId: process.env.WECHAT_APP_ID,
  appSecret: process.env.WECHAT_APP_SECRET,
  redirectUri: process.env.WECHAT_REDIRECT_URI
}

// 获取 access_token
async function getAccessToken(code) {
  const url = 'https://api.weixin.qq.com/sns/oauth2/access_token'
  const params = {
    appid: WECHAT_CONFIG.appId,
    secret: WECHAT_CONFIG.appSecret,
    code: code,
    grant_type: 'authorization_code'
  }

  const response = await axios.get(url, { params })
  return response.data
}

// 获取用户信息
async function getUserInfo(accessToken, openid) {
  const url = 'https://api.weixin.qq.com/sns/userinfo'
  const params = {
    access_token: accessToken,
    openid: openid
  }

  const response = await axios.get(url, { params })
  return response.data
}

// 微信登录接口
router.post('/api/auth/wechat', async (req, res) => {
  try {
    const { code, state } = req.body

    // TODO: 验证 state

    // 1. 获取 access_token
    const tokenData = await getAccessToken(code)
    const { access_token, openid, unionid } = tokenData

    // 2. 获取用户信息
    const userData = await getUserInfo(access_token, openid)
    const { nickname, headimgurl } = userData

    // 3. 查询或创建用户
    let user = await db.users.findOne({
      where: {
        wechatOpenid: openid
      }
    })

    if (!user) {
      user = await db.users.create({
        name: nickname,
        avatar: headimgurl,
        loginMethod: 'wechat',
        wechatOpenid: openid,
        wechatUnionid: unionid,
        email: null,
        passwordHash: null
      })
    } else {
      // 更新用户信息
      await db.users.update({
        where: { id: user.id },
        data: {
          name: nickname,
          avatar: headimgurl
        }
      })
      user = { ...user, name: nickname, avatar: headimgurl }
    }

    // 4. 生成 JWT
    const token = generateJWT(user)
    const refreshToken = generateRefreshToken(user)

    // 5. 返回响应
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        },
        token,
        refreshToken,
        expiresIn: 3600
      },
      message: '登录成功'
    })

  } catch (error) {
    console.error('WeChat login error:', error)

    // 处理微信 API 错误
    if (error.response?.data?.errcode) {
      const errcode = error.response.data.errcode
      if (errcode === 40029) {
        return res.status(400).json({
          success: false,
          message: '授权码无效或已过期',
          error: { code: 'INVALID_CODE' }
        })
      }
    }

    res.status(500).json({
      success: false,
      message: '微信登录失败',
      error: { code: 'WECHAT_API_ERROR' }
    })
  }
})
```

---

**文档版本**: 1.0
**最后更新**: 2024-01-XX
**维护者**: Graftra Team
