import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Singlebook from './Singlebook.js';
import Fixer from './Fixer.js';
import { DebounceInput } from 'react-debounce-input';

class Searchpage extends Component {
  state ={
    localQuery: '',
    searchResults: []
  }

  componentDidMount() {
    // sets the query to the param that might be passed to it by featuredbook if the user is navigating back; this preserves the searchpage if the user clicks away for more detailed information on a book
    const previousQuery = (this.props.location.state === undefined) ? '' : this.props.location.state.previousQuery
    if ((previousQuery !== '')  && (previousQuery !== undefined)) {
      this.setState({localQuery: `${previousQuery}`});
      this.getSearchResults(previousQuery);
    }
  }

  // makes search requests to the BooksAPI, processes any error message, then hands collection off to the fixer() method for processing and local storage via setState()
  getSearchResults = async (userQuery) => {

    // prevents BooksAPI searches of '' which returns undefined
    let initialResults = (userQuery.length === 0) ? [] : await BooksAPI.search(userQuery);

    // if there are no results for any given query, an error object is returned by the BooksAPI; in that case, this sets the searchResults to an empty array rather than that error object
    let fixedResults = (initialResults.error) ? [] : await Fixer(initialResults, false);

    // checks in myBookCollection to see if any of the searchResults are already in my collection and replaces that book with the book collection version so the correct shelf is set on the searchResults
    const { myBookCollection } = this.props;
    let crossCheckedResults = fixedResults.map(searchResultsBook => {
      let inMyCollection =  myBookCollection.some(book => book.id === searchResultsBook.id);
      return inMyCollection ? myBookCollection.find(book => book.id === searchResultsBook.id) : searchResultsBook;
    })

    this.setState({ searchResults: crossCheckedResults });
  }

  // called whenever there is a shelf change; this fxn updates the remote BooksAPI, add any book whose shelf is changed or who is currently selected to MyBookCollection, and also sets the local state to the appropriate shelf, and de-selects that book
  updateSearchResults = (bookID, newShelf) => {
    const { addToBookCollection } = this.props;

    this.setState(previousState => ({
      searchResults: previousState.searchResults.map(eachBook => {
        if ( (eachBook.id === bookID) || (eachBook.selected === true) ){
          eachBook.shelf = newShelf;
          eachBook.selected = false;
          BooksAPI.update(eachBook, newShelf);
          addToBookCollection(eachBook);
        }
        return eachBook;
      })
    }));
  }

  // simply toggles the selected value on any book
  toggleSelectedSearchResults = (bookID) => {
    this.setState(previousState => ({
      searchpage: previousState.searchResults.map(eachBook => {
        if (eachBook.id === bookID) { eachBook.selected = !eachBook.selected; }
        return eachBook;
      })
    }));
  }

  render() {
    let { searchResults, localQuery } = this.state;

    const myProps = {
      updateSearchResults:this.updateSearchResults,
      toggleSelectedSearchResults:this.toggleSelectedSearchResults,
      previousQuery:localQuery
    }

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to={{pathname: '/'}}> <button className="close-search"/> </Link>
          <div className="search-books-input-wrapper">
            <DebounceInput
              debounceTimeout={200} // delays the firing of the onChange event for 200ms, which corrects bad searchResults displaying when the user holds down the backspace key; also limits calls to the API by waiting until there is a pause in the typing
              type="text"
              placeholder='Search by title or author'
              value= {this.state.localQuery}
              onChange={event => {
                /* sets the localQuery to the typed input and searches as the input changes */
                this.setState({localQuery: event.target.value});
                this.getSearchResults(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="search-books-results">
          <div className="list-books-content">
            <div className='bookshelf'>
              <div className='bookshelf-books'>
                <ol className='books-grid'>
                  {searchResults.map(thisBook => (
                  <li key={thisBook.id}>
                  <Singlebook {...this.props} {...myProps} key={`${thisBook.id}`} thisBook={thisBook} parentPage={'/search'}/>
                  </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Searchpage;