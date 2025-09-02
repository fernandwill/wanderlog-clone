const { Photo, Trip } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo file provided' });
    }

    const { tripId, caption } = req.body;
    
    // Verify the trip belongs to the user
    const trip = await Trip.findOne({
      where: { 
        id: tripId,
        userId: req.userId
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const photo = await Photo.create({
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      caption: caption || null,
      mimeType: req.file.mimetype,
      size: req.file.size,
      tripId: tripId,
      uploadedBy: req.userId
    });

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTripPhotos = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    // Verify the trip belongs to the user or is public
    const trip = await Trip.findOne({
      where: { 
        id: tripId,
        [Op.or]: [
          { userId: req.userId },
          { isPublic: true }
        ]
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    const photos = await Photo.findAll({
      where: { tripId },
      order: [['createdAt', 'DESC']]
    });

    res.json({ photos });
  } catch (error) {
    console.error('Get trip photos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    
    const photo = await Photo.findOne({
      where: { 
        id,
        uploadedBy: req.userId
      },
      include: [{
        model: Trip,
        as: 'trip'
      }]
    });

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    // Delete the file from disk
    try {
      const filePath = path.join(__dirname, '..', 'uploads', photo.filename);
      await fs.unlink(filePath);
    } catch (fileError) {
      console.error('Error deleting photo file:', fileError);
    }

    await photo.destroy();

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  uploadPhoto,
  getTripPhotos,
  deletePhoto
};