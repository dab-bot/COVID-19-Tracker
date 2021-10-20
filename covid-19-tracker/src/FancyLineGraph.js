import {React, useState, useEffect } from 'react'
import Chart from "react-apexcharts";

const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
      if (lastDataPoint) {
        let newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

function FancyLineGraph({ casesType = "cases", ...props }) {

    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            let chartData = buildChartData(data, casesType);
            setData(chartData);
          });
      };
  
      fetchData();
    }, [casesType]);

    console.log(data);

    return (
        <div id="chart">
        <Chart
          options={{
            stroke: {
                curve: 'smooth',
                width: 3,

            },
            dataLabels: {
                enabled: false
            },
            fill: {
                type: "gradient",
                gradient: {
                  shadeIntensity: 1,
                  opacityFrom: 0.7,
                  opacityTo: 0.9,
                  stops: [0, 90, 100]
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
          }}
          series={[
            {
              name: "series-1",
              data: data
            }
          ]}
          type="area"
        />
      </div>
    )
}

export default FancyLineGraph
