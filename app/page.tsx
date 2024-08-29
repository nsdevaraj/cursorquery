"use client";
import React from 'react';
import DateRangeSlider from '../components/date-range-slider';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold mb-8">Date Range Selector</h1>
      <DateRangeSlider />
    </main>
  );
}

// import React, {SetStateAction, useState } from 'react';
// import PromptForm from '../components/PromptForm';
// import ImageDisplay from '../components/imageDisplay';

// export default function Home() {
//   const [image, setImage] = useState<SetStateAction<null>>(null);

//   const generateImage = async (prompt:String) => {
//     // In a real application, you would make an API call here
//     // For this example, we'll use a placeholder image
//     const placeholderImage = `https://source.unsplash.com/random/800x600?${prompt}`;
//     setImage(placeholderImage);
//   };

//   return (
//     <div className="App">
//       <h1>Image Generator</h1>
//       <PromptForm onSubmit={generateImage} />
//       <ImageDisplay image={image} />
//     </div>
//   );
// }
