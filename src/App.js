import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { Route } from 'react-router-dom';
import Bookshelves from './Bookshelves.js';
import Searchpage from './Searchpage.js';
import Featuredbook from './Featuredbook.js';


class BooksApp extends Component {

  state = {
    myBookCollection: [{}],
    searchResults: []
  }

  // this method basically processes the books collection once it's retrieved; makes sure that all key:values pairs are present and if not adds them locally; ends by storing the entire fixed collection locally via setState()
  fixer = (someBooks, type) => {
    const { myBookCollection } = this.state;
    let myBookCollectionUpdated, searchResultsUpdated;

    if (type === 'featuredBook') {someBooks = [someBooks]};

    const someBooksUpdated = someBooks.map(book => {
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
      book.selected = 'false';
      return book;
    });

    switch(type) {
      case 'myBookCollection': {
        myBookCollectionUpdated = someBooksUpdated;
        this.setState({myBookCollection: myBookCollectionUpdated});
        break;
      }
      case 'searchResults': {
        searchResultsUpdated = someBooksUpdated.map(someBook => {
          return myBookCollection.map(book => {
            if (someBook.id === book.id) {someBook.shelf = book.shelf};
            return someBook;
          })[0]
        })
        this.setState({searchResults: searchResultsUpdated});
        break;
      }
      default: { break; }
    }
  }

  // sets the 'selected' key to 'true' for the book that is passed to it; that key:value pair is initially set to 'false' byt the fixer() method; part of the buld-edit functionality
  selectThisBook = (bookID, sourcePage) => {
    const { myBookCollection, searchResults } = this.state;

    switch (sourcePage) {
      case 'bookshelves': {
        const index = myBookCollection.findIndex(book => book.id === bookID);
        myBookCollection[index].selected = ('true');
        this.setState({myBookCollection: myBookCollection});
        break;
      }
      case 'searchpage': {
        const index = searchResults.findIndex(book => book.id === bookID);
        searchResults[index].selected = ('true');
        this.setState({searchResults: searchResults});
        break;
      }
      default: {
        break;
      }
    }
  }

  // sets the 'selected' key to 'false' for the book that is passed to it; that key:value pair is initially set to 'false' byt the fixer() method; part of the buld-edit functionality
  unSelectThisBook =  (bookID, sourcePage) => {
    const { myBookCollection, searchResults } = this.state;

    switch (sourcePage) {
      case 'bookshelves': {
        const index = myBookCollection.findIndex(book => book.id === bookID);
        myBookCollection[index].selected = ('false');
        this.setState({myBookCollection: myBookCollection});
        break;
      }
      case 'searchpage': {
        const index = searchResults.findIndex(book => book.id === bookID);
        searchResults[index].selected = ('false');
        this.setState({searchResults: searchResults});
        break;
      }
      default: {
        break;
      }
    }
  }

  // collects all books with 'selected: true' and sets their 'shelf' key to the shelf-value it was passed; then hands collection off to the fixer() method for processing and local storage via setState()
  updateMyBookCollection = async (shelfID, sourcePage) => {
    const { myBookCollection, searchResults } = this.state;
    let booksToUpdate;

    switch (sourcePage) {
      case 'bookshelves': {
        booksToUpdate = myBookCollection.filter(book => (book.selected === 'true'));
        break;
      }
      case 'searchpage': {
        booksToUpdate = searchResults.filter(book => (book.selected === 'true'));
        break;
      }
      default: { break; }
    }

    await booksToUpdate.map(book => BooksAPI.update({ id: book.id }, shelfID) );
    BooksAPI.getAll().then(fetchedBooks => this.fixer(fetchedBooks, 'myBookCollection'));
  }

  // makes search requests to the BooksAPI, processes any error message, then hands collection off to the fixer() method for processing and local storage via setState()
  updateSearchResults = async (userQuery) => {
    if (userQuery.length === 0) {return};

    let initialResults = await BooksAPI.search(userQuery);
    initialResults = (initialResults.error) ? ([]) : initialResults;

    this.fixer(initialResults, 'searchResults');
  }

  render() {

    // passes all the above methods and state down to all child components; by using ES6 function declaration above, a closure is also placed around the states above, which means that whenever I call theses functions, on any other component, they will have access to those states above
    const myProps = {
      myBookCollection:this.state.myBookCollection,
      searchResults:this.state.searchResults,
      updateMyBookCollection:this.updateMyBookCollection,
      updateSearchResults:this.updateSearchResults,
      fixer:this.fixer,
      selectThisBook:this.selectThisBook,
      unSelectThisBook:this.unSelectThisBook
    }

    return (
      <div>
        {/*straightforward use of react-router to set the routes for the app*/}
        <Route exact path='/' render={(props) => (
          <Bookshelves {...props} {...myProps}/>
        )}/>

        <Route path='/search/:query?' render={(props) => (
          <Searchpage {...props}  {...myProps}/>
        )}/>

        <Route path='/featuredbook/:bookID' render={(props) => (
          <Featuredbook {...props}  {...myProps}/>
        )}/>

      </div>
    )
  }
}

export default BooksApp;