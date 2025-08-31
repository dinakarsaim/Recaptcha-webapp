from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os

app = Flask(__name__)
CORS(app)

model = YOLO("best.pt")

def get_tile_index(bbox, img_width, img_height):
    """
    bbox = [x1, y1, x2, y2]
    img_width, img_height = original image size
    Returns tile index (0–8) for the grid.
    """
    x1, y1, x2, y2 = bbox

    cx = (x1 + x2) / 2
    cy = (y1 + y2) / 2

    col = int(cx // (img_width / 3))
    row = int(cy // (img_height / 3)) 

    return row * 3 + col

def get_tile_indices(bbox, img_width, img_height):
    """
    bbox = [x1, y1, x2, y2]
    Returns a list of tile indices (0–8) that overlap with the bbox.
    """
    x1, y1, x2, y2 = bbox

    tile_w = img_width / 3
    tile_h = img_height / 3

    tiles = []
    for row in range(3):
        for col in range(3):
            # Tile boundaries
            tx1 = col * tile_w
            ty1 = row * tile_h
            tx2 = (col + 1) * tile_w
            ty2 = (row + 1) * tile_h

            # Check overlap between bbox and tile
            overlap_x = max(0, min(x2, tx2) - max(x1, tx1))
            overlap_y = max(0, min(y2, ty2) - max(y1, ty1))
            if overlap_x > 0 and overlap_y > 0:
                tiles.append(row * 3 + col)

    return tiles


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    temp_file = f"temp_{file.filename}"
    file.save(temp_file)

    results = model.predict(temp_file)

    detections = []
    tile_indices = set()

    for r in results:
        img_w, img_h = r.orig_shape[1], r.orig_shape[0]  
        for box in r.boxes:
            bbox = box.xyxy[0].tolist()
            cls_id = int(box.cls)

            tile_idxs = get_tile_indices(bbox, img_w, img_h)
            tile_indices.update(tile_idxs)

            detections.append({
                "class": cls_id,
                "label": model.names[cls_id],
                "confidence": float(box.conf),
                "bbox": bbox,
                "tile": tile_idxs
            })

    os.remove(temp_file)

    return jsonify({
        "detections": detections,
        "tiles": sorted(list(tile_indices))  # unique list of tiles with objects
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)