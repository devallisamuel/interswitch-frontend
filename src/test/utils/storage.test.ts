import { storageUtils } from '../../utils/storage';
import type { Medication, VitalSigns } from '../../types';

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

describe('storageUtils', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('medications', () => {
    const mockMedications: Medication[] = [
      { id: '1', name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily' },
      { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    ];

    it('should get medications for user', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockMedications));

      const result = storageUtils.getMedications('testuser');

      expect(localStorageMock.getItem).toHaveBeenCalledWith('health-tracker-medications-testuser');
      expect(result).toEqual(mockMedications);
    });

    it('should return empty array when no medications stored', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = storageUtils.getMedications('testuser');

      expect(result).toEqual([]);
    });

    it('should handle invalid JSON when getting medications', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = storageUtils.getMedications('testuser');

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should save medications for user', () => {
      storageUtils.saveMedications('testuser', mockMedications);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'health-tracker-medications-testuser',
        JSON.stringify(mockMedications)
      );
    });

    it('should handle error when saving medications', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      storageUtils.saveMedications('testuser', mockMedications);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('vital signs', () => {
    const mockVitals: VitalSigns[] = [
      {
        id: '1',
        systolic: 120,
        diastolic: 80,
        heartRate: 70,
        weight: 150,
        timestamp: '2023-01-01T00:00:00.000Z',
      },
    ];

    it('should get vital signs for user', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVitals));

      const result = storageUtils.getVitalSigns('testuser');

      expect(localStorageMock.getItem).toHaveBeenCalledWith('health-tracker-vitals-testuser');
      expect(result).toEqual(mockVitals);
    });

    it('should return empty array when no vital signs stored', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = storageUtils.getVitalSigns('testuser');

      expect(result).toEqual([]);
    });

    it('should save vital signs for user', () => {
      storageUtils.saveVitalSigns('testuser', mockVitals);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'health-tracker-vitals-testuser',
        JSON.stringify(mockVitals)
      );
    });
  });

  describe('clearUserData', () => {
    it('should clear all user data', () => {
      storageUtils.clearUserData('testuser');

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('health-tracker-medications-testuser');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('health-tracker-vitals-testuser');
    });

    it('should handle error when clearing user data', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      storageUtils.clearUserData('testuser');

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
