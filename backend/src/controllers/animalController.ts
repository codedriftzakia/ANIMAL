import { Request, Response } from 'express';
import Animal from '../models/Animal';
import Feedback from '../models/Feedback';
import { recalculateAnimalWelfare } from '../services/welfareLogic';

// GET /api/animals
export async function getAnimals(req: Request, res: Response) {
  try {
    const { species, habitat, careTier, search } = req.query;
    const query: any = {};

    if (species && species !== 'All') query.species = species;
    if (habitat && habitat !== 'All') query.habitat = habitat;
    if (careTier && careTier !== 'All') query.careTier = careTier;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { species: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
      ];
    }

    const animals = await Animal.find(query).sort({ updatedAt: -1 });
    res.json({ success: true, count: animals.length, data: animals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET /api/animals/:id
export async function getAnimalById(req: Request, res: Response) {
  try {
    const animalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }

    const feedbacks = await Feedback.find({ animalId: animal._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: { ...animal.toObject(), feedbacks } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/animals
export async function createAnimal(req: Request, res: Response) {
  try {
    const animal = new Animal(req.body);
    await animal.save();
    res.status(201).json({ success: true, data: animal });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// PUT /api/animals/:id
export async function updateAnimal(req: Request, res: Response) {
  try {
    const animalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const animal = await Animal.findByIdAndUpdate(animalId, req.body, { new: true, runValidators: true });
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }
    res.json({ success: true, data: animal });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// DELETE /api/animals/:id
export async function deleteAnimal(req: Request, res: Response) {
  try {
    const animalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const animal = await Animal.findByIdAndDelete(animalId);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }
    await Feedback.deleteMany({ animalId });
    res.json({ success: true, message: 'Animal and associated feedback deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// POST /api/animals/:id/recalculate
export async function triggerWelfareRecalculate(req: Request, res: Response) {
  try {
    const animalId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await recalculateAnimalWelfare(animalId);
    const animal = await Animal.findById(animalId);
    res.json({ success: true, data: animal });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
