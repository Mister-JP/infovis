
// SVG drawing area

let margin = {top: 40, right: 10, bottom: 60, left: 60};

let width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;



let svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// Scales
let x = d3.scaleBand()
    .rangeRound([0, width])
	.paddingInner(0.1);

let y = d3.scaleLinear()
    .range([height, 0]);


// Initialize data
loadData();

// Create a 'data' property under the window object
// to store the coffee chain data
Object.defineProperty(window, 'data', {
	// data getter
	get: function() { return _data; },
	// data setter
	set: function(value) {
		_data = value;
		// update the visualization each time the data property is set by using the equal sign (e.g. data = [])
		updateVisualization()
	}
});

var max_rev=0;
var max_store = 0;
var count = 0;

let y_append = svg.append("g")
	.attr("transform", "translate(0, 0)");

let x_append = svg.append("g")
	.attr("transform", "translate(0, "+height+")");

// Load CSV file
function loadData() {

	d3.csv("data/coffee-house-chains.csv").then(csv=> {

		csv.forEach(function(d){
			d.revenue = +d.revenue;
			d.stores = +d.stores;
			if(max_rev<d.revenue){
				max_rev = d.revenue;
			}
			if(max_store<d.stores){
				max_store = d.stores;
			}
			count=count+1;
		});

		// Store csv data in global variable
		data = csv;

		let rev_dom = d3.scaleLinear().domain([max_rev,0]).range([height, 0]);
		let store_dom = d3.scaleLinear().domain([max_store,0]).range([height, 0]);
		let com_dom = d3.scaleBand().domain(data.map((d)=>{return d.company})).range([width,0]);

		var x_scale = d3.scaleBand()
			.domain(data.map((d)=>{return d.company}))
			.padding(0.2)
			.range([width, 0]);

		var x_axis = d3.axisBottom()
			.scale(x_scale);

		var y_scale = d3.scaleLinear()
			.domain([0, max_store])
			.range([height, 0]);

		var y_axis = d3.axisLeft()
			.scale(y_scale);

		y_append.attr("id","y-axis")
			.transition()
			.duration(1000)
			.call(y_axis);

		x_append.attr("id","x-axis")
			.transition()
			.duration(1000)
			.call(x_axis);

		console.log(data);


		let rect = svg.selectAll("rect")
			.data(data);



		rect.enter().append("rect")
			.transition()
			.duration(1000)
			.attr("x", (d)=>{return x_scale(d.company)})
			.attr("y", (d,i)=>{return height-store_dom(d.stores)})
			.attr("width",10)
			.attr("height", (d,i)=>{return store_dom(d.stores)})
			.attr("fill","rgba(105,84,62,0.8)");

        // updateVisualization gets automatically called within the data = csv call;
		// basically(whenever the data is set to a value using = operator);
		// see the definition above: Object.defineProperty(window, 'data', { ...
	});
}


//document.getElementById('ranking-type').storeID.onchange = updateVisualization();


var sorting = true;

// Render visualization
function sortButton(){
	var val = document.getElementById("ranking-type").value;
	console.log("button val - "+val);
	data.reverse();

	if(!sorting) {
		sorting = true;
	}
	else{
		sorting = false;
	}
	updateVisualization(val);
}


function updateVisualization(val) {
  //console.log("insode update"+data);

	//console.log("max_rev = "+max_rev);
	//console.log("max_stores = "+max_store);
	let rev_dom = d3.scaleLinear().domain([max_rev,0]).range([height, 0]);
	let store_dom = d3.scaleLinear().domain([max_store,0]).range([height, 0]);




  if(val == "revenue"){
	  if(sorting) {
		  data.sort((b, a) => b.revenue - a.revenue);
	  }
	  else{
		  data.sort((a, b) => b.revenue - a.revenue);
	  }
	  x_scale = d3.scaleBand()
		  .domain(data.map((d)=>{return d.company}))
		  .padding(0.2)
		  .range([width, 0]);

	  x_axis = d3.axisBottom()
		  .scale(x_scale);

	  y_scale = d3.scaleLinear()
		  .domain([0, max_rev])
		  .range([height, 0]);

	  y_axis = d3.axisLeft()
		  .scale(y_scale);

	  y_append.transition()
		  .duration(1000).call(y_axis)	;

	  x_append.transition()
		  .duration(1000).call(x_axis);

	  console.log("rev");
	  let rect = svg.selectAll("rect")
		  .data(data);

	  rect.enter().append("rect")
		  .merge(rect)
		  .style("opacity", 0.5)
		  .transition()
		  .duration(1000)
		  .style("opacity",1)
		  .attr("x", (d,i)=>{return x_scale(d.company)})
		  .attr("y", (d,i)=>{return height-rev_dom(d.revenue)})
		  .attr("width",x_scale.bandwidth())
		  .attr("height", (d,i)=>{return rev_dom(d.revenue)})
		  .attr("fill","rgba(105,84,62,0.8)");

	  rect.exit().remove();
  }
  else{
	  if(sorting) {
		  data.sort((b, a) => b.stores - a.stores);
	  }
	  else{
		  data.sort((a, b) => b.stores - a.stores);
	  }
	  //data.sort((b,a)=> b.stores - a.stores);
	  var x_scale = d3.scaleBand()
		  .domain(data.map((d)=>{return d.company}))
		  .padding(0.2)
		  .range([width, 0]);

	  x_axis = d3.axisBottom()
		  .scale(x_scale);

	  y_scale = d3.scaleLinear()
		  .domain([0, max_store])
		  .range([height, 0]);

	  y_axis = d3.axisLeft()
		  .scale(y_scale);

	  y_append.transition()
		  .duration(1000).call(y_axis);

	  x_append.transition()
		  .duration(1000)	.call(x_axis);

	  console.log("stores");
	  let rect = svg.selectAll("rect")
		  .data(data);

	  rect.enter().append("rect")
		  .merge(rect)
		  .style("opacity", 0.5)
		  .transition()
		  .duration(1000)
		  .style("opacity", 1)
		  .attr("x", (d,i)=>{return x_scale(d.company)})
		  .attr("y", (d,i)=>{return height-store_dom(d.stores)})
		  .attr("width",x_scale.bandwidth())
		  .attr("height", (d,i)=>{return store_dom(d.stores)})
		  .attr("fill","rgba(105,84,62,0.8)");

	  rect.exit().remove();
  }


}