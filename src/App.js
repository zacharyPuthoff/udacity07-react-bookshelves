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
      let books = await BooksAPI.getAll(); // awaits here and gets all the books from the db
      let fixedBooks = await Fixer(books, false); // the books are sent to the Fixer component to have errors and missing values fixed
      this.setState({myBookCollection: fixedBooks}); // the newly fixed book collection is set to state
    } catch (error) { console.log('Something went wrong in BooksApp!'); console.log(error); }
  }

  // this method uses the function option for setState; we pass in the previous-state and use .map() to iterate over all the entries in myBookCollection; when a book.id matches in the bookID, OR when book.selected equals true, the remote databasee is updated; Object.assign uses the eachBook object as it's target and then copies the value of the newShelf to a copy of eachBook, resets that book's "selected" value, and then returns that copy as that single entry for the .map() fxn; once .map() is done, it returns a new array of book objects that we then set as myBookCollecction
  updateMyBookCollection = (bookID, newShelf) => {
    this.setState(previousState => ({
      myBookCollection: previousState.myBookCollection.map(eachBook => {
        if ( (eachBook.id === bookID) || (eachBook.selected === true) ){
          return Object.assign(eachBook, { shelf: newShelf, selected: false });
        } else { return eachBook; }
      })
    }));
  }

  toggleSelectedValue = (bookID) => {
    this.setState(previousState => ({
      myBookCollection: previousState.myBookCollection.map(eachBook => {
        if (eachBook.id === bookID) {
          return Object.assign(eachBook, { selected: !eachBook.selected });
        } else { return eachBook; }
      })
    }));
  }

  render() {

    // passes all the above methods and state down to all child components; by using ES6 function declaration above, a closure is also placed around the states above, which means that whenever I call theses functions, on any other component, they will have access to those states above
    const myProps = {
      myBookCollection:this.state.myBookCollection,
      updateMyBookCollection:this.updateMyBookCollection,
      toggleSelectedValue:this.toggleSelectedValue
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