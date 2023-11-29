#![allow(dead_code)]

mod error;
mod session;
mod user_profile;

use std::time::Duration;

use error::{Error, ErrorStatus};
use ic_cdk::{init, post_upgrade, query, update};
use ic_siwe::types::settings::SettingsBuilder;
use session::Session;
use user_profile::UserProfile;

use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{DefaultMemoryImpl, StableBTreeMap};
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

extern crate ic_siwe;

thread_local! {
    // The memory manager is used for simulating multiple memories. Given a `MemoryId` it can
    // return a memory that can be used by stable structures.
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> =
        RefCell::new(MemoryManager::init(DefaultMemoryImpl::default()));

    static USER_PROFILES: RefCell<StableBTreeMap<String, UserProfile, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );
}

#[query]
fn list_active_sessions() -> Result<Vec<Session>, Error> {
    with_valid_session!()?;
    Ok(session::list())
}

#[query]
fn get_my_profile() -> Result<UserProfile, Error> {
    with_valid_session!()?;

    let session = session::get(ic_cdk::caller())
        .map_err(|e| Error::new(e.to_string(), ErrorStatus::BadRequest))?;

    USER_PROFILES
        .with(|p| p.borrow().get(&session.address))
        .map_or(
            Err(Error::new(
                "No profile found for the given address".to_string(),
                ErrorStatus::NotFound,
            )),
            |p| Ok(p),
        )
}

#[update]
fn save_my_profile(profile: UserProfile) -> Result<String, Error> {
    with_valid_session!()?;

    let session = session::get(ic_cdk::caller())
        .map_err(|e| Error::new(e.to_string(), ErrorStatus::BadRequest))?;

    USER_PROFILES.with(|p| p.borrow_mut().insert(session.address, profile));

    Ok("Profile saved".to_string())
}

#[query]
fn list_profiles() -> Result<Vec<(String, UserProfile)>, Error> {
    with_valid_session!()?;

    let profiles = USER_PROFILES.with(|p| p.borrow().iter().collect::<Vec<_>>());

    Ok(profiles)
}

#[update]
fn create_siwe_message(address: String) -> Result<String, String> {
    ic_siwe::create_siwe_message(&address).map(|m| m.into())
}

#[update]
async fn login(signature: String, address: String) -> Result<Session, String> {
    ic_siwe::verify_siwe_signature(&signature, &address)?;
    let session = session::start(ic_cdk::caller(), address.clone())?;
    Ok(session)
}

#[update]
fn logout() -> Result<String, String> {
    session::delete(ic_cdk::caller())
}

fn siwe_init() {
    ic_siwe::init(
        SettingsBuilder::new("127.0.0.1", "http://127.0.0.1:5173")
            .scheme("http")
            .statement("Login to the app")
            .sign_in_expires_in(Duration::from_secs(60 * 5).as_nanos() as u64) // 5 minutes
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
