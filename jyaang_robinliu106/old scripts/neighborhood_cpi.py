import json
import urllib.request #request the JSON url
import dml
import datetime
import pymongo
from pymongo import MongoClient
import ast
import uuid
import prov.model
from bson.code import Code

contributor = 'jyaang_robinliu106'
reads = []
writes = ['jyaang_robinliu106.']
# Set up the db connection
client = dml.pymongo.MongoClient()
repo = client.repo
repo.authenticate('jyaang_robinliu106', 'jyaang_robinliu106')

# Start the process
startTime = datetime.datetime.now()
# Use mapReduce. results = name and total CPI score.
map = Code("function() {emit(this.Name, {CPI:this.CPI});}")
reduce = Code("function(k, vs) {var total = 0;for(var i = 0; i < vs.length; i++)total += vs[i].CPI;return {Name:k, CPI:total};}")
results = repo.testScores.map_reduce(map,reduce, "")

cursor = repo['jyaang_robinliu106.testScores'].find()
for entry in cursor:
    temp_name = entry["Name"]
    split_name = temp_name.split("-")
    split_name[0] = split_name[0][0:-1]
    split_name[1] = split_name[1][1:]
    entry["Name"] = split_name[1]
    entry["City"] = split_name[0]
"""def project(R,p):
    return [p(t) for t in R]
def aggregate(R,f):
    keys = {r[0] for r in R}
    return [(key, f([v for (k,v) in R if k == key])) for key in keys]
    return[t for (k,v) in R for t in f(k,v)]
def reduce(f,R):
    keys = {k for (k,v) in R}
    return [f(k1, [v for (k2,v) in R if k1 == k2]) for k1 in keys]"""


"""map = Code("function() { emit(this.Name,1);}")
reduce = Code("function(k, vs) {return Array.sum(values)}, {out:'post_total'});")
result = repo.testScores.map_reduce(map,reduce,"myresults")
for doc in result.find():
    print(doc)"""

        scores = repo["jyaang_robinliu106.testScores"]

        map = Code("function() {emit(this.Name, {CPI:this.CPI});}")
        reduce = Code("function(k, vs) {var total = 0;for(var i = 0; i < vs.length; i++)total += vs[i].CPI;return {Name:k, CPI:total};}")
        results = scores.map_reduce(map,reduce, "jyaang_robinliu106.testScores")
        #results = repo.jyaang_robinliu106.testScores.map_reduce(map,reduce, "jyaang_robinliu106.testScores")
