import express from 'express';
import {
  getAll,
  add,
  deleteById,
  updateById,
  getById,
  getByUser,
  getByType,
  getByDate
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAll);
router.post('/', add);
router.delete('/:id', deleteById);
router.put('/:id', updateById);
router.get('/:id', getById);
router.get('/user/:id', getByUser);
router.get('/type/:type', getByType);
router.get('/date/:date', getByDate);

export default router;
