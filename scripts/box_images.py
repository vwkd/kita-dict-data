import json
import os
from enum import Enum
from PIL import Image, ImageDraw


class FeatureType(Enum):
    PAGE = 1
    BLOCK = 2
    PARA = 3
    WORD = 4
    SYMBOL = 5


def draw_boxes(image, bounds, color, line_width):
    draw = ImageDraw.Draw(image)

    (width, height) = image.size

    # correct offset due to line width by shifting coordinates by same amount
    for bound in bounds:
        draw.polygon(
            [
                bound["normalizedVertices"][0]["x"] * width + line_width,
                bound["normalizedVertices"][0]["y"] * height + line_width,
                bound["normalizedVertices"][1]["x"] * width + line_width,
                bound["normalizedVertices"][1]["y"] * height + line_width,
                bound["normalizedVertices"][2]["x"] * width + line_width,
                bound["normalizedVertices"][2]["y"] * height + line_width,
                bound["normalizedVertices"][3]["x"] * width + line_width,
                bound["normalizedVertices"][3]["y"] * height + line_width,
            ],
            None,
            color,
            line_width,
        )
    return image


def get_document_bounds(document, feature):

    bounds = []

    for page in document["pages"]:
        for block in page["blocks"]:
            for paragraph in block["paragraphs"]:
                for word in paragraph["words"]:
                    if feature == FeatureType.WORD:
                        bounds.append(word["boundingBox"])

                if feature == FeatureType.PARA:
                    bounds.append(paragraph["boundingBox"])

            if feature == FeatureType.BLOCK:
                bounds.append(block["boundingBox"])

    return bounds


def render_doc_text(book, page):
    image_file = f"p{book}/p-{page:03}.jpg"
    data_file = f"out{book}/output-{page}-to-{page}.json"
    image_file_out = f"box{book}/p-{page}.jpg"

    print(f"Create boxed {book}/{page} ...")

    image = Image.open(image_file)

    with open(data_file) as user_file:
        content = user_file.read()

    result = json.loads(content)
    try:
        document = result["responses"][0]["fullTextAnnotation"]

        bounds = get_document_bounds(document, FeatureType.WORD)
        draw_boxes(image, bounds, "yellow", 1)

        bounds = get_document_bounds(document, FeatureType.PARA)
        draw_boxes(image, bounds, "blue", 2)

        bounds = get_document_bounds(document, FeatureType.BLOCK)
        draw_boxes(image, bounds, "red", 3)
    except:
        print(f"Skipped empty page {book}/{page}")

    image.save(image_file_out)


if __name__ == "__main__":
    book1 = 1
    last_page1 = 862

    os.makedirs("box1", exist_ok=True)
    for page in range(1, last_page1 + 1):
        render_doc_text(book1, page)

    book2 = 2
    last_page1 = 818

    os.makedirs("box2", exist_ok=True)
    for page in range(1, last_page1 + 1):
        render_doc_text(book2, page)

    book3 = 3
    last_page1 = 832

    os.makedirs("box3", exist_ok=True)
    for page in range(1, last_page1 + 1):
        render_doc_text(book3, page)
