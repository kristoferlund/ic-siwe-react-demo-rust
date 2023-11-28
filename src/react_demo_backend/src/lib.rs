#![allow(dead_code)]

mod error;
mod session;

use std::time::Duration;

use error::{Error, ErrorStatus};
use ic_cdk::{init, post_upgrade, query, update};
use ic_siwe::types::settings::SettingsBuilder;
use session::Session;

extern crate ic_siwe;

#[query]
fn list_active_sessions() -> Result<Vec<Session>, Error> {
    with_valid_session!()?;
    Ok(session::list())
}

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hellooo, {}!", name)
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

#[query]
fn create_identity_message(address: String) -> Result<String, String> {
    ic_siwe::create_identity_message(&address).map(|m| m.into())
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
