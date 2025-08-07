import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth, getAuth } from '@clerk/express';
import pool from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/user', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  try {
    const result = await pool.query('SELECT * FROM users WHERE clerk_id = $1', [userId]);
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/reports', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  const { clientName, projectName, data, userEmail } = req.body;

  try {
    await pool.query(
      'INSERT INTO users (clerk_id, email) VALUES ($1, $2) ON CONFLICT (clerk_id) DO NOTHING',
      [userId, userEmail]
    );

    const {
      rows: [userRow],
    } = await pool.query('SELECT id FROM users WHERE clerk_id = $1', [userId]);

    const {
      rows: [clientRow],
    } = await pool.query(
      'INSERT INTO clients (user_id, name) VALUES ($1, $2) RETURNING id',
      [userRow.id, clientName]
    );

    const {
      rows: [projectRow],
    } = await pool.query(
      'INSERT INTO projects (user_id, client_id, name) VALUES ($1, $2, $3) RETURNING id',
      [userRow.id, clientRow.id, projectName]
    );

    const {
      rows: [reportRow],
    } = await pool.query(
      'INSERT INTO reports (project_id, data) VALUES ($1, $2::jsonb) RETURNING id',
      [projectRow.id, data]
    );

    res.status(201).json({ reportId: reportRow.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save report' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
