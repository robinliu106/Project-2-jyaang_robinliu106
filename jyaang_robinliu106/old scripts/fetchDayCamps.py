#filename: fetchDayCamps.py
"""
This python script retrieves the data of Day Camps in Boston, and cleans the data to
be in a readable json format.
"""

import json
import urllib.request #request the JSON url
import datetime
import pymongo
from pymongo import MongoClient
import ast

client = MongoClient('localhost',27017)

startTime = datetime.datetime.now()

url = "https://data.cityofboston.gov/api/views/sgf2-btru/rows.json?accessType=DOWNLOAD"

JSON_response = urllib.request.urlopen(url).read().decode("utf-8")

JSON_object = json.loads(JSON_response) #deserializes a str containing a JSON object to a list

#just for viewing as a string, we don't use this for anything...
#dayCampData = json.dumps(JSON_object, indent=2, sort_keys=True) #seriealize obj to a JSON formatted str


#list of schools from JSON object
dayCampData = JSON_object['data']

dayCampList = []
for dayCamp in dayCampData:
    dayCampList.append([dayCamp[8],dayCamp[-1]])
#delete last, empty entry
dayCampList = dayCampList[:-1]

d = []
for entry in dayCampList:
    address = repr(entry[1][0])
    address = address[1:-1].split(',')
    if len(address[0]) < 3:
        continue
    city = str(address[1]).split(':')[1]
    city = city.strip("\"")
    d.append({"name": entry[0], "city": city, "coord" : entry[1][1:3]})
#p = json.dumps(d, indent=2, sort_keys=True)
p = json.dumps(d).replace('\\"',"\"")
print(p)
#print(jsonFormat)
#print(temp_json)

# Ex = ['Boys & Girls Club Camp Jubilee', ['{"address":"Warren","city":"ROXBURY","state":"","zip":"02119"}', '768713.1158', '2944385.259', None, False]]
endTime = datetime.datetime.now()
