# API Reference

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### Health Check
```
GET /api/health
```
**Response:**
```json
{ "status": "ok", "timestamp": "2025-01-14T10:00:00.000Z" }
```

---

### Assessment

#### Start Assessment
```
POST /api/assessment/start
```
**Body:**
```json
{
  "filePaths": ["/uploads/doc1.pdf"],
  "standards": ["ISO37001", "ISO37301", "ISO27001", "ISO9001"],
  "orgProfile": {
    "company": "Acme Corp",
    "industry": "Financial Services",
    "employees": "501-1000",
    "scope": "Global Operations"
  }
}
```
**Response:**
```json
{ "assessmentId": "uuid", "status": "processing" }
```

#### Stream Assessment Progress (SSE)
```
GET /api/assessment/:id/stream
```
**Headers:** `Accept: text/event-stream`

**Events:**
```
data: { "type": "agent-start", "agent": "Document Agent", "timestamp": "..." }
data: { "type": "log", "message": "Parsing documents...", "timestamp": "..." }
data: { "type": "agent-complete", "agent": "Document Agent", "timestamp": "..." }
data: { "type": "complete", "result": { ... }, "timestamp": "..." }
```

#### Get Assessment Results
```
GET /api/assessment/:id/results
```
**Response:**
```json
{
  "status": "complete",
  "result": {
    "id": "uuid",
    "overallScore": 62,
    "maturityLevel": 3,
    "standardAssessments": [...],
    "gaps": [...],
    "remediationActions": [...]
  }
}
```

---

### Chat
```
POST /api/chat
```
**Body:**
```json
{
  "message": "What are my biggest compliance gaps?",
  "context": { "overallScore": 62 }
}
```
**Response:**
```json
{ "response": "Your most critical gaps are..." }
```

---

### Standards

#### List Standards
```
GET /api/standards
```
**Response:**
```json
[
  { "code": "ISO37001", "name": "ISO 37001", "fullName": "Anti-Bribery Management Systems", "clauseCount": 28 }
]
```

#### Get Standard Clauses
```
GET /api/standards/:code/clauses
```
**Response:**
```json
{
  "code": "ISO37001",
  "clauses": [
    { "id": "4.1", "title": "Understanding the organization", "category": "Context", "weight": 3 }
  ]
}
```

---

### File Upload
```
POST /api/upload
Content-Type: multipart/form-data
```
**Body:** `files` (multipart, max 10 files, 20MB each)

**Accepted types:** PDF, DOCX, TXT

**Response:**
```json
{
  "files": [
    { "originalName": "policy.pdf", "savedPath": "/uploads/uuid.pdf", "size": 1024000, "mimetype": "application/pdf" }
  ]
}
```

---

### Report
```
POST /api/report/generate
```
**Body:**
```json
{ "assessmentResult": { ... } }
```
**Response:** Structured report JSON for client-side PDF generation

---

### Demo
```
GET /api/demo/assessment
```
**Response:** Complete demo assessment result (Acme Corp)
