import { Annotation, SustainabilityGoal, Node, Ontology } from '../types/ontologyTypes';
import api from './api';

export const getRelations = async (nodeId: string): Promise<Array<Ontology>> => {
  try {
    const data: Array<Ontology> = await api.GET(
      `ontologies/relations/${encodeURIComponent(nodeId)}`,
    );
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getAnnotations = async (nodeId: string): Promise<Annotation> => {
  try {
    const data: Promise<Annotation> = await api.GET(
      `ontologies/annotations/${encodeURIComponent(nodeId)}`,
    );
    return await data;
  } catch (e) {
    console.log(e);
    return { label: '', description: '' };
  }
};

export const getSubclasses = async (nodeId: string): Promise<Array<Node>> => {
  try {
    const data: Array<Node> = await api.GET(`ontologies/subclasses/${encodeURIComponent(nodeId)}`);
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getSustainabilityGoals = async (): Promise<Array<SustainabilityGoal>> => {
  try {
    const data = await api.GET('ontologies/sustainabilityGoals');
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getSDGAndTBLContributions = async (nodeId: string): Promise<Array<Node>> => {
  try {
    const data: Array<Node> = await api.GET(
      `ontologies/contributions/${encodeURIComponent(nodeId)}`,
    );
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const search = async (searchTerm: string, limit?: number): Promise<Array<Node>> => {
  let url = `ontologies/search?search=${encodeURIComponent(searchTerm)}`;
  if (limit) {
    url += `&limit=${limit}`;
  }
  try {
    const data: Array<Node> = await api.GET(url);
    return data;
  } catch (e) {
    console.log(e);
    return [];
  }
};
