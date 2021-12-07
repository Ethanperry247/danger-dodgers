import React, { useContext, useState, useEffect } from "react";
import { Heatmap } from 'react-native-maps';
import AuthContext from '../../Helpers/Auth';

const customData = require('../../Assets/res.json')

const points = [{
    latitude: 39.75523057362685,
    longitude: -105.22186051013645,
    weight: 100,
}, {
    latitude: 39.75624057362685,
    longitude: -105.22186051013645,
    weight: 10,
}];

const Heat = () => {
    const context = useContext(AuthContext);
    const [heatmaps, setHeatmaps] = useState([]);

    useEffect(() => {
        const getHeatMaps = async () => {
            const data = await context.useAuthorizedGet('/analysis/all');

            if (data.state === 'SUCCESS') {
                setHeatmaps(data.content);
            }
        };

        getHeatMaps();

    }, []);

    return (<>{
        heatmaps.length > 0 && heatmaps.map((heatmap, index) => {
            return (<Heatmap key={index} points={JSON.parse(heatmap.analysis)} radius={10} opacity={0.4} minIntensity={5} maxIntensity={100} gradientSmoothing={5} ></Heatmap>);
        })
    }</>);
}

export default Heat;