import UserSchema from '../models/user.mjs';

class UsersController {
  constructor(app, mongoose) {
    this.app = app;
    this.User = mongoose.model('User', UserSchema);
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.post('/user', this.createUser);
    this.app.get('/user/:userId', this.getUserById);
    this.app.delete('/user/:userId', this.deleteUserById);
  }

  createUser = async (req, res) => {
    try {
      const user = new this.User(req.body);
      const savedUser = await user.save();
      res.status(201).json(savedUser);
    } catch (err) {
      console.error(`[ERROR] POST /user -> ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  getUserById = async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await this.User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(`[ERROR] GET /user/${userId} -> ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  deleteUserById = async (req, res) => {
    const { userId } = req.params;
    try {
      const deletedUser = await this.User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted', user: deletedUser });
    } catch (err) {
      console.error(`[ERROR] DELETE /user/${userId} -> ${err}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}

export default UsersController;
