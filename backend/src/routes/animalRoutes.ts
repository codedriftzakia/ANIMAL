import { Router } from 'express';
import {
  getAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  triggerWelfareRecalculate,
} from '../controllers/animalController';

const router = Router();

router.get('/', getAnimals);
router.get('/:id', getAnimalById);
router.post('/', createAnimal);
router.put('/:id', updateAnimal);
router.delete('/:id', deleteAnimal);
router.post('/:id/recalculate', triggerWelfareRecalculate);

export default router;
