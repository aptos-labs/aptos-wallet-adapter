export function isMobile(): boolean {
  return "ontouchstart" in window;
}
