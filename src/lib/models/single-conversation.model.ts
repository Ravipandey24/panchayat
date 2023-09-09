import mongoose from "mongoose";

const singleConversationSchema = new mongoose.Schema({
  participants: [
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
  ] 
});

const SingleConversation =
  mongoose.models.SingleConversation || mongoose.model("SingleConversation", singleConversationSchema);

export default SingleConversation;
