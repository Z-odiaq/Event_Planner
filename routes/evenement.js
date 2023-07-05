import express from 'express';
import {
  getAll,
  getAllByCat,
  getAllByUser,
  add,
  deleteById,
  update,
  getById,
  getByName,
  getByDate,
  getSearch,
  getTri,
  participate,
  unparticipate
} from '../controllers/evenementController.js';

const router = express.Router();

router.get('/search', getSearch);
router.get('/', getAll);
router.get('/category/:id', getAllByCat);
router.get('/user/:id', getAllByUser);
router.post('/', add);
router.delete('/:id', deleteById);
router.get('/sort', getTri);
router.put('/:id', update);
router.get('/:id', getById);
router.get('/name/:name', getByName);
router.get('/date/:date', getByDate);
router.post('/participate', participate);
router.post('/unparticipate', unparticipate);

export default router;
