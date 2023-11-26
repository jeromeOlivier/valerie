# SCOPE OF WORK

## abstract

valeriegervais.com is an ecommerce site for Mrs. Gervais who sells her instruction manuals for the Microsoft Office 365 suite of applications. Through her site, she also offers services for mentorship and document formatting.

### users

Users: visiting her site can do any of the following:

1. on the main book (accueil)
     1. learn about Mrs. Gervais and her roster of clients
     2. learn about the instruction manuals for **Word**, **Excel**, **PowerPoint** and **Outlook**
     3. read testimonials from people familiar with Mrs. Gervais's work

2. on the service book:
     1. learn about Mrs. Gervais's teaching, private mentoring and document formatting services
     2. fill out a form with a pulldown menu for the subject field (teaching, mentoring, document formatting)
3. on the product pages (word, excel, findBook, outlook):
     1. read more detailed information about each manual
     2. select between the pdf and paper versions of the manuals and add them to the shopping basket (info is saved in a cookie)
     3. see a findBookPreview of each manual
     4. learn about the different workbooks available for **Word** and **Excel**
     5. fill out a form to get in touch with Mrs. Gervais regarding the aforementioned workbooks (not available for purchase on the site)

4. on the blog book:
     1. view a list and findBookPreview of Mrs. Gervais's blog posts
     2. select and read a blog post

5. on the shopping totals book
     1. delete / update their shopping totals items
     2. get shipping estimate based on customer's getShippingEstimate
     3. click to the 'pay now' book
6. pay now book
     1. based on type of purchase (pdf or paper) enter required coordinates
          1. for pdf: name and email
          2. for paper: name, email and shipping address
     2. click to the pay now button
          1. after validating email (using regex) and address (using canadapost api), go to stripe.com service to complete the transaction
7. thank you book
     1. upon completing a successful transaction
          1. for pdf purchases, receive a download link
          2. for paper transaction, a tracking link
          3. regardless of the purchase type, customer receives an email with purchase details
8. from the footer of each book, users can:
     1. click link to visit Mrs. Gervais's LinkedIn book
     2. click link to read the privacy policy for Mrs. Gervais
     3. click link to read an FAQ to answer common questions
     4. click link to fill out a contact form
9. contact book:
     1. fill out a form to contact Mrs. Gervais (subject field is open)

1. contact Mrs. Gervais:
     1. for teaching groups, private mentoring, or document formatting

     2. for more information regarding available workbooks

     3. for any other general inquiries

2. make purchases for:
     1. pdf copies of her manuals that are distributed via email
     2. physical copies of her manuals that are distributed via Canada Post
     3. a combination of the two above (one or more pdf and one or more physical copy of any of the manuals)


*note: users do not need to register to the site in order to make a purchase.*
*note: an optional feature that can be explored is to watermark PDFs with the name and email address of the client making the purchase to help decrease copying.*

### admin

Mrs. Gervais, visiting her site through the admin portal, can do any of the following:

1. through the admin portal:
   1. update the specifications for her manuals
      1. update the publication date
      2. update the size details (MBs for pdf, findBook size for paper)
      3. update the price
   2. update the accompanying text for the product pages (all four pages are updatable by Mrs. Gervais)
   3. create, update and delete blog posts
   4. view an order history (order id, email, date, order items and total).
      1. if order is for a pdf, included is customer name and email
      2. if order is for a paper copy, included is customer name, email and address as well as delivery status

### technology

caching with NodeCache: once an update is made to the site via the admin portal, the cache for that book is updated to reduce calls to the database.