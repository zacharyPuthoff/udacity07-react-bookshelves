import React from 'react';
import { Link } from 'react-router-dom';

const FourOhFourPage = () => {
  return (
    <div>
    <div className="twilight-zone">
      <div className="list-books-title" style={{position: 'relative'}}><h1>That page isn't here...</h1>
        <Link to={{ pathname: '/' }}> <div className='go-back-button' /> </Link>
      </div>
    </div>
    <div className="twilight-zone-text">
      <p>The place: a far corner of the universe. The cast of characters: one man lost amongst the stars, one man who shares the common urgency of all men who are lost... he's looking for home.</p>
      <p>Just click the "Back" button up above and you'll find it.</p>
    </div>
    </div>
  )
}

export default FourOhFourPage;