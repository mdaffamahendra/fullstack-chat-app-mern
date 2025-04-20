import { getReceiverSocketId, io } from "../lib/socket.js";
import Request from "../models/request.model.js";
import User from "../models/user.model.js";

export const postRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverEmail } = req.body;
    const receiver = await User.findOne({ email: receiverEmail });

    if (!receiver) return res.status(404).json({ msg: "User not found" });
    if (receiver._id.equals(senderId)) {
      return res.status(400).json({ msg: "Cant send to own email" });
    }
    if (receiver.friends.includes(senderId)) {
      return res.status(400).json({
        msg: "This user is already your friend",
      });
    }

    console.log("Receiver ID", receiver._id);
    console.log("sender Id", senderId);

    const existingRequest = await Request.findOne({
      $or: [
        { sender: senderId, receiver: receiver._id },
        { sender: receiver._id, receiver: senderId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        msg: "Friend request already exists or you are already friends",
      });
    }

    const newRequest = new Request({
      sender: senderId,
      receiver: receiver._id,
      status: "pending",
    });
    await newRequest.save();

    const populatedRequest = await newRequest.populate(
      "sender",
      "fullName email profilePic"
    );

    const receiverSocketId = getReceiverSocketId(receiver._id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("requestReceived", populatedRequest);
    }

    res.status(200).json({ msg: "Friend request sent" });
  } catch (error) {
    console.log("Error in postRequest controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await Request.findById(requestId)
      .populate("sender", "fullName email profilePic")
      .populate("receiver", "fullName email profilePic");
    if (!request || request.status !== "pending") {
      return res.status(400).json({ msg: "Invalid request" });
    }

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.receiver },
    });

    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { friends: request.sender },
    });

    const senderSocketId = getReceiverSocketId(request.sender._id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("requestAccepted", {
        requestId: request._id,
        receiverId: request.receiver._id,
        receiverName: request.receiver.fullName,
      });
    }

    console.log("SENDER DELETE", senderSocketId);
    res.status(200).json({ msg: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptRequest controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await Request.findById(requestId)
      .populate("sender", "fullName email profilePic")
      .populate("receiver", "fullName email profilePic");
    if (!request) return res.status(404).json({ msg: "Request not found" });

    request.status = "rejected";
    await request.save();

    const senderSocketId = getReceiverSocketId(request.sender._id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("requestRejected", {
        requestId: request._id,
        receiverId: request.receiver._id,
        receiverName: request.receiver.fullName,
      });
    }
    console.log("SENDER DELETE", senderSocketId);
    res.status(200).json({ msg: "Request rejected" });
  } catch (error) {
    console.log("Error in rejectRequest controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all friend requests sent by me (sender)
export const getRequestFromMe = async (req, res) => {
  try {
    const senderId = req.user._id;

    const sentRequests = await Request.find({ sender: senderId })
      .populate("receiver", "fullName email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(sentRequests);
  } catch (error) {
    console.log("Error in getRequestFromMe controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all friend requests received by me (receiver)
export const getRequestFromUser = async (req, res) => {
  try {
    const receiverId = req.user._id;

    const receivedRequests = await Request.find({
      receiver: receiverId,
      status: "pending",
    })
      .populate("sender", "fullName email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(receivedRequests);
  } catch (error) {
    console.log("Error in getRequestFromUser controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await Request.findById(requestId);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    // Hanya pengirim atau penerima yang boleh hapus
    if (!request.sender.equals(userId) && !request.receiver.equals(userId)) {
      return res
        .status(403)
        .json({ msg: "Not authorized to delete this request" });
    }

    await Request.findByIdAndDelete(requestId);

    res.status(200).json({ msg: "Request deleted" });
  } catch (error) {
    console.log("Error in deleteRequest controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "friends",
      "fullName email profilePic"
    );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getFriends controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
