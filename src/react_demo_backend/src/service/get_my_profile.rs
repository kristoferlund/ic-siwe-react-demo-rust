use ic_cdk::query;

use crate::{user_profile::UserProfile, USER_PROFILES};

/// Returns the profile of the caller if it exists.
#[query]
fn get_my_profile() -> Result<UserProfile, String> {
    USER_PROFILES
        .with(|p| p.borrow().get(&ic_cdk::caller().to_string()))
        .map_or(
            Err("No profile found for the given address".to_string()),
            Ok,
        )
}
