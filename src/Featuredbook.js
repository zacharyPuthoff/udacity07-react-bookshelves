import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';

class Featuredbook extends Component {

  state ={
    theBook: { title: '', authors: '', imageLinks: {thumbnail: ''}, description: 'Coffee', categories: [], industryIdentifiers: [{}], publisher: '', publishedDate: '', pageCount:''}
  }

  /* an async-await functiont to pull the books id from params, get it's info from the API, fix it, and then set it as state locally */
  async componentDidMount() {
    const { bookID } = this.props.match.params;
    const myBook = await BooksAPI.get(bookID);
    this.props.fixer(myBook, 'featuredBook');
    this.setState({theBook: myBook});
  }

  render() {
    let goBackTo;
    const { previousPage } = this.props.location.state;
    const { theBook } = this.state;

    // ensures that the "back" button functions properly
    switch (previousPage) {
      case ('searchpage'): {
        goBackTo = `/search/${this.props.location.state.query}`;
        break;
      }
      case 'bookshelves': {
        goBackTo = '/';
        break;
      }
      default: {
        break;
      }
    }

    return (
      <div className="list-books">
        <div className="list-books-title" style={{position: 'relative'}}><h1>Book Information</h1>

          <Link to={{ pathname: `${goBackTo}`, state: {previousPage: {goBackTo}}}}>
            <div className='go-back-button' />
          </Link>

        </div>

        <div className="list-books-content">
          <div className='bookshelf'>
            <div className='bookshelf-books'>
              <ol className='books-grid'>
                <li>

      <div className='book'>
        <div className='book-top'>
          <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${theBook.imageLinks.thumbnail})`}}></div>

          <div className="book-shelf-changer">
            <select id={theBook.id} value={theBook.shelf}
              onChange={(event) => {
                BooksAPI.update({ id: theBook.id }, event.target.value) /* updates the API with the user's new choice of shelf */
                let temp = theBook;
                temp.shelf = event.target.value;
                this.setState({theBook: temp}) /* updates the shelf of theBook locally */
              }}>
              <option value="move" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>

        </div>
        <div className='book-title'>{theBook.title}</div>
        <div className='book-authors'>{theBook.authors}</div>
      </div>

                </li>
                <li>
                <div className='extra-info'>
                  <p>{theBook.description}</p>
                  <div><span style={{fontWeight: 'bold'}}>Category:</span> {theBook.categories}</div>
                  <div><span style={{fontWeight: 'bold'}}>ISBN:</span> {theBook.industryIdentifiers[0].identifier}</div>
                  <p>Published by {theBook.publisher} in {theBook.publishedDate.slice(0, 4)} ({theBook.pageCount} pages)</p>
                </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Featuredbook;