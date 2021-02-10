import DB from './index';
import config from '../config';

export default (): void => {
  DB.login(config.GRAPHDB_USERNAME, config.GRAPHDB_PASSWORD)
    .then((result: any) => {
      console.log(result);
    })
    .catch((err: any) => {
      console.log(err);
    });
};
