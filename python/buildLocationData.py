import requests
from bs4 import BeautifulSoup as bs
import concurrent.futures

import overpass
import csv
api = overpass.API()

"""area[name="Toronto"][type="boundary"]->.tor;
	rel(area.tor)[admin_level=4][type="boundary"][boundary="administrative"];
	out geom;"""

print("starting work")

# south, west, north, east
# MapQuery = overpass.MapQuery(43.5082,-79.8425,43.9266,-78.9107)
# print("getting response",MapQuery)
# response = api.get(MapQuery)

# area:3600324211 - area code for toronto
# QUERY = '{{geocodeArea:Toronto}}->.searchArea;node["shop"](area.searchArea);'
# area_name = "Toronto"

queryShop = 'area[name="Toronto"]->.searchArea;(node["shop"]["name"]["addr:street"](area.searchArea););'
queryBuilding = 'area[name="Toronto"]->.searchArea;(node["building"]["name"]["addr:street"](area.searchArea););'
queryAmenity = 'area[name="Toronto"]->.searchArea;(node["amenity"]["name"]["addr:street"](area.searchArea););'

responseShop = api.get(queryShop,responseformat='csv("shop","name","addr:street")',verbosity="tags")
responseBuilding = api.get(queryBuilding,responseformat='csv("building","name","addr:street")',verbosity="tags")
responseAmenity = api.get(queryAmenity,responseformat='csv("amenity","name","addr:street")',verbosity="tags")
# response = api.get("node[shop][type = ]")

def printAll():
    for shop in responseShop:
        # if(shop[1] == "REMOVE"):
        print(shop[0].ljust(20," ")," | ",shop[1].ljust(40," ")," | ",shop[2].ljust(20," "))

    for building in responseBuilding:
        # if(building[1] == "REMOVE"):
        print(building[0].ljust(20," ")," | ",building[1].ljust(40," ")," | ",building[2].ljust(20," "))
    
    for amenity in responseAmenity:
        print(amenity[0].ljust(20," ")," | ",amenity[1].ljust(40," ")," | ",amenity[2].ljust(20," "))

count = 0
errors = 0

csv_Shop = []
csv_Building = []
csv_Amenity = []

for shop in responseShop:
    count+=1

    for i in responseAmenity: # registered 4695
        if shop[1] == i[1] and shop[2] == i[2]:
            errors += 1
            shop[1] = "REMOVE"
            break
    
    if shop[1] != "REMOVE" and not (shop in csv_Shop):
        csv_Shop.append(shop)

for building in responseBuilding: # registered 29
    count+=1
    
    for i in responseShop: 
        if building[1] == i[1] and building[2] == i[2]:
            errors += 1
            shop[1] = "REMOVE"
            break

    for i in responseAmenity:
        if building[1] == i[1] and building[2] == i[2]:
            errors += 1
            building[1] = "REMOVE"
            break

    if building[1] != "REMOVE" and not (building in csv_Building):
        csv_Building.append(building)


for amenity in responseAmenity: # registered 4954
    count+=1
    
    if amenity[1] != "REMOVE" and not (amenity in csv_Amenity):
        csv_Amenity.append(amenity)




def getURL(name, address):

    query = name + " " + address + " Location"
    params = {
        "q":query,
        "tbm":"isch"
    }
    html = requests.get("https://www.google.com/search",params,timeout=10)
    soup = bs(html.content,features="html.parser")
    images = soup.select('div img')
    return images[0]['src']
    

with open('city_database.csv','w', encoding='utf-8') as csvFile:
# file = open('city_database.csv','w')
    # csvWriter = csv.writer(csvFile, delimiter=',')

    #wohoo commit
    csvFile.write("id,type,name,address")
    csvFile.write("\n")
    
    iterator = 0
    for i in csv_Shop:
    # csvWriter.writerows(csv_Shop)
        csvFile.write(str(iterator)) # add id
        csvFile.write(",")
        for j in i: # add tags
            csvFile.write(j)
            csvFile.write(",")
        #add url

        csvFile.write("\n")
        iterator += 1
    for i in csv_Building:
        # csvWriter.writerow(i)
        
        csvFile.write(str(iterator))
        csvFile.write(",")
        for j in i:
            csvFile.write(j)
            csvFile.write(",")
        #add url

        csvFile.write("\n")
        iterator+=1

    for i in csv_Amenity:
        
        csvFile.write(str(iterator))
        csvFile.write(",")
        for j in i:
            csvFile.write(j)
            csvFile.write(",")
        #add url

        csvFile.write("\n")
        iterator += 1
        # csvWriter.writerow(i)

csvFile.close()

# for i in csv_Shop:
#     print(i)
# for i in csv_Building:
#     print(i)
# for i in csv_Amenity:
#     print(i)

# print("Count: ",count)
# print("Duplicates: ", errors)

# run through it one more time to build a csv file and possible turn that into pandas
# things to check for:
    # names, tags, addresses are all actual things and not just the label, name, type, addr:street
    # ignore all places with the name = REMOVE



# |||||||||||||||||| #

# count = 0
# for shop in response["features"]:
#     # print(shop)

#     if(shop["geometry"]["type"] == "Point"):
#         print(shop)

#         count+=1
#         # print(shop["properties"]["shop"].ljust(20," ")," | ",shop["properties"]["name"].ljust(40," ")," | ",shop["properties"]["addr:street"].ljust(20," "))
  
# print(count)


# print(
    # [(feature["id"], feature["properties"]["name"]) for feature in response["features"]]
    # count
# )