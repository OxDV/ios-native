import { useState } from 'react';

export type TabName = 'list' | 'favorites' | 'settings';

export const useActiveTab = () => {
  const [activeTab, setActiveTab] = useState<TabName>('list');

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
  };

  return {
    activeTab,
    handleTabPress,
  };
}; 