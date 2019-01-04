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

  // makes search requests to the BooksAPI, processes any error message, then hands collection off to the fixer() method for processing and local storage via setState()
  getSearchResults = async (userQuery) => {

    let initialResults = (userQuery.length === 0) ? [] : await BooksAPI.search(userQuery); // prevents BooksAPI searches of '' which returns undefined

    let fixedResults = (initialResults.error) ? [] : await Fixer(initialResults, false); // if there are no results for any given query, an error object is returned by the BooksAPI; in that case, this sets the searchResults to an empty array rather than that error object

    this.setState({ searchResults: fixedResults });

    this.myBookCollectionChecker();
  }

  // checks to see if any book in the searchResults is already in my collection; if so, just copies it from myVBookCollection with it's proper shelf value
  myBookCollectionChecker = () => {
    const { myBookCollection } = this.props;
    this.setState(previousState => ({
      searchResults: previousState.searchResults.map(searchResultsBook => {
        let inMyCollection =  myBookCollection.some(book => book.id === searchResultsBook.id);
        return (inMyCollection) ? myBookCollection.find(book => book.id === searchResultsBook.id) : searchResultsBook;
      })
    }));
  }

  componentDidMount() {
    // sets the query to the param that might be passed to it by featuredbook if the user is navigating back; this preserves the searchpage if the user clicks away for more detailed information on a book
    const { query } = this.props.match.params;
    if (query !== undefined) {
      this.setState({localQuery: `${query}`});
      this.getSearchResults(query);
    }
  }

  render() {
    let { searchResults } = this.state;

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to={{pathname: '/'}}>
            <button className="close-search" onClick={ console.log() }>Close</button>
          </Link>
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
                  <Singlebook {...this.props} key={`${thisBook.id}`} thisBook={thisBook} parentPage={'searchpage'} query={this.state.localQuery}/>
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