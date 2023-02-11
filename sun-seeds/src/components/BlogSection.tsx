import React from 'react';

interface blogSection {
  title: string;
  text: string;
  imgURL: string;
  altText: string;
  imgURL2: string;
  altText2: string;
}

function BlogSection({title, text, imgURL, altText, imgURL2, altText2}: blogSection) {
  return (
      <section className='blog-section'>
        <h2>{title}</h2>
        <div>
          <div>
            <img src={imgURL} alt={altText}></img>
          </div>
          <div>
            <img src={imgURL2} alt={altText2}></img>
          </div>
        </div>
        <p>{text}</p>
      </section>
  );
}

export default BlogSection;
