# Sentinel's Journal: Findings

## Critical Architectural Failure: Non-Atomic State Updates in Core Logic

**Finding:** During the audit, I discovered a recurring pattern of non-atomic state updates within the core application logic in `App.jsx`. Several handler functions (e.g., `handleItemTrade`, `disassembleBuild`) were calling `setInventory` multiple times in sequence to perform a single logical operation.

**Example:**
```javascript
const handleItemTrade = (incomingPart, outgoingPartInvId) => {
  setInventory(prev => prev.filter(p => p.invId !== outgoingPartInvId)); // First update
  setInventory(prev => [...prev, { ...incomingPart, invId: '...' }]); // Second update
};
```

**Impact:** Due to React's state batching, the second `setInventory` call does not have a guarantee of seeing the updated state from the first call. This creates a race condition, leading to an inconsistent and unreliable inventory state. In this specific case, the item intended for removal would often persist in the inventory, corrupting the user's game data.

**Aha! Moment:** This is a classic React state management pitfall. A single user action that results in a multi-step state transformation *must* be performed within a single, atomic state update. The functional form of `setState` (`(prevState) => newState`) is the correct tool for this, as it ensures the transformation is based on the most recent, consistent state.

**Resolution:** The fix was to refactor all such instances to use a single `setInventory` call, where the entire transformation (e.g., removing one item and adding another) is performed within the updater function.

```javascript
const handleItemTrade = (incomingPart, outgoingPartInvId) => {
  setInventory(prev => {
    const newInventory = prev.filter(p => p.invId !== outgoingPartInvId);
    newInventory.push({ ...incomingPart, invId: '...' });
    return newInventory;
  });
};
```
This ensures that the state transition is atomic and reliable, preventing data corruption and preserving the integrity of the game's core logic.
