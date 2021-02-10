import { login, getRelations } from './database';
import express from 'express';
import cors from 'cors';
import config from './config';

const app = express();
app.use(cors());

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
  console.log(`Example app listening at http://localhost:${config.PORT}`);
};

app.listen(config.PORT, init);
