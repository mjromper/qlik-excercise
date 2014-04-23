define(['app', 'd3', 'init'],

function(app){
    
    app.directive('qlikDonutChart', ['$rootScope',
    function($rootScope) {
        return {
            restrict: 'A',
            scope: { 
                items: '='
            },
            link: function(scope, element, attrs) {
           
                var width = element.width(),
                    height = element.height(),
                    radius = Math.min(width, height) / 2;

                var color = d3.scale.ordinal()
                    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

                var arc = d3.svg.arc()
                    .outerRadius(radius - 10)
                    .innerRadius(radius - 40);

                var pie = d3.layout.pie()
                    .sort(null)
                    .value(function(d) { return d.population; });

                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


                scope.$watch('items', function(items){
                    if (!items) return;

                    items.forEach(function(d) {
                        d.population = +d.population;
                    });

                    var g = svg.selectAll(".arc")
                        .data(pie(items))
                        .enter().append("g")
                        .attr("class", "arc");

                    g.append("path")
                        .attr("d", arc)
                        .style("fill", function(d) { return color(d.data.name); });

                    g.append("text")
                        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                        .attr("dy", ".35em")
                        .style("text-anchor", "middle")
                        .text(function(d) { return d.data.name; });
                })   


            }
        };    
    }]);
});