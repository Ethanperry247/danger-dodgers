import json

with open("weights.json") as file:
        res = json.load(file)

        jsonpoints = []
        for i in range(len(res['Lat'])):
                jsonpoints.append({
                        "latitude": res['Lat'][str(i)],
                        "longitude": res['Long'][str(i)],
                        "weight": res['hazard'][str(i)],
                })

        with open('res.json', 'w') as f2:
                f2.write(json.dumps(jsonpoints))