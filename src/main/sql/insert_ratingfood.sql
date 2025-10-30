-- Mục tiêu: mỗi món (food_id 1..51) có n_per_food đánh giá từ các user_id 1..4 (không trùng user cho cùng món)
WITH params(n_per_food) AS (VALUES (3)),  -- <== đổi 3 thành 1..4
foods AS (
  SELECT gs AS food_id
  FROM generate_series(1, 51) gs
),
-- Tạo các "slot" user cho mỗi món, quay vòng user_id 1..4
slots AS (
  SELECT
    f.food_id,
    ((f.food_id + s - 2) % 4) + 1 AS user_id, -- xoay user theo món + thứ tự slot
    s AS slot
  FROM foods f
  CROSS JOIN params p
  CROSS JOIN generate_series(1, (SELECT n_per_food FROM params)) s
),
-- Chỉ giữ các (food_id, user_id) chưa có trong bảng (tránh trùng)
missing AS (
  SELECT s.*
  FROM slots s
  LEFT JOIN ratingfood r
    ON r.food_id = s.food_id AND r.user_id = s.user_id
  WHERE r.food_id IS NULL
)
INSERT INTO ratingfood (content, rate_point, food_id, user_id)
SELECT
  format('Đánh giá #%s cho món #%s', m.slot, m.food_id) AS content,
  ((m.food_id + m.slot - 1) % 5) + 1                    AS rate_point, -- 1..5 (deterministic)
  m.food_id,
  m.user_id
FROM missing m;