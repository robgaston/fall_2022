import turf from "@turf/turf";
import fs from "fs";
import sites from "../data/sites.json" assert {type: "json"};
import neighborhoods from "../data/neighborhoods.json" assert {type: "json"};

sites.features.forEach(function(feature) {
    feature.properties = {
        count: 1
    };
});

let output = turf.collect(neighborhoods, sites, "count", "count")

output.features = output.features.filter(function(feature, index) {
    feature.id = index;
    feature.properties.count = feature.properties.count.length;
    return feature.properties.count > 0;
});

output = JSON.stringify(output, null, "\t");

fs.writeFile("../data/output.json", output, function(error) {
    if (error) throw error;

    console.log("success. 👍");
});
