# 📸 Image Tasks API (NestJS)

A REST API to **create image processing tasks** and **check their status**.  
Generates 1024px and 800px width variants using [**sharp**](https://sharp.pixelplumbing.com/).  

## 🚀 Features
- **Image processing** from a local path or remote URL.
- **Asynchronous task execution** to avoid blocking requests.
- **Task management** with status (`pending`, `completed`, `failed`) and pricing.
- **Swagger UI** for documentation and live testing.
- **MongoDB persistence** with indexes for efficient queries.
- **Clean validation** with `class-validator` and global pipes.
- **Centralized error handling** with a global exception filter.

---

## 📦 Requirements
- **Node.js** ≥ 20
- **MongoDB** (local)
---

## 🏁 Quick Start

**1. Clone & install dependencies**
```bash
npm install
```

**2. Run the application**
```bash
npm run start:dev
```

**4. Open Swagger UI**
```
http://localhost:3000/docs
```

---

## 📖 API Endpoints

### **POST** `/tasks`
Create a new image processing task from a **local file path** or a **remote URL**.

**Request body**
```json
{
  "input": "https://picsum.photos/seed/nest/1200/800"
}
```

**Example response**
```json
{
  "taskId": "65d4a54b89c5e342b2c2c5f6",
  "status": "pending",
  "price": 25.5
}
```

---

### **GET** `/tasks/:taskId`
Retrieve task status, price, and generated image variants if completed.

**Example response**
```json
{
  "taskId": "65d4a54b89c5e342b2c2c5f6",
  "status": "completed",
  "price": 25.5,
  "images": [
    { "resolution": 1024, "path": "/output/image1/1024/f322b7.jpg" },
    { "resolution": 800,  "path": "/output/image1/800/202fd8.jpg" }
  ]
}
```

---

## 🛠 Design Decisions

- **API-First**  
  All endpoints are documented with Swagger; DTOs validated using `class-validator`.

- **Persistence**  
  - `tasks` collection: stores task metadata, status, price, and timestamps.  
  - `images` collection: stores variant metadata (`resolution`, `md5`, `path`).  
  - Indexed fields for performance: `status`, `createdAt`, `taskId`, `md5`.

- **Asynchronous processing**  
  Tasks are processed in the background using `setImmediate()` to avoid blocking requests.  
  Could be upgraded to **Bull/Redis** for distributed queues.

- **File output structure**  
  ```
  /output/{original_name}/{resolution}/{md5}.{ext}
  ```
  Base directory configurable via the `OUTPUT_DIR` environment variable.

- **ValidationPipe**  
  Global `ValidationPipe` with:
  - `whitelist: true` → strips unexpected properties.  
  - `transform: true` → automatically converts inputs to the correct types.

- **Global Exception Filter**  
  Captures and formats all errors into a consistent JSON response.

---

## ⚙️ Environment Variables
Create a `.env` file based on `.env.example`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/image_tasks_db
OUTPUT_DIR=./output
INPUT_DIR=./input
```

---

## 🧪 Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

A postman collection is included in the project for testing endpoints.
```bash
Image Tasks API (NestJS).postman_collection.json
```

---

## 📂 Project Structure
```
src/
 ├── common/           # Shared filters, pipes, and utilities
 ├── config/           # Configuration and environment handling
 ├── images/           # Image processing logic and schemas
 ├── tasks/            # Task management logic and schemas
 ├── utils/            # Unique md5 hash generator and file manager
 ├── app.module.ts     # Main module of the application
 └── main.ts           # Application bootstrap
```

---

## 📜 License
Inditex
