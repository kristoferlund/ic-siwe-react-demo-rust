use candid::Principal;
use ic_cdk::{init, post_upgrade};

use crate::SIWE_PROVIDER_CANISTER;

/// When initializing the canister, save a reference to the siwe provider canister.
#[init]
async fn init(siwe_provider_canister: String) {
    save_siwe_provider_canister(siwe_provider_canister);
}

/// When upgrading the canister, save a reference to the siwe provider canister.
#[post_upgrade]
fn upgrade(siwe_provider_canister: String) {
    save_siwe_provider_canister(siwe_provider_canister);
}

fn save_siwe_provider_canister(siwe_provider_canister: String) {
    SIWE_PROVIDER_CANISTER.with(|canister| {
        *canister.borrow_mut() =
            Some(Principal::from_text(siwe_provider_canister).expect("Invalid principal"));
    });
}
