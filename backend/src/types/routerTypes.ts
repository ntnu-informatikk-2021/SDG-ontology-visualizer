/**
 * Contains all type definitions for our custom extensions of Express.Request and Express.Response
 *
 * A Request has 5 generics defined in the following order: Params, ResBody, ReqBody, Query and Locals. They all have default values, so if e.g. only Params need to be defined, the complete type can be written as Request<ParamInterface>.
 * Params is the interface of the URL parameters, e.g. { classId: string; } if the URL is defined as /api/relations/:classId.
 * ResBody is the interface of the body of the response.
 * ReqBody is the interface of the body of the request.
 * Query is the interface of the query parameters, e.g. { search: string; limit: number; } if the URL is /regex?search="foo"&limit=20
 * Locals are used for intermediate data for middlewares, and can be any custom record.
 *
 * A Response has only 2 generics, defined in the following order: ResBody and Locals.
 * These are defined similarly to the Request definitions above.
 */

import { Request, Response } from 'express';
import { Annotation, Node, Ontology } from './types';

type RegexQueryParams = {
  search?: string;
  limit?: number;
};

type ClassIdParams = {
  classId: string;
};

export type EmptyRequest = Request;

export type RegexRequest = Request<{}, {}, {}, RegexQueryParams>;

export type ClassIdRequest = Request<ClassIdParams>;

export type NodeArrayResponse = Response<Array<Node>>;

export type OntologyArrayResponse = Response<Array<Ontology>>;

export type SingleOntologyResponse = Response<Ontology>;

export type AnnotationResponse = Response<Annotation>;
