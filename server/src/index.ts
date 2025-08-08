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

app.get('/api/clients', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  try {
    const { rows } = await pool.query(
      `SELECT id, name FROM clients WHERE user_id = (
         SELECT id FROM users WHERE clerk_id = $1
       ) ORDER BY name`,
      [userId]
    );
    res.json({ clients: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

app.get('/api/reports', requireAuth(), async (req, res) => {
  const { userId } = getAuth(req);
  try {
    const { rows } = await pool.query(
      `SELECT reports.id, reports.data, reports.created_at,
              projects.name AS project_name,
              clients.name AS client_name
       FROM reports
       JOIN projects ON reports.project_id = projects.id
       JOIN clients ON projects.client_id = clients.id
       JOIN users ON projects.user_id = users.id
       WHERE users.clerk_id = $1
       ORDER BY reports.created_at DESC`,
      [userId]
    );
    res.json({ reports: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
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
      'INSERT INTO clients (user_id, name) VALUES ($1, $2) ON CONFLICT (user_id, name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
      [userRow.id, clientName]
    );

    const {
      rows: [projectRow],
    } = await pool.query(
      'INSERT INTO projects (user_id, client_id, name) VALUES ($1, $2, $3) ON CONFLICT (user_id, client_id, name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
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
