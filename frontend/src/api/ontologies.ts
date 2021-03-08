import { Annontations } from '../types/ontologyTypes';
import api from './api';

export const getRelations = (classId: string): Promise<any> =>
  api.GET(`ontologies/relations/${encodeURIComponent(classId)}`);

export const getAnnontations = (classId: string): Promise<Annontations> =>
  api.GET(`ontologies/annontations/${encodeURIComponent(classId)}`);
