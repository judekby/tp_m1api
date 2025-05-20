import PhotoSchema from '../models/photo.mjs';
import AlbumSchema from '../models/album.mjs';

class PhotosController {
  constructor(app, mongoose) {
    this.app = app;
    this.Photo = mongoose.model('Photo', PhotoSchema);
    this.Album = mongoose.model('Album', AlbumSchema);
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.post('/album/:albumId/photo', this.createPhoto);
    this.app.get('/album/:albumId/photos', this.getPhotosByAlbum);
    this.app.get('/album/:albumId/photo/:photoId', this.getPhotoById);
    this.app.put('/album/:albumId/photo/:photoId', this.updatePhoto);
    this.app.delete('/album/:albumId/photo/:photoId', this.deletePhoto);
  }

  createPhoto = async (req, res) => {
    const { albumId } = req.params;
    try {
      const album = await this.Album.findById(albumId);
      if (!album) return res.status(404).json({ error: 'Album not found' });

      const photo = new this.Photo({ ...req.body, album: albumId });
      const savedPhoto = await photo.save();

      await this.Album.findByIdAndUpdate(albumId, { $push: { photos: savedPhoto._id } });

      res.status(201).json(savedPhoto);
    } catch (err) {
      console.error(`[ERROR] POST /album/${albumId}/photo -> ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getPhotosByAlbum = async (req, res) => {
    const { albumId } = req.params;
    try {
      const photos = await this.Photo.find({ album: albumId });
      res.status(200).json(photos || []);
    } catch (err) {
      console.error(`[ERROR] GET /album/${albumId}/photos -> ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getPhotoById = async (req, res) => {
    const { albumId, photoId } = req.params;
    try {
      const photo = await this.Photo.findOne({ _id: photoId, album: albumId }).populate('album');
      if (!photo) return res.status(404).json({ error: 'Photo not found in album' });

      res.status(200).json(photo);
    } catch (err) {
      console.error(`[ERROR] GET /album/${albumId}/photo/${photoId} -> ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  updatePhoto = async (req, res) => {
    const { albumId, photoId } = req.params;
    try {
      const album = await this.Album.findById(albumId);
      if (!album) return res.status(404).json({ error: 'Album not found' });

      const photo = await this.Photo.findOne({ _id: photoId, album: albumId });
      if (!photo) return res.status(404).json({ error: 'Photo not found in album' });

      const updated = await this.Photo.findByIdAndUpdate(photoId, req.body, {
        new: true,
        runValidators: true
      });

      res.status(200).json(updated);
    } catch (err) {
      console.error(`[ERROR] PUT /album/${albumId}/photo/${photoId} -> ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  deletePhoto = async (req, res) => {
    const { albumId, photoId } = req.params;
    try {
      const photo = await this.Photo.findOne({ _id: photoId, album: albumId });
      if (!photo) return res.status(404).json({ error: 'Photo not found in album' });

      await this.Photo.findByIdAndDelete(photoId);
      await this.Album.findByIdAndUpdate(albumId, { $pull: { photos: photoId } });

      res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (err) {
      console.error(`[ERROR] DELETE /album/${albumId}/photo/${photoId} -> ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default PhotosController;
