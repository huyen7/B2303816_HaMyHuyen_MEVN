const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ 
        message: 'Validation error',
        error: errorMessage 
      });
    }
    
    next();
  };
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(128).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  updateProfile: Joi.object({
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    email: Joi.string().email().lowercase()
  })
};

// Book validation schemas
const bookSchemas = {
  create: Joi.object({
    title: Joi.string().trim().min(1).max(200).required(),
    author: Joi.string().trim().min(1).max(100).required(),
    isbn: Joi.string().trim().optional(),
    description: Joi.string().trim().max(1000).optional(),
    category: Joi.string().hex().length(24).required(),
    totalCopies: Joi.number().integer().min(1).max(1000).required(),
    availableCopies: Joi.number().integer().min(0).optional(),
    publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).optional(),
    tags: Joi.array().items(Joi.string().trim().max(30)).optional()
  }),
  
  update: Joi.object({
    title: Joi.string().trim().min(1).max(200),
    author: Joi.string().trim().min(1).max(100),
    isbn: Joi.string().trim(),
    description: Joi.string().trim().max(1000),
    category: Joi.string().hex().length(24),
    totalCopies: Joi.number().integer().min(1).max(1000),
    availableCopies: Joi.number().integer().min(0),
    publishedYear: Joi.number().integer().min(1000).max(new Date().getFullYear()),
    tags: Joi.array().items(Joi.string().trim().max(30)),
    isActive: Joi.boolean()
  })
};

// Category validation schemas
const categorySchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(1).max(50).required(),
    description: Joi.string().trim().max(200).optional()
  }),
  
  update: Joi.object({
    name: Joi.string().trim().min(1).max(50),
    description: Joi.string().trim().max(200),
    isActive: Joi.boolean()
  })
};

// Borrowing request validation schemas
const borrowingSchemas = {
  request: Joi.object({
    bookId: Joi.string().hex().length(24).required()
  }),
  
  approve: Joi.object({
    borrowingPeriodDays: Joi.number().integer().min(1).max(90).default(14),
    adminNotes: Joi.string().trim().max(500).optional()
  }),
  
  reject: Joi.object({
    adminNotes: Joi.string().trim().max(500).required()
  })
};

module.exports = {
  validate,
  userSchemas,
  bookSchemas,
  categorySchemas,
  borrowingSchemas
};