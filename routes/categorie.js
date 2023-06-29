import express from 'express';

import { getAll, addOnce, getOnce, deleteOnce, updateOnce } from '../controllers/categorie.js';

const router = express.Router();


router.get('/:id', getAll);

router.get('/:id', getOnce);
router.post('/', addOnce);
router.delete('/:id', deleteOnce);
router.put('/:id', updateOnce);

export default router;