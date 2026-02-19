# 📸 LocketCloud - Self-hosted Photo Sharing App

Dự án xây dựng mạng xã hội chia sẻ ảnh realtime (giống Locket Widget) trên hạ tầng tự host (Self-hosted Cloud), đảm bảo quyền riêng tư và không phụ thuộc bên thứ ba.

---

## 🏗️ Kiến trúc Hệ thống

### 1. Backend (Server)
Hệ thống chạy trên VPS Linux cá nhân, sử dụng **PocketBase** làm Backend-as-a-Service (BaaS).
- **Server:** Ubuntu 24.04 LTS (`ssh.hnaut.id.vn`)
- **Backend Engine:** [PocketBase](https://pocketbase.io/) (Golang, SQLite, Realtime)
- **Database:** SQLite (Lưu tại `/home/tuananh/pocketbase/pb_data/`)
- **Storage:** Local Disk (72GB Free) - Lưu ảnh trực tiếp trên server.
- **Port:** `8080` (Internal).
- **Public URL:** `https://cloud.hnaut.id.vn`
- **Security:**
    - Reverse Proxy qua **Cloudflare Tunnel** (Không mở port router, ẩn IP gốc).
    - HTTPS tự động qua Cloudflare.
    - Timezone: `Asia/Ho_Chi_Minh` (GMT+7).

### 2. Frontend (Mobile App)
Ứng dụng di động đa nền tảng (iOS/Android) viết bằng **React Native (Expo)**.
- **Framework:** Expo SDK 50+
- **Ngôn ngữ:** TypeScript
- **State Management:** React Hooks + PocketBase SDK
- **Features:**
    - 🔐 Đăng nhập: Google OAuth2 & Email/Password.
    - 📸 Camera: Chụp ảnh tỷ lệ 3:4 (giống Locket).
    - ☁️ Upload: Tải ảnh trực tiếp lên Server nhà.
    - ⚡ Realtime: Ảnh mới hiện ngay lập tức (WebSocket).
    - 📱 UI: Dark Mode, tối ưu cho trải nghiệm vuốt chạm.

---

## 🛠️ Cài đặt & Chạy dự án

### 1. Khởi chạy Server (Backend)
PocketBase đã được cài đặt làm quy trình hệ thống (`systemd service`), tự động chạy khi bật máy.
- **Kiểm tra trạng thái:**
  ```bash
  ssh tuananh@ssh.hnaut.id.vn "sudo systemctl status pocketbase"
  ```
- **Quản trị Database (Admin UI):**
  - Truy cập: **[https://cloud.hnaut.id.vn/_/](https://cloud.hnaut.id.vn/_/)**
  - Tài khoản Admin: `admin@hnaut.id.vn`

### 2. Chạy App (Frontend)
Yêu cầu: Node.js, cài App **Expo Go** trên điện thoại.

```bash
cd D:\cloud\locket-app

# Cài đặt thư viện (lần đầu)
npm install

# Chạy server phát triển (Tunnel mode để truy cập từ ngoài mạng)
npx expo start --clear --tunnel
```
> Quét mã QR hiện ra bằng **Camera iPhone** hoặc App **Expo Go** trên Android.

---

## 🔑 Cấu hình Authentication

### Google OAuth2
Đã tích hợp đăng nhập Google chính chủ.
- **Client ID:** `151336429943-hfo66c38ptleurvgmrimte48fe78ngb9.apps.googleusercontent.com`
- **Redirect URI:** `https://cloud.hnaut.id.vn/api/oauth2-redirect`
- **Cấu hình:** Đã bật trong PocketBase Admin > Settings > Auth Providers.

---

## 📂 Cấu trúc Thư mục

```
locket-app/
├── app.config.ts       # Cấu hình Expo (Tên app, Bundle ID, Deep Link)
├── App.tsx             # Entry point (Router điều hướng Login/Home)
├── assets/             # Icon, splash screen...
├── lib/
│   └── pocketbase.ts   # Cấu hình SDK kết nối Server (cloud.hnaut.id.vn)
├── screens/
│   ├── LoginScreen.tsx # Màn hình Đăng nhập/Đăng ký
│   └── HomeScreen.tsx  # Feed ảnh chính (Camera, List, Realtime)
└── package.json        # Danh sách thư viện
```

---

## 📝 Ghi chú Kỹ thuật

1. **Lưu trữ ảnh:** Ảnh upload nằm ở `/home/tuananh/pocketbase/pb_data/storage/`.
2. **Backup:** Để backup toàn bộ dữ liệu (cả DB và Ảnh), chỉ cần copy thư mục `pb_data` về máy tính.
3. **Múi giờ:** Server đã set cứng GMT+7 để đồng bộ thời gian log và ảnh.
4. **Fix lỗi Expo:** Nếu quét QR bị lỗi, chạy lệnh `npx expo start --clear --tunnel`.

---
*Dự án được xây dựng và vận hành bởi Tuan Anh.*
