export function conditionMultiplier(condition: string) {
  switch (condition) {
    case "New":
      return 0.95;
    case "Like New":
      return 0.82;
    case "Good":
      return 0.68;
    case "Fair":
      return 0.48;
    case "Needs Repair":
      return 0.28;
    default:
      return 0.58;
  }
}