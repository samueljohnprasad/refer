import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '../store';
import { initAuth } from '@/store/authThunks';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!authState?.initialized) {
      dispatch(initAuth());
    }
  }, [authState?.initialized, dispatch]);

  // Debug log`
  useEffect(() => {
    console.log('[useAuth] full auth state:', authState);
  }, [authState]);

  return { user: authState?.user, initialized: authState?.initialized };
}
