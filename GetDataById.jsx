import testData from './inputs/test_input.json';


const jsonData = Array.isArray(testData) ? testData : [];

export default function getDataById(id) {
    const result = jsonData.find(item => item.id === id);
    if (result) {
        return {
            speed: result.speed,
            los_band: result.los_band,
            datetime: result.datetime,
        };
    } else {
        return null;
    }
}
