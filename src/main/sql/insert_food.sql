INSERT INTO food (
    id,
    image,
    is_free_ship,
    price,
    time_ship,
    title,
    cate_id
) VALUES
-- 🍗 KFC
(1,  'kfc_1.png',  true, 357, '15m', 'Double Chicken Spicy', 1),
(2,  'kfc_2.png',  true, 228, '15m', 'Original Chefburger', 1),
(3,  'kfc_3.png',  true, 586, '15m', 'Maestro Burger Blue Cheese', 1),
(4,  'kfc_4.png',  true, 250, '15m', 'Chefburger De Luxe Original', 1),
(5,  'kfc_8.png',  true, 898, '15m', 'Chef Basket Original', 2),
(6,  'kfc_7.png',  true, 681, '15m', 'Home Basket', 2),
(7,  'kfc_6.png',  true, 393, '15m', 'Basket L 24 Spicy Wings', 2),
(8,  'kfc_5.png',  true, 484, '15m', 'Basket Duet Original', 2),
(9,  'kfc_11.png', false, 173, NULL, 'Lipton Tea', 3),
(10, 'kfc_10.png', false, 160, NULL, 'Lemonade Lemon-Lime', 3),
(11, 'kfc_9.png',  false, 160, NULL, 'Lemonade Orange', 3),
(12, 'kfc_12.png', false, 170, NULL, 'Everwess Cola', 3),

-- 🍜 Hanoi Restaurant
(13, 'hanoirestaurant_5.png', false, 600, NULL, 'Phở Sốt Vang', 4),
(14, 'hanoirestaurant_4.png', false, 500, NULL, 'Mì Quảng', 4),
(15, 'hanoirestaurant_3.png', false, 450, NULL, 'Bún Chả Cá', 4),
(16, 'hanoirestaurant_2.png', false, 470, NULL, 'Bún Bò Huế', 4),
(17, 'hanoirestaurant_1.png', false, 500, NULL, 'Phở Bò', 4),
(18, 'hanoirestaurant_8.png', false, 8000, NULL, 'Mâm Tất Niên', 5),
(19, 'hanoirestaurant_7.png', false, 7000, NULL, 'Mâm Cơm Quê', 5),
(20, 'hanoirestaurant_6.png', false, 6000, NULL, 'Mâm Gia Tiên', 5),

-- 🍔 Burger King
(21, 'burgerking_6.png', true,  300, '20m', 'Super Fry', 7),
(22, 'burgerking_5.png', true,  160, '20m', 'Fry Derevo', 7),
(23, 'burgerking_4.png', true,  110, '20m', 'King Fry', 7),
(24, 'burgerking_3.png', true,  340, '20m', 'Spicy Hambuger vs Cheese', 6),
(25, 'burgerking_2.png', true,  340, '20m', 'Hamburger Cheese', 6),
(26, 'burgerking_1.png', true,  300, '20m', 'Hambuger', 6),
(27, 'burgerking_9.png', false, 150, NULL, 'Frustyle Orange', 8),
(28, 'burgerking_8.png', false, 150, NULL, 'Frustyle Limon', 8),
(29, 'burgerking_7.png', false, 150, NULL, 'Lipton', 8);
