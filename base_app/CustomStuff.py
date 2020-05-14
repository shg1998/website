def dicom_png():
    import numpy as np
    import png
    import pydicom
    import matplotlib.pyplot as plt
    import pydicom
    from pydicom.data import get_testdata_files

    ds = pydicom.dcmread('/home/hesam/fun/Carma/carma_000.dcm')

    print("Storage type.....:", ds.SOPClassUID)
    print()

    pat_name = ds.PatientName
    display_name = pat_name.family_name + ", " + pat_name.given_name
    print("Patient's name...:", display_name)
    print("Patient id.......:", ds.PatientID)
    print("Modality.........:", ds.Modality)
    print("Study Date.......:", ds.StudyDate)

    # if 'PixelData' in ds:
    #     rows = int(ds.Rows)
    #     cols = int(ds.Columns)
    #     print("Image size.......: {rows:d} x {cols:d}, {size:d} bytes".format(
    #         rows=rows, cols=cols, size=len(ds.PixelData)))
    #     if 'PixelSpacing' in ds:
    #         print("Pixel spacing....:", ds.PixelSpacing)
    #
    # # use .get() if not sure the item exists, and want a default value if missing
    # print("Slice location...:", ds.get('SliceLocation', "(missing)"))
    #
    # # plot the image using matplotlib
    # plt.imshow(ds.pixel_array, cmap=plt.cm.bone)
    # plt.show()
    

    shape = ds.pixel_array.shape

    # Convert to float to avoid overflow or underflow losses.
    image_2d = ds.pixel_array.astype(float)

    # Rescaling grey scale between 0-255
    image_2d_scaled = (np.maximum(image_2d, 0) / image_2d.max()) * 255.0

    # Convert to uint
    image_2d_scaled = np.uint8(image_2d_scaled)

    # Write the PNG file
    with open('/home/hesam/fun/Carma/res.png', 'wb') as png_file:
        w = png.Writer(shape[1], shape[0], greyscale=True)
        w.write(png_file, image_2d_scaled)