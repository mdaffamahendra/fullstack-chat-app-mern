import Notification from "../models/notifications.model.js";

export const getNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const notifications = await Notification.find({
      userId,
      isRead: false,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to get notifications" });
  }
};

export const clearNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { senderId } = req.params;

    await Notification.deleteMany({ userId, senderId });

    res.status(200).json({ message: "Notifications cleared." });
  } catch (error) {
    console.log("Error in clearNotifications", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
