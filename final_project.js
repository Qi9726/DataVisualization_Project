    function show_data(region) {

        d3.select('#line-chart').html('');

        d3.csv('world_regional_data.csv').then(function(data) {

        // Filter the data by the specified region
        const selectedRegion = data.map(d => {
          return { Year: d.Year, filteredRegion: d[region] };
        });

        selectedRegion.sort((a, b) => a.Year - b.Year);

        const margin = { top: 40, right: 200, bottom: 80, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        // Create the SVG element
        const svg = d3.select('#line-chart')
          .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .style('background-color', 'whitesmoke')
          .append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Set the background color for the chart
        const backgroundColor = 'aliceblue';

        // Add the background rectangle
        svg.append('rect')
          .attr('width', width)
          .attr('height', height)
          .style('fill', backgroundColor);

        // Set the ranges for the x and y axes
        const xScale = d3.scaleBand().domain(selectedRegion.map(d => d.Year)).range([0, width]).padding(0.1);
        const yScale = d3.scaleLinear().domain([0, 9]).range([height, 0]);

        // Add the x-axis
        svg.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale));

        // Add the y-axis
        svg.append('g')
          .call(d3.axisLeft(yScale));

        // Add x-axis label
        svg.append('text')
          .attr('x', width / 2)
          .attr('y', height + margin.bottom -30)
          .attr('text-anchor', 'middle')
          .text('Year');

        // Add y-axis label
        svg.append('text')
          .attr('transform', 'rotate(-90)')
          .attr('x', -height / 2)
          .attr('y', -margin.left + 20)
          .attr('text-anchor', 'middle')
          .text('Happiness Score');

        // Add region name for chart
        svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("font-family", "Arial")
        .attr("fill", "indigo")
        .attr("font-size", "18px")
        .text(region);

        // Add data source for chart
        svg.append('text')
          .attr('x', width/2)
          .attr('y', height + margin.bottom -10 )
          .attr('text-anchor', 'middle')
          .attr("font-size", "10px")
          .text('Data source: https://www.kaggle.com/datasets/usamabuttar/world-happiness-report-2005-present');

        // Add the highlighted line
        svg.append('path')
          .datum(selectedRegion)
          .attr('fill', 'none')
          .attr('stroke', 'indigo')
          .attr('stroke-width', 3)
          .attr('d', d3.line()
            .x(d => xScale(d.Year) + xScale.bandwidth() / 2)
            .y(d => yScale(d.filteredRegion))
          );

        // Add all the lines:
        var allRegion = data.columns.slice(1).map(function(id) {
            return {
                id: id,
                values: data.map(function(d){
                    return {
                        yearRange: d.Year,
                        measurement: +d[id]
                    };
                })
            };
        });

        const line = d3.line()
            .x(function(d) { return xScale(d.yearRange) + xScale.bandwidth() / 2; })
            .y(function(d) { return yScale(d.measurement); });

        const lines = svg.selectAll("lines")
            .data(allRegion)
            .enter()
            .append("g");

        lines.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); });

        lines.append("text")
        .attr("class","trend_label")
        .datum(function(d) {
            return {
                id: d.id,
                value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) {
                return "translate(" + (xScale(d.value.yearRange) + 30)
                + "," + (yScale(d.value.measurement) + 5 )+ ")"; })
        .attr("x", 5)
        .text(function(d) { return d.id; });

        const gray_lines = lines.append("path")
            .attr("class", "gray-line")
            .attr("d", function(d) { return line(d.values); });

        svg.selectAll(".gray-line")
            .on('mouseover', function() {
                const selection = d3.select(this).raise();

                selection
                    .transition()
                    .delay("100").duration("10")
                    .style("stroke","gold")
                    .style("opacity","3")
                    .style("stroke-width","3");

        // add the legend action
        const legend = d3.select(this.parentNode)
            .select(".trend_label");

        legend
            .transition()
            .delay("100")
            .duration("10")
          .style("fill","black");
        })

        .on('mouseout', function() {
            const selection = d3.select(this)

            selection
                .transition()
                .delay("100")
                .duration("10")
                .style("stroke","#d2d2d2")
                .style("opacity","0")
                .style("stroke-width","10");

            // add the legend action
            const legend = d3.select(this.parentNode)
                .select(".trend_label");

        legend
            .transition()
            .delay("100")
            .duration("10")
            .style("fill","#d2d2d2");
    });



        let annotationData;
        let annotationText = 'Annotation';

        if (region === 'South Asia') {
          annotationData = { Year: '2020', AvgHappyScore: selectedRegion.find(d => d.Year === "2020").filteredRegion };
          annotationText = "Export growth in manufacturing and textile industries";
        } else if (region === 'Central and Eastern Europe') {
          annotationData = { Year: '2021', AvgHappyScore: selectedRegion.find(d => d.Year === "2021").filteredRegion };
          annotationText = 'Economic rebound post COVID-19';
        } else if (region === 'East Asia') {
          annotationData = { Year: '2011', AvgHappyScore: selectedRegion.find(d => d.Year === "2011").filteredRegion };
          annotationText = 'Fiscal stimulus packages implemented after financial crisis';
        } else if (region === 'Latin America and Caribbean') {
          annotationData = { Year: '2019', AvgHappyScore: selectedRegion.find(d => d.Year === "2019").filteredRegion };
          annotationText = 'Increased exports of oil, minerals and foods';
        } else if (region === 'Sub-Saharan Africa') {
          annotationData = { Year: '2013', AvgHappyScore: selectedRegion.find(d => d.Year === "2013").filteredRegion };
          annotationText = 'Slowdown in global demand for raw materials exports';
        }

        // Interpolate the y-coordinate value of the trend line at the x-coordinate of the selected year
        const yInterpolated = yScale(annotationData.AvgHappyScore);

        svg.append('circle')
          .attr('cx', xScale(annotationData.Year) + xScale.bandwidth() / 2)
          .attr('cy', yInterpolated)
          .attr('r', 6)
          .attr('fill', 'red');


        // Add the text element for the annotation
        svg.append('text')
          .attr('x', xScale(annotationData.Year) + xScale.bandwidth() / 2)
         .attr('y', yInterpolated + 50)
           .text(annotationText)
          .attr('alignment-baseline', 'middle')
          .attr('text-anchor', 'middle')
          .attr('fill', 'red')
          .style('font-family', 'Arial, sans-serif')
          .style('font-weight', 'bold')
          .style('font-size', '12px');
          });

}

// Multi-line chart inspired by https://datawanderings.com/2019/11/01/tutorial-making-an-interactive-line-chart-in-d3-js-v-5/
