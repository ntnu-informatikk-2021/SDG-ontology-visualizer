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
  console.log('Initializing server...');
  await databaseLogin();
  console.log(`Ontology server listening at http://localhost:${config.PORT}`);
};

app.listen(config.PORT, init);
