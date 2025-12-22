import express from 'express';
import {
  createListing,
  getAllListings,
  deleteListingById
} from '../controllers/sellbuy.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Public: Get all listings
router.get('/getAllListings', getAllListings);

// Protected: Create new listing (must be authenticated)
router.post('/createListing', isAuthenticated, createListing);

// Protected: Delete listing by ID (must be authenticated)
router.delete('/deleteListing/:id', isAuthenticated, deleteListingById);

export default router;
