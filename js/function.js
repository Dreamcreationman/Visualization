function maxValue(data, type) {
	return d3.max(data, function (d) {
		// body...
		switch(type){
			case "sta_ph_v":
				return d.sta_ph_v;break;
			case "sta_do_v":
				return d.sta_do_v;break;
			case "sta_an_v":
				return d.sta_an_v;break;
			case "sta_toc_v":
				return d.sta_toc_v;break;
			case "sta_pp_v":
				return d.sta_pp_v;break;
		}
	});
}

function minValue(data, type) {
	return d3.min(data, function (d) {
		// body...
		switch(type){
			case "sta_ph_v":
				return d.sta_ph_v;break;
			case "sta_do_v":
				return d.sta_do_v;break;
			case "sta_an_v":
				return d.sta_an_v;break;
			case "sta_toc_v":
				return d.sta_toc_v;break;
			case "sta_pp_v":
				return d.sta_pp_v;break;
		}
	});
}