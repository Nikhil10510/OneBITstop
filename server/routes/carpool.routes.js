import express from 'express';
import {
  createCarpool,
  getAllCarpools,
  deleteCarpoolById
} from '../controllers/carpool.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Create a new carpool listing (requires authentication)
router.post('/createCarpool', isAuthenticated, createCarpool);

// Get all carpool listings (public)
router.get('/getAllCarpools', getAllCarpools);

// Delete a carpool listing by ID (requires authentication)
router.delete('/deleteCarpool/:id', isAuthenticated, deleteCarpoolById);

export default router;
