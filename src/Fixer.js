const Fixer = (bookData, singleBook = false) => {

  if (singleBook) {bookData = Array.of(bookData)}

  const updatedBookData = bookData.map(book => {
    if (!book.title) { book.title = 'Unknown' };
    if (!book.authors) { book.authors = ['Unknown'] };
    if (!book.imageLinks) { book.imageLinks = {} }
    if (!book.imageLinks.thumbnail) { book.imageLinks.thumbnail = 'http://books.google.com/books/content?id=NLK2AAAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api' };
    if (!book.shelf) { book.shelf = 'none'};
    if (!book.categories) {book.categories = ['Unknown']};
    if (!book.description) {book.description = '(No description available)'};
    if (!book.industryIdentifiers) {book.industryIdentifiers = [{indentifier: '(no number available'}]};
    if (!book.publisher) {book.publisher = 'an unknown publisher'};
    if (!book.publishedDate) {book.publishedDate = 'Unknown'};
    if (!book.pageCount) {book.pageCount = ' ---'};
    book.selected = false;
    return book;
  });

  if (singleBook) { return updatedBookData[0] } else { return updatedBookData }
}

export default Fixer