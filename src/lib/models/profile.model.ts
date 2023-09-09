import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: false,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/i, "Invalid email address"],
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
//   bio: String,
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
  ],
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Groups",
    },
  ],
});

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default Profile;
