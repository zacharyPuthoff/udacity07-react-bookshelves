import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Singlebook extends Component {

  render() {
    const  { myBookCollection, updateMyBookCollection, selectThisBook, unSelectThisBook, thisBook, parentPage, query } = this.props;

    let temp = myBookCollection.find(book => book.id === thisBook.id);
    let actualShelf = (temp === undefined) ? thisBook.shelf : temp.shelf;

    return (
      <div className='book'>
        <div className='book-top'>
          <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${thisBook.imageLinks.thumbnail})`}}></div>

          <div className="book-shelf-changer">
            <select id={thisBook.id} value={actualShelf}
              onChange={(event) => {
                selectThisBook(thisBook.id, parentPage); /* marks the book as selected even if the user didn't check it before changing the shelf */
                document.getElementById(`checkbox-${thisBook.id}`).checked = true; /* makes the checkbox UI show a checkmark */
                updateMyBookCollection(event.target.value, parentPage); /* updates myBookCollection with the new book and shelf */
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
              if (thisBook.selected === 'false')  { selectThisBook(thisBook.id, parentPage) } else { unSelectThisBook(thisBook.id, parentPage) } /* changes the books selected value to true or false it's state when it's clicked */
            } }
          />
          <span className='checkmark'></span>
          </label>

      </div>
      <div className='book-title'>{thisBook.title}</div>
      {thisBook.authors.map(author => {
        return <div className='book-authors'>{author}</div>
      })}
    </div>
    )
    }
};

export default Singlebook;