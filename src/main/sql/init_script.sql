-- ROLES
CREATE TABLE roles (
                       id          integer GENERATED ALWAYS AS IDENTITY,
                       role_name   varchar(20),
                       create_date timestamp,
                       PRIMARY KEY (id)
);

-- USERS
CREATE TABLE users (
                       id          integer GENERATED ALWAYS AS IDENTITY,
                       user_name   varchar(255),
                       password    varchar(255),
                       fullname    varchar(255),
                       create_date timestamp,
                       role_id     integer,
                       PRIMARY KEY (id)
);

-- CATEGORY
CREATE TABLE category (
                          id          integer GENERATED ALWAYS AS IDENTITY,
                          name_cate   varchar(100),
                          create_date timestamp,
                          PRIMARY KEY (id)
);

-- FOOD
CREATE TABLE food (
                      id          integer GENERATED ALWAYS AS IDENTITY,
                      image       text,
                      title       varchar(255),
                      time_ship   varchar(10),
                      price       numeric(10,2),
                      cate_id     integer,
                      is_free_ship boolean,  -- added is_free_ship column
                      PRIMARY KEY (id)
);

-- RATING FOOD
CREATE TABLE ratingfood (
                            id          integer GENERATED ALWAYS AS IDENTITY,
                            user_id     integer,
                            food_id     integer,
                            content     text,
                            rate_point  smallint CHECK (rate_point BETWEEN 1 AND 5),
                            PRIMARY KEY (id)
);

-- RESTAURANT
CREATE TABLE restaurant (
                            id           integer GENERATED ALWAYS AS IDENTITY,
                            title        varchar(255),
                            subtitle     varchar(255),
                            description  text,
                            image        text,
                            is_free_ship boolean,
                            address      varchar(255),
                            open_date    timestamp,
                            PRIMARY KEY (id)
);

-- RATING RESTAURANT
CREATE TABLE ratingrestaurant (
                                  id          integer GENERATED ALWAYS AS IDENTITY,
                                  user_id     integer,
                                  res_id      integer,
                                  content     text,
                                  rate_point  smallint CHECK (rate_point BETWEEN 1 AND 5),
                                  PRIMARY KEY (id)
);

-- MENU-RESTAURANT (bảng liên kết N-N)
CREATE TABLE menurestaurant (
                                cate_id     integer,
                                res_id      integer,
                                create_date timestamp,
                                PRIMARY KEY (cate_id, res_id)
);

-- PROMO
CREATE TABLE promo (
                       id          integer GENERATED ALWAYS AS IDENTITY,
                       res_id      integer,
                       percent     integer,
                       start_date  timestamp,
                       end_date    timestamp,
                       PRIMARY KEY (id)
);

-- ORDERITEM
CREATE TABLE orderitem (
                           order_id    integer,
                           food_id     integer,
                           create_date timestamp,
                           PRIMARY KEY (order_id, food_id)
);

-- ORDERS
CREATE TABLE Orders (
                        id          integer GENERATED ALWAYS AS IDENTITY,
                        user_id     integer,
                        res_id      integer,
                        create_date timestamp,
                        PRIMARY KEY (id)
);

-- FOREIGN KEYS
ALTER TABLE users
    ADD CONSTRAINT fk_users_role_id
        FOREIGN KEY (role_id) REFERENCES roles(id);

ALTER TABLE ratingfood
    ADD CONSTRAINT fk_ratingfood_user_id
        FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ratingfood
    ADD CONSTRAINT fk_ratingfood_food_id
        FOREIGN KEY (food_id) REFERENCES food(id);

ALTER TABLE food
    ADD CONSTRAINT fk_food_cate_id
        FOREIGN KEY (cate_id) REFERENCES category(id);

ALTER TABLE ratingrestaurant
    ADD CONSTRAINT fk_ratingrestaurant_user_id
        FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE ratingrestaurant
    ADD CONSTRAINT fk_ratingrestaurant_res_id
        FOREIGN KEY (res_id) REFERENCES restaurant(id);

ALTER TABLE menurestaurant
    ADD CONSTRAINT fk_menurestaurant_res_id
        FOREIGN KEY (res_id) REFERENCES restaurant(id);

ALTER TABLE menurestaurant
    ADD CONSTRAINT fk_menurestaurant_cate_id
        FOREIGN KEY (cate_id) REFERENCES category(id);

