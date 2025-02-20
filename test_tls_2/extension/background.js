// background.js
async function checkCertificate(details) {
  if (!details.securityInfo || !details.securityInfo.certificate) return;

  let certInfo = {
    domain: new URL(details.url).hostname,
    serial_number: details.securityInfo.certificate.serialNumber,
    valid_from: details.securityInfo.certificate.validity.start,
    valid_until: details.securityInfo.certificate.validity.end,
  };

  try {
    let response = await fetch("http://localhost:3000/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certInfo),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    let isValid = await response.json();

    if (!isValid) {
      browser.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Certificate Warning",
        message: `Potential MITM detected on ${certInfo.domain}!`,
      });
    }
  } catch (error) {
    console.error("Error verifying certificate:", error);
  }
}

(chrome || browser).webRequest.onHeadersReceived.addListener(
  checkCertificate,
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
);
