import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Link, Route } from 'react-router-dom'
import Bookshelves from './Bookshelves.js'
import Searchpage from './Searchpage.js'
import Featuredbook from './Featuredbook.js'


class BooksApp extends Component {
  
  state ={
    bookRepository: [],
    searchResults: [],
    featuredBook: {}
  }

  fixer = (someBooks) => {

    return someBooks.map(book => {

      if (!book.title) { book.title = 'Unknown' };
      if (!book.authors) { book.authors = ['Unknown'] };
      if (!book.imageLinks) { book.imageLinks = {} }
      if (!book.imageLinks.thumbnail) { book.imageLinks.thumbnail = 'http://books.google.com/books/content?id=NLK2AAAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api' };
      if (!book.shelf) { book.shelf = 'none'};
      if (!book.selected) { book.selected = false };

      book.checked = false;
      
      return book;
    });
  }

  updateBookRepository = () => {

  }

  updateSearchResults = () => {

  }

  updateFeaturedBook = () => {

  }

  render() {

    return (
      <div/>
    )
  }
}

export default BooksApp