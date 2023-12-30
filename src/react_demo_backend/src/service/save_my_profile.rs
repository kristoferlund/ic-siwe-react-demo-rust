use ic_cdk::update;

use crate::{user_profile::UserProfile, GetAddressResponse, SIWE_PROVIDER_CANISTER, USER_PROFILES};

#[update]
async fn save_my_profile(name: String, avatar_url: String) -> Result<UserProfile, String> {
    // Get the address of the caller from the siwe provider canister, return error if it fails. A failure
    // here means that the caller is not authenticated using the siwe provider. This might happen if the
    // caller uses an anonymous principal or has authenticated using a different identity provider.
    let address = get_address().await?;

    // If user has an address and thus is authenticated, create a profile and save it.
    let profile = UserProfile {
        address,
        name,
        avatar_url,
    };

    USER_PROFILES.with(|p| {
        let mut profiles = p.borrow_mut();
        profiles.insert(ic_cdk::caller().to_string(), profile.clone());
    });

    Ok(profile)
}

/// Call the `get_address` method on the siwe provider canister with the calling principal as an argument to get the
/// address of the caller.
async fn get_address() -> Result<String, String> {
    // Get the siwe provider canister reference
    let siwe_provider_canister = SIWE_PROVIDER_CANISTER
        .with_borrow(|canister| canister.expect("Siwe provider canister not initialized"));

    // Call the `get_address` method on the siwe provider canister with the calling principal as an argument
    let response: Result<(GetAddressResponse,), _> = ic_cdk::call(
        siwe_provider_canister,
        "get_address",
        (ic_cdk::caller().as_slice(),),
    )
    .await;

    let address = match response {
        Ok(inner_result) => {
            // Handle the inner Result (GetAddressResponse)
            match inner_result.0 {
                Ok(address) => address,  // Successfully got the address
                Err(e) => return Err(e), // Handle error in GetAddressResponse
            }
        }
        Err(_) => return Err("Failed to get the caller address".to_string()), // Handle ic_cdk::call error
    };

    // Return the calling principal and address
    Ok(address)
}
