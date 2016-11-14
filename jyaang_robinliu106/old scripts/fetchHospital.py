#filename: fetchHospitals.py

import json
import urllib.request #request the JSON url
import datetime
import pymongo
#import dml
#from pymongo import MongoClient

#client = MongoClient('localhost',27017)

#set up mongodb connection
#client = dml.pymongo.MongoClient()
#repo = client.Response
#repo.authenticate("")


startTime = datetime.datetime.now()

url = "https://data.cityofboston.gov/api/views/46f7-2snz/rows.json?accessType=DOWNLOAD"

JSON_response = urllib.request.urlopen(url).read().decode("utf-8")

JSON_object = json.loads(JSON_response) #deserializes a str containing a JSON object to a list

#just for viewing as a string, we don't use this for anything...
#HospitalData = json.dumps(JSON_object, indent=2, sort_keys=True) #seriealize obj to a JSON formatted str


#print(JSON_object['data']);

#list of schools from JSON object
hospitalData = JSON_object['data']

hospitalList = []
for hospital in hospitalData:
    hospitalList.append([hospital[8],hospital[-1]])

print(hospitalList[0])

endTime = datetime.datetime.now()
