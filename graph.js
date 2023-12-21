var myChart;

function generateData(inputFunction1, inputFunction2 ,inputFunction3) {
    var x = [];
    var y1 = [];
    var y2 = [];
    var y3 = [];
    for (var i = -10; i <= 10; i += 0.1) {
        x.push(i);
        y1.push(calculateFunction(inputFunction1, i));
        y2.push(calculateFunction(inputFunction2, i));
        y3.push(calculateFunction(inputFunction3, i));
    }

    return { x: x, y1: y1, y2: y2 , y3: y3 };
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

    var inputFunction1 = document.getElementById('inputFunction1').value;
    var inputFunction2 = document.getElementById('inputFunction2').value;
    var inputFunction3 = document.getElementById('inputFunction3').value;

    // Sadece bir fonksiyon girildiyse ikinci fonksiyonu kullanma
    if (!inputFunction2) {
        inputFunction2 = inputFunction1;
    }
    if (!inputFunction3) {
        inputFunction3 = inputFunction2;
    }
    var data = generateData(inputFunction1, inputFunction2 , inputFunction3);

    var minY = Math.min(...data.y1, ...data.y2 , ...data.y3);
    var maxY = Math.max(...data.y1, ...data.y2 , ...data.y3);
    var absMax = Math.abs(maxY);
    var absMin = Math.abs(minY);
    var newMax = absMax > absMin ? -absMax : absMax;
    var newMin = absMax > absMin ? absMax : -absMin;

    var minX = Math.min(...data.x);
    var maxX = Math.max(...data.x);

    var ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.x,
            datasets: [
                {
                    label: 'Function Graph 1',
                    data: data.y1,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Function Graph 2',
                    data: data.y2,
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Function Graph 3',
                    data: data.y2,
                    borderColor: 'rgba(55,230, 20, 1)',
                    borderWidth: 2,
                    fill: false
                },
            ]
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
    });}
