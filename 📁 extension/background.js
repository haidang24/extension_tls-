import { loadWasm, checkCertificate } from "./wasm_loader.js";

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Background] Extension đã cài đặt.");
  loadWasm();
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "check_certificate") {
    try {
      const tabId = message.tabId;
      const url = new URL(message.url).hostname;
      console.log(`[Background] Kiểm tra chứng chỉ của: ${url}`);

      // Lấy chứng chỉ TLS từ trình duyệt
      const certData = await getCertificate(tabId);
      if (!certData) {
        throw new Error("Không thể lấy chứng chỉ.");
      }

      console.log(`[Background] Chứng chỉ TLS lấy được:`, certData);

      // Gửi chứng chỉ đến Prism CT Service để xác minh
      const response = await fetch("http://localhost:4000/ct-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: url, certificate: certData }),
      });

      const data = await response.json();
      console.log(`[Background] Kết quả từ Prism:`, data);

      // Xác minh Merkle Proof bằng Wasm Light Node
      const mitmStatus = await checkCertificate(
        url,
        data.fingerprint,
        data.merkle_proof,
        data.prism_root
      );
      data.mitm_status = mitmStatus.status;
      sendResponse(data);
    } catch (error) {
      console.error("[Background] Lỗi kiểm tra chứng chỉ:", error);
      sendResponse({ error: error.message });
    }
  }
  return true;
});

async function getCertificate(tabId) {
  return new Promise((resolve, reject) => {
    chrome.debugger.attach({ tabId: tabId }, "1.2", () => {
      chrome.debugger.sendCommand(
        { tabId: tabId },
        "Network.enable",
        {},
        () => {
          chrome.debugger.sendCommand(
            { tabId: tabId },
            "Network.getCertificate",
            {},
            (result) => {
              chrome.debugger.detach({ tabId: tabId });
              if (!result) {
                reject("Không thể lấy chứng chỉ.");
              } else {
                resolve(result);
              }
            }
          );
        }
      );
    });
  });
}
