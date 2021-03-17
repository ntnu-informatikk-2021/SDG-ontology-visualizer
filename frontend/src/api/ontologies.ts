import { Annotation, SustainabilityGoal } from '../types/ontologyTypes';
import api from './api';

export const getRelations = (classId: string): Promise<any> =>
  api.GET(`ontologies/relations/${encodeURIComponent(classId)}`);

export const getAnnotations = (classId: string): Promise<Annotation> =>
  api.GET(`ontologies/annotations/${encodeURIComponent(classId)}`);

export const getSubclasses = (classId: string): Promise<any> =>
  api.GET(`ontologies/subclasses/${encodeURIComponent(classId)}`);

export const getDescription = (classId: string): Promise<any> =>
  api.GET(`ontologies/description/${encodeURIComponent(classId)}`);

export const getSustainabilityGoals = (classId: string): Promise<SustainabilityGoal[]> =>
  api.GET(`ontologies/sustainabilityGoals/${encodeURIComponent(classId)}`);
