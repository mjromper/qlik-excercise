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

                console.log('fsadf', scope.items);
           
                var width = element.width(),
                    height = element.height();
                var data = scope.items;

                var barHeight = 20;

                var chart = d3.select(element[0]).append("svg")
                    .attr("width", width)
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
                        $scope.$emit('bar-clicked', d);
                    });

                bar.append("text")
                    .attr('class', 'textBar')
                    .attr("x", function(d) { return x(d.value) - 3; })
                    .attr("y", barHeight / 2)
                    .attr("dy", ".15em")
                    .text(function(d) { return d.value; });

                

                scope.$watch('items', function(items){

                    var data = items;

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
                          

                }, true);   


            }
        };    
    }]);
});