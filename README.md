# Image Tasks API (NestJS)

API REST para **crear tareas** de procesado de imágenes y **consultar su estado**. Genera variantes de 1024px y 800px de ancho usando **sharp**.

## Requisitos
- Node.js 20+
- Docker (opcional) para MongoDB

## Arranque rápido
```bash
npm i
npm run start:dev
```

## Swagger interface 
`http://localhost:3000/docs`

## Endpoints
### POST /tasks
Create a task from a local path or URL.

**Body**
```json
{ "input": "https://picsum.photos/seed/nest/1200/800" }
```
**Response example**
```json
{ "taskId":"65d4a54b89c5e342b2c2c5f6", "status":"pending", "price":25.5 }
```

### GET /tasks/:taskId
Returns status, price, and if `completed`, the generated paths.

**Example**
```json
{
  "taskId":"65d4a54b89c5e342b2c2c5f6",
  "status":"completed",
  "price":25.5,
  "images":[
    {"resolution":1024, "path":"/output/image1/1024/f322b7.jpg"},
    {"resolution":800,  "path":"/output/image1/800/202fd8.jpg"}
  ]
}
```