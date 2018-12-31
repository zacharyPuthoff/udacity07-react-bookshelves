import React from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';

const Singlebook = (props) => {

  const  { updateMyBookCollection, toggleSelected, thisBook, parentPage, query } = props;

  return (
    <div className='book'>
      <div className='book-top'>
        <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${thisBook.imageLinks.thumbnail})`}}></div>

        <div className="book-shelf-changer">
          <select id={thisBook.id} value={thisBook.shelf}
            onChange={(event) => {
              let newShelf = event.target.value;
              BooksAPI.update(thisBook, newShelf) // updates the remote database
              updateMyBookCollection(thisBook.id, newShelf); // if this book is in myBookCollection, it updates to the new shelf
            }}>
            <option value="move" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* this Link calls up the detailed book info and passes the book-id as a param to the url; also will allow for bookmarking detailed pages and when the user returns, the detailed info should appear */}
        <Link
          className='book-info-button'
          to={{pathname: `/featuredbook/${thisBook.id}`, state: {previousPage: parentPage, query: query} }}>
        </Link>
        <label className='checkbox-container'>
        <input id={`checkbox-${thisBook.id}`}
          type='checkbox'
          onChange={event => {
            toggleSelected(thisBook.id); // calls the App.js fxn that changes the books selected value to true or false when it's clicked
          } }
        />
        <span className='checkmark'></span>
        </label>

    </div>
    <div className='book-title'>{thisBook.title}</div>
    {thisBook.authors.map(author => {
      return <div key={author} className='book-authors'>{author}</div>
    })}
  </div>
  )
};

export default Singlebook;