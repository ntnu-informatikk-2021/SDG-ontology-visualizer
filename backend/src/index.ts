import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';
import routes from './routes';
import databaseLogin from './database/login';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

const init = async (): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('Initializing server...');
  await databaseLogin();
  // eslint-disable-next-line no-console
  console.log(`Example app listening at http://localhost:${config.PORT}`);
};

app.listen(config.PORT, init);
