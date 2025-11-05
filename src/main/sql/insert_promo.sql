select * from promo;

TRUNCATE TABLE promo;

WITH cfg AS (
  SELECT
    1::int AS id_base,      -- id bắt đầu (id cuoi cung ton tai tren table)
    12::int  AS n,            -- số lượng bản ghi cần sinh
    1::int   AS res_lo,       -- res_id bắt đầu
    6::int   AS res_hi,       -- res_id kết thúc
    10::int  AS pct_start,    -- % bắt đầu (VD 20)
    5::int   AS pct_step,     -- bước tăng % (0 = cố định)
    interval '1 days' AS ttl
),
s AS (
  SELECT
    (SELECT id_base FROM cfg) + g - 1 AS id,
    g AS idx
  FROM cfg, LATERAL generate_series(1, (SELECT n FROM cfg)) AS g
),
rows AS (
  SELECT
    s.id,
    (SELECT res_lo FROM cfg)
      + ((s.idx - 1) % ((SELECT res_hi FROM cfg)-(SELECT res_lo FROM cfg)+1)) AS res_id,
    (SELECT pct_start FROM cfg) + (SELECT pct_step FROM cfg) * (s.idx - 1)     AS percent,
    NOW()::timestamp AS start_date,
    NOW()::timestamp + (SELECT ttl FROM cfg) AS end_date
  FROM s
)
INSERT INTO promo (id, res_id, percent, start_date, end_date)
SELECT id, res_id, percent, start_date, end_date
FROM rows
ON CONFLICT (id) DO UPDATE
SET res_id     = EXCLUDED.res_id,
    percent    = EXCLUDED.percent,
    start_date = EXCLUDED.start_date,
    end_date   = EXCLUDED.end_date;
