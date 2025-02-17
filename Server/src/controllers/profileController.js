import Profile from '../models/User.js';


export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
    if (!deletedProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


