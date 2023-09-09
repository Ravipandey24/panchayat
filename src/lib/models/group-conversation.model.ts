import mongoose from "mongoose";

const groupConversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: ''
  },
  participants: [
    {
      type: String,
      required: true,
    },
  ],
  creatorId: {
    type: String,
    required: true,
  },
  admins: [
    {
        type: String,
        required: true,
    },
  ],
  messages: [
    {
      senderId: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const GroupConversation =
  mongoose.models.GroupConversation ||
  mongoose.model("GroupConversation", groupConversationSchema);

export default GroupConversation;
