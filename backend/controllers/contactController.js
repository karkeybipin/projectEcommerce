import contactModel from '../models/contactModel.js';

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, address, queries } = req.body;

    // Validate required fields
    if (!name || !email || !queries) {
      return res.json({
        success: false,
        message: 'Name, email, and queries are required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Create new contact query
    const newContact = new contactModel({
      name,
      email,
      phone: phone || '',
      address: address || '',
      queries
    });

    await newContact.save();

    res.json({
      success: true,
      message: 'Your query has been submitted successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Error submitting contact:', error);
    res.json({
      success: false,
      message: 'Something went wrong while submitting your query. Please try again.'
    });
  }
};

// Get all contact queries (Admin only)
const listContacts = async (req, res) => {
  try {
    const contacts = await contactModel.find({}).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      queries: contacts
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.json({
      success: false,
      message: 'Failed to fetch queries'
    });
  }
};

// Get contact statistics (Admin only)
const getContactStats = async (req, res) => {
  try {
    const totalQueries = await contactModel.countDocuments();
    const todayQueries = await contactModel.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    res.json({
      success: true,
      stats: {
        totalQueries,
        todayQueries
      }
    });

  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

export { submitContact, listContacts, getContactStats };