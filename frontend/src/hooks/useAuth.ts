import { useInternetIdentity } from './useInternetIdentity';

export function useAuth() {
  const { identity, loginStatus } = useInternetIdentity();

  return {
    isAuthenticated: !!identity,
    identity,
    loginStatus,
    isLoggingIn: loginStatus === 'logging-in',
    isInitializing: loginStatus === 'initializing',
  };
}
