import { useState, useEffect } from 'react';
import { GOOGLE_CLIENT_ID } from '../config.js';

export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('mi-carta-user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('mi-carta-user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('mi-carta-user');
    }
  }, [user]);

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        const payload = parseJwt(response.credential);
        setUser({
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
        });
        setShowOverlay(false);
      },
      auto_select: false,
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // silent — user can click the sign-in button
      }
    });
  }, []);

  function login() {
    setShowOverlay(true);
  }

  function logout() {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
  }

  return { user, login, logout, showOverlay, setShowOverlay };
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch {
    return {};
  }
}
