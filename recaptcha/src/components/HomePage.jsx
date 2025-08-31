import React, {useState} from "react";

const HomePage = () => {
    const [image, setImage] = useState(null);

    const uploadFile = (e) => {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
    }

    return (
        <div className="container">
            <div className="left">
                <h1>Detect Objects <br></br> Like reCaptcha</h1>
                <p>Upload an image to and see which tiles contain your chosen object</p>
            </div>

            <div className="Upload-card">
                {!image ? (
                    <div className="upload-file">
                        <input type="file" id="inputFile" onChange={uploadFile}></input>
                        <label htmlFor="inputFile">
                            <p>Upload Image</p>
                            <span>Or drop a file here</span>
                        </label>

                    </div>
                ) : (
                    <div className="upload-split">

                    </div>
                )}
            </div>
        </div>
        

    )
}

export default HomePage