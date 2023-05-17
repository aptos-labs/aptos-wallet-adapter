export function isMobile(): boolean {
  return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(
    navigator.userAgent
  );
}

export function isInAppBrowser(): boolean {
  const isIphone = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    navigator.userAgent
  );

  const isAndroid = /(Android).*Version\/[\d.]+.*Chrome\/[^\s]+ Mobile/i.test(
    navigator.userAgent
  );

  return isIphone || isAndroid;
}

export function isRedirectable(): boolean {
  // SSR: return false
  if (!navigator) return false;

  // if we are on mobile and NOT in a in-app browser we will redirect to a wallet app

  return isMobile() && !isInAppBrowser();
}
