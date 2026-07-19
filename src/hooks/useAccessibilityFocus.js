import { useEffect } from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

export default function useAccessibilityFocus(
  targetRef,
  focusKey,
  { enabled = true, delayMs = 120 } = {},
) {
  useEffect(() => {
    if (!enabled) return undefined;

    let active = true;
    let timeoutId = null;

    AccessibilityInfo.isScreenReaderEnabled().then((screenReaderEnabled) => {
      if (!active || !screenReaderEnabled) return;

      timeoutId = setTimeout(() => {
        const nativeNode = findNodeHandle(targetRef.current);
        if (nativeNode) AccessibilityInfo.setAccessibilityFocus(nativeNode);
      }, delayMs);
    });

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delayMs, enabled, focusKey, targetRef]);
}
