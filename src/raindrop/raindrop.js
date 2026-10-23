import axios from 'axios';
import { setTimeout } from 'node:timers/promises';

const BASE_URL = 'https://api.raindrop.io/rest/v1';

function getToken() {
  const token = process.env.RAINDROP_TOKEN?.trim();
  if (!token) {
    throw new Error('Missing RAINDROP_TOKEN environment variable. Add it to .env');
  }
  return token;
}

function makeClient() {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });
}

function normalizeError(error) {
  if (error?.response?.status === 401) {
    return new Error('Raindrop API rejected the token. Refresh RAINDROP_TOKEN in .env.');
  }

  if (error?.response?.status === 403) {
    return new Error('Raindrop API denied access for this token.');
  }

  return error instanceof Error ? error : new Error('Raindrop API request failed');
}

export async function getCurrentUser() {
  try {
    const client = makeClient();
    const { data } = await client.get('/user');
    return data.user ?? data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getRaindropCollections() {
  try {
    const client = makeClient();
    const { data } = await client.get('/collections');
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getRaindrops(collectionId, sort = 'newest', page = 0, perPage = 50) {
  try {
    const client = makeClient();
    const { data } = await client.get(`/raindrops/${collectionId}`, {
      params: {
        sort,
        page,
        perpage: perPage,
      },
    });
    return data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function collectionScraper(collectionId) {
  const collection = await getRaindrops(collectionId);
  const count = collection.count;
  let total = 0;

  for (let page = 0; total < count; page += 1) {
    const raindrops = await getRaindrops(collectionId, 'domain', page, 50);
    const links = (raindrops.items ?? []).map((item) => item.link);
    if (links.length === 0) {
      break;
    }

    for (const link of links) {
      console.log(link);
    }

    total += links.length;
    if (total < count) {
      await setTimeout(2000);
    }
  }

  if (total !== count) {
    console.error(`Error: Total links fetched (${total}) does not match total links in the collection (${count}).`);
  } else {
    console.log('All links fetched successfully.');
  }

  console.log(`Total links fetched: ${total}/${count}`);
}

export async function getUnsortedLinks({ perPage = 50, page = 0 } = {}) {
  try {
    const client = makeClient();
    const { data } = await client.get('/raindrops/-1', {
      params: {
        sort: 'created',
        perpage: perPage,
        page,
        search: '',
      },
    });

    return data.items ?? [];
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getLinkById(id) {
  try {
    const client = makeClient();
    const { data } = await client.get(`/raindrop/${id}`);
    return data.item ?? data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function updateLinkTags(id, tags) {
  try {
    const client = makeClient();
    const nextTags = [...new Set((tags || []).filter(Boolean).map((tag) => String(tag).trim()).filter(Boolean))];
    const { data } = await client.put(`/raindrop/${id}`, { tags: nextTags });
    return data.item ?? data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function addTagToLink(id, tag) {
  const nextTag = String(tag || '').trim();
  if (!nextTag) {
    throw new Error('Tag cannot be empty');
  }

  const item = await getLinkById(id);
  const existingTags = item.tags ?? [];
  const nextTags = [...new Set([...existingTags, nextTag])];
  return updateLinkTags(id, nextTags);
}

export async function removeTagFromLink(id, tag) {
  const nextTag = String(tag || '').trim();
  if (!nextTag) {
    throw new Error('Tag cannot be empty');
  }

  const item = await getLinkById(id);
  const nextTags = (item.tags ?? []).filter((value) => String(value).trim() !== nextTag);
  return updateLinkTags(id, nextTags);
}

export async function getAllUnsortedLinks({ perPage = 100 } = {}) {
  try {
    const client = makeClient();
    let page = 0;
    const allItems = [];

    while (true) {
      const { data } = await client.get('/raindrops/-1', {
        params: {
          sort: 'created',
          perpage: perPage,
          page,
          search: '',
        },
      });

      const items = data.items ?? [];
      if (!items.length) break;

      allItems.push(...items);

      if (items.length < perPage) break;
      page += 1;
    }

    return allItems;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getAllTags() {
  try {
    const items = await getAllUnsortedLinks();
    return [...new Set(items.flatMap((item) => item.tags || []).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  } catch (error) {
    throw normalizeError(error);
  }
}