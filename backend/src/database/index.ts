import { EnapsoGraphDBClient, EndpointOptions } from '@innotrade/enapso-graphdb-client';
import config from '../config';

export const PREFIXES = {
  OWL: EnapsoGraphDBClient.PREFIX_OWL,
  RDF: EnapsoGraphDBClient.PREFIX_RDF,
  RDFS: EnapsoGraphDBClient.PREFIX_RDFS,
  XSD: EnapsoGraphDBClient.PREFIX_XSD,
  PROTONS: EnapsoGraphDBClient.PREFIX_PROTONS,
  SDG: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  SCHEMA: {
    prefix: 'schema',
    iri: 'http://schema.org/',
  },
};

export default new EnapsoGraphDBClient.Endpoint({
  baseURL: config.GRAPHDB_BASE_URL,
  repository: config.GRAPHDB_REPOSITORY,
} as EndpointOptions);
