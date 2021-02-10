import { Router } from 'express';
import ontologies from './ontologies';

const router = Router();

router.use('/ontologies', ontologies);

export default router;
