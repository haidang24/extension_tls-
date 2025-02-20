import ssl
import socket
import idna
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from datetime import datetime, UTC
from fnmatch import fnmatch

def get_certificate(hostname, port=443):
    try:
        context = ssl.create_default_context()
        with socket.create_connection((hostname, port)) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert_der = ssock.getpeercert(binary_form=True)
                cert = x509.load_der_x509_certificate(cert_der, default_backend())
                return cert
    except Exception as e:
        print(f"[❌] Lỗi khi lấy chứng chỉ từ {hostname}: {e}")
        return None

def validate_certificate(cert, hostname):
    try:
        # 1️⃣ Kiểm tra ngày hết hạn
        if cert.not_valid_before_utc <= datetime.now(UTC) <= cert.not_valid_after_utc:
            print("[✅] Chứng chỉ còn hiệu lực.")
        else:
            print("[❌] Chứng chỉ đã hết hạn hoặc chưa có hiệu lực.")
            return False

        # 2️⃣ Kiểm tra tên miền (Name Matching)
        common_name = cert.subject.get_attributes_for_oid(x509.NameOID.COMMON_NAME)[0].value
        if fnmatch(hostname, common_name) or fnmatch(hostname, f"*.{hostname.split('.')[-2]}.{hostname.split('.')[-1]}"):
            print(f"[✅] Tên miền khớp với chứng chỉ ({common_name}).")
        else:
            print(f"[❌] Tên miền không khớp! Chứng chỉ cho {common_name}, nhưng truy cập {hostname}.")
            return False

        # 3️⃣ Kiểm tra chuỗi chứng chỉ (Certificate Chain) - Đơn giản hóa
        issuer = cert.issuer.get_attributes_for_oid(x509.NameOID.COMMON_NAME)[0].value
        print(f"[ℹ️] Chứng chỉ được cấp bởi: {issuer}")
        return True
    except Exception as e:
        print(f"[❌] Lỗi khi xác thực chứng chỉ: {e}")
        return False

if __name__ == "__main__":
    hostname = input("🔍 Nhập tên miền (VD: google.com): ").strip()
    cert = get_certificate(hostname)
    if cert:
        validate_certificate(cert, hostname)
