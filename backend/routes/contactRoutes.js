import express from 'express';
import { submitContact, listContacts, getContactStats } from '../controllers/contactController.js';
import adminAuth from '../middleware/adminAuth.js';

const contactRouter = express.Router();

// Submit contact form (Public route)
contactRouter.post('/submit', submitContact);

// Get all contact queries (Admin only)
contactRouter.get('/list', adminAuth, listContacts);

// Get contact statistics (Admin only)
contactRouter.get('/stats', adminAuth, getContactStats);

export default contactRouter;