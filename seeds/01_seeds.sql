-- INSERT INTO users (id, name, email, password)
-- VALUES (1, 'Shirly Templeton', 'crazyshirly@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
-- (2, 'Samual Benson', 'bennyboi@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
-- (3, 'Sir Duckington', 'quackin@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
-- VALUES (1, 1, 'Beach house', 'description', 'thumbphoto', 'coverphoto', 175, 2, 1, 2, 'Canada', 'Beach ave.', 'Sechelt', 'Bristish columbia', 'v6t 1s3', true),
-- (2, 2, 'Desert bungalo', 'description', 'thumbphoto', 'coverphoto', 225, 1, 1, 3, 'Canada', 'Desert rd.', 'Kamloops', 'Bristish columbia', 'v7a 1p3', true),
-- (3, 3, 'Tree house', 'description', 'thumbphoto', 'coverphoto', 350, 0, 1, 1, 'Canada', 'Tree st.', 'Tofino', 'Bristish columbia', 'v8m 2s4', true);

INSERT INTO reservations (id, start_date, end_date, property_id, guest_id)
VALUES (1, '2018-09-11', '2018-09-26', 3, 1),
(2, '2019-12-01', '2019-12-10', 2, 3),
(3, '2023-05-27', '2023-05-28', 1, 2);

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 3, 1, 4, 'message'),
(2, 3, 2, 2, 5, 'message'),
(3, 2, 1, 3, 5, 'message');