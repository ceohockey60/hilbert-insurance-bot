
# coding: utf-8

# In[12]:

from PIL import Image as pi
from wand.image import Image
import sys
import pyocr
import pyocr.builders
import io


# In[68]:

def ocr_pdf(filename):
	tool = pyocr.get_available_tools()[0]
	langs = tool.get_available_languages()
	# print("Available languages: %s" % ", ".join(langs))
	lang = langs[0]
	# print("Will use lang '%s'" % (lang)) 
	img_pdf = Image(filename=filename, resolution=300)
	img_jpg = img_pdf.convert('jpeg')

	req_image = []
	for img in img_jpg.sequence:
	    img_page = Image(image=img)
	    req_image.append(img_page.make_blob('jpeg'))

# In[70]:

	final_txt = []
	for img in req_image:
	    txt = tool.image_to_string(
	        pi.open(io.BytesIO(img)),
	        lang=lang,
	        builder=pyocr.builders.TextBuilder()
	    )
	    final_txt.append(txt)

# In[72]:

	print(final_txt)


if __name__ == "__main__":
	filename = input("filename: ")
	ocr_pdf(filename)

	