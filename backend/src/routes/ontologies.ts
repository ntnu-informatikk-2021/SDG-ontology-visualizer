import { Router } from 'express';
import getSubclasses from '../database/getSubclasses';
import getRelations from '../database/getRelations';
<<<<<<< HEAD
import getAnnontations from '../database/getAnnontations';
import { ApiError } from '../types/types';
=======
import onError from './middleware/onError';
>>>>>>> main

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
