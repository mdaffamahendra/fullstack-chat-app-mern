export const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}

export const isMoreThan15MinutesAgo = (isoTimeString) => {
    const targetTime = new Date(isoTimeString);
    const now = new Date();
    const diffInMinutes = (now - targetTime) / (1000 * 60);
    return diffInMinutes > 15;
  }