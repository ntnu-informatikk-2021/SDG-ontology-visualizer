import { LoginResponse } from '@innotrade/enapso-graphdb-client';
import DB from './index';
import config from '../config';

let isLoggedIn = false;

export const getLoginStatus = () => isLoggedIn;

export default async (): Promise<void> => {
  console.log('Connecting to database...');
  await DB.login(config.GRAPHDB_USERNAME, config.GRAPHDB_PASSWORD)
    .then((result: LoginResponse) => {
      console.log(`Connected to database. Response: ${result.statusCode} ${result.message}`);
      isLoggedIn = true;
    })
    .catch((err: LoginResponse) => {
      console.log(
        `Could not connect to database (status code ${err.statusCode}). Message: ${err.message}`,
      );
      isLoggedIn = false;
    });
};
