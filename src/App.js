import React, { Component } from 'react';
import * as BooksAPI from './BooksAPI';
import './App.css';
import { Route } from 'react-router-dom';
import Bookshelves from './Bookshelves.js';
import Searchpage from './Searchpage.js';
import Featuredbook from './Featuredbook.js';
import Fixer from './Fixer.js'


class BooksApp extends Component {

  state = {
    myBookCollection: [{}]
  }

  async componentDidMount() {
    try {
      let books = await BooksAPI.getAll();
      let fixedBooks = await Fixer(books, true);
      this.setState({myBookCollection: fixedBooks});
    } catch (error) { console.log('Something went wrong!'); console.log(error); }
  }

  // sets the 'selected' key to 'true' for the book that is passed to it; that key:value pair is initially set to 'false' byt the fixer() method; part of the buld-edit functionality
  /*selectThisBook = (bookID, sourcePage) => {
    const { myBookCollection, searchResults } = this.state;

    switch (sourcePage) {
      case 'bookshelves': {
        const index = myBookCollection.findIndex(book => book.id === bookID);
        myBookCollection[index].selected = ('true');
        this.setState({myBookCollection[index], selected: true});
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
  }*/

  // collects all books with 'selected: true' and sets their 'shelf' key to the shelf-value it was passed; then hands collection off to the fixer() method for processing and local storage via setState()
  updateMyBookCollection = (bookID, newShelf) => {
    this.setState(previousState => ({
      myBookCollection: previousState.myBookCollection.map(eachBook => {
        if (eachBook.id === bookID) {
          BooksAPI.update(eachBook, newShelf);
          return Object.assign(eachBook, { shelf: newShelf });
        } else { return eachBook; }
      })
    }));
  }

  render() {

    // passes all the above methods and state down to all child components; by using ES6 function declaration above, a closure is also placed around the states above, which means that whenever I call theses functions, on any other component, they will have access to those states above
    const myProps = {
      myBookCollection:this.state.myBookCollection,
      updateMyBookCollection:this.updateMyBookCollection,
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