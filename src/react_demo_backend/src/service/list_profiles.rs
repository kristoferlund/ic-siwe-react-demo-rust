use ic_cdk::query;

use crate::{user_profile::UserProfile, USER_PROFILES};

#[query]
fn list_profiles() -> Result<Vec<(String, UserProfile)>, String> {
    let profiles = USER_PROFILES.with(|p| p.borrow().iter().collect::<Vec<_>>());
    Ok(profiles)
}
