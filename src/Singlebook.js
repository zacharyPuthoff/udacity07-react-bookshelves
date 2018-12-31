import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Singlebook extends Component {

  render() {
    const  { updateMyBookCollection, thisBook, parentPage, query } = this.props;

    return (
      <div className='book'>
        <div className='book-top'>
          <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${thisBook.imageLinks.thumbnail})`}}></div>

          <div className="book-shelf-changer">
            <select id={thisBook.id} value={thisBook.shelf}
              onChange={(event) => {
                /* selectThisBook(thisBook.id, parentPage);*/ /* marks the book as selected even if the user didn't check it before changing the shelf */
                updateMyBookCollection(thisBook.id, event.target.value); /* updates myBookCollection with the new book and shelf */
              }}>
              <option value="move" disabled>Move to...</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* this Link calls up the detailed book info and passes the book-id as a param to the url! also will allow for bookmarking detailed pages and when the user returns, the detailed info should appear */}
          <Link
            className='book-info-button'
            to={{pathname: `/featuredbook/${thisBook.id}`, state: {previousPage: parentPage, query: query} }}>
          </Link>
          <label className='checkbox-container'>
          <input id={`checkbox-${thisBook.id}`}
            type='checkbox'
            onChange={ event => {
              /* changes the books selected value to true or false it's state when it's clicked */
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

    }
};

export default Singlebook;