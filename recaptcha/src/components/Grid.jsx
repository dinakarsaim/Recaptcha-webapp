import React from "react";

const Grid = (props) => {
    const {image, detections} = props;

    return (
        <div className="grid-container">
            {Array.from({length: 9}).map((_, i) => (
                <div 
                    className={`grid-tile ${detections.includes(i) ? "highlighted" : ""}`}
                    key={i}
                    style = {{
                        backgroundImage : `url(${image})`,
                        backgroundSize : "300px 300px" ,
                        backgroundPosition : `${-(i % 3) * 100}px ${-Math.floor(i / 3) * 100}px`,
                    }}
                />
            ))}
        </div>
    )
}

export default Grid;