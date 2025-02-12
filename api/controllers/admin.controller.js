import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const getDashboard = async (req, res, next) => {
    try {
        const users = await User.find({isAdmin:false}).select('-password'); 
        res.status(200).json(users);
    } catch (error) {
        next(errorHandler(500, 'Internal Server Error'));
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

export const blockUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.isBlocked = !user.isBlocked;
      await user.save();
      
      res.status(200).json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}` });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
  
  export const deleteUser = async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  };
