import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Singlebook from './Singlebook.js';
import Fixer from './Fixer.js'

class Searchpage extends Component {
  state ={
    localQuery: '',
    searchResults: []
  }

  // makes search requests to the BooksAPI, processes any error message, then hands collection off to the fixer() method for processing and local storage via setState()
  getSearchResults = async (userQuery) => {

    if (userQuery.length === 0) {
      console.log('zippo time')
      this.setState({ searchResults: [] })
      return;
    }; // prevents a '' search which throws an error from the BooksAPI


    let initialResults = await BooksAPI.search(userQuery);
    initialResults = (initialResults.error) ? [] : initialResults; // if there search yields no results, an error object is returned; this catches it and sets the results to an empty array
    let fixedResults = await Fixer(initialResults, false);

    this.setState({ searchResults: fixedResults });

    console.log('query:', userQuery, ' results:', this.state.searchResults)
  }

  myBookCollectionChecker = () => {
    const { myBookCollection } = this.props;
    this.setState(previousState => ({
      searchResults: previousState.searchResults.map(resultsBook => {

        for (let shelvedBook of myBookCollection) {
          if (resultsBook.id === shelvedBook.id) {
            return Object.assign(resultsBook, { shelf: shelvedBook.shelf });
          } else { return resultsBook; }
        }
        // .find? .some? better shorter way to find bok in the collection and set it's shelf
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
    let { searchResults, localQuery } = this.state;
    let upToDateSearchResults;

    // there is an edge case where the user could hold down the backspace key and delete the entire search term, BUT not cause a change in the input field beyond his initial keystroke that just deleted one character; this deals with that by checking the legnth of localQuery at the time of rendering to be sure that the searchResults are up to date even in this edge case
    // if (localQuery.length === 0) { upToDateSearchResults = [] } else { upToDateSearchResults = searchResults }
    upToDateSearchResults = searchResults

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
              defaultValue= {this.state.localQuery}
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
                  {upToDateSearchResults.map(thisBook => (
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