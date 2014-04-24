define(['app', 'd3', 'init'],

function(app){
    
    app.directive('qlikBarChart', ['$rootScope',
    function($rootScope) {
        return {
            restrict: 'A',
            scope: { 
                items: '=',
                colors: '='
            },
            link: function(scope, element, attrs) {
           
                var width = element.width()-65,
                    height = element.height();
                var data = scope.items;

                var barHeight = 30;

                var chart = d3.select(element[0]).append("svg")
                    .attr("width", width+65)
                    .attr("height", barHeight * data.length);  

                var maxValue = d3.max(data, function(d){ return d.value; });
                var x = d3.scale.linear()
                    .domain([0, maxValue])
                    .range([0, width]);

                var bar = chart.selectAll("g")
                        .data(data)
                        .enter().append("g")
                        .attr('class', 'barGroup')
                        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });            
                
                bar.append("rect")
                    .attr('class', 'rectBar')
                    .attr("width", function(d){
                        if (d.value == 0){
                            return '1px';
                        }
                        return x(d.value);
                    })
                    .attr("height", barHeight - 2)
                    .attr('fill', 'transparent')
                    .attr('stroke', '#444')
                    .attr('stroke-width', 0.5)
                    .on('click', function(d){
                        scope.$emit('bar-clicked', d);
                    })
                    .style('cursor', 'pointer');

                bar.append("text")
                    .attr('class', 'textBar')
                    .attr("x", function(d) { return x(d.value) - 3; })
                    .attr("y", barHeight / 2)
                    .attr("dy", ".15em")
                    .style('text-anchor', 'end')
                    .text(function(d) { return d.value; }); 

                bar.append("text")
                    .attr('class', 'textTile')
                    .attr("x", width +5 )
                    .attr("y", barHeight / 2)
                    .attr("dy", ".15em")
                    .style('text-anchor', 'start')
                    .style('fill', function(d){
                        return scope.colors[d.name];
                    })
                    .text(function(d) { return d.title; });      

                
                scope.$watch('items', function(items){
                    renderChart();                    
                }, true);

                function renderChart(){
                    var data = scope.items;

                    var maxValue = d3.max(data, function(d){ return d.value; });
                    if (maxValue == 0) maxValue = 1;
                    x.domain([0, maxValue]);

                    var rects = chart.selectAll('.rectBar').data(data);
                    rects.transition().attr("width", function(d){
                        if (d.value == 0){
                            return x(maxValue);
                        }
                        return x(d.value);
                    })
                    .attr('fill', function(d){
                        if (d.value == 0){
                            return 'transparent';
                        }else{
                            return scope.colors[d.name];
                        }  
                    });

                    var texts = chart.selectAll('.textBar').data(data);
                    texts.transition().attr("x", function(d) { 
                        if (d.value == 0){
                            return x(maxValue) - 3;
                        }
                        return x(d.value) - 3; 
                    })
                    .text(function(d) { 
                        return d.value; 
                    });
                }  


                $(window).on('resize', function(){
                    var width = element.width()-65;
                    console.log(width);
                    x.range([0, width]);
                }); 


            }
        };    
    }]);
});