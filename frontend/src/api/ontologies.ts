import { Annotations } from '../types/ontologyTypes';
import api from './api';

export const getRelations = (classId: string): Promise<any> =>
  api.GET(`ontologies/relations/${encodeURIComponent(classId)}`);

export const getAnnotations = (classId: string): Promise<Annotations> =>
  api.GET(`ontologies/Annotations/${encodeURIComponent(classId)}`);