ALTER TABLE promo
    ADD CONSTRAINT fk_promo_res_id
        FOREIGN KEY (res_id) REFERENCES restaurant(id);

ALTER TABLE OrderItem
    ADD CONSTRAINT fk_orderitem_order_id
        FOREIGN KEY (order_id) REFERENCES Orders(id);

ALTER TABLE OrderItem
    ADD CONSTRAINT fk_orderitem_food_id
        FOREIGN KEY (food_id) REFERENCES Food(id);

ALTER TABLE Orders
    ADD CONSTRAINT fk_orders_user_id
        FOREIGN KEY (user_id) REFERENCES Users(id);

ALTER TABLE Orders
    ADD CONSTRAINT fk_orders_res_id
        FOREIGN KEY (res_id) REFERENCES Restaurant(id);

-- Inserting role
INSERT INTO roles (role_name, create_date) VALUES ('admin', NOW());

-- first three restaurant
INSERT INTO category (create_date, name_cate) VALUES
                                                  ('2025-10-11 00:00:00', 'Burger'),
                                                  ('2024-10-11 20:00:05', 'Basket'),
                                                  ('2023-10-21 00:22:10', 'Cold drinks'),
                                                  ('2025-10-11 00:00:00', 'Bún, phở'),
                                                  ('2025-10-11 00:00:00', 'Mâm'),
                                                  ('2025-10-11 00:00:00', 'Burger'),
                                                  ('2025-10-11 00:00:00', 'Fry'),
                                                  ('2025-10-11 00:00:00', 'Cold drinks');

-- red dragon
INSERT INTO category (create_date, name_cate) VALUES
                                                  ('2025-10-11 00:00:00', 'Ramen'),
                                                  ('2024-10-11 20:00:05', 'Lollipop'),
                                                  ('2023-10-21 00:22:10', 'Snacks');

-- yakitoriya
INSERT INTO category (create_date, name_cate) VALUES
                                                  ('2025-10-11 00:00:00', 'Set'),
                                                  ('2025-10-11 00:00:00', 'Rolls');

-- teremok
INSERT INTO category (create_date, name_cate) VALUES
                                                  ('2025-10-11 00:00:00', 'Pancakes'),
                                                  ('2025-10-11 00:00:00', 'Desserts'),
                                                  ('2025-10-11 00:00:00', 'Dumplings');

-- first three restaurant
INSERT INTO food (image, price, time_ship, title, cate_id, is_free_ship) VALUES
                                                                             ('kfc_1.png', 356.99, '15m', 'Double Chicken Spicy', 1, true),
                                                                             ('kfc_2.png', 228.99, '15m', 'Original Chefburger', 1, true),
                                                                             ('kfc_3.png', 586.99, '15m', 'Maestro Burger Blue Cheese', 1, true),
                                                                             ('kfc_4.png', 249.99, '15m', 'Chefburger De Luxe Original', 1, true),
                                                                             ('kfc_8.png', 898.99, '15m', 'Chef Basket Original', 2, true),
                                                                             ('kfc_7.png', 681.99, '15m', 'Home Basket', 2, true),
                                                                             ('kfc_6.png', 393.99, '15m', 'Basket L 24 Spicy Wings', 2, true),
                                                                             ('kfc_5.png', 484.99, '15m', 'Basket Duet Original', 2, true),
                                                                             ('kfc_11.png', 173.99, NULL, 'Lipton Tea', 3, false),
                                                                             ('kfc_10.png', 159.99, NULL, 'Lemonade Lemon-Lime', 3, false),
                                                                             ('kfc_9.png', 159.99, NULL, 'Lemonade Orange', 3, false),
                                                                             ('kfc_12.png', 169.99, NULL, 'Everwess Cola', 3, false),

