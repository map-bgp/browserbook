import React, {useEffect} from "react";
import * as d3 from "d3";

export default function Chart() {

  useEffect(() => {

    const margin = {top: 10, right: 0, bottom: 30, left: 0},
      width = 696 - margin.left - margin.right,
      height = 480 - margin.top - margin.bottom;

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
          // @ts-ignore
          date: d3.timeParse("%Y-%m-%d")(d.date),
          value : d.value
        }
      }).then(

      // Now I can use this dataset:
      function(data) {

        // const callout = (g, value) => {
        //   if (!value) return g.style("display", "none");
        //
        //   g
        //     .style("display", null)
        //     .style("pointer-events", "none")
        //     .style("font", "10px sans-serif");
        //
        //   const path = g.selectAll("path")
        //     .data([null])
        //     .join("path")
        //     .attr("fill", "white")
        //     .attr("stroke", "black");
        //
        //   const text = g.selectAll("text")
        //     .data([null])
        //     .join("text")
        //     .call(text => text
        //       .selectAll("tspan")
        //       .data((value + "").split(/\n/))
        //       .join("tspan")
        //       .attr("x", 0)
        //       .attr("y", (d, i) => `${i * 1.1}em`)
        //       .style("font-weight", (_, i) => i ? null : "bold")
        //       .text(d => d));
        //
        //   const {x, y, width: w, height: h} = text.node().getBBox();
        //
        //   text.attr("transform", `translate(${-w / 2},${15 - y})`);
        //   path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
        // }

        // Add X axis --> it is a date format
        const x = d3.scaleTime()
          // @ts-ignore
          .domain(d3.extent(data, d => d.date))
          .range([ 0, width ]);

        svg.append("g")
          .attr("transform", `translate(0,${height + 8})`)
          .call(d3.axisBottom(x).tickSize(0).tickFormat(d3.timeFormat("%Y")))
          .call(g => g.select(".domain").remove());

        // Add Y axis
        const y = d3.scaleLinear()
          // @ts-ignore
          .domain([0, d3.max(data, d => +d.value)])
          .range([ height, 0 ]);

        // const tooltip = svg.append("g");
        // svg.on("touchmove mousemove", function(event) {
        //   const {date, value} = d3.bisect(d3.pointer(event, this)[0]);
        //
        //   tooltip
        //     .attr("transform", `translate(${x(date)},${y(value)})`)
        //     .call(callout, `${d3.formatValue(value)}
        //       ${d3.formatDate(date)}`);
        // });
        //
        // svg.on("touchend mouseleave", () => tooltip.call(callout, null));

        // // Append a circle
        // svg.append("circle")
        //   .attr("id", "circleBasicTooltip")
        //   .attr("cx", 150)
        //   .attr("cy", 200)
        //   .attr("r", 40)
        //   .attr("fill", "#69b3a2")
        //
        // // create a tooltip
        // var tooltip = d3.select("#area")
        //   .append("div")
        //   .style("position", "absolute")
        //   .style("visibility", "hidden")
        //   .text("I'm a circle!");
        //
        // //
        // d3.select("#circleBasicTooltip")
        //   .on("mouseover", function(){return tooltip.style("visibility", "visible");})
        //   .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-800)+"px").style("left",(d3.event.pageX-800)+"px");})
        //   .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        // Add the area
        svg.append("path")
          .datum(data)
          .attr("fill", "#FFEDD5")
          .attr("stroke", "#EA580C")
          .attr("stroke-width", 1.5)
          // @ts-ignore
          .attr("d", d3.area()
            // @ts-ignore
            .x(d => x(d.date))
            .y0(y(0))
            // @ts-ignore
            .y1(d => y(d.value))
          )

      })
  }, []);

  return (
    <>
      <style>{"\
        svg text {\
          margin-top: 2px;\
          fill: #71717A;\
          font-weight: 800;\
          font: 12px sans-serif;\
          text-anchor: center;\
         }\
      "}</style>
      <div className="bg-white border-gray-200 rounded">
        <svg id="area" height={480.55} width={696}></svg>
      </div>
    </>
  );
}