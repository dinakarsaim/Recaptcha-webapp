import React, {useState} from "react";
import Grid from "./Grid";

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
                <p>Upload an image to see which tiles contain your chosen object</p>
            </div>

            <div className="upload-card">
                {!image ? (
                    <div className="upload-file">
                        <input type="file" id="inputFile" onChange={uploadFile}></input>
                        <label htmlFor="inputFile" className="upload-box">
                            <button className="upload-btn">Upload Image</button>
                            <p> or drop a file here </p>
                        </label>

                    </div>
                ) : (
                    <div className="upload-split">
                        <Grid image={image}/>

                    </div>
                )}
            </div>
        </div>
        

    )
}

export default HomePage