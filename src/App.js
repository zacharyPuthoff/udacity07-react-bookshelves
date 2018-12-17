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
    searchResults: [{}],
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
      if (!book.selected) { book.selected = false };
      
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
          })
        })
        this.setState({searchResults: updatedSearchResults});      
        break;
      }
      case 'featuredBook': {
        updatedFeaturedBook = updatedSomeBooks.map(someBook => {
          return bookRepository.map(book => {
            if (someBook.id === book.id) {someBook.shelf = book.shelf};
            return someBook;
          })
        })
        this.setState({featuredBook: updatedFeaturedBook})
        break;
      }
      default: { return }
    }
  }

  updateBookRepository = async (bookID, shelfID) => {
    const { bookRepository } = this.state;

    console.log('[App.js:66] Book Repository:', bookRepository);

    let booksToUpdate = bookRepository.filter(book => (book.selected === true)).push({id: bookID, shelf: shelfID});

    console.log('[App.js:70] Books To Update:', booksToUpdate);
    
    await booksToUpdate.forEach(book => { BooksAPI.update({ id: book.id }, shelfID) })

    BooksAPI.getAll().then(fetchedBooks => this.fixer(fetchedBooks, 'bookRepository'));
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
      fixer:this.fixer
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