import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  recieverId: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false
  }
});

const friendRequest = mongoose.models.friendRequest || mongoose.model("friendRequest", requestSchema);

export default friendRequest;
