# Graftra 认证系统 - 后端接口协议文档

## 概述

本文档定义了 Graftra 图表生成工具的认证相关后端接口，包括图形验证码生成、用户注册、登录等功能。

---

## 基础配置

### 1. 技术栈建议
- **框架**: Node.js (Express/NestJS) / Python (FastAPI/Django) / Go (Gin) / Java (Spring Boot)
- **缓存**: Redis (存储验证码和会话)
- **数据库**: PostgreSQL / MongoDB
- **图片处理**: Canvas (Node) / Pillow (Python) / 其他图形库

### 2. 通用响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": {
    // 具体数据
  },
  "message": "操作成功"
}

// 失败响应
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

---

## API 接口定义

### 1. 生成图形验证码

#### 接口信息
```
POST /api/auth/captcha
```

#### 请求参数
无需请求体

#### 响应数据

```typescript
{
  "success": true,
  "data": {
    "captchaId": "550e8400-e29b-41d4-a716-446655440000",  // 验证码唯一标识
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."  // Base64 编码的 PNG 图片
  }
}
```

#### 后端实现要求

1. **生成验证码**
   - 生成 4 位随机字符（大写字母 + 数字，去除易混淆字符如 I/1/O/0）
   - 使用字符集: `23456789ABCDEFGHJKLMNPQRSTUVWXYZ`

2. **绘制图片**
   - 图片尺寸: 120px × 44px
   - 添加随机背景色（浅色系）
   - 添加干扰线（5-8条）
   - 添加噪点（30-50个）
   - 字符随机旋转（-15° 到 +15°）
   - 字符随机颜色

3. **存储验证码**
   ```typescript
   // Redis 存储结构
   Key: captcha:{captchaId}
   Value: { "code": "A7B3", "expiresAt": 1701234567890 }
   TTL: 300 秒（5分钟）
   ```

4. **安全措施**
   - 每个 captchaId 只能使用一次
   - 验证码 5 分钟过期
   - 限制同一 IP 的请求频率（1分钟最多 10 次）

#### 错误码

| 错误码 | 说明 |
|--------|------|
| RATE_LIMIT_EXCEEDED | 请求过于频繁，请稍后再试 |

---

### 2. 用户注册

#### 接口信息
```
POST /api/auth/register
```

#### 请求参数

```typescript
{
  "email": "user@example.com",           // 邮箱地址（必填）
  "password": "password123",            // 密码（必填，至少8位）
  "captchaCode": "A7B3",                // 验证码（必填）
  "captchaId": "550e8400-e29b-41d4-a716-446655440000",  // 验证码ID（必填）
  "agreeToTerms": true                  // 同意条款（必填）
}
```

#### 响应数据

