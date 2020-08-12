import torch
import torchvision
import cv2
import numpy as np
import torchvision.transforms as transforms
from PIL import Image
import time

t1 = time.time()
transform = transforms.ToTensor()
normalize = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[1, 1, 1])
res_to = 256
number_of_label_points = 9
model_path = "/Users/Hamed/PycharmProjects/Labeling/prediction/checkpoint_202008061041.pth.tar"
# image_address = "/Users/Hamed/PycharmProjects/Labeling/data/cropped/000000000000000022872247244725472483000000.jpeg"
# image_address = "/Users/Hamed/PycharmProjects/Labeling/learning/cropped_x256/0000000000000000000127012601271281271922550000.jpeg"
image_address = "/Users/Hamed/PycharmProjects/Labeling/learning/cropped_x256/25525525525525525525525525525525525524125501291281311281291281291921290128012801287192.jpeg"
image_name = "test1"
img = cv2.imread(image_address)
img_x256 = cv2.resize(img, (res_to, res_to), cv2.INTER_CUBIC)
cv2.imwrite('out/' + image_name + "_" + str(res_to) + ".jpg", img_x256)

model = torchvision.models.resnet18(num_classes=18).cpu()
model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu'))['model_state_dict'], strict='False')
model.eval()

with Image.open('out/' + image_name + "_" + str(res_to) + ".jpg") as img:
    input_image = img.convert('RGB')
# with Image.open(image_address) as img:
#     input_image = img.convert('RGB')
input = transform(input_image)
input = normalize(input)
input = input.unsqueeze(0)
input = input[:, :, 14:241, 14:241]
# input = torch.from_numpy(img_x256)
# input = input[np.newaxis, ...]
# input = np.expand_dims(input, axis=0)
# input = torch.from_numpy(input)
pred = model(input).detach().numpy()
print(pred)

t2 = time.time()
print(t2 - t1)

for i in range(number_of_label_points):
    img_x256 = cv2.circle(img_x256, (int(pred[0, 2 * i + 0].item()) + 14,
                                     int(pred[0, 2 * i + 1].item()) + 14), 4, (0, 1, 0), 2)
    img_x256 = cv2.circle(img_x256, (int(pred[0, 2 * i + 0].item()) + 14,
                                     int(pred[0, 2 * i + 1].item()) + 14), 4, (1, 0, 0), 2)
    cv2.imwrite('out/labeled_' + image_name + "_" + str(res_to) + ".jpg", img_x256)
