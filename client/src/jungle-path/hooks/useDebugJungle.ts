import { useJungleTheme } from '../contexts/JungleThemeContext';
import { useJungleFundi } from '../contexts/JungleFundiContext';
import { getZoneByCategory } from '../utils/zoneUtils';

/**
 * Debug hook for testing Jungle Theme functionality during development
 * This hook provides convenience methods for manipulating jungle state
 * without needing to go through the normal progression.
 */
export const useDebugJungle = () => {
  const { 
    enableJungleTheme, 
    disableJungleTheme, 
    updateJungleProgress, 
    jungleProgress,
    addXP
  } = useJungleTheme();
  
  const { sendJungleMessage } = useJungleFundi();

  // Set a specific XP amount
  const setXP = (amount: number) => {
    if (amount < 0) {
      console.warn('Debug: Cannot set negative XP');
      return;
    }
    
    // Calculate the rank based on XP
    const rank = Math.floor(amount / 100);
    
    updateJungleProgress({
      xp: amount,
      rank
    });
    
    console.log(`Debug: Set XP to ${amount} (Rank: ${rank})`);
  };
  
  // Unlock a specific zone by its category
  const unlockZone = (category: string) => {
    const zone = getZoneByCategory(category);
    
    if (!zone) {
      console.warn(`Debug: No zone found for category "${category}"`);
      return;
    }
    
    // Ensure the user has enough XP for the zone's required rank
    const requiredXP = zone.requiredRank * 100;
    if (jungleProgress.xp < requiredXP) {
      updateJungleProgress({
        xp: requiredXP
      });
    }
    
    // Set the last zone visited
    updateJungleProgress({
      lastZoneId: zone.id
    });
    
    console.log(`Debug: Unlocked zone "${zone.name}" (ID: ${zone.id})`);
  };
  
  // Preview a Fundi message
  const previewFundiMessage = (message: string) => {
    // Enable jungle theme if not already enabled
    enableJungleTheme();
    
    // Send the message
    sendJungleMessage(message);
    
    console.log(`Debug: Previewed Fundi message: "${message}"`);
  };
  
  // Reset all jungle progress
  const resetProgress = () => {
    updateJungleProgress({
      xp: 0,
      rank: 0,
      lastZoneId: undefined,
      lastPosition: undefined
    });
    
    console.log('Debug: Reset all jungle progress');
  };
  
  // Toggle jungle theme debug UI
  const toggleDebugUI = () => {
    const debugContainer = document.getElementById('jungle-debug-ui');
    
    if (debugContainer) {
      // Remove existing debug UI
      debugContainer.remove();
      console.log('Debug: Removed debug UI');
    } else {
      // Create debug UI
      const container = document.createElement('div');
      container.id = 'jungle-debug-ui';
      container.style.position = 'fixed';
      container.style.bottom = '10px';
      container.style.left = '10px';
      container.style.zIndex = '9999';
      container.style.background = 'rgba(30, 74, 61, 0.9)';
      container.style.padding = '10px';
      container.style.borderRadius = '4px';
      container.style.border = '2px solid #E6B933';
      container.style.color = '#E6B933';
      container.style.fontFamily = 'monospace';
      container.style.fontSize = '12px';
      
      // Add heading
      const heading = document.createElement('div');
      heading.textContent = '🧪 JUNGLE DEBUG';
      heading.style.fontWeight = 'bold';
      heading.style.marginBottom = '5px';
      container.appendChild(heading);
      
      // Add XP display
      const xpDisplay = document.createElement('div');
      xpDisplay.textContent = `XP: ${jungleProgress.xp} | Rank: ${jungleProgress.rank}`;
      container.appendChild(xpDisplay);
      
      // Add buttons
      const buttonStyle = 'margin:5px 2px; padding:2px 5px; background:#E6B933; color:#1E4A3D; border:none; border-radius:2px; cursor:pointer;';
      
      // Add XP button
      const addXpButton = document.createElement('button');
      addXpButton.textContent = '+100 XP';
      addXpButton.style.cssText = buttonStyle;
      addXpButton.onclick = () => addXP(100);
      container.appendChild(addXpButton);
      
      // Toggle theme button
      const toggleThemeButton = document.createElement('button');
      toggleThemeButton.textContent = 'Toggle Theme';
      toggleThemeButton.style.cssText = buttonStyle;
      toggleThemeButton.onclick = () => {
        const { toggleJungleTheme } = useJungleTheme();
        toggleJungleTheme();
      };
      container.appendChild(toggleThemeButton);
      
      // Reset button
      const resetButton = document.createElement('button');
      resetButton.textContent = 'Reset Progress';
      resetButton.style.cssText = buttonStyle + 'background:#C25E5E;';
      resetButton.onclick = resetProgress;
      container.appendChild(resetButton);
      
      document.body.appendChild(container);
      console.log('Debug: Added debug UI');
    }
  };
  
  return {
    setXP,
    unlockZone,
    previewFundiMessage,
    resetProgress,
    toggleDebugUI,
    enableJungleTheme,
    disableJungleTheme,
    // Expose the current progress for debugging
    currentProgress: jungleProgress
  };
};