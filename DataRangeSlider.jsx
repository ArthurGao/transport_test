import React, {useState, useEffect} from 'react';
import ReactSlider from 'react-slider';
import * as d3 from 'd3';
import './DataRangeSlider.css';


const DataRangeSlider = ({data}) => {
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

        let result;
        switch (selectedOption) {
            case 'value':
                result = data.speed[startIndex];
                break;
            case 'mean':
                result = d3.mean(data.speed.slice(startIndex, endIndex + 1));
                break;
            case 'maximum':
                result = d3.max(data.speed.slice(startIndex, endIndex + 1));
                break;
            case 'minimum':
                result = d3.min(data.speed.slice(startIndex, endIndex + 1));
                break;
            default:
                result = data.speed[startIndex];
                break;
        }
        setOutput(result);
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
        <div>
            <h3>Data Range Slider</h3>
            <select value={selectedOption} onChange={e => setSelectedOption(e.target.value)}>
                <option value="value">Value</option>
                <option value="mean">Mean</option>
                <option value="maximum">Maximum</option>
                <option value="minimum">Minimum</option>
            </select>
            <div className="slider-container">
                <div className="slider-labels">
                    <span className="slider-label">{formatDate(minDatetime)}</span>
                    -
                    <span className="slider-label">{formatDate(maxDatetime)}</span>
                </div>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    value={selectedOption === 'value' ? rangeValue[0] : rangeValue}
                    min={0}
                    max={data.datetime.length - 1}
                    onChange={value => setRangeValue(selectedOption === 'value' ? [value] : value)}
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    pearling
                    minDistance={selectedOption === 'value' ? 0 : 1}
                    step={1}
                    ariaLabel={['Lower thumb', 'Upper thumb']}
                    ariaValuetext={state => `Thumb value ${state.valueNow}`}
                />
            </div>
            <div>
                <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
            </div>
            <div>
                <strong>Selected {selectedOption}: </strong>{output}
            </div>
        </div>
    );
};

export default DataRangeSlider;
