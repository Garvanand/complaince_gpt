import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { assessmentRouter } from './routes/assessment';
import { chatRouter } from './routes/chat';
import { standardsRouter } from './routes/standards';
import { reportRouter } from './routes/report';
import { demoRouter } from './routes/demo';
import { uploadRouter } from './routes/upload';
import { policyRouter } from './routes/policy';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));

// Ensure uploads directory exists
import fs from 'fs';
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/assessment', assessmentRouter);
app.use('/api/chat', chatRouter);
app.use('/api/standards', standardsRouter);
app.use('/api/report', reportRouter);
app.use('/api/demo', demoRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/policy', policyRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 ComplianceGPT Server running on port ${PORT}`);
});

export default app;
