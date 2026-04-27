const router = require("express").Router();
const notification = require("../controllers/notification.controller");

router.get("/:userId", notification.getAll);
router.get("/unread/:userId", notification.getUnread);
router.post("/", notification.create);
router.put("/:notificationId/read", notification.markAsRead);
router.put("/read-all/:userId", notification.markAllAsRead);
router.delete("/:notificationId", notification.delete);

module.exports = router;