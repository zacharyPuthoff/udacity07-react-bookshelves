import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import * as BooksAPI from './BooksAPI';
import Fixer from './Fixer.js'

class Featuredbook extends Component {

  state ={
    theBook: { title: '', authors: [''], imageLinks: {thumbnail: ''}, description: '', categories: [], industryIdentifiers: [{}], publisher: '', publishedDate: '', pageCount:''}
  }

  async componentDidMount() {
    const { bookID } = this.props.match.params;

    let book = await BooksAPI.get(bookID); // awaits here and get the single book from the db
    let fixedBook = await Fixer(book, true); // the books are sent to the Fixer component to have errors and missing values fixed
    this.setState({theBook: fixedBook}); // the newly fixed book collection is set to state
  }

  render() {
    const { theBook } = this.state;
    const { parentPage, previousQuery } = this.props.location.state;
    const { updateMyBookCollection, addToBookCollection } = this.props;

    return (
      <div className="list-books">
        <div className="list-books-title" style={{position: 'relative'}}><h1>Book Information</h1>

          <Link to={{ pathname: parentPage, state: { previousQuery: previousQuery } }}> <div className='go-back-button' /> </Link>

        </div>

        <div className="list-books-content">
          <div className='bookshelf'>
            <div className='bookshelf-books'>
              <ol className='books-grid'>
                <li>
                <div className='book'>
                  <div className='book-top'>
                    <div className="book-cover" style={{width: 128, height: 188, backgroundImage: `url(${theBook.imageLinks.thumbnail})`}}></div>

                    {/* changes the shelf a book is on */}
                    <div className="book-shelf-changer">
                      <select id={theBook.id} value={theBook.shelf}
                        onChange={(event) => {
                          let newShelf = event.target.value;
                          this.setState(previousState => ({
                            theBook: Object.assign(previousState.theBook, { shelf: newShelf })
                          }));
                          if (parentPage === '/') updateMyBookCollection(theBook.id, newShelf);
                          if (parentPage === '/search') addToBookCollection(theBook); // no need tp update searchResults here as they will be checked against myBookCollection
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
                  {theBook.authors.map(author => {
                    return <div key={author} className='book-authors'>{author}</div>
                  })}
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