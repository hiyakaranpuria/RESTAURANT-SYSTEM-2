/**
 * Navigation utility functions for QR-based menu access only
 */

/**
 * Get the QR menu URL
 * @returns {string} - The QR menu URL or home if no QR slug
 */
export const getMenuUrl = () => {
  const qrSlug = sessionStorage.getItem("qrSlug");

  if (qrSlug) {
    return `/t/${qrSlug}`;
  }

  return "/"; // Redirect to home if no QR slug
};

/**
 * Navigate back to the QR menu
 * @param {function} navigate - React Router navigate function
 */
export const navigateToMenu = (navigate) => {
  const url = getMenuUrl();
  navigate(url);
};

/**
 * Set the entry point when user accesses via QR code
 * @param {string} qrSlug - The QR slug
 */
export const setQREntryPoint = (qrSlug) => {
  sessionStorage.setItem("entryPoint", "qr");
  sessionStorage.setItem("qrSlug", qrSlug);
};

/**
 * Clear entry point data (e.g., on logout)
 */
export const clearEntryPoint = () => {
  sessionStorage.removeItem("entryPoint");
  sessionStorage.removeItem("qrSlug");
};

/**
 * Get the current QR slug
 * @returns {string|null} - The QR slug or null
 */
export const getQRSlug = () => {
  return sessionStorage.getItem("qrSlug");
};
