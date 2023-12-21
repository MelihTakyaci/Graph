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

    // Y ekseninin minimum ve maksimum belirle
    var minY = Math.min(...data.y);
    var maxY = Math.max(...data.y);

    // Maksimum ve minimum değerlerin 
    var absMax = Math.abs(maxY);
    var absMin = Math.abs(minY);

    // Mutlak degere gore max min bul
    var newMax = absMax > absMin ? -absMax : absMax;
    var newMin = absMax > absMin ? absMax : -absMin;

    // X ekseninin min ve max degeri
    var minX = Math.min(...data.x);
    var maxX = Math.max(...data.x);

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
                    min: minX,
                    max: maxX,
                    ticks: {
                        stepSize: 1
                    }
                },
                y: {
                    type: 'linear',
                    position: 'center',
                    min: newMin,
                    max: newMax,
                    ticks: {
                        stepSize: 10
                    }
                }
            },
        }
    });
}
