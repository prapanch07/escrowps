const Message = require('../models/MessageModel');
const ChatRoom = require('../models/ChatRoommodel');

const User = require('../models/user');

exports.createMessage = async(req, res, next) => {
    const content = req.body.content
    const user_id = req.body.userId
    const receiverId = req.body.receiverId
    try {
        let room = await ChatRoom. findOne({
            participants: { $all: [user_id, receiverId]}
        });
        
        if (!room) {
            room = new ChatRoom ({
                participants: [user_id, receiverId]
            });
        }
        room.updatedAt = Date.now();
        await room.save();

        const message = new Message({
            content: content,
            sender: user_id,
            receiver:receiverId,
            room: room._id
        });
        await message.save();
        res.status(201).json({ message: 'Message created successfully', data: message });
    } catch (error) {
        console.log("Error Creating message", error);
        res.status(500).json({error:'internal Server Error'});
    }

};

exports.fetchMessages = async (req, res) => {
    const { userId, receiverId } =req.query;
    try {
        const chatRoom = await ChatRoom.findOne({
            participants: { $all: [userId, receiverId] }
        });
        if (!chatRoom) {
            return res.status(200).json({messages:'no_chat'});
        }
        const messages = await Message.find({ room:chatRoom._id })
        .populate('sender', 'username createdAt')
        .sort({createdAt:1});
        res.status(200).json({messages});
    } catch (error) {
        console.error("Error feching messages: ", error);
        res.status(500).json({error:'internal server Error'});
    }
};

exports.fetchConversation = async (req, res) => {
    const userId = req.query.userId;
    try {
        const rooms = await ChatRoom.find({ participants: userId })
            .populate('participants', 'username _id').sort({updatedAt:-1});
        const otherParticipants = rooms.flatMap(room => {
            return room.participants.filter(participant => participant._id.toString() !== userId);
        });

        res.json(otherParticipants);
    } catch (error) {
        console.error("Error fetching rooms", error);
    }
}