import http.client, urllib.request, urllib.parse, urllib.error, base64, json

###############################################
### This python module communicates with Microsoft's
### computer vision API to conduct OCR on images of
### insurance EOBs being uploaded by the user
###############################################

# NOTE: Replace the subscription_key string value with your valid subscription key.
subscription_key = '217e2f2f745fXXXXXXXXXXX'

# Microsoft: Computer Vision API endpoint
uri_base = 'westcentralus.api.cognitive.microsoft.com'

def comp_vision_msft(image_url):
    headers = {
        # Request headers.
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscription_key,
    }

    params = urllib.parse.urlencode({
        'language': 'unk',
        'detectOrientation ': 'true',
    })


    try:
        # Execute the REST API call and get the response.
        conn = http.client.HTTPSConnection(uri_base)
        conn.request("POST", "/vision/v1.0/ocr?%s" % params, "{'url': '" + image_url + "'}", headers)
        response = conn.getresponse()
        data = response.read()

        # 'data' contains the JSON data. The following formats the JSON data for display.
        parsed = json.loads(data.decode("utf-8"))
        # print statement sends the resulting JSON object back to server.js to be handled by bot
        print (parsed)
        conn.close()

    except Exception as e:
        print('Error:')
        print(e)

    ####################################
if __name__ == "__main__":
    image_url = input()
    comp_vision_msft(image_url)