**成功响应:**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-xxx",
      "name": null,                      // 用户名（可选）
      "email": "user@example.com",
      "avatar": null
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT Token
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600                    // Token 过期时间（秒）
  },
  "message": "注册成功"
}
```

#### 后端验证逻辑

1. **验证码校验**
   ```typescript
   // 1. 从 Redis 获取存储的验证码
   const storedCaptcha = await redis.get(`captcha:${captchaId}`)

   // 2. 检查验证码是否存在
   if (!storedCaptcha) {
     return error("VALIDATION_ERROR", "验证码已过期或不存在")
   }

   // 3. 检查是否过期
   if (Date.now() > storedCaptcha.expiresAt) {
     await redis.del(`captcha:${captchaId}`)
     return error("VALIDATION_ERROR", "验证码已过期")
   }

   // 4. 比较验证码（不区分大小写）
   if (storedCaptcha.code.toLowerCase() !== captchaCode.toLowerCase()) {
     // 验证失败也要删除，防止暴力破解
     await redis.del(`captcha:${captchaId}`)
     return error("INVALID_CAPTCHA", "验证码错误")
   }

   // 5. 验证成功后立即删除（一次性使用）
   await redis.del(`captcha:${captchaId}`)
   ```

2. **邮箱验证**
   - 格式验证（正则）
   - 检查邮箱是否已注册

3. **密码验证**
   - 最少 8 位字符
   - 可选：包含大小写字母、数字

4. **用户创建**
   - 密码使用 bcrypt 或 argon2 加密（salt rounds >= 10）
   - 生成用户 UUID
   - 创建用户记录

5. **Token 生成**
   - 使用 JWT (HS256/RS256)
   - Payload 包含: userId, email, iat, exp
   - Token 有效期: 1 小时
   - RefreshToken 有效期: 30 天

#### 错误码

| 错误码 | 说明 |
|--------|------|
| VALIDATION_ERROR | 参数验证失败 |
| INVALID_CAPTCHA | 验证码错误或已过期 |
| EMAIL_EXISTS | 该邮箱已被注册 |
| RATE_LIMIT_EXCEEDED | 请求过于频繁 |

---

### 3. 用户登录

#### 接口信息
```
POST /api/auth/login
```

#### 请求参数

```typescript
{
  "email": "user@example.com",     // 邮箱地址（必填）
  "password": "password123",      // 密码（必填）
  "remember": true                // 记住我（可选，默认 false）
}
```

#### 响应数据

与注册接口相同

#### 后端验证逻辑

1. **验证码校验**（可选，连续失败 3 次后要求）
   - 检测到连续失败后，要求输入验证码

2. **用户查询**
   - 根据 email 查找用户

3. **密码验证**
   - 使用 bcrypt/argon2 对比密码哈希
   - 记录失败次数（Redis，15分钟窗口）

4. **登录限制**
   ```typescript
   // Redis 存储失败次数
   Key: login_fail:{email}
   Value: { "count": 3, "lastAttempt": 1701234567890 }
   TTL: 900 秒（15分钟）

   // 失败 5 次后锁定 30 分钟
   if (failCount >= 5) {
     return error("ACCOUNT_LOCKED", "登录失败次数过多，账户已临时锁定")
   }
   ```

5. **Token 生成**
   - remember=true: refreshToken 有效期 30 天
   - remember=false: refreshToken 有效期 7 天

#### 错误码

| 错误码 | 说明 |
|--------|------|
| INVALID_CREDENTIALS | 邮箱或密码错误 |
| ACCOUNT_LOCKED | 登录失败次数过多，账户已临时锁定 |
| REQUIRE_CAPTCHA | 需要输入验证码 |

---

### 4. 刷新 Token

#### 接口信息
```
POST /api/auth/refresh
```

#### 请求参数

```typescript
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 响应数据

```typescript
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

#### 后端验证逻辑

1. 验证 refreshToken 有效性
2. 检查是否在黑名单中（用于主动注销）
3. 生成新的 accessToken
4. 可选：轮换 refreshToken

---

### 5. 获取当前用户信息

#### 接口信息
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
```

#### 响应数据

```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "用户名",
      "email": "user@example.com",
      "avatar": "https://...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

### 6. 退出登录

#### 接口信息
```
POST /api/auth/logout
Headers: Authorization: Bearer {token}
```

#### 响应数据

```typescript
{
  "success": true,
  "message": "退出成功"
}
```

#### 后端逻辑

1. 将 refreshToken 加入黑名单
2. 可选：清除服务器端会话

---

## 数据库 Schema

### Users 表

```sql
CREATE TYPE login_method AS ENUM ('email', 'wechat');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar TEXT,
  login_method login_method DEFAULT 'email',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### Refresh Tokens 表（可选，用于服务端令牌管理）

```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at TIMESTAMP
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
```

---

## 安全要求

### 1. 密码安全
- 使用 bcrypt (cost >= 10) 或 argon2id
- 不返回密码明文或哈希值
- 不在日志中记录密码

### 2. Token 安全
- 使用强随机密钥生成 JWT
- Token 签名使用 RS256（生产环境推荐）
- 设置合理的过期时间

### 3. 验证码安全
- 验证码一次性使用
- 限制请求频率
- 使用 HTTPS 传输

### 4. 防护措施
- 实施 Rate Limiting
- CORS 配置
- SQL 注入防护（使用参数化查询）
- XSS 防护

---

## Redis Key 设计

```
# 验证码
captcha:{captchaId}         -> { code, expiresAt }  (TTL: 300s)

# 登录失败记录
login_fail:{email}          -> { count, lastAttempt }  (TTL: 900s)

# Token 黑名单
token_blacklist:{tokenId}   -> "1"  (TTL: token过期时间)

# 用户会话（可选）
session:{userId}            -> { tokenData }  (TTL: 3600s)
```

