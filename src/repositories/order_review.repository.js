const db = require("../../config/db");

class OrderReviewRepository {
  async createReview(data) {
    const [id] = await db("order_reviews").insert(data);
    return id;
  }

  async getReviewByOrderId(orderId) {
    return db("order_reviews").where({ order_id: orderId }).first();
  }

  async updateStoreRating(storeId) {
    // Tính trung bình
    const result = await db("order_reviews")
      .where({ store_id: storeId })
      .avg("store_rating as avg_rating")
      .count("* as total_reviews")
      .first();

    const avgRating = result.avg_rating || 0;
    const totalReviews = result.total_reviews || 0;

    await db("stores").where({ id: storeId }).update({
      rating: parseFloat(avgRating).toFixed(1),
      rating_count: totalReviews
    });
  }

  async updateShipperRating(shipperId) {
    if (!shipperId) return;
    
    const result = await db("order_reviews")
      .where({ shipper_id: shipperId })
      .avg("shipper_rating as avg_rating")
      .count("* as total_reviews")
      .first();

    const avgRating = result.avg_rating || 0;
    const totalReviews = result.total_reviews || 0;

    await db("shippers").where({ id: shipperId }).update({
      rating: parseFloat(avgRating).toFixed(1),
      rating_count: totalReviews
    });
  }
}

module.exports = new OrderReviewRepository();
