#!/bin/bash
# Find the end positions of both useEffect blocks we need to modify
sed -i -e '/\/\/ EMERGENCY HANDLER: Listen for force open events/,/toggleChat\]\);/c\
  // EMERGENCY HANDLER: Listen for force open events\
  useEffect(() => {\
    const handleForceOpen = () => {\
      console.log("EMERGENCY: Received forceFundiOpen event");\
      setIsOpen(true);\
      // Force open chat if it is not already open\
      if (!isChatOpen) {\
        setIsChatOpen(true);\
      }\
      if (onRequestHelp) {\
        onRequestHelp(category);\
      }\
    };\
    \
    window.addEventListener("forceFundiOpen", handleForceOpen);\
    \
    return () => {\
      window.removeEventListener("forceFundiOpen", handleForceOpen);\
    };\
  }, [isOpen, isChatOpen, category, onRequestHelp]);' client/src/components/fundi-interactive-assistant.tsx

grep -A 5 "EMERGENCY HANDLER" client/src/components/fundi-interactive-assistant.tsx
