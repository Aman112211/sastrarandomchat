/**
 * Location service for Sastra University campus
 * Campus center: ~10.7626° N, 79.0193° E
 */

const SASTRA_CENTER = { lat: 10.7626, lng: 79.0193 };
const CAMPUS_RADIUS_KM = 2;

// Campus zones with approximate bounding boxes
const CAMPUS_ZONES = [
  {
    name: "Main Block",
    center: { lat: 10.7626, lng: 79.0193 },
    radius: 0.15,
  },
  {
    name: "Library",
    center: { lat: 10.7635, lng: 79.0185 },
    radius: 0.1,
  },
  {
    name: "Boys Hostel",
    center: { lat: 10.7610, lng: 79.0210 },
    radius: 0.2,
  },
  {
    name: "Girls Hostel",
    center: { lat: 10.7640, lng: 79.0175 },
    radius: 0.2,
  },
  {
    name: "Labs",
    center: { lat: 10.7618, lng: 79.0200 },
    radius: 0.12,
  },
  {
    name: "Cafeteria",
    center: { lat: 10.7622, lng: 79.0188 },
    radius: 0.08,
  },
  {
    name: "Sports Complex",
    center: { lat: 10.7600, lng: 79.0220 },
    radius: 0.2,
  },
];

/**
 * Calculate distance between two coordinates using the Haversine formula.
 * Returns distance in kilometers.
 */
function haversineDistance(coord1, coord2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Check if coordinates are within the Sastra campus radius.
 */
function isOnCampus(coords) {
  if (!coords || coords.lat == null || coords.lng == null) return false;
  const dist = haversineDistance(SASTRA_CENTER, coords);
  return dist <= CAMPUS_RADIUS_KM;
}

/**
 * Detect which campus zone a user is in.
 * Returns zone name or "Campus" as a fallback.
 */
function detectZone(coords) {
  if (!coords || coords.lat == null || coords.lng == null) return "Campus";
  let closest = null;
  let minDist = Infinity;
  for (const zone of CAMPUS_ZONES) {
    const dist = haversineDistance(zone.center, coords);
    if (dist <= zone.radius && dist < minDist) {
      minDist = dist;
      closest = zone.name;
    }
  }
  return closest || "Campus";
}

module.exports = { haversineDistance, isOnCampus, detectZone, SASTRA_CENTER, CAMPUS_RADIUS_KM };
