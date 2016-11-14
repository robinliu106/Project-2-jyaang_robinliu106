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



class cpiByNeighborhood(dml.Algorithm):
    contributor = 'jyaang_robinliu106'
    reads = []
    writes = ['jyaang_robinliu106.testScore']

    @staticmethod
    def execute(trial = False):
        '''Retrieve some data sets (not using the API here for the sake of simplicity).'''
        startTime = datetime.datetime.now()

        # Set up the database connection.
        client = dml.pymongo.MongoClient()
        repo = client.repo
        repo.authenticate('jyaang_robinliu106', 'jyaang_robinliu106')

        #cursor = repo['jyaang_robinliu106.testScores'].find()

        scores = repo["jyaang_robinliu106.testScores"]

        map = Code("function() {emit(this.City, {CPI:this.CPI});}")
        reduce = Code("function(k, vs) {var total = 0;for(var i = 0; i < vs.length; i++)total += vs[i].CPI;return {City:k, CPI:total};}")
        repo.dropPermanent("totalCPI_neighborhood")
        repo.createPermanent("totalCPI_neighborhood")
        results = scores.map_reduce(map,reduce, "jyaang_robinliu106.totalCPI_neighborhood")

        #results = repo.jyaang_robinliu106.testScores.map_reduce(map,reduce, "jyaang_robinliu106.testScores")


        #repo['jyaang_robinliu106.totalCPI_neighborhood'].insert_many(results)

        repo.logout()

        endTime = datetime.datetime.now()

        return {"start":startTime, "end":endTime}


    @staticmethod
    def provenance(doc = prov.model.ProvDocument(), startTime = None, endTime = None):
        '''
        Create the provenance document describing everything happening
        in this script. Each run of the script will generate a new
        document describing that invocation event.
        '''

         # Set up the database connection.
        client = dml.pymongo.MongoClient()
        repo = client.repo
        repo.authenticate('jyaang_robinliu106', 'jyaang_robinliu106')

        doc.add_namespace('alg', 'http://datamechanics.io/algorithm/') # The scripts are in <folder>#<filename> format.
        doc.add_namespace('dat', 'http://datamechanics.io/data/') # The data sets are in <user>#<collection> format.
        doc.add_namespace('ont', 'http://datamechanics.io/ontology#') # 'Extension', 'DataResource', 'DataSet', 'Retrieval', 'Query', or 'Computation'.
        doc.add_namespace('log', 'http://datamechanics.io/log/') # The event log.
        doc.add_namespace('bdp', 'https://data.cityofboston.gov/resource/')

        this_script = doc.agent('alg:jyaang_robinliu106#getTestScores', {prov.model.PROV_TYPE:prov.model.PROV['SoftwareAgent'], 'ont:Extension':'py'})
        resource = doc.entity('bdp:wc8w-nujj', {'prov:label':'testScore Location', prov.model.PROV_TYPE:'ont:DataResource', 'ont:Extension':'json'})
        get_testScore = doc.activity('log:uuid'+str(uuid.uuid4()), startTime, endTime)
        doc.wasAssociatedWith(get_testScore, this_script)
        doc.usage(get_testScore, resource, startTime, None,
                {prov.model.PROV_TYPE:'ont:Retrieval',
                 'ont:Query':'?type=testScore&$select=type,latitude,longitude,OPEN_DT'
                }
            )

        testScore = doc.entity('dat:jyaang_robinliu106#testScore', {prov.model.PROV_LABEL:'testScore Locations', prov.model.PROV_TYPE:'ont:DataSet'})
        doc.wasAttributedTo(testScore, this_script)
        doc.wasGeneratedBy(testScore, get_testScore, endTime)
        doc.wasDerivedFrom(testScore, resource, get_testScore, get_testScore, get_testScore)

        repo.record(doc.serialize()) # Record the provenance document.
        repo.logout()

        return doc

cpiByNeighborhood.execute()
doc = cpiByNeighborhood.provenance()
print(doc.get_provn())
print(json.dumps(json.loads(doc.serialize()), indent=4))










"""
contributor = 'jyaang_robinliu106'
reads = []
writes = ['jyaang_robinliu106.c']
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
def project(R,p):
    return [p(t) for t in R]
def aggregate(R,f):
    keys = {r[0] for r in R}
    return [(key, f([v for (k,v) in R if k == key])) for key in keys]
    return[t for (k,v) in R for t in f(k,v)]
def reduce(f,R):
    keys = {k for (k,v) in R}
    return [f(k1, [v for (k2,v) in R if k1 == k2]) for k1 in keys]

map = Code("function() { emit(this.Name,1);}")
reduce = Code("function(k, vs) {return Array.sum(values)}, {out:'post_total'});")
result = repo.testScores.map_reduce(map,reduce,"myresults")
for doc in result.find():
    print(doc)

        scores = repo["jyaang_robinliu106.testScores"]

        map = Code("function() {emit(this.Name, {CPI:this.CPI});}")
        reduce = Code("function(k, vs) {var total = 0;for(var i = 0; i < vs.length; i++)total += vs[i].CPI;return {Name:k, CPI:total};}")
        results = scores.map_reduce(map,reduce, "jyaang_robinliu106.testScores")
        results = repo.jyaang_robinliu106.testScores.map_reduce(map,reduce, "jyaang_robinliu106.testScores")"""
