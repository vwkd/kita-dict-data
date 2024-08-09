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


def render_doc_text(image, result):
    document = result["responses"][0]["fullTextAnnotation"]

    bounds = get_document_bounds(document, FeatureType.WORD)
    draw_boxes(image, bounds, "yellow", 1)

    bounds = get_document_bounds(document, FeatureType.PARA)
    draw_boxes(image, bounds, "blue", 2)

    bounds = get_document_bounds(document, FeatureType.BLOCK)
    draw_boxes(image, bounds, "red", 3)


def box_image(image_path, data_path, output_path):
    with Image.open(image_path) as img, open(data_path) as user_file:
        content = user_file.read()

        result = json.loads(content)

        try:
            render_doc_text(img, result)
        except Exception as e:
            print(f"Got error {e}")

        img.save(output_path)


if __name__ == "__main__":
    print("Create box images...")

    # for every part
    for part_number in range(1, 4):
        print(f"Part {part_number}")

        dirname = f"tmp/part{part_number}"

        # for every page
        for name in os.listdir(dirname):
            if re.match(r"^page-\d+\.jpg$", name):
                print(f"{name}")

                path = os.path.join(dirname, name)
                name_new = re.sub(r"^(page-\d+)(\.jpg)$", r"\1_boxed\2", name)
                path_new = os.path.join(dirname, name_new)

                page_number = name.split("-")[1].split(".")[0]
                data_path = (
                    f"out{part_number}/output-{page_number}-to-{page_number}.json"
                )

                # create boxed page image
                box_image(path, data_path, path_new)
            else:
                print(f"WARNING: Skipping unexpected file {name}")
