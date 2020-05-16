def is_image(file):
    import PIL
    try:
        PIL.Image.open(file)
        return True
    except PIL.UnidentifiedImageError:
        return False

def overrideTempDicom(image_data):
    import numpy as np
    import png
    import pydicom
    import io

    # *************
    ds = pydicom.dcmread(image_data.file)

    shape = ds.pixel_array.shape

    # Convert to float to avoid overflow or underflow losses.
    image_2d = ds.pixel_array.astype(float)

    # Rescaling grey scale between 0-255
    image_2d_scaled = (np.maximum(image_2d, 0) / image_2d.max()) * 255.0

    # Convert to uint
    image_2d_scaled = np.uint8(image_2d_scaled)
    # *************

    # Write the PNG file
    with io.BytesIO() as png_file:
        w = png.Writer(shape[1], shape[0], greyscale=True)
        w.write(png_file, image_2d_scaled)

    return png_file


