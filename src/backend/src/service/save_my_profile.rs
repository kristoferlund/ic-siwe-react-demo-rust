use ic_cdk::update;
use serde_bytes::ByteBuf;

use crate::{
    declarations::ic_siwe_provider::{ic_siwe_provider, GetAddressResponse},
    user_profile::UserProfile,
    USER_PROFILES,
};

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

pub async fn get_address() -> Result<String, String> {
    let response = ic_siwe_provider
        .get_address(ByteBuf::from(ic_cdk::caller().as_slice()))
        .await;

    let address = match response {
        Ok((inner_result,)) => {
            // Handle the inner Result (GetAddressResponse)
            match inner_result {
                GetAddressResponse::Ok(address) => address, // Successfully got the address
                GetAddressResponse::Err(e) => return Err(e), // Handle error in GetAddressResponse
            }
        }
        Err(_) => return Err("Failed to get the caller address".to_string()), // Handle ic_cdk::call error
    };

    // Return the calling principal and address
    Ok(address)
}
