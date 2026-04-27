# 药品管理系统 API 接口文档

## 服务器地址

**基础URL**: `http://localhost:3000/api`

---

## API 接口列表

### 1. 健康检查

| 属性 | 值 |
|------|-----|
| **方法** | GET |
| **路径** | `/health` |

**响应示例**:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

### 2. 获取所有药品列表

| 属性 | 值 |
|------|-----|
| **方法** | GET |
| **路径** | `/medicines` |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "感冒药",
      "expiry_date": "2025-12-31",
      "category": "感冒用药",
      "quantity": 10,
      "remark": "饭后服用",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

### 3. 获取即将过期的药品

| 属性 | 值 |
|------|-----|
| **方法** | GET |
| **路径** | `/medicines/expiring` |

**说明**: 返回7天内即将过期的药品

**响应示例**: 同获取所有药品列表

---

### 4. 获取单个药品详情

| 属性 | 值 |
|------|-----|
| **方法** | GET |
| **路径** | `/medicines/:id` |

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | number | 药品ID |

**成功响应** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "感冒药",
    "expiry_date": "2025-12-31",
    "category": "感冒用药",
    "quantity": 10,
    "remark": "饭后服用",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
}
```

**失败响应**:
- 400: `{"success": false, "message": "Invalid ID"}`
- 404: `{"success": false, "message": "Medicine not found"}`

---

### 5. 添加新药品

| 属性 | 值 |
|------|-----|
| **方法** | POST |
| **路径** | `/medicines` |

**请求体**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 药品名称 |
| `expiry_date` | string | 是 | 过期日期 (格式: YYYY-MM-DD) |
| `category` | string | 否 | 药品分类 |
| `quantity` | number | 否 | 数量 (默认: 0) |
| `remark` | string | 否 | 备注 |

**请求示例**:
```json
{
  "name": "退烧药",
  "expiry_date": "2026-06-30",
  "category": "解热镇痛",
  "quantity": 5,
  "remark": "发烧超过38.5度服用"
}
```

**成功响应** (201):
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "退烧药",
    "expiry_date": "2026-06-30",
    "category": "解热镇痛",
    "quantity": 5,
    "remark": "发烧超过38.5度服用",
    "created_at": "2025-04-26T10:00:00Z",
    "updated_at": "2025-04-26T10:00:00Z"
  }
}
```

**失败响应** (400):
```json
{"success": false, "message": "Name and expiry_date are required"}
```

---

### 6. 更新药品信息

| 属性 | 值 |
|------|-----|
| **方法** | PUT |
| **路径** | `/medicines/:id` |

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | number | 药品ID |

**请求体**: 同添加药品（所有字段均为可选，只更新提供的字段）

**成功响应** (200): 同获取单个药品详情

**失败响应**:
- 400: `{"success": false, "message": "Invalid ID"}`
- 404: `{"success": false, "message": "Medicine not found"}`

---

### 7. 删除药品

| 属性 | 值 |
|------|-----|
| **方法** | DELETE |
| **路径** | `/medicines/:id` |

**路径参数**:
| 参数 | 类型 | 说明 |
|------|------|------|
| `id` | number | 药品ID |

**成功响应** (200):
```json
{"success": true}
```

**失败响应**:
- 400: `{"success": false, "message": "Invalid ID"}`
- 404: `{"success": false, "message": "Medicine not found"}`

---

## 数据模型

### Medicine (药品)

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | number | 药品唯一标识 (自动生成) |
| `name` | string | 药品名称 |
| `expiry_date` | string | 过期日期 (YYYY-MM-DD) |
| `category` | string | 药品分类 |
| `quantity` | number | 数量 |
| `remark` | string | 备注说明 |
| `created_at` | string | 创建时间 (ISO格式) |
| `updated_at` | string | 更新时间 (ISO格式) |

### ApiResponse (统一响应格式)

| 字段 | 类型 | 说明 |
|------|------|------|
| `success` | boolean | 请求是否成功 |
| `data` | T | 返回的数据 (成功时有值) |
| `message` | string | 提示信息 (失败时有值) |

---

## 使用示例

```bash
# 获取所有药品
curl http://localhost:3000/api/medicines

# 添加药品
curl -X POST http://localhost:3000/api/medicines \
  -H "Content-Type: application/json" \
  -d '{"name":"感冒药","expiry_date":"2025-12-31","category":"感冒用药","quantity":10}'

# 更新药品
curl -X PUT http://localhost:3000/api/medicines/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity":15}'

# 删除药品
curl -X DELETE http://localhost:3000/api/medicines/1
```