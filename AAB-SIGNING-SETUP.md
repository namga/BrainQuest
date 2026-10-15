# Brain Quest — ký AAB bằng GitHub Actions (API 36)

Workflow `.github/workflows/android-aab.yml` hỗ trợ ký release AAB bằng keystore riêng thông qua GitHub Actions Secrets. Không commit keystore hoặc mật khẩu vào repository.

## 1) Tạo upload keystore trên máy của bạn

Cài Java JDK (có `keytool`) rồi chạy lệnh sau trong terminal:

```bash
keytool -genkeypair -v -keystore brainquest-upload.jks -alias brainquest-upload -keyalg RSA -keysize 2048 -validity 10000
```

Hãy ghi nhớ mật khẩu keystore, mật khẩu key và alias. **Sao lưu `brainquest-upload.jks` ở nơi an toàn**; nếu mất khóa upload, việc cập nhật ứng dụng có thể cần quy trình khôi phục của Google Play. Không gửi keystore hoặc mật khẩu vào chat và không commit chúng lên GitHub.

## 2) Chuyển keystore thành Base64

Linux/Git Bash:

```bash
base64 -w 0 brainquest-upload.jks > keystore-base64.txt
```

macOS:

```bash
base64 brainquest-upload.jks | tr -d '\n' > keystore-base64.txt
```

Không commit `keystore-base64.txt`.

## 3) Thêm 4 GitHub Actions Secrets

Trong repository: **Settings → Secrets and variables → Actions → New repository secret**. Tạo chính xác các secret:

- `ANDROID_KEYSTORE_BASE64` — toàn bộ chuỗi Base64 của file `.jks`
- `ANDROID_KEYSTORE_PASSWORD` — mật khẩu keystore
- `ANDROID_KEY_ALIAS` — alias, ví dụ `brainquest-upload`
- `ANDROID_KEY_PASSWORD` — mật khẩu key

## 4) Chạy build

Vào **Actions → Build Brain Quest Android AAB (API 36) → Run workflow**. Khi có đủ secrets, workflow cấu hình signing cho release và đặt artifact tên `...release-signed.aab`. Nếu không có secret keystore, nó sẽ tạo artifact `...release-unsigned.aab`; không tải file unsigned lên Google Play. Debug AAB chỉ dành cho kiểm tra, không phải bản phát hành.

## Lưu ý

- API target được đặt là 36.
- Workflow phải chạy thành công trước khi có AAB tải xuống; file cấu hình này chưa được kiểm chứng trên repository của bạn.
- Nếu app đã từng phát hành, hãy dùng đúng upload key hiện tại, đừng tự ý thay khóa. Với Google Play, bật Play App Signing nếu phù hợp với cấu hình ứng dụng.