---

## 错误码汇总

| 错误码 | HTTP状态码 | 说明 |
|--------|-----------|------|
| VALIDATION_ERROR | 400 | 参数验证失败 |
| INVALID_CAPTCHA | 400 | 验证码错误或已过期 |
| INVALID_CREDENTIALS | 401 | 邮箱或密码错误 |
| UNAUTHORIZED | 401 | 未授权或 Token 无效 |
| ACCOUNT_LOCKED | 423 | 账户已临时锁定 |
| EMAIL_EXISTS | 409 | 邮箱已被注册 |
| RATE_LIMIT_EXCEEDED | 429 | 请求过于频繁 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |

---

## 前端集成示例

### 获取验证码
```typescript
// 1. 请求验证码
const response = await fetch('/api/auth/captcha', { method: 'POST' })
const { captchaId, image } = await response.json()

// 2. 显示图片
captchaImage.src = image

// 3. 保存 captchaId 用于后续提交
form.captchaId = captchaId
```

### 注册
```typescript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: form.email,
    password: form.password,
    captchaCode: form.captcha,      // 用户输入
    captchaId: form.captchaId,       // 验证码ID
    agreeToTerms: true
  })
})
```

---

## 测试用例

### 验证码接口测试
- [ ] 正常生成验证码
- [ ] 返回有效的 captchaId
- [ ] 返回有效的 Base64 图片
- [ ] Redis 中正确存储验证码
- [ ] 验证码 5 分钟后过期
- [ ] 验证码使用后立即删除

### 注册接口测试
- [ ] 正确的验证码可以注册成功
- [ ] 错误的验证码返回 INVALID_CAPTCHA
- [ ] 过期的验证码返回 INVALID_CAPTCHA
- [ ] 已使用的验证码不能再次使用
- [ ] 重复邮箱返回 EMAIL_EXISTS
- [ ] 密码少于8位返回 VALIDATION_ERROR

---

## 附录：验证码图片生成示例代码

### Node.js (Canvas)
```javascript
const Canvas = require('canvas')

function generateCaptcha() {
  const canvas = Canvas.createCanvas(120, 44)
  const ctx = canvas.getContext('2d')
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

  // 背景
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, 120, 44)

  // 验证码
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }

  // 绘制文字
  ctx.font = 'bold 24px monospace'
  for (let i = 0; i < 4; i++) {
    ctx.save()
    ctx.translate(20 + i * 25, 28)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.fillStyle = randomColor()
    ctx.fillText(code[i], 0, 0)
    ctx.restore()
  }

  // 干扰线
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(0,0,0,0.2)`
    ctx.beginPath()
    ctx.moveTo(Math.random() * 120, Math.random() * 44)
    ctx.lineTo(Math.random() * 120, Math.random() * 44)
    ctx.stroke()
  }

  return {
    code,
    image: canvas.toDataURL('image/png')
  }
}
```

### Python (Pillow)
```python
from PIL import Image, ImageDraw, ImageFont
import random
import string
import io
import base64

def generate_captcha():
    # 字符集（去除易混淆字符）
    chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

    # 创建图片
    img = Image.new('RGB', (120, 44), color=(240, 240, 240))
    draw = ImageDraw.Draw(img)

    # 生成验证码
    code = ''.join(random.choice(chars) for _ in range(4))

    # 绘制文字
    for i, char in enumerate(code):
        x = 20 + i * 25
        draw.text((x, 15), char, fill=random_rgb())

    # 添加干扰线
    for _ in range(5):
        x1, y1 = random.randint(0, 120), random.randint(0, 44)
        x2, y2 = random.randint(0, 120), random.randint(0, 44)
        draw.line([(x1, y1), (x2, y2)], fill=(128, 128, 128))

    # 转为 base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    image_base64 = base64.b64encode(buffer.getvalue()).decode()

    return {
        'code': code,
        'image': f'data:image/png;base64,{image_base64}'
    }
```

---

**文档版本**: 1.0
**最后更新**: 2024-01-XX
**维护者**: Graftra Team
