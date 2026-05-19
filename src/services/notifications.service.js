const notiRepo = require("../repositories/notifications.repository");

exports.getUserNotifications = async (userId) => {
  return await notiRepo.getNotificationsByUserId(userId);
};

exports.readAllNotifications = async (userId) => {
  return await notiRepo.markAsReadRepository(userId);
};
