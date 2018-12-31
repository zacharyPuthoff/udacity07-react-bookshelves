import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Singlebook from './Singlebook.js';

class Searchpage extends Component {
  state ={
    localQuery: ''
  }

  // makes search requests to the BooksAPI, processes any error message, then hands collection off to the fixer() method for processing and local storage via setState()
  updateSearchResults = async (userQuery) => {
    if (userQuery.length === 0) {return};

    let initialResults = await BooksAPI.search(userQuery);
    initialResults = (initialResults.error) ? ([]) : initialResults;

    this.fixer(initialResults, 'searchResults');
  }

  componentDidMount() {
    const { updateSearchResults } = this.props;
    const { query } = this.props.match.params;

    // sets the query to the param that might be passed to it by featuredbook if the user is navigating back; this preserves the searchpage if the user clicks away for more detailed information on a book
    if (query !== undefined) { this.setState({localQuery: `${query}`}) };
    BooksAPI.getAll().then(fetchedBooks => this.props.fixer(fetchedBooks, 'myBookCollection'));
    updateSearchResults(this.state.localQuery);
  }

  render() {
    const { updateSearchResults } = this.props;
    let { searchResults } = this.props;

    if (this.state.localQuery.length === 0) {searchResults = []};

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to={{pathname: '/'}}>
            <button className="close-search" onClick={ console.log() }>Close</button>
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder='Search by title or author'
              value= {this.state.localQuery}
              onChange={event => {
                /* sets the localQuery to the typed input and searches as the input changes */
                this.setState({localQuery: event.target.value});
                updateSearchResults(event.target.value);
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
                  <Singlebook {...this.props} key={`${thisBook.id}-${this.state.localQuery}-${thisBook.shelf}`} thisBook={thisBook} parentPage={'searchpage'} query={this.state.localQuery}/>
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