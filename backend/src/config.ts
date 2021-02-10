import dotenv from 'dotenv-safe';
import { EnapsoGraphDBClient } from '@innotrade/enapso-graphdb-client';

dotenv.config();

const PORT = process.env.PORT || 3001;

const DEFAULT_PREFIXES = [
  EnapsoGraphDBClient.PREFIX_OWL,
  EnapsoGraphDBClient.PREFIX_RDF,
  EnapsoGraphDBClient.PREFIX_RDFS,
  EnapsoGraphDBClient.PREFIX_XSD,
  EnapsoGraphDBClient.PREFIX_PROTONS,
];

export default {
  PORT,
  DEFAULT_PREFIXES,
  GRAPHDB_BASE_URL: process.env.GRAPHDB_BASE_URL,
  GRAPHDB_REPOSITORY: process.env.GRAPHDB_REPOSITORY,
  GRAPHDB_USERNAME: process.env.GRAPHDB_USERNAME,
  GRAPHDB_PASSWORD: process.env.GRAPHDB_PASSWORD,
  GRAPHDB_CONTEXT_TEST: process.env.GRAPHDB_CONTEXT_TEST,
};
