import { useState } from 'react';
import { Animated } from 'react-native';

export const useDrawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnimation = useState(new Animated.Value(-300))[0];

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -300 : 0;
    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  return { isDrawerOpen, drawerAnimation, toggleDrawer };
}; 