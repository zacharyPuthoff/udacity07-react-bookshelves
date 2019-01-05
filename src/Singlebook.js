import React from 'react';
import { Link } from 'react-router-dom';

const Singlebook = (props) => {

  const  { updateMyBookCollection, toggleSelectedShelvedBooks, thisBook, parentPage, query, updateSearchResults, toggleSelectedSearchResults } = props;

  // makes sure all checkboxes are reset visually whenever it is called, even if a checked book is not re-rendered
  const resetCheckBoxes = () => {
    const checkBoxes = document.querySelectorAll('input:checked');
    for (let checkBox of checkBoxes) {
      checkBox.checked = false;
    }
  }

  return (
    <div className='book'>
      <div className='book-top'>
        <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${thisBook.imageLinks.thumbnail})`}}></div>

        <div className="book-shelf-changer">
          <select id={thisBook.id} value={thisBook.shelf}
            onChange={(event) => {
              let newShelf = event.target.value;
              if (parentPage === 'bookshelves') updateMyBookCollection(thisBook.id, newShelf);
              if (parentPage === 'searchpage') updateSearchResults(thisBook.id, newShelf);
              resetCheckBoxes();
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
            if (parentPage === 'bookshelves') toggleSelectedShelvedBooks(thisBook.id);
            if (parentPage === 'searchpage') toggleSelectedSearchResults(thisBook.id);
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