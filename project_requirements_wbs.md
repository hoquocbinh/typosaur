# Tài liệu Yêu cầu & WBS: Keyboard Dino Run (Dự án "Typosaur")

## 1. Tổng quan Dự án
Xây dựng một web game chạy vô tận (endless runner) lấy cảm hứng từ Dino T-Rex của Chrome, nhưng kết hợp cơ chế gõ phím (typing) để vượt chướng ngại vật.
- **Phong cách:** Pixel art đen trắng (Classic/Retro).
- **Cơ chế:** Người chơi gõ các ký tự/từ xuất hiện trên hoặc gần chướng ngại vật để nhân vật thực hiện hành động (nhảy, cúi, tấn công).
- **Nền tảng:** Web (Responsive).
- **Mô hình:** Free-to-play với tính năng mua sắm (In-app purchase) để nâng cấp.

## 2. Công nghệ sử dụng
- **Frontend:** ReactJS (Vite), TailwindCSS (hoặc CSS Modules), Canvas API hoặc thư viện game nhẹ (như PixiJS hoặc Phaser - nhưng với yêu cầu đơn giản có thể dùng thuần React/Canvas).
- **Backend:** .NET 8 (Core Web API).
- **Database:** PostgreSQL.
- **Authentication:** JWT, OAuth (Google/Facebook).
- **Payment:** Tích hợp cổng thanh toán (ví dụ: Stripe/PayPal hoặc giả lập).

## 3. Danh sách Tính năng (Feature List)

### 3.1. Gameplay (Core Loop)
- **Cơ chế chạy:** Nhân vật tự động chạy từ trái sang phải.
- **Sinh chướng ngại vật:**
  - Chướng ngại vật xuất hiện ngẫu nhiên (cây xương rồng, chim bay, đá...).
  - Mỗi chướng ngại vật gắn liền với một **Ký tự** hoặc **Từ vựng**.
- **Cơ chế Input:**
  - Người chơi gõ đúng ký tự/từ để vượt qua.
  - Gõ sai hoặc chậm -> Va chạm -> Game Over.
- **Độ khó (Scaling Difficulty):**
  - Tốc độ chạy tăng dần theo thời gian.
  - Độ dài và độ phức tạp của từ tăng dần (Ký tự đơn -> Từ ngắn -> Từ dài -> Cụm từ).
- **Hệ thống điểm:** Dựa trên quãng đường và số từ gõ đúng.

### 3.2. Quản lý Người dùng (User Management)
- **Chế độ Ẩn danh (Guest):** Chơi ngay không cần login, điểm số lưu local storage (mất khi clear cache).
- **Đăng ký / Đăng nhập:** Email/Password hoặc Social Login.
- **Profile:** Xem lịch sử đấu, thống kê tốc độ gõ (WPM), độ chính xác.

### 3.3. Hệ thống Xếp hạng (Leaderboard)
- Global Leaderboard: Top điểm cao nhất toàn server.
- Weekly/Daily Leaderboard: Đua top theo tuần/ngày.

### 3.4. Hệ thống Mua sắm & Tiền tệ (Monetization)
- **Tiền tệ:** Coins (nhặt được trong game) và Gems (nạp tiền).
- **Shop:**
  - **Skins:** Thay đổi ngoại hình nhân vật (Dino, Robot, Ninja...).
  - **Power-ups:** Khiên, Chậm thời gian, Nam châm hút coin (mua bằng Gem hoặc Coin).
  - **Mạng (Lives):** Hồi sinh khi thua (giới hạn số lần).
- **Payment Gateway:** Nạp Gem bằng tiền thật.

## 4. Work Breakdown Structure (WBS)

### Phase 1: Inception & Design (Tuần 1-2)
* **1.1. Game Design Document (GDD)**
    * 1.1.1. Thiết kế chi tiết cơ chế gõ (Typing mechanics).
    * 1.1.2. Thiết kế thuật toán sinh từ (Word Dictionary & Difficulty Curve).
    * 1.1.3. Cân bằng game (Game Balancing).
* **1.2. UI/UX Design**
    * 1.2.1. Wireframe các màn hình: Home, Game, Game Over, Leaderboard, Shop.
    * 1.2.2. Thiết kế Assets Pixel Art: Nhân vật, Enemy, Background.

### Phase 2: Core Gameplay Development (MVP) (Tuần 3-5)
* **2.1. Frontend - Game Engine (React)**
    * 2.1.1. Thiết lập dự án React + Vite.
    * 2.1.2. Xây dựng Game Loop (requestAnimationFrame).
    * 2.1.3. Implement nhân vật & Animation cơ bản.
    * 2.1.4. Hệ thống Spawning chướng ngại vật & Từ vựng.
    * 2.1.5. Xử lý Input bàn phím & Collision Detection.
* **2.2. Backend - Core API (.NET)**
    * 2.2.1. Setup Solution, Architecture (Clean Architecture).
    * 2.2.2. API lấy danh sách từ vựng (Dictionary Service).
    * 2.2.3. API lưu điểm số (High Score - Guest Mode).

### Phase 3: User System & Meta-Game (Tuần 6-8)
* **3.1. Database Design (PostgreSQL)**
    * 3.1.1. Thiết kế Schema: Users, Scores, Transactions, Inventory.
* **3.2. Backend - User Services**
    * 3.2.1. Authentication (Identity, JWT).
    * 3.2.2. User Profile API.
    * 3.2.3. Leaderboard Logic (Optimized queries).
* **3.3. Frontend - UI Integration**
    * 3.3.1. Màn hình Login/Register.
    * 3.3.2. Dashboard & Leaderboard UI.
    * 3.3.3. Tích hợp API Backend.

### Phase 4: Monetization & Polish (Tuần 9-10)
* **4.1. Shop System**
    * 4.1.1. Backend: Inventory System, Product Catalog.
    * 4.1.2. Frontend: Shop UI, Skin Selector.
* **4.2. Payment Integration**
    * 4.2.1. Giả lập cổng thanh toán (Sandbox).
    * 4.2.2. Xử lý Transaction an toàn (Transaction Locking).
* **4.3. Polish**
    * 4.3.1. Âm thanh & FX (Retro SFX).
    * 4.3.2. Tối ưu hiệu năng (Performance Tuning).

### Phase 5: Testing & Deployment (Tuần 11)
* **5.1. Testing**
    * 5.1.1. Unit Test (.NET xUnit).
    * 5.1.2. UAT (User Acceptance Testing) - Chơi thử & cân bằng lại độ khó.
* **5.2. Deployment**
    * 5.2.1. Dockerize App.
    * 5.2.2. CI/CD Pipeline.
    * 5.2.3. Deploy lên Cloud (AWS/Azure/DigitalOcean).

## 5. Các bước thực hiện chi tiết (Next Steps)

1.  **Chốt Design & Assets:** Tìm hoặc vẽ bộ asset Pixel Art đen trắng.
2.  **Khởi tạo Repo:** Setup Monorepo (hoặc 2 repo riêng lẻ) cho Client và Server.
3.  **Prototyping:** Làm trước bản prototype chỉ có hình khối để test cảm giác gõ phím.
4.  **Database Migration:** Tạo cấu trúc DB PostgreSQL.
5.  **Develop:** Code theo Sprint (2 tuần/sprint) bám sát WBS.
