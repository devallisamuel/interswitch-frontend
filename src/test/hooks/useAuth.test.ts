import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAuth', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with no user', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should load user from localStorage on mount', () => {
    const mockUser = { username: 'testuser' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should login user and save to localStorage', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('testuser');
    });

    expect(result.current.user).toEqual({ username: 'testuser' });
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'health-tracker-auth',
      JSON.stringify({ username: 'testuser' })
    );
  });

  it('should logout user and remove from localStorage', () => {
    const mockUser = { username: 'testuser' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('health-tracker-auth');
  });

  it('should handle invalid JSON in localStorage', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('health-tracker-auth');

    consoleSpy.mockRestore();
  });

  it('should trim username when logging in', () => {
    localStorageMock.getItem.mockReturnValue(null);
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('  testuser  ');
    });

    expect(result.current.user).toEqual({ username: 'testuser' });
  });
});
