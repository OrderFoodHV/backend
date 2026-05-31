/**
 * Tính khoảng cách chim bay giữa 2 tọa độ GPS bằng công thức Haversine
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Nhân hệ số 1.3 để ước lượng quãng đường bộ thực tế (vì đi đường có rẽ/cong)
  return parseFloat((distance * 1.3).toFixed(1));
}

/**
 * Tính khoảng cách đường bộ thực tế giữa 2 tọa độ GPS qua OSRM API (Miễn phí)
 */
async function getOSRMDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  try {
    // Định dạng OSRM: lon,lat;lon,lat
    const url = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    console.log(`🌐 [OSRM Call] Requesting distance from OSRM: ${url}`);
    
    // Sử dụng fetch gốc của Node.js v18+ (Không cần thư viện ngoài)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // timeout 3 giây

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.routes && data.routes.length > 0) {
        // OSRM trả về cự ly tính bằng Mét (meters), chia 1000 ra km
        const distanceInMeters = data.routes[0].distance;
        const distanceInKm = parseFloat((distanceInMeters / 1000).toFixed(1));
        console.log(`✅ [OSRM Success] Road distance: ${distanceInKm} km`);
        return distanceInKm;
      }
    }
  } catch (error) {
    console.warn(`⚠️ [OSRM Failed] OSRM API error: ${error.message}. Hướng xử lý: Tự động dùng công thức Haversine...`);
  }

  // Fallback về Haversine nếu mạng chậm hoặc lỗi
  return calculateHaversineDistance(lat1, lon1, lat2, lon2);
}

/**
 * Tự động chuyển đổi Địa chỉ (dạng chữ) sang Tọa độ (Vĩ độ, Kinh độ) qua Nominatim OpenStreetMap (Miễn phí)
 */
async function geocodeAddress(address) {
  if (!address) return null;

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    console.log(`🌐 [Geocoding Call] Nominatim request for address: ${address}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 giây timeout

    const response = await fetch(url, {
      headers: {
        "User-Agent": "FoodApp/1.0 (contact@foodapp.com)" // Nominatim bắt buộc khai báo User-Agent
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        console.log(`✅ [Geocoding Success] Coordinates found: ${lat}, ${lon}`);
        return { latitude: lat, longitude: lon };
      }
    }
  } catch (error) {
    console.warn(`⚠️ [Geocoding Failed] Geocoding Nominatim error: ${error.message}`);
  }

  return null;
}

module.exports = {
  calculateHaversineDistance,
  getOSRMDistance,
  geocodeAddress,
};
