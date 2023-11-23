# create shipping table
CREATE TABLE IF NOT EXISTS shipping
(
    id     INT AUTO_INCREMENT PRIMARY KEY COMMENT 'primary key',
    type   VARCHAR(8) COMMENT 'type of packaging',
    weight INT COMMENT 'weight of packaging in grams',
    length INT COMMENT 'length of packaging in millimeters',
    width  INT COMMENT 'width of packaging in millimeters',
    height INT COMMENT 'height of packaging in millimeters'
);

INSERT INTO shipping (type, weight, length, width, height)
VALUES ('envelope', 23, 406, 267, 25),
       ('box', 137, 286, 229, 64);
