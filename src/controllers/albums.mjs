import AlbumSchema from '../models/album.mjs';

class AlbumsController {
  constructor(app, mongoose) {
    this.app = app;
    this.Album = mongoose.model('Album', AlbumSchema);
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.post('/album/', this.createAlbum);
    this.app.get('/album/:id', this.getAlbumById);
    this.app.delete('/album/:id', this.deleteAlbumById);
    this.app.put('/album/:id', this.updateAlbumById);
    this.app.get('/albums/', this.searchAlbums);
  }

  createAlbum = async (req, res) => {
    try {
      const album = new this.Album(req.body);
      const saved = await album.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error(`[CREATE ERROR] /album -> ${err}`);
      res.status(400).json({ code: 400, message: 'Bad request' });
    }
  };

  getAlbumById = async (req, res) => {
    try {
      const album = await this.Album.findById(req.params.id).populate('photos');
      res.status(200).json(album || {});
    } catch (err) {
      console.error(`[FETCH ERROR] /album/${req.params.id} -> ${err}`);
      res.status(400).json({ code: 400, message: 'Bad request' });
    }
  };

  deleteAlbumById = async (req, res) => {
    try {
      const result = await this.Album.findByIdAndDelete(req.params.id);
      res.status(200).json(result || {});
    } catch (err) {
      console.error(`[DELETE ERROR] /album/${req.params.id} -> ${err}`);
      res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
  };

  updateAlbumById = async (req, res) => {
    try {
      const updated = await this.Album.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!updated) {
        return res.status(404).json({ error: 'Album not found' });
      }
      res.status(200).json(updated);
    } catch (err) {
      console.error(`[UPDATE ERROR] /album/${req.params.id} -> ${err}`);
      res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
  };

  searchAlbums = async (req, res) => {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    try {
      const results = await this.Album.find({ title: new RegExp(title, 'i') }).populate('photos');
      if (!results.length) {
        return res.status(404).json({ error: 'No items found matching the title' });
      }
      res.status(200).json(results);
    } catch (err) {
      console.error(`[SEARCH ERROR] /albums?title=${title} -> ${err}`);
      res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
  };
}

export default AlbumsController;
