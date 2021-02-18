import dotenv from 'dotenv-safe';

dotenv.config();

const PORT = process.env.PORT || 3001;

export default {
  PORT,
  GRAPHDB_BASE_URL: process.env.GRAPHDB_BASE_URL,
  GRAPHDB_REPOSITORY: process.env.GRAPHDB_REPOSITORY,
  GRAPHDB_USERNAME: process.env.GRAPHDB_USERNAME,
  GRAPHDB_PASSWORD: process.env.GRAPHDB_PASSWORD,
  GRAPHDB_CONTEXT_TEST: process.env.GRAPHDB_CONTEXT_TEST,
};
