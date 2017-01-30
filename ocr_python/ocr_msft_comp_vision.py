"""
    MSFT Computer Vision OCR API call script
"""

########### Python 3.2 #############
import http.client, urllib.request, urllib.parse, urllib.error, base64, json

def ocr_msft(url):
    headers = {
        # Request headers
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': 'd1e609fa66914785b879ee1aaf4b9262',
    }

    params = urllib.parse.urlencode({
        # Request parameters
        'language': 'unk',
        'detectOrientation ': 'true',
    })

    try:
        conn = http.client.HTTPSConnection('api.projectoxford.ai')
        conn.request("POST", "/vision/v1.0/ocr?%s" % params, "{'url': '" + url + "'}", headers)
        response = conn.getresponse()
        data = response.read()
        ### Manipulate "data" HERE########

        print(data)
        conn.close()
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))

if __name__ == "__main__":
    url = input()
    ocr_msft(url)
####################################