import { login, getRelations, readAllClasses, insertClass } from './database.js';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
const port = 3001;

await login();

app.get('/', async (req, res) => {
  try {
    const data = await readAllClasses();
    res.json(data);
  } catch (e) {
    console.log(e);
    res.json({error: e.message});
  }
});

app.get('/class/:className', async (req, res) => {
  try {
    const data = await getRelations(req.params.className); 
    res.json(data);
  } catch (e) {
    console.log(e);
    res.json({error: e.message});
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})