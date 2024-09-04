import { onMounted, watch, Ref } from "vue";

const AUTO_CONNECT_LOCAL_STORAGE_KEY = "AptosWalletAutoConnect";

export function useAutoConnect(walletAutoConnect: Ref<boolean>) {
  const setAutoConnect = (value: boolean) => {
    walletAutoConnect.value = value;
  };

  onMounted(() => {
    try {
      const isAutoConnect = localStorage.getItem(
        AUTO_CONNECT_LOCAL_STORAGE_KEY,
      );
      if (isAutoConnect) setAutoConnect(JSON.parse(isAutoConnect));
    } catch (e) {
      if (typeof window !== "undefined") {
        console.error(e);
      }
    }
  });

  watch(walletAutoConnect, (newValue) => {
    try {
      if (!newValue) {
        localStorage.removeItem(AUTO_CONNECT_LOCAL_STORAGE_KEY);
      } else {
        localStorage.setItem(
          AUTO_CONNECT_LOCAL_STORAGE_KEY,
          JSON.stringify(newValue),
        );
      }
    } catch (error) {
      if (typeof window !== "undefined") {
        console.error(error);
      }
    }
  });

  return {
    walletAutoConnect,
    setAutoConnect,
  };
}
