import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import API from '../services/api';
import AuthContext from './AuthContext';

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const saveAuthData = useCallback(
    (token, userData) => {
      localStorage.setItem(
        'token',
        token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(userData)
      );

      setUser(userData);
    },
    []
  );

  const login = useCallback(
    async (credentials) => {
      const response =
        await API.auth.login(
          credentials
        );

      const userData =
        response.data.user;

      saveAuthData(
        response.data.token,
        userData
      );

      return userData;
    },
    [saveAuthData]
  );

  const register = useCallback(
    async (userData) => {
      const response =
        await API.auth.register(
          userData
        );

      const registeredUser =
        response.data.user;

      saveAuthData(
        response.data.token,
        registeredUser
      );

      return registeredUser;
    },
    [saveAuthData]
  );

  const logout = useCallback(
    async () => {
      try {
        if (
          localStorage.getItem('token')
        ) {
          await API.auth.logout();
        }
      } catch {
        // Local session cleanup continues
        // even if the API request fails.
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
      }
    },
    []
  );

  useEffect(() => {
    const restoreSession = async () => {
      const token =
        localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await API.auth.me();

        const userData =
          response.data.user;

        setUser(userData);

        localStorage.setItem(
          'user',
          JSON.stringify(userData)
        );
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated:
        Boolean(user),
      login,
      register,
      logout
    }),
    [
      user,
      loading,
      login,
      register,
      logout
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;