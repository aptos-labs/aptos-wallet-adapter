export class GA4 {
  readonly aptosGAID: string | undefined = process.env.GAID;

  constructor() {
    // Inject Aptos Google Analytics 4 script
    this.injectGA(this.aptosGAID);
  }

  gtag(a: string, b: string | object, c?: object) {
    let dataLayer = (window as any).dataLayer || [];
    dataLayer.push(arguments);
  }

  private injectGA(gaID?: string) {
    if (typeof window === "undefined") return;
    if (!gaID) return;

    const head = document.getElementsByTagName("head")[0];

    var myScript = document.createElement("script");

    myScript.setAttribute(
      "src",
      `https://www.googletagmanager.com/gtag/js?id=${gaID}`
    );

    const that = this;
    myScript.onload = function () {
      that.gtag("js", new Date());
      that.gtag("config", `${gaID}`, {
        send_page_view: false,
      });
    };

    head.insertBefore(myScript, head.children[1]);
  }
}
