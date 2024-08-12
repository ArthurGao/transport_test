import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import * as d3 from 'd3';
import './DataRangeSlider.css';

const DataRangeSlider = ({ data }) => {
    const [rangeValue, setRangeValue] = useState([0, 8]);
    const [selectedOption, setSelectedOption] = useState('value');
    const [output, setOutput] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const datetime = data.datetime.map(d => new Date(d).getTime());
    const minDatetime = d3.min(datetime);
    const maxDatetime = d3.max(datetime);

    const calculateOutput = () => {
        const startIndex = rangeValue[0];
        const endIndex = selectedOption === 'value' ? startIndex : rangeValue[1];

        let speedResult;
        let losResult;
        switch (selectedOption) {
            case 'value':
                speedResult = data.speed[startIndex];
                losResult = data.los_band[startIndex];
                break;
            case 'mean':
                speedResult = d3.mean(data.speed.slice(startIndex, endIndex + 1));
                losResult = d3.mean(data.los_band.slice(startIndex, endIndex + 1));
                break;
            case 'maximum':
                speedResult = d3.max(data.speed.slice(startIndex, endIndex + 1));
                losResult = d3.max(data.los_band.slice(startIndex, endIndex + 1));
                break;
            case 'minimum':
                speedResult = d3.min(data.speed.slice(startIndex, endIndex + 1));
                losResult = d3.min(data.los_band.slice(startIndex, endIndex + 1));
                break;
            default:
                speedResult = data.speed[startIndex];
                losResult = data.los_band[startIndex];
                break;
        }
        setOutput({ "speed": speedResult, "los": losResult });
    };

    useEffect(() => {
        calculateOutput();
    }, [rangeValue, selectedOption]);

    useEffect(() => {
        if (selectedOption === 'value') {
            setRangeValue([rangeValue[0]]);
        } else {
            setRangeValue([0, 8]);
        }
    }, [selectedOption]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const toTime = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setRangeValue(prev => {
                    const nextValue = prev[0] + 1;
                    if (nextValue > data.datetime.length - 1) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        return prev;
                    }
                    return [nextValue, nextValue];
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="slider-wrapper">
            <h3 className="slider-title">Data Range Slider</h3>
            <div className="slider-controls">
                <select
                    className="slider-select"
                    value={selectedOption}
                    onChange={e => setSelectedOption(e.target.value)}
                >
                    <option value="value">Value</option>
                    <option value="mean">Mean</option>
                    <option value="maximum">Maximum</option>
                    <option value="minimum">Minimum</option>
                </select>
                <button className="slider-button" onClick={handlePlayPause}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>
            <div className="slider-container">
                <div className="slider-wrapper">
                    <ReactSlider
                        className="horizontal-slider"
                        thumbClassName="thumb"
                        trackClassName="track"
                        value={selectedOption === 'value' ? rangeValue[0] : rangeValue}
                        min={0}
                        max={data.datetime.length - 1}
                        onChange={value => setRangeValue(selectedOption === 'value' ? [value] : value)}
                        renderThumb={(props) => <div {...props}></div>}
                        pearling
                        minDistance={selectedOption === 'value' ? 0 : 1}
                        step={1}
                        ariaLabel={['Lower thumb', 'Upper thumb']}
                        ariaValuetext={state => `Thumb value ${state.valueNow}`}
                    />
                    <div className="slider-selector-values">
            <span
                className="left-value"
                style={{left: `${(rangeValue[0] / (data.datetime.length - 1)) * 100}%`}}
            >
                {toTime(datetime[rangeValue[0]])}
            </span>
                        {selectedOption !== 'value' && (
                            <span
                                className="right-value"
                                style={{left: `${(rangeValue[1] / (data.datetime.length - 1)) * 100}%`}}
                            >
                    {toTime(datetime[rangeValue[1]])}
                </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="slider-output">
                <strong>Selected {selectedOption}: </strong>
                <pre>{JSON.stringify(output, null, 2)}</pre>
            </div>
        </div>
    );
};

export default DataRangeSlider;
