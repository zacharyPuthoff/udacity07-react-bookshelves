import React from 'react';
import { Link } from 'react-router-dom';

const Singlebook = (props) => {

  const { updateMyBookCollection, toggleSelectedShelvedBooks, thisBook, updateSearchResults, toggleSelectedSearchResults, parentPage } = props;
  // allows us to pass the query from the searchpage to each book, which can then be passed on to featuredbook if needed; if there is no previousQuery prop passed in because the singelbook is being rendered on the bookshelf page, the local variable is set to ''
  const previousQuery = ( props.previousQuery === undefined ) ? '' : props.previousQuery;

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

        {/* this Link calls up the detailed book info and passes the book-id as a param to featuredbook; this allows bookmarking the page, too */}
        <Link className='book-info-button' to={{
          pathname: `/featuredbook=${thisBook.id}`,
          state: {previousQuery: previousQuery, parentPage: parentPage}
        }}/>

        {/* changes the shelf a book is on, based on the parentPage which is passed in as a prop */}
        <div className="book-shelf-changer">
          <select id={thisBook.id} value={thisBook.shelf}
            onChange={(event) => {
              let newShelf = event.target.value;
              if (parentPage === '/') updateMyBookCollection(thisBook.id, newShelf);
              if (parentPage === '/search') updateSearchResults(thisBook.id, newShelf);
              resetCheckBoxes();
            }}>
            <option value="move" disabled>Move to...</option>
            <option value="currentlyReading">Currently Reading</option>
            <option value="wantToRead">Want to Read</option>
            <option value="read">Read</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* sets the "selected value for a book; if a book is selected, it's shelf is changed whenever any other book's shelf is changed" */}
        <label className='checkbox-container'>
        <input id={`checkbox-${thisBook.id}`}
          type='checkbox'
          onChange={event => {
            if (parentPage === '/') toggleSelectedShelvedBooks(thisBook.id);
            if (parentPage === '/search') toggleSelectedSearchResults(thisBook.id);
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