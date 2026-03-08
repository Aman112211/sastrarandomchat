/**
 * Browser Geolocation service
 */

export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

export function watchLocation(callback) {
  if (!navigator.geolocation) return null;
  const id = navigator.geolocation.watchPosition(
    (pos) =>
      callback({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      }),
    (err) => console.warn("Location watch error:", err),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
  return id;
}

export function clearLocationWatch(watchId) {
  if (watchId != null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
}
