def is_image(file):
    import PIL
    try:
        PIL.Image.open(file)
        return True
    except PIL.UnidentifiedImageError:
        return False

def overwriteTempDicom(image_data):
    import numpy as np
    import png
    import pydicom
    from django.core.files.temp import NamedTemporaryFile

    # *************
    ds = pydicom.dcmread(image_data)

    shape = ds.pixel_array.shape

    # Convert to float to avoid overflow or underflow losses.
    image_2d = ds.pixel_array.astype(float)

    # Rescaling grey scale between 0-255
    image_2d_scaled = (np.maximum(image_2d, 0) / image_2d.max()) * 255.0

    # Convert to uint
    image_2d_scaled = np.uint8(image_2d_scaled)

    image_data.close()
    # *************

    # Write the PNG file
    png_file=NamedTemporaryFile()
    w = png.Writer(shape[1], shape[0], greyscale=True)
    w.write(png_file, image_2d_scaled)

    return png_file


