var myChart;

function generateData(inputFunction) {
    var x = [];
    var y = [];

    for (var i = -10; i <= 10; i += 0.1) {
        x.push(i);
        y.push(calculateFunction(inputFunction, i));
    }

    return { x: x, y: y };
}

function calculateFunction(inputFunction, value) {
    try {
        var editedFunction = inputFunction
            .replace(/sin/g, 'Math.sin')
            .replace(/cos/g, 'Math.cos')
            .replace(/tan/g, 'Math.tan')
            .replace(/sqrt/g, 'Math.sqrt')
            .replace(/log/g, 'Math.log')
            .replace(/exp/g, 'Math.exp');

        var safeFunction = new Function('x', `
            return ${editedFunction};
        `);

        return safeFunction(value);
    } catch (error) {
        console.error('Error evaluating function:', error);
        return NaN;
    }
}

function generateGraph() {
    if (myChart) {
        myChart.destroy();
    }

    var inputFunction = document.getElementById('inputFunction').value;
    var data = generateData(inputFunction);

    var minY = Math.min(...data.y);
    var minYFloor = Math.floor(minY / 10) * 10;

    if (minYFloor >= 0) {
        minYFloor = 0;
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.x,
            datasets: [{
                label: 'Function Graph',
                data: data.y,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'center',
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    type: 'linear',
                    position: 'center',
                    min: minYFloor,
                    ticks: {
                        stepSize: 10
                    }
                }
            },
        }
    });
}
