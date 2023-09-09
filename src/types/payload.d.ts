interface sendFriendRequest {
    email: string
}

interface respondFriendRequest{
    action: 'accept' | 'decline'
    requesterId: mongoose.Schema.Types.ObjectId
} 

