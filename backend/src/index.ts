import { login, getRelations, readAllClasses } from './database';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 3001;

app.get('/', async (req, res) => {
  try {
    const data = await readAllClasses();
    res.json(data);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

app.get('/class/:className', async (req, res) => {
  try {
    const data = await getRelations(req.params.className);
    res.json(data);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

const init = async (): Promise<void> => {
  console.log('Initializing server...');
  await login();
  console.log(`Example app listening at http://localhost:${port}`);
};

app.listen(port, init);
