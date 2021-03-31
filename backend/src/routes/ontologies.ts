import { Router } from 'express';
import getSubclasses from '../database/getSubclasses';
import getRelations from '../database/getRelations';
import getAnnotations from '../database/getAnnotations';
import getSustainabilityGoals from '../database/getSustainabilityGoals';
import getClassesByString from '../database/getClassesByString';
import getContributions from '../database/getContributions';
import getTradeOff from '../database/getTradeOffTil';
import getDevelopmentArea from '../database/getDevelopmentArea';
import getSubGoals from '../database/getSubGoals';
import onError from './middleware/onError';
import verifyDatabaseAccess from './middleware/verifyDatabaseAccess';

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

const getContributionsToNodes = async (req, res) => {
  try {
    const data = await getContributions(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const getTradeOffToNodes = async (req, res) => {
  try {
    const data = await getTradeOff(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const getDevelopmentAreaToNodes = async (req, res) => {
  try {
    const data = await getDevelopmentArea(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const getSubGoalsfromSDG = async (req, res) => {
  try {
    const data = await getSubGoals(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

const regexSearch = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const limitResults = req.query.limit;
    const data = await getClassesByString(searchTerm, limitResults);

    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

router.get('/relations/:classId', verifyDatabaseAccess, getRelationsFromClass);
router.get('/subclasses/:classId', verifyDatabaseAccess, getSubclassesFromClass);
router.get('/annotations/:classId', verifyDatabaseAccess, getAnnotationsFromClass);
router.get('/sustainabilityGoals', verifyDatabaseAccess, getSustainabilityGoalsFromOntology);
router.get('/search', verifyDatabaseAccess, regexSearch);
router.get('/contributions/:classId', verifyDatabaseAccess, getContributionsToNodes);
router.get('/tradeoff/:classId', verifyDatabaseAccess, getTradeOffToNodes);
router.get('/developmentarea/:classId', verifyDatabaseAccess, getDevelopmentAreaToNodes);
router.get('/subgoals/:classId', verifyDatabaseAccess, getSubGoalsfromSDG);

export default router;
