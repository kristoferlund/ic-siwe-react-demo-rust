# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

-

## [0.0.2] - 2024-01-16

### Added

- Preloading of SIWE messages! When a users wallet is connected, a SIWE message is requested from the provider canister. This
  means, when user clicks on the "Login" button, the SIWE message is already there and the user can sign it immediately. No
  more waiting for the message to be fetched from the provider canister.

### Changed

- Upgraded to `ic-use-siwe-identity` version `0.0.4` and refactored some code to reflect the changes in the new version.

## [0.0.1] - 2024-01-08

### Added

- First released.
