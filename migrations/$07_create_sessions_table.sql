# create session table with session_id as primary key, user_id as foreign keys
CREATE TABLE IF NOT EXISTS sessions (
    id CHAR(36) PRIMARY KEY,
    customer_id int,
    FOREIGN KEY (customer_id) REFERENCES customers (id)
)