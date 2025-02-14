import React from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react'; 
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

const SignAndSubmit = () => {
  const { account, signAndSubmitTransaction } = useWallet();

  const onSignAndSubmitTransaction = async () => {
    if(account == null) {
        throw new Error("Unable to find account to sign transaction")
    }
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: "0x1::coin::transfer",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [account.address, 1],
      },
    });
    // if you want to wait for transaction
    try {
      await aptos.waitForTransaction({ transactionHash: response.hash });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={onSignAndSubmitTransaction}>
      Sign and submit transaction
    </button>
  );
};

export default SignAndSubmit;