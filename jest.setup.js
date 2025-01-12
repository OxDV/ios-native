import '@testing-library/jest-native/extend-expect';

// Mock для Expo Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock для AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock для Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
})); 