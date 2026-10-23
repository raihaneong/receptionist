import { Router } from 'express';
import {
  addTagToLink,
  getAllTags,
  getAllUnsortedLinks,
  getCurrentUser,
  getUnsortedLinks,
  removeTagFromLink,
} from '../lib/raindrop.js';

const router = Router();

router.get('/user', async (req, res, next) => {
  try {
    const user = await getCurrentUser();
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: err.message || 'Raindrop authentication failed' });
  }
});

router.get('/unsorted', async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page ?? '0', 10);
    const perPage = Number.parseInt(req.query.perPage ?? '10', 10);

    const items = await getUnsortedLinks({
      page: Number.isNaN(page) ? 0 : page,
      perPage: Number.isNaN(perPage) ? 10 : perPage,
    });

    res.json(items);
  } catch (err) {
    res.status(401).json({ error: err.message || 'Raindrop authentication failed' });
  }
});

router.get('/tags', async (req, res, next) => {
  try {
    const tags = await getAllTags();
    res.json(tags);
  } catch (err) {
    res.status(401).json({ error: err.message || 'Raindrop authentication failed' });
  }
});

router.post('/links/:id/tags', async (req, res, next) => {
  try {
    const { tag } = req.body ?? {};
    const item = await addTagToLink(req.params.id, tag);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to add tag' });
  }
});

router.delete('/links/:id/tags', async (req, res, next) => {
  try {
    const { tag } = req.body ?? {};
    const item = await removeTagFromLink(req.params.id, tag);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to remove tag' });
  }
});

export default router;