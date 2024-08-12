const processData = (data) => {
    const groupedData = data.reduce((acc, curr) => {
        curr.datetime.forEach((dt, index) => {
            if (!acc[dt]) {
                acc[dt] = {
                    datetime: dt,
                    speeds: new Set(),
                    los_bands: []
                };
            }
            acc[dt].speeds.add(curr.speed[index]);
            acc[dt].los_bands.push(curr.los_band[index]);
        });
        return acc;
    }, {});

    const preparedData = Object.values(groupedData).map(group => ({
        datetime: group.datetime,
        speeds: Array.from(group.speeds),
        los_band: group.los_bands[group.los_bands.length - 1]
    }));

    return preparedData;
};

export default processData;
