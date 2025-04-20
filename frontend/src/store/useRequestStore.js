import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useRequestStore = create((set, get) => ({
  requestsFromMe: [],
  requestsFromUser: [],
  isRequestsLoading: false,
  isSendRequestsLoading: false,
  users: [],
  isUsersLoading: false,

  // GET: Friend requests sent by me
  fetchRequestsFromMe: async () => {
    try {
      set({ isRequestsLoading: true });
      const res = await axiosInstance.get("/request/from-me");
      set({ requestsFromMe: res.data });
    } catch (err) {
      toast.error("Failed to fetch requests from me");
      console.error("fetchRequestsFromMe error", err.message);
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  // GET: Friend requests received by me
  fetchRequestsFromUser: async () => {
    try {
      set({ isRequestsLoading: true });
      const res = await axiosInstance.get("/request/from-user");
      set({ requestsFromUser: res.data });
      console.log("Jalan fetch");
    } catch (err) {
      toast.error("Failed to fetch requests from others");
      console.error("fetchRequestsFromUser error", err.message);
    } finally {
      set({ isRequestsLoading: false });
    }
  },

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/request/friends");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // POST: Send friend request
  sendFriendRequest: async (receiverEmail) => {
    try {
      set({ isSendRequestsLoading: false });

      const res = await axiosInstance.post("/request", { receiverEmail });
      toast.success(res.data.msg);
      get().fetchRequestsFromMe();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send request");
      console.error("sendFriendRequest error", err.message);
    } finally {
      set({ isSendRequestsLoading: false });
    }
  },

  // POST: Accept friend request
  acceptFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.put("/request/accept", { requestId });
      toast.success(res.data.msg);
      get().fetchRequestsFromMe();
      get().fetchRequestsFromUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to accept request");
      console.error("acceptFriendRequest error", err.message);
    }
  },

  // POST: Reject friend request
  rejectFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.put("/request/reject", { requestId });
      toast.success(res.data.msg);
      get().fetchRequestsFromMe();
      get().fetchRequestsFromUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to reject request");
      console.error("rejectFriendRequest error", err.message);
    }
  },

  // DELETE: Cancel or delete request
  deleteFriendRequest: async (requestId) => {
    try {
      const res = await axiosInstance.delete(`/request/delete/${requestId}`);
      toast.success(res.data.msg);
      get().fetchRequestsFromMe();
      get().fetchRequestsFromUser();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete request");
      console.error("deleteFriendRequest error", err.message);
    }
  },

  subscribeToRequest: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    console.log("✅ Subscribed to socket request events");

    // Saat ada request masuk dari orang lain
    socket.on("requestReceived", (data) => {
      toast.success(`${data.sender.fullName} sent you a friend request`);
      get().fetchRequestsFromUser();
    });

    // Saat request kita diterima oleh orang lain
    socket.on("requestAccepted", (data) => {
      toast.success(`${data.receiverName} accepted your friend request`);
      get().fetchRequestsFromMe(); // refresh list pengirim
      get().getUsers(); // refresh daftar teman
    });

    // Saat request kita ditolak oleh orang lain
    socket.on("requestRejected", (data) => {
      toast(`${data.receiverName} rejected your friend request`, {
        icon: "❌",
      });
      get().fetchRequestsFromMe();
    });
  },

  unsubscribeToRequest: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("requestReceived");
      socket.off("requestAccepted");
      socket.off("requestRejected");
    }
  },
}));
