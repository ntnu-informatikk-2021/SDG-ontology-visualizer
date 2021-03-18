import { Router } from 'express';
import getDescription from '../database/getDescription';
import getSubclasses from '../database/getSubclasses';
import getRelations from '../database/getRelations';
import getAnnotations from '../database/getAnnotations';
import getSustainabilityGoals from '../database/getSustainabilityGoals';
import getConnectionsSDGAndTBL from '../database/getConnectionsSDGAndTBL';
import onError from './middleware/onError';

const router = Router();

const getRelationsFromClass = async (req, res) => {
  try {
    const data = await getRelations(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const getSubclassesFromClass = async (req, res) => {
  try {
    const data = await getSubclasses(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const getAnnotationsFromClass = async (req, res) => {
  try {
    const data = await getAnnotations(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const getDescriptionFromClass = async (req, res) => {
  try {
    const data = await getDescription(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const getSustainabilityGoalsFromOntology = async (req, res) => {
  try {
    const data = await getSustainabilityGoals(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const getSDGTBLConnections = async (req, res) => {
  try {
    const data = await getConnectionsSDGAndTBL(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

router.get('/relations/:classId', getRelationsFromClass);
router.get('/subclasses/:classId', getSubclassesFromClass);
router.get('/annotations/:classId', getAnnotationsFromClass);
router.get('/description/:classId', getDescriptionFromClass);
router.get('/sustainabilityGoals/:classId', getSustainabilityGoalsFromOntology);
router.get('/contributions/:classId', getSDGTBLConnections);

export default router;
