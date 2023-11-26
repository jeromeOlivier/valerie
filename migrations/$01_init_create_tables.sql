# BOOKS
# information needed to display a findBook on the website.
# books are never deleted, only updated, so update or delete timestamps aren't needed
# not added often, the information is stored in the database instead of a file
CREATE TABLE books
(
    id            INT AUTO_INCREMENT PRIMARY KEY COMMENT 'primary key',
    title         VARCHAR(255) NOT NULL UNIQUE COMMENT 'title of the findBook',
    background    VARCHAR(255) NOT NULL COMMENT 'css gradient background color for web book',
    border        VARCHAR(255) NOT NULL COMMENT 'css border color for findBook cover image',
    image         VARCHAR(255) NOT NULL COMMENT 'findBook cover image url',
    description   TEXT         NOT NULL COMMENT 'web book content description of the findBook',
    workbook_desc TEXT COMMENT 'if findBook has workbooks, add workbook preamble'
);

# formats are toggled on the website and used for purchase decisions (pdf or physical)
CREATE TABLE formats
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE COMMENT 'format name'
);

# availability scope is used to display the geographic availability of the findBook
CREATE TABLE market_coverage
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE COMMENT 'market name'
);

# languages are used to display the language of the findBook
CREATE TABLE languages
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE COMMENT 'language name'
);

# findBook formats describe the two formats a findBook can be purchased in (pdf or physical)
# the formats are toggled on the website and used for purchase decisions
CREATE TABLE book_formats
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    book_id  INT            NOT NULL COMMENT 'findBook id',
    pub_date DATE           NOT NULL COMMENT 'publication date',
    size     VARCHAR(255)   NOT NULL COMMENT 'size in MBs for pdfs, or physical dimensions for paper',
    format   INT            NOT NULL COMMENT 'format id',
    pages    INT            NOT NULL COMMENT 'number of pages',
    weight   INT            NULL COMMENT 'physical weight',
    language INT            NOT NULL COMMENT 'language id will only be french for now',
    market   INT            NOT NULL COMMENT 'market ids will only be canada for physical, or international for pdfs',
    price    DECIMAL(10, 2) NOT NULL COMMENT 'price in dollars',
    in_stock BOOLEAN        NOT NULL DEFAULT TRUE COMMENT 'whether the findBook is in stock',
    FOREIGN KEY (book_id) REFERENCES books (id),
    FOREIGN KEY (format) REFERENCES formats (id),
    FOREIGN KEY (market) REFERENCES market_coverage (id),
    FOREIGN KEY (language) REFERENCES languages (id),
    UNIQUE KEY (book_id, format)
);

# workbooks are subdivisions of certain books that include exercises.
# they are not available for online purchase.
# the table is used to display information on the website
CREATE TABLE workbooks
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    book_id     INT          NOT NULL COMMENT 'findBook id',
    seq_order   INT          NOT NULL COMMENT 'order of the workbook in the findBook',
    title       VARCHAR(255) NOT NULL COMMENT 'heading of the workbook',
    description TEXT         NOT NULL COMMENT 'description of the workbook',
    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
);

# CUSTOMERS
# customers never register on the site, so there are no passwords
# pdf orders are sent to the customer's email address, so only the email is required
# physical orders require a full address
CREATE TABLE customers
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(255) COMMENT 'email address of customer does not need to be unique',
    given_name  VARCHAR(255) COMMENT 'given name of customer',
    family_name VARCHAR(255) COMMENT 'family name of customer',
    address     VARCHAR(255) COMMENT 'address of customer',
    city        VARCHAR(255) COMMENT 'city of customer',
    province    VARCHAR(255) COMMENT 'province of customer',
    postcode    VARCHAR(255) COMMENT 'getShippingEstimate of customer',
    country     VARCHAR(255) COMMENT 'country of customer'
);

# ORDERING
# the orders table is used to store information about orders made on the website
CREATE TABLE orders
(
    id          INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT       NOT NULL COMMENT 'customer id of customer who placed order',
    date        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'date of order',
    FOREIGN KEY (customer_id) REFERENCES customers (id)
);

# order_items includes price to take a snapshot at time of purchase for safekeeping
CREATE TABLE order_items
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    order_id       INT            NOT NULL COMMENT 'order id',
    book_format_id INT            NOT NULL COMMENT 'findBook format id',
    quantity       INT            NOT NULL CHECK (quantity > 0) COMMENT 'number of books ordered',
    unit_price     DECIMAL(10, 2) NOT NULL COMMENT 'price of findBook at time of purchase',
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (book_format_id) REFERENCES book_formats (id),
    UNIQUE KEY (order_id, book_format_id) COMMENT 'order id and findBook format id must be unique'
);

# payments are made through Stripe and are stored in the database for reference
CREATE TABLE payments
(
    id                INT AUTO_INCREMENT PRIMARY KEY,
    order_id          INT          NOT NULL COMMENT 'order id',
    transaction_id    VARCHAR(255) NOT NULL UNIQUE COMMENT 'transaction id from Stripe',
    payment_method    VARCHAR(255) NOT NULL COMMENT 'payment method used',
    payment_timestamp TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'date of payment',
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

# BLOGS
CREATE TABLE blogs
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    blog_title VARCHAR(255) NOT NULL UNIQUE COMMENT 'title of the blog',
    date       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'date of blog',
    content    TEXT         NOT NULL COMMENT 'content of the blog',
    UNIQUE KEY (blog_title, date)
);
