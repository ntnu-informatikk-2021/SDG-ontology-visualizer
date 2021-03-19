import { Router } from 'express';
import getSubclasses from '../database/getSubclasses';
import getRelations from '../database/getRelations';
import getAnnotations from '../database/getAnnotations';
import getSustainabilityGoals from '../database/getSustainabilityGoals';
import getConnectionsSDGAndTBL from '../database/getConnectionsSDGAndTBL';
import getClassesByString from '../database/getClassesByString';
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

const getSustainabilityGoalsFromOntology = async (req, res) => {
  try {
    const data = await getSustainabilityGoals();
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

const regexSearch = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const limitResults = req.query.limit;
    console.log(searchTerm, limitResults);
    const data = await getClassesByString(searchTerm, limitResults);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

router.get('/relations/:classId', getRelationsFromClass);
router.get('/subclasses/:classId', getSubclassesFromClass);
router.get('/annotations/:classId', getAnnotationsFromClass);
router.get('/sustainabilityGoals', getSustainabilityGoalsFromOntology);
router.get('/contributions/:classId', getSDGTBLConnections);
router.get('/search', regexSearch);

export default router;
