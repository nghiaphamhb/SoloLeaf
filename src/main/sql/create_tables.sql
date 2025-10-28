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
    user_name   varchar(100),
    password    varchar(50),
    fullname    varchar(50),
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
    "isFreeShip" boolean,        -- giữ nguyên tên bạn dùng
    price       numeric(10,2),
    cate_id     integer,
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
    is_freeship  boolean,
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

CREATE TABLE orderitem (
    order_id    integer,
    food_id     integer,
    create_date timestamp,
    PRIMARY KEY (order_id, food_id)
);

CREATE TABLE Orders (
	id integer GENERATED ALWAYS AS IDENTITY,
	user_id integer,
	res_id integer,
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