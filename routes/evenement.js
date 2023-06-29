import express from 'express';

import { getAll, addOnce, getOnce, deleteOnce,updateOnce,getSearch,getTri,getTriCat,participate,unparticipate } from '../controllers/evenement.js';

const router = express.Router();


router.get('/', getAll);
router.get('/:id', getOnce);
router.post('/', addOnce);
router.delete('/:id', deleteOnce);
router.put('/:id', updateOnce);
router.post('/recherche', getSearch);
router.post('/tri', getTri);
router.post('/category/tri', getTriCat);
router.post('/participate', participate);
router.post('/unparticipate', unparticipate);


  
export default router;





