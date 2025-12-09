// Minimal test server to debug Railway 502 issues
import express from "express";

const app = express();

app.get('/health', (_req, res) => {
  console.log('Health endpoint hit!');
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  console.log('Root endpoint hit!');
  res.send('Hello from Railway!');
});

const port = parseInt(process.env.PORT || '8080', 10);

app.listen(port, '0.0.0.0', () => {
  console.log(`Minimal server listening on 0.0.0.0:${port}`);
});
