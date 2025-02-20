use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct CertificateData {
    pub domain: String,
    pub fingerprint: String,
    pub merkle_proof: String,
    pub prism_root: String,
    pub status: String,
}

#[wasm_bindgen]
pub fn verify_certificate(
    domain: &str,
    fingerprint: &str,
    merkle_proof: &str,
    prism_root: &str,
) -> String {
    let is_valid = verify_merkle_proof(merkle_proof, fingerprint, prism_root);
    let status = if is_valid { "safe" } else { "danger" };

    let result = CertificateData {
        domain: domain.to_string(),
        fingerprint: fingerprint.to_string(),
        merkle_proof: merkle_proof.to_string(),
        prism_root: prism_root.to_string(),
        status: status.to_string(),
    };

    serde_json::to_string(&result).unwrap()
}

fn verify_merkle_proof(proof: &str, fingerprint: &str, root: &str) -> bool {
    // Giả lập xác minh Merkle Proof (cần thay thế bằng thuật toán thực)
    proof == "VALID_PROOF_HASH" && fingerprint.starts_with("SHA256") && root == "ROOT_HASH_67890"
}
