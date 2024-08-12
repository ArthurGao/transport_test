import React, {useRef, useState} from 'react';
import DataRangeSlider from './DataRangeSlider';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import {scaleThreshold} from "d3-scale";
import {PathStyleExtension} from '@deck.gl/extensions';
import {PathLayer} from '@deck.gl/layers';
import getDataById from "./GetDataById";

//const testData = getDataById(2);

// Source data
const DATA =
    'inputs/test_input_example.json';

// set a linear scale for the colour for los band 1 to 6
const colorScale = scaleThreshold()
    .domain([1, 2, 3, 4, 5, 6])
    .range([
        [60, 207, 23],
        [125, 171, 0],
        [150, 135, 0],
        [158, 98, 0],
        [152, 63, 4],
        [134, 29, 29]
    ]);

// Set the initial view state
const INITIAL_VIEW_STATE = {
    latitude: -41.291668,
    longitude: 174.787618,
    zoom: 13,
    maxZoom: 20,
    pitch: 0,
    bearing: 0
};

// Set the map style
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

// Function to get the tooltip
function getTooltip({object}) {
    return (
        object && {
            html: `\
  <div>ID: ${object.id}</div>
  <div>Datetime: ${object.datetime}</div>
  <div>Speed: ${object.speed}</div>
  <div>Level of Service: ${object.los_band}</div>
  `
        }
    );
}

export default function App({data = DATA, mapStyle = MAP_STYLE}) {
    const [testData, setTestData] = useState(null);
    const sliderRef = useRef(null);


    const handleMapClick = (info) => {
        if (info.object) {
            const id = info.object.id;
            const newData = getDataById(id);
            if (sliderRef.current) {
                sliderRef.current.refresh(newData);
            }
        }
    };
    const layers = [
        new PathLayer({
            id: 'test-example',
            data: data,
            getColor: d => colorScale(d.los_band),
            getPath: d => d.coordinates,
            getWidth: 10,
            jointRounded: true,
            widthMinPixels: 2,
            autoHighlight: true,
            opacity: 1,
            pickable: true,
            getOffset: -0.5,
            extensions: [new PathStyleExtension({offset: true, dashJustified: true})]
        })
    ];

    return (
        <div>
            <DeckGL
                layers={layers}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                getTooltip={getTooltip}
                onClick={handleMapClick}
            >
                <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true}/>
            </DeckGL>
                <div className="slider-panel">
                    <DataRangeSlider ref={sliderRef} initialData={getDataById(2)}/>
                </div>
        </div>
    );
}

export function renderToDOM(container) {
    createRoot(container).render(<App/>);
}
