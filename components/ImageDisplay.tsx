import React from 'react';

function ImageDisplay({ image }) {
  return (
    <div className="image-display">
      {image ? (
        <img src={image} alt="Generated" />
      ) : (
        <p>Enter a prompt to generate an image</p>
      )}
    </div>
  );
}

export default ImageDisplay;