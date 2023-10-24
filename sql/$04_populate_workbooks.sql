USE railway;

SET @word_id = (SELECT id
                FROM books
                WHERE title = 'Word');
SET @excel_id = (SELECT id
                 FROM books
                 WHERE title = 'Excel');

INSERT INTO workbooks (book_id, seq_order, title, description)
VALUES (@word_id, 1, 'Word – fonctions de base', 'This is a test workbook'),
       (@word_id, 2, 'Word – fonctions intermédiaires', 'This is a test workbook'),
       (@word_id, 3, 'Word – fonctions avancées', 'This is a test workbook'),
       (@excel_id, 1, 'Excel – fonctions de base', 'This is a test workbook'),
       (@excel_id, 2, 'Excel – fonctions intermédiaires', 'This is a test workbook'),
       (@excel_id, 3, 'Excel – fonctions avancées', 'This is a test workbook');
