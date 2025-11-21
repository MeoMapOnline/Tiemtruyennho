CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  encrypted_yw_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  photo_url TEXT,
  role TEXT DEFAULT 'reader',
  wallet_number TEXT,
  bank_info TEXT,
  balance INTEGER DEFAULT 0,
  earnings INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
) STRICT;

CREATE TABLE stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  cover TEXT,
  description TEXT,
  genres TEXT,
  status TEXT DEFAULT 'Ongoing',
  views INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
) STRICT;

CREATE TABLE chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  story_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  chapter_order INTEGER NOT NULL,
  is_locked INTEGER DEFAULT 0,
  price INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch())
) STRICT;

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  story_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch())
) STRICT;

CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  story_id INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(user_id, story_id)
) STRICT;

CREATE TABLE author_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at INTEGER DEFAULT (unixepoch())
) STRICT;

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  reference_id TEXT, 
  status TEXT DEFAULT 'pending',
  description TEXT,
  created_at INTEGER DEFAULT (unixepoch())
) STRICT;

CREATE TABLE unlocked_chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  chapter_id INTEGER NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  UNIQUE(user_id, chapter_id)
) STRICT;

INSERT INTO stories (title, author_id, cover, description, genres, status, views, rating) VALUES 
('Thiên Đạo Đồ Thư Quán', 1, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80', 'Trương Huyền xuyên việt qua dị giới...', '["Huyền Huyễn", "Tiên Hiệp"]', 'Completed', 150000, 4.8),
('Toàn Chức Pháp Sư', 1, 'https://images.unsplash.com/photo-1515524738708-327f6b0033a7?w=500&q=80', 'Tỉnh lại sau giấc ngủ, thế giới đại biến...', '["Pháp Thuật", "Đô Thị"]', 'Ongoing', 230000, 4.9);

INSERT INTO chapters (story_id, title, content, chapter_order, is_locked, price) VALUES
(1, 'Chương 1: Lừa đảo', 'Nội dung chương 1...', 1, 0, 0),
(1, 'Chương 2: Thư viện', 'Nội dung chương 2...', 2, 0, 0),
(1, 'Chương 3: VIP (Khóa)', 'Nội dung chương 3 (Cần trả phí 100 Xu)...', 3, 1, 100);
