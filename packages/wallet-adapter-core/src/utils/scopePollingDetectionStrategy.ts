export function scopePollingDetectionStrategy(detect: () => boolean): void {
  // Early return when server-side rendering
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const disposers: (() => void)[] = [];

  function detectAndDispose() {
    const detected = detect();
    if (detected) {
      for (const dispose of disposers) {
        dispose();
      }
    }
  }

  // Strategy #1: Try detecting every second.
  const interval =
    // TODO: #334 Replace with idle callback strategy.
    setInterval(detectAndDispose, 1000);
  disposers.push(() => clearInterval(interval));

  // Strategy #2: Detect as soon as the DOM becomes 'ready'/'interactive'.
  if (
    // Implies that `DOMContentLoaded` has not yet fired.
    document.readyState === "loading"
  ) {
    document.addEventListener("DOMContentLoaded", detectAndDispose, {
      once: true,
    });
    disposers.push(() =>
      document.removeEventListener("DOMContentLoaded", detectAndDispose)
    );
  }

  // Strategy #3: Detect after the `window` has fully loaded.
  if (
    // If the `complete` state has been reached, we're too late.
    document.readyState !== "complete"
  ) {
    window.addEventListener("load", detectAndDispose, { once: true });
    disposers.push(() => window.removeEventListener("load", detectAndDispose));
  }

  // Strategy #4: Detect synchronously, now.
  detectAndDispose();
}
