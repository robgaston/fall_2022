import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

let map;

async function init() {
    const neighborhoods = await import("../data/output.json");
    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource("neighborhoods").setData(neighborhoods);

    initPopup();
    initLegend();
}

function initLegend() {
    const legend = document.querySelector('#legend');
    const template = document.querySelector('#legend-entry');
    const fillColorStyle = map.getPaintProperty('neighborhoods-fill', 'fill-extrusion-color');

    fillColorStyle.splice(0, 2);
    let total = 0;

    for (let index = 0; index < fillColorStyle.length; index+=2) {
        const entry = document.importNode(template.content, true);
        const spans = entry.querySelectorAll("span");
        const color = fillColorStyle[index];
        const siteCount = fillColorStyle[index+1]

        spans[0].style.backgroundColor = color;

        if (index === fillColorStyle.length-1) {
            spans[1].textContent = ">=" + total;
        } else {
            spans[1].textContent = total + "-" + (siteCount-1);
            total = siteCount;
        }

        legend.appendChild(entry);
    }
}

let hovered;
const popup = document.querySelector('#popup');
const neighborhoodName = popup.querySelector('.neighborhood-name');
const count = popup.querySelector('.count');
function initPopup() {
    map.on('mousemove', 'neighborhoods-fill', function(event) {
        clearHover();
        if (event.features.length > 0) {
            hovered = event.features[0];
            map.setFeatureState(hovered, {
                hover: true
            });
            popup.style.display = "block";
            neighborhoodName.textContent = hovered.properties.name;
            count.textContent = hovered.properties.count;
        }
    });
    map.on('mouseleave', 'neighborhoods-fill', clearHover);
}

function clearHover() {
    if (hovered) {
        map.setFeatureState(hovered, {
            hover: false
        });
    }
    popup.style.display = "none";
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);
