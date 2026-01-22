import { useState, useCallback } from "react";

export type TabId = "content" | "design" | "placement";

interface UseTimerTabsProps {
  initialTab?: TabId;
  onTabChange?: (tabId: TabId) => void;
}

export function useTimerTabs({
  initialTab = "content",
  onTabChange
}: UseTimerTabsProps = {}) {
  const [selectedTab, setSelectedTab] = useState<number>(
    initialTab === "content" ? 0 : initialTab === "design" ? 1 : 2
  );

  const handleTabChange = useCallback((selected: number) => {
    setSelectedTab(selected);

    // Convert index to tab ID
    const tabId: TabId = selected === 0 ? "content" : selected === 1 ? "design" : "placement";
    onTabChange?.(tabId);
  }, [onTabChange]);

  const goToNextTab = useCallback(() => {
    setSelectedTab((prev) => Math.min(prev + 1, 2));
  }, []);

  const goToPreviousTab = useCallback(() => {
    setSelectedTab((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToTab = useCallback((tabId: TabId) => {
    const index = tabId === "content" ? 0 : tabId === "design" ? 1 : 2;
    setSelectedTab(index);
    onTabChange?.(tabId);
  }, [onTabChange]);

  const isFirstTab = selectedTab === 0;
  const isLastTab = selectedTab === 2;

  const currentTabId: TabId =
    selectedTab === 0 ? "content" :
    selectedTab === 1 ? "design" :
    "placement";

  return {
    selectedTab,
    currentTabId,
    handleTabChange,
    goToNextTab,
    goToPreviousTab,
    goToTab,
    isFirstTab,
    isLastTab,
  };
}
