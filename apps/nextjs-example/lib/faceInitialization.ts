import { Face, Network } from "@haechi-labs/face-sdk";

/**
 * For managing Face object as a global variable/state, you might use the Singleton pattern.
 * If you don't need to change the blockchain network, the Singleton pattern is enough.
 * But, if you're developing on web application in React and need to change blockchain network,
 * you can manage Face object as a global variable/state using a state management library like Recoil or Redux.
 */
const FACE_WALLET_TEST_API_KEY =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCS23ncDS7x8nmTuK1FFN0EfYo0vo6xhTBMBNWVbQsufv60X8hv3-TbAQ3JIyMEhLo-c-31oYrvrQ0G2e9j8yvJYEUnLuE-PaABo0y3V5m9g_qdTB5p9eEfqZlDrcUl1zUr4W7rJwFwkTlAFSKOqVCPnm8ozmcMyyrEHgl2AbehrQIDAQAB';

let face: Face | null = null;
if (typeof window !== "undefined") {
  face = new Face({
    apiKey: FACE_WALLET_TEST_API_KEY,
    network: Network.APTOS_TESTNET, // FaceWallet supports Testnet/Mainnet for now.
  } as never);
}

export default face;