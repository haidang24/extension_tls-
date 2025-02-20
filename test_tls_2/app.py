from flask import Flask, request, jsonify
import threading
import hashlib

app = Flask(__name__)
ct_logs = {}
lock = threading.Lock()

def hash_cert(cert_data):
    return hashlib.sha256(cert_data.encode()).hexdigest()

@app.route('/register', methods=['POST'])
def register_certificate():
    data = request.json
    serial_number = data.get('serial_number')
    hashed_cert = hash_cert(str(data))
    with lock:
        ct_logs[serial_number] = hashed_cert
    return jsonify({"message": "Certificate Registered"})

@app.route('/verify', methods=['POST'])
def verify_certificate():
    data = request.json
    serial_number = data.get('serial_number')
    hashed_cert = hash_cert(str(data))
    with lock:
        is_valid = ct_logs.get(serial_number) == hashed_cert
    return jsonify(is_valid)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
