# Sentinel's Findings

## Critical Issues

### 1. `fulfillOrder` Logic Flaw

-   **File:** `src/store/gameStore.js`
-   **Description:** The `fulfillOrder` function contains a critical logic flaw. It correctly checks if all required *types* of components are present in a build (e.g., a CPU, a GPU, RAM), but it fails to validate if the specific *tier* or *model* of those components meets the customer's order requirements.
-   **Impact:** This allows players to complete high-paying jobs with underpowered, cheap components, breaking the core gameplay loop of sourcing the right parts for the job. For example, an order requiring a top-tier "Quantum" GPU can be fulfilled with a bottom-tier "Viper" GPU.
-   **Recommendation:** The validation logic must be enhanced to check the `id` or a similar unique property of each part against the `requiredParts` specified in the order template. This will ensure players are rewarded only for meeting the actual order specifications.

## Minor Issues

### 1. Hardcoded "Gold Workbench" Bonus Text

-   **File:** `src/components/Workshop.jsx`
-   **Description:** The banner that appears for the "Gold Workbench" has a hardcoded text value of "+25% PC Value". The actual bonus is determined by the `markup` variable in the `saveBuildToInventory` function in `gameStore.js`.
-   **Impact:** While the values currently match, this is a fragile implementation. If the markup value in the store is ever changed, the banner in the workshop will become misleading.
-   **Recommendation:** The `Workshop` component should receive the actual markup value as a prop and display it dynamically.