-- Hanoi Restaurant
                                                                             ('hanoirestaurant_5.png', 599.99, NULL, 'Phở Sốt Vang', 4, false),
                                                                             ('hanoirestaurant_4.png', 499.99, NULL, 'Mì Quảng', 4, false),
                                                                             ('hanoirestaurant_3.png', 449.99, NULL, 'Bún Chả Cá', 4, false),
                                                                             ('hanoirestaurant_2.png', 469.99, NULL, 'Bún Bò Huế', 4, false),
                                                                             ('hanoirestaurant_1.png', 499.99, NULL, 'Phở Bò', 4, false),
                                                                             ('hanoirestaurant_8.png', 7999.99, NULL, 'Mâm Tất Niên', 5, false),
                                                                             ('hanoirestaurant_7.png', 6999.99, NULL, 'Mâm Cơm Quê', 5, false),
                                                                             ('hanoirestaurant_6.png', 5999.99, NULL, 'Mâm Gia Tiên', 5, false),

-- Burger King
                                                                             ('burgerking_6.png', 300.99, '20m', 'Super Fry', 7, true),
                                                                             ('burgerking_5.png', 160.99, '20m', 'Fry Derevo', 7, true),
                                                                             ('burgerking_4.png', 110.99, '20m', 'King Fry', 7, true),
                                                                             ('burgerking_3.png', 340.99, '20m', 'Spicy Hambuger vs Cheese', 6, true),
                                                                             ('burgerking_2.png', 340.99, '20m', 'Hamburger Cheese', 6, true),
                                                                             ('burgerking_1.png', 300.99, '20m', 'Hambuger', 6, true),
                                                                             ('burgerking_9.png', 150.99, NULL, 'Frustyle Orange', 8, false),
                                                                             ('burgerking_8.png', 150.99, NULL, 'Frustyle Limon', 8, false),
                                                                             ('burgerking_7.png', 150.99, NULL, 'Lipton', 8, false);

-- red dragon
INSERT INTO food (image, price, time_ship, title, cate_id, is_free_ship) VALUES
                                                                             ('reddragon_1.png', 176.99, '50m', 'K-Ramen Original', 9, true),
                                                                             ('reddragon_2.png', 186.99, '50m', 'Bull Ramen Carbonara', 9, true),
                                                                             ('reddragon_3.png', 166.99, '50m', 'Black Bean Ramen', 9, true),
                                                                             ('reddragon_4.png', 148.99, '50m', 'Korean Ramen Plain noodles', 9, true),
                                                                             ('reddragon_5.png', 48.00, '50m', 'Fruit lollipops grape flavor', 10, true),
                                                                             ('reddragon_6.png', 48.00, '50m', 'Fruit lollipops watermelon flavor', 10, true),
                                                                             ('reddragon_7.png', 48.00, '50m', 'Fruit lollipops peach flavor', 10, true),
                                                                             ('reddragon_8.png', 48.00, '50m', 'Fruit lollipops lemon flavor', 10, true),
                                                                             ('reddragon_9.png', 147.99, '50m', 'Vegetarian snack with beef Xiange', 11, true),
                                                                             ('reddragon_10.png', 147.99, '50m', 'Spicy wheat snack Xiange', 11, true);

-- yakitoriya
INSERT INTO food (image, price, time_ship, title, cate_id, is_free_ship) VALUES
                                                                             ('yakitoriya_1.png', 2801.00, '30m', 'Salmon set', 12, true),
                                                                             ('yakitoriya_2.png', 2700.00, '30m', 'Tempura set', 12, true),
                                                                             ('yakitoriya_3.png', 2658.00, '30m', 'Grill set', 12, true),
                                                                             ('yakitoriya_4.png', 685.00, '10m', 'Sunray', 13, true),
                                                                             ('yakitoriya_5.png', 615.00, '10m', 'Geisha', 13, true),
                                                                             ('yakitoriya_6.png', 706.00, '10m', 'Duosei', 13, true);

-- teremok
INSERT INTO food (image, price, time_ship, title, cate_id, is_free_ship) VALUES
                                                                             ('teremok_1.png', 183.00, NULL, 'Pancake with mushrooms', 14, false),
                                                                             ('teremok_2.png', 183.00, NULL, 'Pancake with ham and cheese', 14, false),
                                                                             ('teremok_3.png', 252.00, NULL, 'Dessert Gurievsky with cherry jam and nuts', 15, false),
                                                                             ('teremok_4.png', 252.00, NULL, 'Dessert Gurievsky with raspberries, strawberries and nuts', 15, false),
                                                                             ('teremok_5.png', 415.00, NULL, 'Double portion of dumplings', 16, false),
                                                                             ('teremok_6.png', 276.00, NULL, 'Dumplings', 16, false);
