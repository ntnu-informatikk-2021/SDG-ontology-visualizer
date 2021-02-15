import { EnapsoGraphDBClient, EndpointOptions } from '@innotrade/enapso-graphdb-client';
import config from '../config';

export default new EnapsoGraphDBClient.Endpoint({
  baseURL: config.GRAPHDB_BASE_URL,
  repository: config.GRAPHDB_REPOSITORY,
  prefixes: config.DEFAULT_PREFIXES,
} as EndpointOptions);
