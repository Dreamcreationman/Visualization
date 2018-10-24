function getMonthChart(viewId, width, height, stationId, time, resBase, type) {
    // body...
    var stationChosenData = [];

    d3.select("#" + viewId).selectAll('*').remove();

    d3.csv("http://localhost:8080/VisTaskData/csv/WaterStation.csv").then(function(res) {
        // body...
        resStation = res;
        for (var i = 0; i < res.length; i++)
            if (res[i].sta_id == stationId && res[i].sta_time.split(" ")[1] == time) {
                stationChosenData.push(res[i])
            }
        var padding = { top: 20, right: 10, bottom: 10, left: 40 };
        var svg = d3.select("body")
            .select("#" + viewId)
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        var xScale = d3.scaleLinear()
            .domain([1, 31])
            .range([0, width - padding.left - padding.right]);
            console.log(maxValue(stationChosenData, type));
        var yScale = d3.scaleLinear()
            .domain([minValue(stationChosenData, type), maxValue(stationChosenData, type)])
            .range([height - padding.top - padding.bottom, 0]);

        var xAxis = d3.axisBottom().scale(xScale);
        var yAxis = d3.axisLeft().scale(yScale);

        svg.append("g")
            .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - 10) + ")").call(xAxis);
        svg.append("g")
            .attr("transform", "translate(" + padding.left + "," + (padding.top - 10) + ")").call(yAxis);

        var linePath = d3.line().x(function(d) {
                return xScale(d.sta_time.split(" ")[0].split("-")[2]);
            })
            .y(function(d) {
                switch (type) {
                    case "sta_ph_v":
                        return yScale(d.sta_ph_v);
                        break;
                    case "sta_do_v":
                        return yScale(d.sta_do_v);
                        break;
                    case "sta_an_v":
                        return yScale(d.sta_an_v);
                        break;
                    case "sta_toc_v":
                        return yScale(d.sta_toc_v);
                        break;
                    case "sta_pp_v":
                        return yScale(d.sta_pp_v);
                        break;
                }
            })

        svg.append("g")
            .append("path")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .attr("d", linePath(stationChosenData))
            .attr("fill", "none")
            .attr("stroke-width", 2)
            .attr("stroke", function() {
                switch (type) {
                    case "sta_ph_v":
                        return "#007bff";
                        break;
                    case "sta_do_v":
                        return "#28a745";
                        break;
                    case "sta_an_v":
                        return "#ffc107";
                        break;
                    case "sta_toc_v":
                        return "#dc3545";
                        break;
                    case "sta_pp_v":
                        return "#17a2b8";
                        break;
                }
            });

        svg.append("g")
            .selectAll("circle")
            .data(stationChosenData)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("transform", function(d) {
                return "translate("+(xScale(d.sta_time.split(" ")[0].split("-")[2]) + padding.left)+ ","+(yScale(d.sta_ph_v)+ padding.top)+")"
            })
            .attr("fill", function() {
                switch (type) {
                    case "sta_ph_v":
                        return "#007bff";
                        break;
                    case "sta_do_v":
                        return "#28a745";
                        break;
                    case "sta_an_v":
                        return "#ffc107";
                        break;
                    case "sta_toc_v":
                        return "#dc3545";
                        break;
                    case "sta_pp_v":
                        return "#17a2b8";
                        break;
                }
            })
            .attr("id", function(d) {
                return d.sta_time + "monthChart";
            })
            .on("mouseover", function(d) {
                tooltip.html("时间： " + d.sta_time + "<br/>")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .style("opacity", 1.0);
                document.getElementById(d.sta_time + "monthChart").setAttribute("r", "8");
            })
            .on("mouseomove", function(d) {
                tooltip.style("left", (d3.event.pageX))
                    .style("top", (d3.event.pageY + 20));
            })
            .on("mouseout", function(d) {
                document.getElementById(d.sta_time + "monthChart").setAttribute("r", "5");
                tooltip.style("opacity", 0.0);
            });
        drawRadar("radar", res, StationId, date, time);
        getRegionChart("region", 350, 240, resBase, res, type);
    });

}