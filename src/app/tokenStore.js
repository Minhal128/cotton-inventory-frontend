const REFRESH_KEY = 'psa_refresh_token';

let accessToken = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (t) => { accessToken = t || null; };

export const getRefreshToken = () => {
  try { return localStorage.getItem(REFRESH_KEY); } catch { return null; }
};
export const setRefreshToken = (t) => {
  try {
    if (t) localStorage.setItem(REFRESH_KEY, t);
    else localStorage.removeItem(REFRESH_KEY);
  } catch {}
};
export const clearTokens = () => {
  accessToken = null;
  setRefreshToken(null);
};
