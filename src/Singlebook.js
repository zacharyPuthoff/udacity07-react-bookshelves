import React from 'react';
import { Link } from 'react-router-dom';

const Singlebook = (props) => {

  const  { updateBookRepository, toggleSelected, thisBook} = props;

  return (
    <div className='book'> 
      <div className='book-top'>
        <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${thisBook.imageLinks.thumbnail})`}}></div>

        
        <div className="book-shelf-changer">
          <select id={thisBook.id} value={thisBook.shelf} 
            onChange={(event) => { 
              updateBookRepository(thisBook.id, event.target.value, 'searchpage');
              this.props.history.push({pathname: '/'});
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
  )

};

export default Singlebook;