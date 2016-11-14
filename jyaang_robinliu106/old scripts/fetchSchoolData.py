#filename: fetchSchoolData.py

import json
import urllib.request #request the JSON url
import datetime
import pymongo
from pymongo import MongoClient

client = MongoClient('localhost',27017)



startTime = datetime.datetime.now()

url = "https://data.cityofboston.gov/api/views/e29s-ympv/rows.json?accessType=DOWNLOAD"

JSON_response = urllib.request.urlopen(url).read().decode("utf-8")

JSON_object = json.loads(JSON_response) #deserializes a str containing a JSON object to a list

#just for viewing as a string, we don't use this for anything...
#schoolData = json.dumps(JSON_object, indent=2, sort_keys=True) #seriealize obj to a JSON formatted str

#list of schools from JSON object
schoolData = JSON_object['data']

# A list with each element = [school name, [address information]]
schoolList =[]
for school in schoolData:
    schoolList.append([school[10],school[-1]])

for i in schoolList: print(i)

endTime = datetime.datetime.now()
