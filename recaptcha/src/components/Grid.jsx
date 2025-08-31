import React, { useState } from "react";

function Home() {
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="container">
      {/* Left side text */}
      <div className="left">
        <h1>Detect Objects <br/> Like reCAPTCHA</h1>
        <p>Upload an image and see which tiles contain your chosen object.</p>
      </div>

      {/* Right side upload card */}
      <div className="upload-card">
        {!image ? (
          <>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              hidden
            />
            <label htmlFor="fileInput" className="upload-box">
              <p>Upload Image</p>
              <span>or drop a file here</span>
            </label>
          </>
        ) : (
          <div className="grid-container">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="grid-tile"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "300px 300px",
                  backgroundPosition: `${-(i % 3) * 100}px ${-Math.floor(i / 3) * 100}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;