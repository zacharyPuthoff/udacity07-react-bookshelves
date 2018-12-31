import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Singlebook from './Singlebook.js';


class Bookshelves extends Component {

  formatShelfName = (shelfName) => { // creates an eye-pleasing version of the shelf variabels for the UI
    switch (shelfName) {
      case 'currentlyReading':
        return 'Currently Reading';
      case 'wantToRead':
        return 'Want to Read';
      case 'read':
        return 'Read';
      default:
        return;
    }
  }

  render() {
    const shelves = ['currentlyReading', 'wantToRead', 'read'];
    const { myBookCollection } = this.props;

    // filters out unused shelves so they do no display
    const usedShelves = shelves.filter(shelf => myBookCollection.some(book => book.shelf === shelf));

    // the render section just cycles through each shelf, and matches any books in myBookCollection that have the same shelf value and pass them on to the Singlebook component for display.
    return (
      <div>
        <div className="list-books">
          <div className="list-books-title"><h1>My Bookshelves</h1></div>
          <div className="list-books-content">
          {usedShelves.map(theShelf => (
            <div className='bookshelf' key={theShelf}>
              <h2 className="bookshelf-title">{this.formatShelfName(theShelf)}</h2>
              <div className='bookshelf-books'>
                <ol className='books-grid'>
                  {myBookCollection.filter(book => (book.shelf === theShelf)).map(thisBook => (
                  <li key={thisBook.id}>
                  {/* the parent page prop is passed in here; this allows my Singlebook component to make updates to the correct state if the shelf is changed, ie myBookCollection for the bookshelves page, and searchResults for the searchresults page */}
                  <Singlebook {...this.props} key={`${thisBook.id}`} thisBook={thisBook} parentPage={'bookshelves'}/>
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