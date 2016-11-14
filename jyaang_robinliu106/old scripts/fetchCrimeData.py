#filename: fetchCrimeData.py

import json
import urllib.request #request the JSON url
import datetime
import pymongo
from pymongo import MongoClient

client = MongoClient('localhost',27017)



startTime = datetime.datetime.now()

url = "https://data.cityofboston.gov/api/views/fqn4-4qap/rows.json?accessType=DOWNLOAD"
JSON_response = urllib.request.urlopen(url).read().decode("utf-8")

JSON_object = json.loads(JSON_response) #deserializes a str containing a JSON object to a list

#just for viewing as a string, we don't use this for anything...
#crimeData = json.dumps(JSON_object, indent=2, sort_keys=True) #seriealize obj to a JSON formatted str

#list of schools from JSON object
crimeData = JSON_object['data']

# A list with each element = [school name, [address information]]

excludedCrimes = ['Other','Medical Assistance','Towed','Motor Vehicle Accident Response']

crimeList =[]
for crime in crimeData:
    if crime[10] not in excludedCrimes:
        crimeList.append([crime[10],crime[-1]])

for i in crimeList: print(i)

endTime = datetime.datetime.now()
