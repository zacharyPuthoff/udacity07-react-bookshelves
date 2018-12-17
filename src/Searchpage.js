import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Singlebook from './Singlebook.js'

class Searchpage extends Component {
  state ={
    query: ''
  }

  componentWillMount() {
    BooksAPI.getAll().then(fetchedBooks => this.props.fixer(fetchedBooks, 'bookRepository'));
  }

  render() {
    const { updateBookRepository, updateSearchResults, toggleSelected } = this.props;
    let { searchResults } = this.props; 

    if (this.state.query.length === 0) {searchResults = []}

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
              value= {this.state.query}
              onChange={event => {
                this.setState({query: event.target.value});
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

                

                <div className='book'> 
                  <div className='book-top'>
                    <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${thisBook.imageLinks.thumbnail})`}}></div>

                    
                    <div className="book-shelf-changer">
                      <select id={thisBook.id} value={thisBook.shelf} 
                        onChange={(event) => { 
                          updateBookRepository(thisBook.id, event.target.value, 'searchpage');
                          //this.props.history.push({pathname: '/'});

                        }}>
                        <option value="move" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>

                    <Link 
                      className='book-info-button' 
                      to={{pathname: `/featuredbook/${thisBook.id}`, state: {previousPage: 'bookshelves'} }}>
                    </Link>
                    
                    <input 
                      type='checkbox' 
                      className='bulk-edit-checkbox' 
                      value={thisBook.selected}
                      onChange={ event => {
                        toggleSelected(thisBook.id, event.target.value, 'searchpage')
                      } }
                    />

                  </div>
                  <div className='book-title'>{thisBook.title}</div>
                  <div className='book-authors'>{thisBook.authors}</div>
                </div>

                <Singlebook thisBook={thisBook}/>

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