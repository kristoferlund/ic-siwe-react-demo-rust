#![allow(dead_code)]

mod user_profile;

use ic_cdk::{init, post_upgrade, query, update};
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use serde_bytes::ByteBuf;
use std::cell::RefCell;
use std::time::Duration;
use user_profile::UserProfile;

type Memory = VirtualMemory<DefaultMemoryImpl>;

extern crate ic_siwe;

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static USER_PROFILES: RefCell<StableBTreeMap<String, UserProfile, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

fn profile_guard() -> Result<(), String> {
    // Require that user has a user profile. An empty profile is created on first successful login.
    USER_PROFILES.with(|p| {
        if !p.borrow().contains_key(&ic_cdk::caller().to_string()) {
            return Err("No profile found for the given address".to_string());
        }
        Ok(())
    })
}

#[query(guard = profile_guard)]
fn get_my_profile() -> Result<UserProfile, String> {
    USER_PROFILES
        .with(|p| p.borrow().get(&ic_cdk::caller().to_string()))
        .map_or(
            Err("No profile found for the given address".to_string()),
            |p| Ok(p),
        )
}

#[update(guard = profile_guard)]
fn save_my_profile(profile: UserProfile) -> Result<String, String> {
    USER_PROFILES.with(|p| p.borrow_mut().insert(ic_cdk::caller().to_string(), profile));
    Ok("Profile saved".to_string())
}

#[query(guard = profile_guard)]
fn list_profiles() -> Result<Vec<(String, UserProfile)>, String> {
    let profiles = USER_PROFILES.with(|p| p.borrow().iter().collect::<Vec<_>>());
    Ok(profiles)
}

#[update]
fn prepare_login(address: String) -> Result<String, String> {
    ic_siwe::prepare_login(&address).map(|m| m.into())
}

#[update]
fn login(signature: String, address: String, session_key: ByteBuf) -> Result<ByteBuf, String> {
    ic_siwe::login(&signature, &address, session_key)
}

#[query]
fn get_delegation(
    address: String,
    session_key: ByteBuf,
) -> Result<ic_siwe::SignedDelegation, String> {
    match ic_siwe::get_delegation(&address, session_key) {
        Ok(signed_delegation) => {
            // Create a new user profile for the user if it doesn't exist yet.
            USER_PROFILES.with(|p| {
                p.borrow_mut().insert(
                    ic_cdk::caller().to_string(),
                    UserProfile {
                        address,
                        name: "".to_string(),
                        avatar_url: "".to_string(),
                    },
                )
            });
            Ok(signed_delegation)
        }
        Err(e) => Err(e.to_string()),
    }
}

fn siwe_init() {
    ic_siwe::init(
        ic_siwe::SettingsBuilder::new("127.0.0.1", "http://127.0.0.1:5173", "salt")
            .scheme("http")
            .statement("Login to the app")
            .sign_in_expires_in(Duration::from_secs(60 * 5).as_nanos() as u64) // 5 minutes
            .session_expires_in(Duration::from_secs(60 * 60).as_nanos() as u64) // 1 hour
            .build()
            .unwrap(),
    )
    .unwrap();
}

#[init]
fn init() {
    siwe_init();
}

#[post_upgrade]
fn upgrade() {
    siwe_init();
}
