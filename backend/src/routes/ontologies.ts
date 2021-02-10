import { Router } from 'express';
import getRelations from '../database/getRelations';

const router = Router();

const getRelationsFromClass = async (req, res) => {
  try {
    const data = await getRelations(req.params.className);
    res.json(data);
  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
};

router.get('/:className', getRelationsFromClass);

export default router;
