import init, { verify_certificate } from "./pkg/wasm_light_node.js";

async function loadWasm() {
  try {
    await init();
    console.log("[WASM] Đã tải thành công Wasm Light Node.");
  } catch (error) {
    console.error("[WASM] Lỗi khi tải Wasm:", error);
  }
}

async function checkCertificate(domain, fingerprint, merkle_proof, prism_root) {
  try {
    const resultJson = verify_certificate(
      domain,
      fingerprint,
      merkle_proof,
      prism_root
    );
    const result = JSON.parse(resultJson);
    console.log("[WASM] Kết quả xác minh:", result);
    return result;
  } catch (error) {
    console.error("[WASM] Lỗi khi xác minh chứng chỉ:", error);
    return { error: "Lỗi khi xác minh chứng chỉ." };
  }
}

export { loadWasm, checkCertificate };
