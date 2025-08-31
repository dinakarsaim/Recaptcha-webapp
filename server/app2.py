from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
from PIL import Image

app = Flask(__name__)
CORS(app)

model = YOLO("best.pt") 

def split_image(image_path):
    """
    Splits an image into 9 (3x3) equal tiles and saves them temporarily.
    Returns list of (tile_path, tile_index).
    """
    img = Image.open(image_path)
    w, h = img.size
    tile_w, tile_h = w // 3, h // 3

    tiles = []
    idx = 0
    for row in range(3):
        for col in range(3):
            left = col * tile_w
            upper = row * tile_h
            right = (col + 1) * tile_w
            lower = (row + 1) * tile_h

            tile = img.crop((left, upper, right, lower))
            tile_path = f"tile_{idx}.jpg"
            tile.save(tile_path)
            tiles.append((tile_path, idx))
            idx += 1

    return tiles


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    temp_file = f"temp_{file.filename}"
    file.save(temp_file)

    tiles = split_image(temp_file)

    detections = []
    positive_tiles = []

    for tile_path, idx in tiles:
        results = model.predict(tile_path, verbose=False)

        tile_has_object = False
        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls)
                tile_has_object = True
                detections.append({
                    "tile": idx,
                    "class": cls_id,
                    "label": model.names[cls_id],
                    "confidence": float(box.conf),
                    "bbox": box.xyxy[0].tolist()
                })

        if tile_has_object:
            positive_tiles.append(idx)

        os.remove(tile_path)

    os.remove(temp_file)

    return jsonify({
        "detections": detections,
        "tiles": sorted(positive_tiles)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)