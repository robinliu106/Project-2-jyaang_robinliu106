#filename: reduceTestScores.py
"""
This python script retrieves the data of Boston school test scores from a json file, and reduces it.
"""

import json
import urllib.request #request the JSON url
import dml
import datetime
import pymongo
from pymongo import MongoClient
import ast
import uuid
import prov.model


#contributor = 'jyaang_robinliu106'
#reads = []
#writes = ['jyaang_robinliu106.BostonSchoolTestScores']


startTime = datetime.datetime.now()
client = dml.pymongo.MongoClient()
repo = client.repo
repo.authenticate('jyaang_robinliu106', 'jyaang_robinliu106')

with open('BostonSchoolTestScores.json') as json_data:
    testScores = json.load(json_data)

for entry in testScores:
    for key in entry:
        if key == "Org Name":
            entry["Name"] = entry.pop(key)
        else:
            continue
jsonTestScores = json.dumps(testScores)
repo.dropPermanent("testScores")
repo.createPermanent("testScores")
repo['jyaang_robinliu106.testScores'].insert_many(testScores)

endTime = datetime.datetime.now()
