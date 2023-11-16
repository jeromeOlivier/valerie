USE railway;

SET @id_word = (SELECT id FROM books WHERE title = 'Word');
SET @id_excel = (SELECT id FROM books WHERE title = 'Excel');
SET @id_powerpoint = (SELECT id FROM books WHERE title = 'PowerPoint');
SET @id_outlook = (SELECT id FROM books WHERE title = 'Outlook');
SET @form_pdf = (SELECT id FROM formats WHERE name = 'pdf');
SET @form_papier = (SELECT id FROM formats WHERE name = 'papier');
SET @lang_fr = (SELECT id FROM languages WHERE name = 'français');
SET @mark_int = (SELECT id FROM market_coverage WHERE name = 'à l\'international');
SET @mark_cad = (SELECT id FROM market_coverage WHERE name = 'seulement au Canada');

INSERT INTO book_formats (book_id, pub_date, size, format, pages, weight, language, market, price)
VALUES (@id_word, '2022-09-04', '8.5" x 11"', @form_papier, 259, 639, @lang_fr, @mark_cad, 44.95),
       (@id_word, '2022-09-04', '33 megaoctet', @form_pdf, 259, 0, @lang_fr, @mark_int, 34.95),
       (@id_excel, '2022-09-04', '8.5" x 11"', @form_papier, 259, 639, @lang_fr, @mark_cad, 44.95),
       (@id_excel, '2022-09-04', '38 megaoctet', @form_pdf, 259, 0, @lang_fr, @mark_int, 34.95),
       (@id_powerpoint, '2022-09-04', '8.5" x 11"', @form_papier, 153, 388, @lang_fr, @mark_cad, 29.95),
       (@id_powerpoint, '2022-09-04', '17 megaoctet', @form_pdf, 153, 0, @lang_fr, @mark_int, 24.95),
       (@id_outlook, '2022-09-04', '8.5" x 11"', @form_papier, 101, 264, @lang_fr, @mark_cad, 29.95),
       (@id_outlook, '2022-09-04', '15 megaoctet', @form_pdf, 101, 0, @lang_fr, @mark_int, 21.95);