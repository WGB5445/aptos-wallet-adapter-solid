# Wallet Adapter Solid Provider

A solid provider wrapper for the Aptos Wallet Adapter

Dapps that want to use the adapter should install this package and other supported wallet packages.

### Support

The solid provider supports all [wallet standard](https://aptos.dev/integration/wallet-adapter-for-wallets#aip-62-wallet-standard) functions and feature functions

##### Standard functions

```
connect
disconnect
connected
account
network
signAndSubmitTransaction
signMessage
```

##### Feature functions - functions that may not be supported by all wallets

```
signTransaction
signMessageAndVerify
signAndSubmitBCSTransaction
submitTransaction
```

### Usage

#### Install Dependencies

Install wallet dependencies you want to include in your app.
To do that, you can look at our [supported wallets list](https://github.com/aptos-labs/aptos-wallet-adapter#supported-wallet-packages). Each wallet is a link to npm package where you can install it from.

Next, install the `@wgb5445/aptos-wallet-adapter-solid`

```
pnpm i @wgb5445/aptos-wallet-adapter-solid
```

using npm

```
npm i @wgb5445/aptos-wallet-adapter-solid
```

#### Import dependencies

On the `App.jsx` file,

Import the installed wallets.

```js
import { SomeAptosWallet } from "some-aptos-wallet-package";
```

Import the `AptosWalletAdapterProvider`.

```js
import { AptosWalletAdapterProvider } from "@wgb5445/aptos-wallet-adapter-solid";
```

Wrap your app with the Provider, pass it the relevant props.

```js
const wallets = [new AptosLegacyStandardWallet()];

<AptosWalletAdapterProvider
  plugins={wallets}
  autoConnect={true}
  optInWallets={["Petra"]}
  dappConfig={{ netwrok: network.MAINNET }}
  onError={(error) => {
    console.log("error", error);
  }}
>
  <App />
</AptosWalletAdapterProvider>;
```

#### Available Provider Props

- `plugins` - any legacy standard wallet, i.e a wallet that is not AIP-62 standard compatible, should be installed and passed in this array. [Check here](../../README.md#supported-wallet-packages) for a list of AIP-62 and legacy standard wallets.
- `autoConnect` - a prop indicates whether the dapp should auto connect with a previous connected wallet.
- `optInWallets` - the adapter detects and adds AIP-62 standard wallets by default, sometimes you might want to opt-in with specific wallets. This props lets you define the AIP-62 standard wallets you want to support in your dapp.
- `dappConfig` - the adapter comes built-in with AIP-62 standard SDK wallets and it needs to know what configuration your dapp is in to render the current instance.
- `onError` - a callback function to fire when the adapter throws an error

#### Use Wallet

On any page you want to use the wallet props, import `useWallet` from `@wgb5445/aptos-wallet-adapter-solid`

```js
import { useWallet } from "@wgb5445/aptos-wallet-adapter-solid";
```

Then you can use the exported properties

```js
const {
  connect,
  account,
  network,
  connected,
  disconnect,
  wallet,
  wallets,
  signAndSubmitTransaction,
  signAndSubmitBCSTransaction,
  signTransaction,
  signMessage,
  signMessageAndVerify,
} = useWallet();
```

#### Examples

##### Initialize Aptos

```js
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);
```

##### connect(walletName)

```js
const onConnect = async (walletName) => {
  await connect(walletName);
};

<button onClick={() => onConnect(wallet.name)}>{wallet.name}</button>;
```

##### disconnect()

```js
<button onClick={disconnect}>Disconnect</button>
```

##### signAndSubmitTransaction(payload)

```js
const onSignAndSubmitTransaction = async () => {
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

<button onClick={onSignAndSubmitTransaction}>
  Sign and submit transaction
</button>;
```

##### signAndSubmitBCSTransaction(payload)

```js
const onSignAndSubmitBCSTransaction = async () => {
  const response = await signAndSubmitTransaction({
    sender: account.address,
    data: {
      function: "0x1::coin::transfer",
      typeArguments: [parseTypeTag(APTOS_COIN)],
      functionArguments: [AccountAddress.from(account.address), new U64(1)],
    },
  });
  // if you want to wait for transaction
  try {
    await aptos.waitForTransaction({ transactionHash: response.hash });
  } catch (error) {
    console.error(error);
  }
};

<button onClick={onSignAndSubmitTransaction}>
  Sign and submit BCS transaction
</button>;
```

##### signMessage(payload)

```js
const onSignMessage = async () => {
  const payload = {
    message: "Hello from Aptos Wallet Adapter",
    nonce: "random_string",
  };
  const response = await signMessage(payload);
};

<button onClick={onSignMessage}>Sign message</button>;
```

##### Account

```js
<div>{account?.address}</div>
<div>{account?.publicKey}</div>
```

##### Network

```js
<div>{network?.name}</div>
```

##### Wallet

```js
<div>{wallet?.name}</div>
<div>{wallet?.icon}</div>
<div>{wallet?.url}</div>
```

##### Wallets

```js
{
  wallets.map((wallet) => <p>{wallet.name}</p>);
}
```

##### signTransaction(payload)

```js
const onSignTransaction = async () => {
  const payload = {
    type: "entry_function_payload",
    function: "0x1::coin::transfer",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    arguments: [account?.address, 1], // 1 is in Octas
  };
  const response = await signTransaction(payload);
};

<button onClick={onSignTransaction}>Sign transaction</button>;
```

##### signMessageAndVerify(payload)

```js
const onSignMessageAndVerify = async () => {
  const payload = {
    message: "Hello from Aptos Wallet Adapter",
    nonce: "random_string",
  };
  const response = await signMessageAndVerify(payload);
};

<button onClick={onSignMessageAndVerify}>Sign message and verify</button>;
```
