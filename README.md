# ic-siwe-react-demo-rust

This is a demo application for the [ic-siwe](https://github.com/kristoferlund/ic-siwe-rust) library. The app is built with React and Vite.

The `ic-siwe` library allows Ethereum developers to extend their applications onto the Internet Computer (IC) platform, utilizing the Sign-In With Ethereum (SIWE) standard.

### ⚠️ This is a work in progress ⚠️

Code is not production ready. Expect breaking changes. Code is not fully tested and audited.

## Demo

Deployed demo can be accessed here: https://shtr2-2iaaa-aaaal-qckva-cai.icp0.io

## Prerequisites

The ic-siwe library needs to be available in a sibling directory, named `ic-siwe`.

https://github.com/kristoferlund/ic-siwe-rust

## Run

```bash
dfx start --background
make deploy-backend
make deploy-frontend
```
