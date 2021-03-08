import { Router } from 'express';
import getSubclasses from '../database/getSubclasses';
import getRelations from '../database/getRelations';
import getAnnontations from '../database/getAnnontations';
import { ApiError } from '../types/types';

const router = Router();

const getRelationsFromClass = async (req, res) => {
  try {
    const data = await getRelations(req.params.classId);
    res.json(data);
  } catch (e) {
    const status = e instanceof ApiError ? e.statusCode : 500;
    console.log(e);
    res.status(status);
    res.json({ message: e.message });
  }
};

const getSubclassesFromClass = async (req, res) => {
  try {
    const data = await getSubclasses(req.params.classId);
    res.json(data);
  } catch (e) {
    const status = e instanceof ApiError ? e.statusCode : 500;
    console.log(e);
    res.status(status);
    res.json({ message: e.message });
  }
};

const getAnnontationsFromClass = async (req, res) => {
  try {
    const data = await getAnnontations(req.params.classId);
    res.json(data);
  } catch (e) {
    const status = e instanceof ApiError ? e.statusCode : 500;
    console.log(e);
    res.status(status);
    res.json({ message: e.message });
  }
};

router.get('/relations/:classId', getRelationsFromClass);
router.get('/subclasses/:classId', getSubclassesFromClass);
router.get('/annontations/:classId', getAnnontationsFromClass);

export default router;
