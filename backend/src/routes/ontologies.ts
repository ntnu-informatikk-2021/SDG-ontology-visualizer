import { Router } from 'express';
import getSubclasses from '../database/getSubclasses';
import getRelations from '../database/getRelations';

const router = Router();

const getRelationsFromClass = async (req, res) => {
  try {
    const data = await getRelations(req.params.classId);
    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ message: e.message });
  }
};

const getSubclassesFromClass = async (req, res) => {
  try {
    const data = await getSubclasses(req.params.classId);
    res.json(data);
  } catch (e) {
    console.log(e);
    res.status(500);
    res.json({ message: e.message });
  }
};

router.get('/relations/:classId', getRelationsFromClass);
router.get('/subclasses/:classId', getSubclassesFromClass);

export default router;
