const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// Dữ liệu giả lập CT Logs
let mockCTLogs = [
  {
    domain: "example.com",
    fingerprint: "SHA256-FAKE-EXAMPLE",
    merkle_proof: "VALID_PROOF_HASH",
  },
  {
    domain: "google.com",
    fingerprint: "SHA256-FAKE-GOOGLE",
    merkle_proof: "VALID_PROOF_HASH",
  },
];

// Hàm tạo Root Hash dựa trên CT Logs
function generateRootHash(logs) {
  return crypto.createHash("sha256").update(JSON.stringify(logs)).digest("hex");
}

let mockRootHash = generateRootHash(mockCTLogs);

/**
 * API cập nhật CT Logs (giả lập)
 */
app.post("/update-ct-log", (req, res) => {
  const { domain, fingerprint } = req.body;
  if (!domain || !fingerprint)
    return res.status(400).json({ error: "Thiếu domain hoặc fingerprint" });

  const newLog = { domain, fingerprint, merkle_proof: "VALID_PROOF_HASH" };
  mockCTLogs.push(newLog);
  mockRootHash = generateRootHash(mockCTLogs);

  console.log(`✅ Cập nhật CT log cho ${domain}`);
  res.json({ message: "Cập nhật thành công!", rootHash: mockRootHash });
});

/**
 * API lấy Root Hash giả lập
 */
app.get("/get-root-hash", (req, res) => {
  res.json({ rootHash: mockRootHash });
});

/**
 * API kiểm tra chứng chỉ TLS (giả lập)
 * Yêu cầu: nhận domain từ request body (POST)
 */
app.post("/ct-check", (req, res) => {
  const { domain } = req.body;
  if (!domain) return res.status(400).json({ error: "Thiếu domain" });

  const logEntry = mockCTLogs.find((log) => log.domain === domain);

  if (!logEntry) {
    return res.json({
      domain,
      status: "❌ Chứng chỉ không có trong CT Logs",
      mitm_status: "possible_mitm",
      rootHash: mockRootHash,
    });
  }

  res.json({
    domain,
    status: "✅ Chứng chỉ hợp lệ!",
    fingerprint: logEntry.fingerprint,
    merkle_proof: logEntry.merkle_proof,
    prism_root: mockRootHash,
    mitm_status: "safe",
    rootHash: mockRootHash,
  });
});

app.listen(port, () => {
  console.log(
    `🚀 Server Prism CT Service đang chạy tại http://localhost:${port}`
  );
});
