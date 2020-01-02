import React, { useEffect, useState } from 'react'
import { getDashboard } from '../../../network/apiFetcher'
import {
    Chart,
    ChartLegend,
    ChartSeries,
    ChartSeriesItem,
    ChartSeriesLabels,
    ChartTitle,
    ChartValueAxis,
    ChartValueAxisItem,
    ChartCategoryAxis,
    ChartCategoryAxisTitle,
    ChartCategoryAxisItem,
    ChartTooltip,

} from '@progress/kendo-react-charts';

import {
    ComposedChart, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
    Area, Bar, Line,
    BarChart, Cell,
} from 'recharts'

import data from './power-distribution-data.json';
import data1 from './waterfall-data.json';




const pointColor = (point) => {
    if (point.value > 0) {
        return 'purple';
    } else {
        return 'red';
    }
};

const labelContent = (e) => (e.category);




const Home = () => {

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        getDashboard().then(data => {
            console.log("dashboard data is =============", data.payload)
            setChartData(data.payload)
        })
    }, []);
    return (
        <div>
            <div className="container-width" >
                <Chart>
                    <ChartSeries>
                        <ChartSeriesItem type="donut" data={chartData} categoryField="accountName" field="opening">
                            <ChartSeriesLabels color={pointColor} background="none" content={labelContent} position="outsideEnd" />
                        </ChartSeriesItem>
                    </ChartSeries>
                    <ChartLegend visible={false} />
                </Chart>

                {/* *************************************************************************************************** */}
                <ComposedChart width={730} height={250} data={chartData}
                   margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                >
                    <XAxis dataKey="accountName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid stroke="#f5f5f5" />
                    {/* <Area type="monotone" dataKey="opening" fill="#8884d8" stroke="#8884d8" /> */}
                    <Bar dataKey="opening" barSize={20} fill="#413ea0" radius={[45,45,10,10]} />
                    <Line type="monotone" dataKey="opening" stroke="#ff7300" />
                </ComposedChart>
                {/**************************************************************************************************** */}
                <BarChart
                   width={800} height={300}
                    data={chartData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="accountName"   
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="opening"  barSize={20} fill="#8884d8" radius={[45,45,10,10]}/>
                </BarChart>
            </div>
        </div>
    )
}

export default Home