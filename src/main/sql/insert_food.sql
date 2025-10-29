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
(1,  'kfc_1.png',  true, 356.99, '15m', 'Double Chicken Spicy', 1),
(2,  'kfc_2.png',  true, 228.99, '15m', 'Original Chefburger', 1),
(3,  'kfc_3.png',  true, 586.99, '15m', 'Maestro Burger Blue Cheese', 1),
(4,  'kfc_4.png',  true, 249.99, '15m', 'Chefburger De Luxe Original', 1),
(5,  'kfc_8.png',  true, 898.99, '15m', 'Chef Basket Original', 2),
(6,  'kfc_7.png',  true, 681.99, '15m', 'Home Basket', 2),
(7,  'kfc_6.png',  true, 393.99, '15m', 'Basket L 24 Spicy Wings', 2),
(8,  'kfc_5.png',  true, 484.99, '15m', 'Basket Duet Original', 2),
(9,  'kfc_11.png', false, 173.99, NULL, 'Lipton Tea', 3),
(10, 'kfc_10.png', false, 159.99, NULL, 'Lemonade Lemon-Lime', 3),
(11, 'kfc_9.png',  false, 159.99, NULL, 'Lemonade Orange', 3),
(12, 'kfc_12.png', false, 169.99, NULL, 'Everwess Cola', 3),

-- 🍜 Hanoi Restaurant
(13, 'hanoirestaurant_5.png', false, 599.99, NULL, 'Phở Sốt Vang', 4),
(14, 'hanoirestaurant_4.png', false, 499.99, NULL, 'Mì Quảng', 4),
(15, 'hanoirestaurant_3.png', false, 449.99, NULL, 'Bún Chả Cá', 4),
(16, 'hanoirestaurant_2.png', false, 469.99, NULL, 'Bún Bò Huế', 4),
(17, 'hanoirestaurant_1.png', false, 499.99, NULL, 'Phở Bò', 4),
(18, 'hanoirestaurant_8.png', false, 7999.99, NULL, 'Mâm Tất Niên', 5),
(19, 'hanoirestaurant_7.png', false, 6999.99, NULL, 'Mâm Cơm Quê', 5),
(20, 'hanoirestaurant_6.png', false, 5999.99, NULL, 'Mâm Gia Tiên', 5),

-- 🍔 Burger King
(21, 'burgerking_6.png', true,  300.99, '20m', 'Super Fry', 7),
(22, 'burgerking_5.png', true,  160.99, '20m', 'Fry Derevo', 7),
(23, 'burgerking_4.png', true,  110.99, '20m', 'King Fry', 7),
(24, 'burgerking_3.png', true,  340.99, '20m', 'Spicy Hambuger vs Cheese', 6),
(25, 'burgerking_2.png', true,  340.99, '20m', 'Hamburger Cheese', 6),
(26, 'burgerking_1.png', true,  300.99, '20m', 'Hambuger', 6),
(27, 'burgerking_9.png', false, 150.99, NULL, 'Frustyle Orange', 8),
(28, 'burgerking_8.png', false, 150.99, NULL, 'Frustyle Limon', 8),
(29, 'burgerking_7.png', false, 150.99, NULL, 'Lipton', 8);
