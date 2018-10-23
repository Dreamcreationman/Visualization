showmap("big-map", 1000, 800);

$('.form_date').datetimepicker({
        language:  'fr',
        weekStart: 1,
        todayBtn:  1,
		autoclose: true,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		keyboardNavigation:true
 });

function showmap(container_id, width, height) {
	// body...
	var StationId = "5";
	var projection = d3.geoMercator()
						.center([107, 31])
						.scale(800)
						.translate([width/2+60, height/2+60]);
	var path = d3.geoPath().projection(projection);
	var svg = d3.select("body")
				.select("#" + container_id)
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	var tooltip = d3.select("body")
					.append("div")
					.attr("id", "map-tooltips")
					.attr("class", "tooltips")
					.attr("opacity", 0.0);

	d3.json("http://localhost:8080/VisTaskData/json/china.geo.json").then(function (res) {
		// body...
		var map = svg.append("g").attr("transform", "translate(0,0)");
		map.selectAll("path")
			.data(res.features)
			.enter()
			.append("path")
			.attr("stroke", "rgb(111, 111, 111)")
			.attr("stroke-width", 1)
			.attr("fill","#5D6165")
			.attr("id", function (data) {
				// body...
				return data.properties.id;
			})
			.attr("d", path)
			.on("mouseover", function () {
				// body...
				d3.select(this).transition().ease(d3.easeLinear).attr("fill","#52585F");
			})
			.on("mouseout", function() {
				// body...
				d3.select(this).transition().duration(600).ease(d3.easeLinear).attr("fill", "#5D6165");
			});
		var text = svg.append("g").attr("transform", "translate(0, 0)");
		text.selectAll("text")
			.data(res.features)
			.enter()
			.append("text")
			.attr("transform", function(d) {
				// body...
				return "translate("+projection(d.properties.cp)+")";
			})
			.attr("text-anchor", "middle")
			.attr("font-size", "8pt")
			.attr("fill", "rgb(130, 130, 130)")
			.text(function (d) {
				// body...
				return d.properties.name;
			});
		var point = svg.append("g").attr("transform", "translate(0, 0)");
		d3.csv("http://localhost:8080/VisTaskData/csv/WaterBase.csv").then(function (res) {	
				// body...
			var color = d3.scaleOrdinal(d3.schemePaired);
			console.log(getRegion(res));
			point.selectAll("circle")
					.data(res)
					.enter()
					.append("circle")
					.attr("r", 3)
					.attr("transform", function(d, i){
						return "translate("+projection([d.lon, d.lat])+")";
					})	
					.attr("id", function(d) {
						return d.code+"map-unclicked";
					})
					.attr("fill", function(d, i) {
						return color(getRegion(res).indexOf(d.basin)%12);
					})
					.on("click", function (d ,i) {
						// body...
						StationId = d.code;
						getMonthChart("small-view1", 330, 240, StationId, "16:00:00", res);
						tooltip.style("opacity", 0.0);
						point.selectAll("circle").attr("r", "3")
							.attr("fill", "grey")
							.attr("id",function() {
								return d.code+"map-unclicked";
							});
						d3.select(this)
								.attr("id", function(d) {
									return d.code+"map-clicked";
								})
								.attr("r", "8")
								.attr("fill", function() {
									return color(getRegion(res).indexOf(d.basin)%12);
								});
						
					})
					.on("mouseover", function (d, i) {
						// body...
						d3.select(this).attr("r","8");
						tooltip.html("名称： "+ d.name+"<br/>"
									+"描述： "+ d.description +"<br/>")
								.style("left", (d3.event.pageX)+"px")
								.style("top", (d3.event.pageY+20)+"px")
								.style("opacity", 1.0);
					})
					.on("mousemove", function(d) {
						tooltip.style("left", (d3.event.pageX))
								.style("top", (d3.event.pageY+20));
					})
					.on("mouseout", function(d, i) {
						console.log(this.id.split("-")[1]);
						if (this.id.split("-")[1] == "unclicked") {
							d3.select(this).transition()
	                                    .ease(d3.easeLinear)
	                                    /*.attr("fill", function() {
											return color(getRegion(res).indexOf(d.basin)%12);
										}) 	*/
	                                    .attr("r", "3");
							tooltip.style("opacity", 0.0);
						}
					});
		});
		getMonthChart("small-view1", 330, 240, StationId, "16:00:00", res);
	})
}
