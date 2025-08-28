const validator = require('validator');

const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' });
  }

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  next();
};

const validateTrip = (req, res, next) => {
  const { title, startDate, endDate, destination } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Trip title is required' });
  }

  if (!startDate || !validator.isISO8601(startDate)) {
    return res.status(400).json({ error: 'Valid start date is required' });
  }

  if (!endDate || !validator.isISO8601(endDate)) {
    return res.status(400).json({ error: 'Valid end date is required' });
  }

  if (new Date(startDate) >= new Date(endDate)) {
    return res.status(400).json({ error: 'End date must be after start date' });
  }

  if (!destination || destination.trim().length === 0) {
    return res.status(400).json({ error: 'Destination is required' });
  }

  next();
};

const validatePlace = (req, res, next) => {
  const { name, latitude, longitude, category } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Place name is required' });
  }

  if (latitude === undefined || !validator.isFloat(latitude.toString(), { min: -90, max: 90 })) {
    return res.status(400).json({ error: 'Valid latitude is required' });
  }

  if (longitude === undefined || !validator.isFloat(longitude.toString(), { min: -180, max: 180 })) {
    return res.status(400).json({ error: 'Valid longitude is required' });
  }

  const validCategories = ['restaurant', 'attraction', 'hotel', 'activity', 'transport', 'other'];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateTrip,
  validatePlace
};