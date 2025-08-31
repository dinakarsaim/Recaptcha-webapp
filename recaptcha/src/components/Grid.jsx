import React from "react";

const Grid = (props) => {
    const {image} = props;

    return (
        <div className="grid-container">
            {Array.from({length: 9}).map((_, i) => (
                <div 
                    className="grid-tile" 
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