import { Router } from 'express';
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

router.get('/relations/:classId', getRelationsFromClass);

export default router;
