import express from 'express';
import medicinesRouter from './routes/medicines';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/medicines', medicinesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

export function startServer(): Promise<void> {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
      resolve();
    });
  });
}

export { app, PORT };
