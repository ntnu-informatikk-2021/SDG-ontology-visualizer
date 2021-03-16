import { Router } from 'express';
import getDescription from '../database/getDescription';
import getSubclasses from '../database/getSubclasses';
import getRelations from '../database/getRelations';
import getannotations from '../database/getannotations';
import { ApiError } from '../types/types';
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

const getannotationsFromClass = async (req, res) => {
  try {
    const data = await getannotations(req.params.classId);
    res.json(data);
  } catch (e) {
    const status = e instanceof ApiError ? e.statusCode : 500;
    console.log(e);
    res.status(status);
    res.json({ message: e.message });
 
const getDescriptionFromClass = async (req, res) => {
  try {
    const data = await getDescription(req.params.classId);
    res.json(data);
  } catch (e) {
    onError(e, req, res);
  }
};

router.get('/relations/:classId', getRelationsFromClass);
router.get('/subclasses/:classId', getSubclassesFromClass);
router.get('/annotations/:classId', getannotationsFromClass);
router.get('/description/:classId', getDescriptionFromClass);


export default router;
