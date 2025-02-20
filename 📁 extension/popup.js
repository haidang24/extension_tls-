document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Wallet is loaded
    // Xử lý nút Connect Wallet
    document
      .getElementById("connectWalletBtn")
      .addEventListener("click", async () => {
        if (typeof window.ethereum !== "undefined") {
          try {
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            const account = accounts[0];
            document.getElementById(
              "wallet-address"
            ).textContent = `Ví: ${account}`;
            // Lưu địa chỉ ví vào chrome.storage (nếu cần)
            chrome.storage.local.set({ metaMaskAccount: account });
          } catch (error) {
            console.error("Lỗi kết nối MetaMask:", error);
            document.getElementById(
              "wallet-address"
            ).textContent = `❌ Lỗi: ${error.message}`;
          }
        } else {
          document.getElementById("wallet-address").textContent =
            "❌ MetaMask không được cài đặt.";
        }
      });

    // Xử lý nút Disconnect Wallet
    document
      .getElementById("disconnectWalletBtn")
      .addEventListener("click", () => {
        // Xóa thông tin ví khỏi giao diện và chrome.storage
        document.getElementById("wallet-address").textContent =
          "Chưa kết nối ví";
        chrome.storage.local.remove("metaMaskAccount", () => {
          console.log("Đã hủy kết nối MetaMask.");
        });
      });
    // Wallet

    // Lấy tab hiện tại và hiển thị URL
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    document.getElementById("current-url").textContent = tab.url;

    // Đăng ký sự kiện click cho nút "Kiểm Tra Ngay"
    document.getElementById("checkBtn").addEventListener("click", async () => {
      try {
        // Hiển thị trạng thái loading
        document.getElementById("status").textContent =
          "⏳ Đang kiểm tra chứng chỉ...";

        // Gọi API server để kiểm tra chứng chỉ (endpoint đã được cấu hình)
        const domainEncoded = encodeURIComponent(tab.url);
        const response = await fetch(
          `http://localhost:4000/ct-check?domain=${domainEncoded}`
        );
        const data = await response.json();
        console.log("Dữ liệu từ server:", data);
        if (data.error) {
          document.getElementById("status").textContent = "❌ " + data.error;
        } else {
          // if (!data.prism_root) {
          //   throw new Error("Không tìm thấy root hash từ server.");
          // }
          // Kiểm tra và hiển thị MITM status
          // Hiển thị kết quả nhận được
          let statusText = `🔍 Chứng chỉ: ${data.rootHash}\nFingerprint: ${data.fingerprint}`;
          if (data.mitm_status !== "safe") {
            statusText += `\n⚠️ Cảnh báo MITM: ${data.mitm_status}`;
          }
          document.getElementById("status").textContent = statusText;
          saveToHistory(tab.url, data);
        }
      } catch (error) {
        console.error("[Popup] Lỗi khi gọi API:", error);
        document.getElementById("status").textContent =
          "❌ Lỗi: " + error.message;
      }
    });

    // Tự động tải lịch sử khi popup mở
    loadHistory();
  } catch (error) {
    console.error("[Popup] Lỗi khi khởi tạo popup:", error);
    document.getElementById("status").textContent =
      "❌ Lỗi khi khởi tạo popup.";
  }
});

/**
 * Lưu lịch sử kiểm tra vào chrome.storage
 */
function saveToHistory(url, result) {
  chrome.storage.local.get("history", (data) => {
    let history = data.history || [];
    const newRecord = {
      url: url,
      result: result,
      time: new Date().toLocaleString(),
    };
    history.unshift(newRecord);
    chrome.storage.local.set({ history }, () => {
      loadHistory();
    });
  });
}

/**
 * Hiển thị lịch sử kiểm tra từ chrome.storage
 */
function loadHistory() {
  chrome.storage.local.get("history", (data) => {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    (data.history || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `[${item.time}] ${item.url} → ${JSON.stringify(
        item.result
      )}`;
      historyList.appendChild(li);
    });
  });
}
