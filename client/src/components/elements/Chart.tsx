import React, { useEffect } from "react";
import * as d3 from "d3";

export default function Chart() {

  useEffect(() => {

    const margin = {top: 10, right: 30, bottom: 30, left: 50},
      width = 696 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
    const svg = d3.select("#area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

      // When reading the csv, I must format variables:
      d => {
        return {
          date: d3.timeParse("%Y-%m-%d")(d.date),
          value : d.value
        }
      }).then(

      // Now I can use this dataset:
      function(data) {

        // Add X axis --> it is a date format
        const x = d3.scaleTime()
          .domain(d3.extent(data, d => d.date))
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(x));

        // Add Y axis
        const y = d3.scaleLinear()
          .domain([0, d3.max(data, d => +d.value)])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // Add the area
        svg.append("path")
          .datum(data)
          .attr("fill", "#FFEDD5")
          .attr("stroke", "#EA580C")
          .attr("stroke-width", 1.5)
          .attr("d", d3.area()
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d.value))
          )
      })

  }, []);

  return (
    <div className="bg-white border-gray-200 rounded">
      <svg id="area" height={400.55} width={696}></svg>
    </div>
  );
}