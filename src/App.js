import React, { Component } from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import { Route } from 'react-router-dom'
import Bookshelves from './Bookshelves.js'
import Searchpage from './Searchpage.js'
import Featuredbook from './Featuredbook.js'


class BooksApp extends Component {
  
  state = {
    bookRepository: [{}],
    searchResults: [],
    featuredBook: {}
  }

  fixer = (someBooks, type) => {
    const { bookRepository } = this.state;
    let updatedBookRepository, updatedSearchResults, updatedFeaturedBook;

    const updatedSomeBooks = someBooks.map(book => {
      if (!book.title) { book.title = 'Unknown' };
      if (!book.authors) { book.authors = ['Unknown'] };
      if (!book.imageLinks) { book.imageLinks = {} }
      if (!book.imageLinks.thumbnail) { book.imageLinks.thumbnail = 'http://books.google.com/books/content?id=NLK2AAAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api' };
      if (!book.shelf) { book.shelf = 'none'};
      if (!book.selected) { book.selected = 'false' };
      
      return book;
    });

    switch(type) {
      case 'bookRepository': {
        updatedBookRepository = updatedSomeBooks;
        this.setState({bookRepository: updatedBookRepository})
        break;
      }
      case 'searchResults': {
        updatedSearchResults = updatedSomeBooks.map(someBook => {
          return bookRepository.map(book => {
            if (someBook.id === book.id) {someBook.shelf = book.shelf};
            return someBook;
          })[0]
        })
        this.setState({searchResults: updatedSearchResults});      
        break;
      }
      case 'featuredBook': {
        updatedFeaturedBook = updatedSomeBooks.map(someBook => {
          return bookRepository.map(book => {
            if (someBook.id === book.id) {someBook.shelf = book.shelf};
            return someBook;
          })[0]
        })
        this.setState({featuredBook: updatedFeaturedBook})
        break;
      }
      default: { return }
    }
  }

  toggleSelected = (bookID, currentValue, sourcePage) => {
    const { bookRepository, searchResults } = this.state;

    switch (sourcePage) {
      case 'bookshelves': {
        let index = bookRepository.findIndex(book => book.id === bookID);
        bookRepository[index].selected = (currentValue === 'true') ? ('false') : ('true');
        this.setState({bookRepository: bookRepository});
        break;     
      }
      case 'searchpage': {
        let index = searchResults.findIndex(book => book.id === bookID);
        searchResults[index].selected = (currentValue === 'true') ? ('false') : ('true');
        this.setState({searchResults: searchResults});
        break;
      }
      case 'featuredbook': {
        break;
      }
      default: {
        break;
      }
    }
  }

  updateBookRepository = async (bookID, shelfID, sourcePage) => {
    const { bookRepository, searchResults } = this.state;
    let booksToUpdate;

    switch (sourcePage) {
      case 'bookshelves': {
        booksToUpdate = bookRepository.filter(book => (book.selected === 'true')).concat([{id: bookID, shelf: shelfID}]);
        await booksToUpdate.map(book => BooksAPI.update({ id: book.id }, shelfID) )
        BooksAPI.getAll().then(fetchedBooks => this.fixer(fetchedBooks, 'bookRepository'));
        break;
      }
      case 'searchpage': {
        booksToUpdate = searchResults.filter(book => (book.selected === 'true')).concat([{id: bookID, shelf: shelfID}]);
        await booksToUpdate.map(book => BooksAPI.update({ id: book.id }, shelfID) )
        BooksAPI.getAll().then(fetchedBooks => {
          this.fixer(fetchedBooks, 'bookRepository')
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  updateSearchResults = async (userQuery) => {
    if (userQuery.length === 0) {return};

    let initialResults = await BooksAPI.search(userQuery);
    initialResults = (initialResults.error) ? ([]) : initialResults;

    this.fixer(initialResults, 'searchResults');
  }

  updateFeaturedBook = async (bookID, shelfID) => {
    const requestedBook = await BooksAPI.get(bookID);
    this.fixer(requestedBook, 'featuredBook')
  }


  render() {

    const myProps = {
      bookRepository:this.state.bookRepository,
      searchResults:this.state.searchResults,
      featuredBook:this.state.featuredBook, 
      updateBookRepository:this.updateBookRepository, 
      updateSearchResults:this.updateSearchResults, 
      updateFeaturedBook:this.updateFeaturedBook,
      fixer:this.fixer,
      toggleSelected:this.toggleSelected
    }

    return (
      <div>
        <Route exact path='/' render={(props) => (
          <Bookshelves {...props} {...myProps}/>
        )}/>
        
        <Route path='/search' render={(props) => (
          <Searchpage {...props}  {...myProps}/>
        )}/>

        <Route path='/featuredBook/:bookID' render={(props) => (
          <Featuredbook {...props}  {...myProps}/>
        )}/>
      
      </div>
    )
  }
}

export default BooksApp