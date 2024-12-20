use dotenv::dotenv;
use ic_cdk_bindgen::{Builder, Config};
use std::env;
use std::path::PathBuf;

/// This build script generates bindings in the declarations module to simplify interacting
/// with the deployed ic_siwe_provider canister.
fn main() {
    dotenv().ok();

    let manifest_dir =
        PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").expect("Cannot find manifest dir"));

    let ic_siwe_provider_did_path =
        manifest_dir.join("../ic_siwe_provider/declarations/ic_siwe_provider.did");

    let ic_siwe_provider_did_str = ic_siwe_provider_did_path.to_str().expect("Path invalid");

    unsafe {
        env::set_var(
            "CANISTER_CANDID_PATH_IC_SIWE_PROVIDER",
            ic_siwe_provider_did_str,
        )
    };

    let mut builder = Builder::new();

    // ic_siwe_provider
    let mut ic_siwe_provider = Config::new("ic_siwe_provider");
    ic_siwe_provider
        .binding
        .set_type_attributes("#[derive(Debug, CandidType, Deserialize)]".into());
    builder.add(ic_siwe_provider);

    builder.build(Some(manifest_dir.join("src/declarations")));
}
