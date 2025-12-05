// Pagination utility
const paginate = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit))); // Max 50 items per page
  const skip = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    skip
  };
};

// Generate pagination metadata
const getPaginationMeta = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    currentPage: page,
    totalPages,
    totalItems,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

// Build search query for text search
const buildSearchQuery = (searchTerm, fields = []) => {
  if (!searchTerm || !fields.length) return {};
  
  const searchRegex = new RegExp(searchTerm, 'i');
  
  return {
    $or: fields.map(field => ({
      [field]: searchRegex
    }))
  };
};

// Build filter query
const buildFilterQuery = (filters = {}) => {
  const query = {};
  
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        query[key] = { $in: value };
      } else if (typeof value === 'string' && value.includes(',')) {
        query[key] = { $in: value.split(',').map(v => v.trim()) };
      } else {
        query[key] = value;
      }
    }
  });
  
  return query;
};

module.exports = {
  paginate,
  getPaginationMeta,
  buildSearchQuery,
  buildFilterQuery
};