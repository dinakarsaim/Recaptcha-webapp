import React, {useState} from "react";
import Grid from "./Grid";

const HomePage = () => {
    const [image, setImage] = useState(null);
    const [tiles, setTiles] = useState([]);


    const uploadFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch ("http://127.0.0.1:3000/predict", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        console.log("API Response:", data);

        setTiles(data.tiles || []);

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
                        <label htmlFor="inputFile" className="upload-btn upload-box">
                            {/* <button className="upload-btn">Upload Image</button> */}
                            Upload Image
                        </label>
                        <p className="upload-text"> or drop a file here </p>

                    </div>
                ) : (
                    <div className="upload-split">
                        <Grid image={image} detections={tiles}/>
                    </div>
                )}
            </div>
        </div>
        

    )
}

export default HomePage