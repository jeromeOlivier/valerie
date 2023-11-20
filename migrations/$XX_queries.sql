
SELECT b.id AS b_id, b.title AS book, wb.id AS wb_id, wb.title AS workbook, wp.description, wp.path, wp.level
FROM books b
JOIN workbooks wb ON wb.book_id = b.id
JOIN workbook_previews wp ON wb.id = wp.workbook_id
WHERE b.title = 'Word'
ORDER BY b.id, wb.id, wp.path + '.';

SELECT b.title as title, bf.pub_date as date, f.name as format, bf.size as size, bf.pages as pages, l.name as
    language, m.name as market, bf.price as price
FROM book_formats bf
JOIN books b ON bf.book_id = b.id
JOIN formats f ON f.id = bf.format
JOIN languages l ON l.id = bf.language
JOIN market_coverage m ON m.id = bf.market
WHERE b.title = 'Word' AND f.name = 'pdf';

