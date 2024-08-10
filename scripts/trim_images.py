import os
import re
from PIL import Image, ImageChops


def trim_whitespace(image_path, output_path):
    with Image.open(image_path) as img:
        if img.mode != "RGB":
            raise Exception("Image is not in RGB mode.")

        # Get bounding box of non-white content
        bg = Image.new("RGB", img.size, (255, 255, 255))
        diff = ImageChops.difference(img, bg)
        bbox = diff.getbbox()

        if not bbox:
            raise Exception("No content found in the image.")

        imgNew = img.crop(bbox)

        imgNew.save(output_path)


if __name__ == "__main__":
    print("Create trimmed images...")

    # for every part
    for part_number in range(1, 4):
        dirname = f"tmp/part{part_number}"

        # for every page
        for name in os.listdir(dirname):
            if re.match(r"^page-\d+\.jpg$", name):
                print(f"{name}")

                path = os.path.join(dirname, name)
                name_new = re.sub(r"^(page-\d+)(\.jpg)$", r"\1_trimmed\2", name)
                path_new = os.path.join(dirname, name_new)

                # create trimmed page image
                trim_whitespace(path, path_new)
            else:
                print(f"WARNING: Skipping unexpected file {name}")
