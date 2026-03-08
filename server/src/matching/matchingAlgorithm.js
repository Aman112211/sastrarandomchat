/**
 * Matching algorithm for Sastra Random Chat
 * Manages a waiting queue and pairs users based on proximity or randomly.
 */

const { haversineDistance, detectZone } = require("./locationService");

// waitingQueue: Map<socketId, { socketId, coords, joinedAt }>
const waitingQueue = new Map();

/**
 * Add a user to the waiting queue.
 */
function addToQueue(socketId, coords) {
  waitingQueue.set(socketId, { socketId, coords, joinedAt: Date.now() });
}

/**
 * Remove a user from the waiting queue.
 */
function removeFromQueue(socketId) {
  waitingQueue.delete(socketId);
}

/**
 * Find the best match for a given user.
 * Strategy:
 *  1. Prefer users within 500 m.
 *  2. Fall back to anyone within campus radius (2 km).
 *  3. Fall back to any waiting user (no location data).
 * Returns the matched user entry or null.
 */
function findMatch(socketId, coords) {
  const candidates = [...waitingQueue.values()].filter(
    (u) => u.socketId !== socketId
  );

  if (candidates.length === 0) return null;

  // If the searching user has coords, try proximity-based matching first
  if (coords && coords.lat != null && coords.lng != null) {
    // Sort by distance ascending
    const withDist = candidates
      .map((u) => ({
        ...u,
        dist:
          u.coords && u.coords.lat != null
            ? haversineDistance(coords, u.coords)
            : Infinity,
      }))
      .sort((a, b) => a.dist - b.dist);

    // Prefer within 500 m
    const nearby = withDist.find((u) => u.dist <= 0.5);
    if (nearby) return nearby;

    // Fall back to within campus (2 km)
    const onCampus = withDist.find((u) => u.dist <= 2);
    if (onCampus) return onCampus;
  }

  // Random pick from remaining candidates
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx];
}

/**
 * Attempt to match a user.
 * Returns { matched: true, partner } or { matched: false }.
 */
function tryMatch(socketId, coords) {
  const partner = findMatch(socketId, coords);
  if (!partner) return { matched: false };

  // Remove both from queue
  removeFromQueue(socketId);
  removeFromQueue(partner.socketId);

  return {
    matched: true,
    partner,
    zone: detectZone(coords),
    partnerZone: detectZone(partner.coords),
  };
}

/**
 * Get queue length (excluding a specific socket id).
 */
function getQueueLength(excludeSocketId) {
  let count = 0;
  for (const id of waitingQueue.keys()) {
    if (id !== excludeSocketId) count++;
  }
  return count;
}

module.exports = { addToQueue, removeFromQueue, tryMatch, getQueueLength };
