![](media/header.png)

✅ Sign in with Ethereum to interact with smart contracts (canisters) on the [Internet Computer](https://internetcomputer.org) (IC)!

✅ Establish a one-to-one relationship between an Ethereum wallet and an IC identity.

✅ Access the IC capabilities from Ethereum dapp frontends, create cross-chain dapps! Some of the features IC provide are:

- Native integration with BTC and ETH
- Twin tokens (ckBTC, ckETH)
- Fast finality
- Low transaction fees
- HTTPS outcalls
- Store large amounts of data cheaply
- etc

This React demo application and template demonstrates how to login Ethereum users into an IC canister using the [ic-use-siwe-identity](https://github.com/kristoferlund/ic-siwe/tree/main/packages/ic-use-siwe-identity) hook and [ic-siwe-provider](https://github.com/kristoferlund/ic-siwe/tree/main/packages/ic_siwe_provider) canister.

The goal of the [ic-siwe](https://github.com/kristoferlund/ic-siwe) project is to enhance the interoperability between Ethereum and the Internet Computer platform, enabling developers to build applications that leverage the strengths of both platforms.

## 👀 Try the live demo: https://shtr2-2iaaa-aaaal-qckva-cai.icp0.io

## Key features

The demo is buit using [Vite](https://vitejs.dev/) to provide a fast development experience. It also includes the following features:

- TypeScript
- TailwindCSS
- Wagmi/Viem Ethereum libraries
- RainbowKit for Ethereum wallet integration

## App components

If you are new to IC, please read the [Internet Computer Basics](https://internetcomputer.org/basics) before proceeding.

For a detailed description of the SIWE concept, see the [SIWE specification, EIP-4361](https://eips.ethereum.org/EIPS/eip-4361).

This app consists of three main components:

### Backend

The backend is a Rust based canister that, for demonstration purposes, implements some basic functionality for managing user profiles.

### Frontend

The frontend is a React application that interacts with the backend canister. To be able to make authenticated calls to the backend canister, the frontend needs to have an identity.

### IC SIWE Provider

IC Siwe Provider is used to create an identity for the user. It is a a Rust based canister that implements the SIWE login flow. The flow starts with a SIWE message being generated and ends with a Delegate Identity being created for the user. The Delegate Identity gives the user access to the backend canister.

## How it works

This is the high-level flow between the app components when a user logs in:

1. An IC application requests a SIWE message from the `ic_siwe_provider` canister on behalf of the user.
2. The application displays the SIWE message to the user who signs it with their Ethereum wallet.
3. The application sends the signed SIWE message to the `ic_siwe_provider` canister to login the user. The canister verifies the signature and creates an identity for the user.
4. The application retrieves the identity from the `ic_siwe_provider` canister.
5. The application can now use the identity to make authenticated calls to canisters.

![Sign in with Ethereum - Login flow](/media/flow.png)

## Run locally

```bash
dfx start --clean --background
make deploy-backend
make deploy-frontend
```

## Updates

See the [CHANGELOG](CHANGELOG.md) for details on updates.

## Contributing

Contributions are welcome. Please submit your pull requests or open issues to propose changes or report bugs.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
