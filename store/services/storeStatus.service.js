const repo = require("../repositories/storeStatus.repo");

exports.getStoreStatus = (store) => {
  return {
    id: store.id,
    name: store.name,
    is_open: store.is_open,
    status: store.status,
  };
};

exports.toggleStoreStatus = async (store) => {
  const newStatus = store.is_open ? 0 : 1;
  await repo.updateStoreStatus(store.id, newStatus);
  return newStatus ? "Cửa hàng đã MỞ CỬA" : "Cửa hàng đã ĐÓNG CỬA";
};
