function getNameById(id, res) {
    // body...
    for (var i = 0; i < res.length; i++) {
        if (res[i].code == id) {
            return res[i].name;
        }
    }
}

function getInfosByRegion(resBase, resStation) {
    // body...
    var regions = getRegion(resBase);
    var infos = [];
    for (var i = 0; i < regions.length; i++) {
        var region = [];
        for (var j = 0; j < resBase.length; j++) {
            if (resBase[j].basin == regions[i]) {
                var station = [];
                for (var k = 0; k < resStation.length; k++) {
                    if (resStation[k].sta_id == resBase[j].code) {
                        station.push(resStation[k]);
                    }
                }
                region.push(station);
            }
        }
        infos.push(region);
    }
    return infos;
}



function getRegionChart(view, width, height, resBase, resStation, type) {
    // body...
     d3.select("#" + view).selectAll('*').remove();

    var res = getInfosByRegion(resBase, resStation);
    var riverRegion = getRegion(resBase);
    var index = [];
    var regionShort = [];
    for (var i = 0; i < riverRegion.length; i++) {
        regionShort.push(riverRegion[i].slice(0, 2));
    }
    var svg = d3.select("body")
        .select("#" + view)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var padding = { top: 10, right: 10, bottom: 30, left: 40 };
    for (var i = 0; i < riverRegion.length; i++) {
        interval = (width - padding.left - padding.right) / riverRegion.length;
        index.push(i * interval);
    }
    var xScale = d3.scaleOrdinal()
        .domain(regionShort)
        .range(index);
    var yScale = d3.scaleLinear()
        .domain([minValue(resStation, type), maxValue(resStation, type)])
        .range([height - padding.top - padding.bottom, 0]);

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickSize(height - padding.top - padding.bottom)
        .ticks(riverRegion.length);
    var yAxis = d3.axisLeft().scale(yScale).tickSize(0);

    svg.append("g")
        .attr("class", "axis")
        .attr("id", "x")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
        .call(xAxis);

    d3.select("#" + view)
        .select("#x")
        .selectAll("text")
        .attr("writing-mode", "vertical-lr")
        .attr("top", "5")
        .attr("id", function(d, i) {
            return i + "xAxis";
        });

    svg.append("g")
        .attr("class", "axis")
        .attr("id", "y")
        .attr("transform", function(d) {
            return "translate(" + (padding.left-5) + "," + (padding.top) + ")";
        })
        .call(yAxis);
    for (var i = 0; i < res.length; i++) {
        for (var j = 0; j < res[i].length; j++) {
            var avg = d3.mean(res[i][j], function(d, k) {
                switch (type) {
                    case "sta_ph_v":
                        return d.sta_ph_v;
                        break;
                    case "sta_do_v":
                        return d.sta_do_v;
                        break;
                    case "sta_an_v":
                        return d.sta_an_v;
                        break;
                    case "sta_toc_v":
                        return d.sta_toc_v;
                        break;
                    case "sta_pp_v":
                        return d.sta_pp_v;
                        break;
                }
            });
            var circle = svg.append("g")
                .append("circle")
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
                .attr("id",function() {
                    return i+"_"+j+"_"+avg;
                })
                .attr("transform", function() {
                    return "translate(" + (xScale(i) + padding.left )+ "," + (yScale(avg)+ padding.top) + ")"
                })
                .attr("r", 5)
                .on("mouseover", function() {
                    var x = this.id.split("_")[0];
                    var y = this.id.split("_")[1];
                    var avg = this.id.split("_")[2];
                    tooltip.html(avg+" " + riverRegion[x]+ " "+getNameById(res[x][y][0].sta_id, resBase)+" <br/>")
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY + 20) + "px")
                        .style("opacity", 1.0);
                    d3.select(this).transition()
                                    .ease(d3.easeLinear)
                                    .attr("r", "8");
                })
                .on("mouseomove", function() {
                    tooltip.style("left", (d3.event.pageX))
                        .style("top", (d3.event.pageY + 20));
                })
                .on("mouseout", function() {
                    d3.select(this).transition()
                                    .ease(d3.easeLinear)
                                    .attr("r", "5");
                    tooltip.style("opacity", 0.0);
                });;
        }
    }

}
