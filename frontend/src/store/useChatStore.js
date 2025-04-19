import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import showMessageNotification from "../components/ToastNotificationsChat.jsx";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: true,
  isDeleteMessageLoading: true,
  isEditMessageLoading: true,
  editMessageAction: false,
  messageId: null,
  notifications: {}, // key = userId pengirim, value = jumlah pesan

  incrementNotif: (fromUserId) => {
    set((state) => ({
      notifications: {
        ...state.notifications,
        [fromUserId]: (state.notifications[fromUserId] || 0) + 1,
      },
    }));

    console.log(get().notifications);
  },

  fetchNotifications: async () => {
    try {
      const res = await axiosInstance.get("/notifications");
      const notifMap = {};
      console.log("fetchNotifications", res.data);
      console.log(get().notifications);

      res.data.forEach((notif) => {
        const senderId = notif.senderId;
        notifMap[senderId] = (notifMap[senderId] || 0) + 1;
      });

      set({ notifications: notifMap });
    } catch (err) {
      console.log("Error fetching notifs", err);
    }
  },

  clearNotif: async (fromUserId) => {
    const { selectedUser } = get();

    try {
      await axiosInstance.delete(`/notifications/clear/${selectedUser._id}`);
      set((state) => {
        const newNotifs = { ...state.notifications };
        delete newNotifs[fromUserId];
        return { notifications: newNotifs };
      });
      console.log("notif", get().notifications);
      console.log("Kehapus semua notifnya");
    } catch (err) {
      console.log("Gagal mark notif as read:", err);
    }
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  deleteMessages: async (messageId) => {
    const { messages } = get();
    set({ isDeleteMessageLoading: true });
    try {
      const res = await axiosInstance.delete(`/messages/delete/${messageId}`);
      const updateMessages = messages.filter(
        (message) => message._id !== res.data.id
      );

      set({ messages: updateMessages });
      toast.success("Chat deleted!");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isDeleteMessageLoading: false });
    }
  },

  updateMessage: async (messageId, messageData) => {
    const { messages } = get();
    set({ isEditMessageLoading: true });
    try {
      const res = await axiosInstance.put(
        `/messages/edit/${messageId}`,
        messageData
      );

      const updatedMessages = messages.map((message) =>
        message._id === messageId ? res.data : message
      );

      set({ messages: updatedMessages });
      toast.success("Chat updated!");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isEditMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeNotifications: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newNotifications", (populatedNotif) => {
      console.log("selectedUser:", get().selectedUser?._id);
      console.log("populateNotif", populatedNotif);

      if (populatedNotif.senderId._id !== get().selectedUser?._id) {
        console.log("should call incrementNotif()");
        get().incrementNotif(populatedNotif.senderId._id);
        showMessageNotification(populatedNotif, get().setSelectedUser);
      }
    });
  },

  unsubscribeToNotif: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newNotif");
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;

      set({ messages: [...get().messages, newMessage] });
    });

    socket.on("deletedMessage", (id) => {
      if (!id) return;
      const updateMessages = get().messages.filter(
        (message) => message._id !== id
      );

      set({ messages: updateMessages });
    });

    socket.on("updatedMessage", (newMessage) => {
      const updatedMessages = get().messages.map((msg) =>
        msg._id === newMessage._id ? newMessage : msg
      );
      set({ messages: updatedMessages });
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: async (selectedUser) => {
    set({ selectedUser });
    
  },
  handleCloseChat : () => {
    const currentUserId = get().selectedUser?._id;
  
    if (currentUserId) {
      get().clearNotif(currentUserId);
    }
  
    get().setSelectedUser(null);
  },
  setMessageId: (messageId) => set({ messageId }),
  setEditMessageActive: () =>
    set({ editMessageAction: !get().editMessageAction }),
}));
