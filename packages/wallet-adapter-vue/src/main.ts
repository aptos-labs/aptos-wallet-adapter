import type { App } from "vue";
import WalletItem from "./components/WalletItem.vue";
import WalletConnectButton from "./components/base/WalletConnectButton.vue";
import WalletIcon from "./components/base/WalletIcon.vue";
import WalletName from "./components/base/WalletName.vue";
import WalletInstallLink from "./components/base/WalletInstallLink.vue";
import AptosLogo from "./components/icons/AptosLogo.vue";
import AptosPrivacyPolicy from "./components/pp/AptosPrivacyPolicy.vue";
import Disclaimer from "./components/pp/Disclaimer.vue";
import Link from "./components/pp/Link.vue";
import PoweredBy from "./components/pp/PoweredBy.vue";

export default {
  install: (app: App) => {
    app.component("WalletItem", WalletItem);
    app.component("WalletConnectButton", WalletConnectButton);
    app.component("WalletIcon", WalletIcon);
    app.component("WalletName", WalletName);
    app.component("WalletInstallLink", WalletInstallLink);
    app.component("AptosLogo", AptosLogo);
    app.component("AptosPrivacyPolicy", AptosPrivacyPolicy);
    app.component("Disclaimer", Disclaimer);
    app.component("Link", Link);
    app.component("PoweredBy", PoweredBy);
  },
};

export {
  WalletItem,
  WalletConnectButton,
  WalletIcon,
  WalletName,
  WalletInstallLink,
  AptosLogo,
  AptosPrivacyPolicy,
  Disclaimer,
  Link,
  PoweredBy,
};
