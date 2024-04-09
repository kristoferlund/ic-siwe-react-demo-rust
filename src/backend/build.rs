use ic_cdk_bindgen::{Builder, Config};
use std::path::PathBuf;

/// This build script generates bindings in the declarations module to simplify interacting
/// with the deployed ic_siwe_provider canister.
fn main() {
    let manifest_dir =
        PathBuf::from(std::env::var("CARGO_MANIFEST_DIR").expect("Cannot find manifest dir"));
    let mut builder = Builder::new();

    // ic_siwe_provider
    let mut ic_siwe_provider = Config::new("ic_siwe_provider");
    ic_siwe_provider
        .binding
        .set_type_attributes("#[derive(Debug, CandidType, Deserialize)]".into());
    builder.add(ic_siwe_provider);

    builder.build(Some(manifest_dir.join("src/declarations")));
}
