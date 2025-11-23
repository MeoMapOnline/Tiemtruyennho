# Hướng Dẫn Triển Khai TiệmTruyệnNhỏ

## Bước 1: Triển Khai Backend (Cloudflare Workers)
1. Cài đặt Wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. Tạo Database: `wrangler d1 create tiem-truyen-db` (Copy `database_id` vào `backend/wrangler.toml`)
4. Chạy Schema: `wrangler d1 execute tiem-truyen-db --file=backend/schema.sql --remote`
5. Deploy: `cd backend && npm run deploy`
6. **Lưu lại URL Backend** (ví dụ: `https://backend.your-name.workers.dev`).

## Bước 2: Triển Khai Frontend (Netlify)
1. Upload code lên GitHub.
2. Tạo site mới trên Netlify từ GitHub repo.
3. Vào **Site settings > Environment variables**, thêm:
   - `VITE_API_URL`: `https://backend.your-name.workers.dev` (URL Backend ở Bước 1).
4. Deploy.
