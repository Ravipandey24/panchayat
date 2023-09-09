
interface User {
  name: string;
  email: string;
  image: string;
  profileId: mongoose.Schema.Types.ObjectId
  id: any;
}

interface UserProfile {
  _id: mongoose.Schema.Types.ObjectId;
  username: string;
  email: string;
  name: string;
  image: string;
  friends: mongoose.Schema.Types.ObjectId[];
  groups: mongoose.Schema.Types.ObjectId[];
}

interface Group {
  id: string;
  image: string;
  title: string;
}

interface Token {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
}

interface Chat {
  type: 'single' | 'group'
  currentUser: UserProfile
  partner: UserProfile | UserProfile[]
  conversation: Conversation | GroupConversation
}

interface Message {
  _id: mongoose.Schema.Types.ObjectId;
  senderId: string;
  text: string;
  timestamp: any;
}

interface FriendRequest {
  _id: mongoose.Schema.Types.ObjectId;
  senderId: string;
  receiverId: string;
  send: boolean;
}

interface Conversation {
  _id:  mongoose.Schema.Types.ObjectId;
  participants: mongoose.Schema.Types.ObjectId[]
  messages: Message[]
}

interface GroupConversation {
  _id:  mongoose.Schema.Types.ObjectId;
  name: string;
  participants: mongoose.Schema.Types.ObjectId[];
  creatorId:  mongoose.Schema.Types.ObjectId;
  admins: string[];
  messages: Message[];
}


type mongoID = mongoose.Schema.Types.ObjectId