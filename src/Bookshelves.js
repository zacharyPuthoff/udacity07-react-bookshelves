import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';


class Bookshelves extends Component {

  state = {
      shelves: ['currentlyReading', 'wantToRead', 'read']
    }
  
  componentWillMount() {
    BooksAPI.getAll().then(fetchedBooks => this.props.fixer(fetchedBooks, 'bookRepository'));
  }

  render() {
    const { shelves } = this.state;
    const { bookRepository, updateBookRepository, toggleSelected } = this.props;

    return (
 
      <div>
        <div className="list-books">
          <div className="list-books-title"><h1>My Bookshelves</h1></div>
        <div className="list-books-content">

          {shelves.map(theShelf => (

          <div className='bookshelf' key={theShelf}>
            <h2 className="bookshelf-title">{theShelf}</h2>
            <div className='bookshelf-books'>
              <ol className='books-grid'>
                {bookRepository.filter(book => (book.shelf === theShelf)).map(thisBook => (
                <li key={thisBook.id}>
                <div className='book'> 
                  <div className='book-top'>
                    <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${thisBook.imageLinks.thumbnail})`}}></div>
                    
                    <div className="book-shelf-changer">
                      <select id={thisBook.id} value={thisBook.shelf} 
                      onChange={(event) => updateBookRepository(thisBook.id, event.target.value, 'bookshelves') }>
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
                        toggleSelected(thisBook.id, event.target.value, 'bookshelves')
                      } }
                    />

                  </div>
                  <div className='book-title'>{thisBook.title}</div>
                  <div className='book-authors'>{thisBook.authors}</div>
                </div>
                </li>
                ))}
              </ol>
            </div>
          </div>
          ))}
        </div>
        </div>
        <div className="open-search">
          <Link to={{pathname: '/search'}}><button>Add a Book</button></Link>
        </div>
      </div>
    )
  }
}

export default Bookshelves;