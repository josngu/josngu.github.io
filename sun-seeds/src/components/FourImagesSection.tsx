import React from 'react';

interface fourImagesSection {
  title: string;
  text: string;
  imgURL: string;
  altText: string;
  imgURL2: string;
  altText2: string;
  imgURL3: string;
  altText3: string;
  imgURL4: string;
  altText4: string;
}

function FourImagesSection({
  title = '',
  text = '',
  imgURL = '',
  altText = '',
  imgURL2 = '',
  altText2 = '',
  imgURL3 = '',
  altText3 = '',
  imgURL4 = '',
  altText4 = '',
}: fourImagesSection) {
  return (
    <section className='four-images-section'>
      <h2>{title}</h2>
      {/*Conditionally renders the images if there is an image present*/}
      {(imgURL || imgURL2 || imgURL3 || imgURL4) && (
        <div>
          <div>
            <img src={imgURL} alt={altText}></img>
          </div>
          <div>
            <img src={imgURL2} alt={altText2}></img>
          </div>
          <div>
            <img src={imgURL3} alt={altText3}></img>
          </div>
          <div>
            <img src={imgURL4} alt={altText4}></img>
          </div>
        </div>
      )}
      <p>{text}</p>
    </section>
  );
}

export default FourImagesSection;
