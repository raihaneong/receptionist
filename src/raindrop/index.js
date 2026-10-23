import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const { default: bookmarkRoutes } = await import('./routes/bookmark.js');

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
app.use('/api', bookmarkRoutes);

app.get('/health', (_, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Raindrop API proxy listening on http://localhost:${port}`);
});
