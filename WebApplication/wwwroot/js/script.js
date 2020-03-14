

var numberOfGraph = 0;
var histograms = [];
var loaded = false;
var isColored = false;
var id = 1000;

var isRedTwoThresholds = false;
var isGreenTwoThresholds = false;
var isBlueTwoThresholds = false;


function otsuMethod(histogram) {

  var image = document.getElementById('source_image');

  var height = $('#loaded_img').get(0).naturalHeight;
  var width = $('#loaded_img').get(0).naturalWidth;

  var resolution = histogram.reduce((a, b) => a + b, 0);

  var frequencies = [];

  histogram.forEach((it) => {
    frequencies.push(it / resolution);
  })

  var threshold = 0;
  var maxVariance = 0;
  var myT = 0;

  for (let t = 0; t < 256; t++) {
    myT += t * frequencies[t];
  }

  for (let t = 0; t < histogram.length; t++) {

    var omega1 = 0;
    for (let i = 0; i < t; i++) {
      omega1 += frequencies[i];
    }

    var omega2 = 1 - omega1;

    var my1 = 0;
    var my2 = 0;

    for (let i = 0; i < t; i++) {
      my1 += i * frequencies[i];
    }

    my1 /= omega1;
    my2 = (myT - my1 * omega1) / omega2;

    var variance = omega1 * omega2 * Math.pow(my1 - my2, 2);

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = t;
    }
  }

  return threshold;

}

function readURL(input) {

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = async function (e) {
            let response = await fetch('/Home/LoadImage', {
              method: 'POST',
              body: new FormData(document.getElementById("image_form"))
            });

            var jsonResponse = await response.json();
            histograms = jsonResponse.histograms;
            id = jsonResponse.id;
            console.log(id);
            $('#loaded_img').attr('src', e.target.result);
        };

        $('#result_img').attr('src', '');
        $('#result_img').attr('class', '');

        reader.readAsDataURL(input.files[0]);

    }
}


function paintGraph(elem, param) {
    let rectsList = elem.getElementsByTagName("rect");

    switch (param) {
        case 'r':
            for (let i = 0; i < rectsList.length; i++) {
                rectsList[i].setAttribute("style", `fill: rgb(${i}, 0, 0);`);
            };
            break;
        case 'g':
                for (let i = 0; i < rectsList.length; i++) {
                    rectsList[i].setAttribute("style", `fill: rgb(0, ${i}, 0);`);
                };
            break;
        case 'b':
                for (let i = 0; i < rectsList.length; i++) {
                    rectsList[i].setAttribute("style", `fill: rgb(0, 0, ${i});`);
                };
            break;
        case 'bw':
                for (let i = 0; i < rectsList.length; i++) {
                    rectsList[i].setAttribute("style", `fill: rgb(${i}, ${i}, ${i});`);
                };
            break;
    }
}

function buildGrahp(data, maxCount) {
    //let graphs = document.getElementsByClassName("graphs")[0];
    let height = 250,
        width = 620,
        margin = 50,
        padding = 1;

    let graph = document.createElement("div");
    graph.id = `graph-${numberOfGraph}`;
    graph.classList.add("graph");
    document.getElementById("graphs").append(graph);

    var svg = d3.select("#graph-" + numberOfGraph).append("svg")
        .attr("class", "axis g-" + numberOfGraph)
        .attr("width", width)
        .attr("height", height);

    // длина оси X= ширина контейнера svg - отступ слева и справа
    var xAxisLength = width - 2 * margin;

    // длина оси Y = высота контейнера svg - отступ сверху и снизу
    var yAxisLength = height - 2 * margin;

    // функция интерполяции значений на ось Х
    var scaleX = d3.scale.linear()
                .domain([0, 256])
                .range([0, xAxisLength]);

    // функция интерполяции значений на ось Y
    var scaleY = d3.scale.linear()
                .domain([maxCount + 5, 0])
                .range([0, yAxisLength]);

    // создаем ось X
    var xAxis = d3.svg.axis()
                .scale(scaleX)
                .orient("bottom");
    // создаем ось Y
    var yAxis = d3.svg.axis()
                .scale(scaleY)
                .orient("left");

    // отрисовка оси Х
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform",  // сдвиг оси вниз и вправо
            "translate(" + margin + "," + (height - margin) + ")")
        .attr("id", `x-${numberOfGraph}`)
        .on("click", function() {

        })
        .call(xAxis);

    // отрисовка оси Y
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", // сдвиг оси вниз и вправо на margin
                "translate(" + margin + "," + margin + ")")
        .call(yAxis);

    // рисуем горизонтальные линии
    d3.selectAll("g.y-axis g.tick")
        .append("line")
        .classed("grid-line", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", xAxisLength)
        .attr("y2", 0);
    // создаем объект g для прямоугольников
    var g = svg.append("g")
        .attr("class", "body")
        .attr("transform",  // сдвиг объекта вправо
            "translate(" + margin + ", 0 )");
    // связываем данные с прямоугольниками
    g.selectAll("rect.bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar");
    // устанавливаем параметры прямоугольников
    g.selectAll("rect.bar")
        .data(data)
        .attr("x", function (d) {
            return scaleX(d.x);
        })
        .attr("y", function (d) {
            return scaleY(d.y) + margin;
        })
        .attr("height", function (d) {
            return yAxisLength - scaleY(d.y);
        })
        .attr("width", function(d){

            return Math.floor(xAxisLength / data.length) - padding;
        });

    numberOfGraph++;

    /*document.getElementsByClassName(`g-${numberOfGraph - 1}`)[0]
        .getElementsByClassName("x-axis")[0]
        .setAttribute("onclick", addOnclick(numberOfGraph - 1));*/

    //addRange("graphs");
    addThresholdValues(graph.id);
}

function addThresholdValues(id) {
    let div = document.createElement("div");
    let text = document.createElement("span");
    let input = document.createElement("input");
    let btnContainer = document.createElement("div");
    let button = document.createElement("input");
    let elemId = id.slice(id.indexOf("-") + 1);

    text.innerText = "Пороги:";
    div.classList.add("trhd-container");
    input.type = "text";
    input.classList.add("trhd", "appear");
    input.id = `trhd-${elemId}-0`;
    input.value = 80;
    input.required;
    input.setAttribute("oninput", "changeThresholdBefore(this.id)");
    btnContainer.classList.add("btn-container");
    btnContainer.id = `btnC-${elemId}`;
    button.type = "button";
    button.value = "";
    button.id = `btn-${elemId}`;
    button.classList.add("add-trhd");
    button.setAttribute("onclick", "addThreshold(this.id)");

    btnContainer.append(button);
    div.append(text, input, btnContainer);
    document.getElementById(id).append(div);

    $("<div>",
    {
        id: `range-container-${elemId}`,
        class: "range-container"
    }).appendTo(`#graph-${elemId}`);

    $("<input>",
    {
        type: "range",
        oninput: "changeThresholdValueBefore(this.id)",
        id: `range-${elemId}-0`,
        class: "range",
        min: "0",
        max: "255",
        value: "80"
    }).appendTo(`#range-container-${elemId}`);

    $("<div>",
    {
        class: "graph-threshold-before",
        id: `trhd_before-${elemId}`,
        width: `${80 * 523 / 256}px`
    }).appendTo(`#graph-${elemId}`);

    //document.getElementById(`graph-${elemId}`).setAttribute("class", "graph graph-threshold-before");
}

function changeThresholdBefore(inputId) {
    let graphNumber = inputId.slice(inputId.indexOf("-") + 1, inputId.indexOf("-") + 2);
    let range = document.getElementById(`range-${graphNumber}-0`);
    range.value = document.getElementById(`trhd-${graphNumber}-0`).value;
    document.getElementById(`trhd_before-${graphNumber}`).setAttribute("style", `width: ${range.value * 523 / 256}px`);
}

function changeThresholdAfter(inputId) {
    let graphNumber = inputId.slice(inputId.indexOf("-") + 1, inputId.indexOf("-") + 2);
    let range = document.getElementById(`range-${graphNumber}-1`);

    range.value = document.getElementById(`trhd-${graphNumber}-1`).value;
    document.getElementById(`trhd_after-${graphNumber}`).setAttribute("style", `width: ${(255 - range.value) * 523 / 256}px`);
}

function changeThresholdValueBefore(inputId) {
    let elemId = inputId.slice(inputId.indexOf("-") + 1, inputId.indexOf("-") + 2);
    let input = document.getElementById(inputId);
    let input1 = document.getElementById(`range-${elemId}-1`);
    
    if (input1 && +input.value >= +input1.value) {
        input1.value = +input.value;
        document.getElementById(`trhd_after-${elemId}`).setAttribute("style", `width: ${(255 - input.value) * 523 / 256}px`);
        document.getElementById(`trhd-${elemId}-1`).value = input.value;
    }

    document.getElementById(`trhd_before-${elemId}`).setAttribute("style", `width: ${input.value * 523 / 256}px`);
    document.getElementById(`trhd-${elemId}-0`).value = input.value;
}

function changeThresholdValueAfter(inputId) {
    let elemId = inputId.slice(inputId.indexOf("-") + 1, inputId.indexOf("-") + 2);
    let input1 = document.getElementById(inputId);
    let input = document.getElementById(`range-${elemId}-0`);

    if (+input1.value <= +input.value) {
        input.value = +input1.value;
        document.getElementById(`trhd_before-${elemId}`).setAttribute("style", `width: ${(input.value) * 523 / 256}px`);
        document.getElementById(`trhd-${elemId}-0`).value = input.value;
    }

    document.getElementById(`trhd_after-${elemId}`).setAttribute("style", `width: ${(255 - input1.value) * 523 / 256}px`);
    document.getElementById(`trhd-${elemId}-1`).value = input1.value;
}

function addThreshold(id) {
    let elemId = id.slice(id.indexOf("-") + 1);
    if (document.getElementById(`trhd-${elemId}-1`))
        document.getElementById(`trhd-${elemId}-1`).remove();

    switch (elemId) {
      case "0":
        isRedTwoThresholds = true;
        break;
      case "1":
        isGreenTwoThresholds = true;
        break;
      default:
        isBlueTwoThresholds = true;
    }

    let val = document.getElementById(`trhd-${elemId}-0`).value;
    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("trhd", "appear");
    input.id = `trhd-${elemId}-1`;
    input.value = Math.round((+val + 255) / 2);
    input.required;
    input.setAttribute("oninput", "changeThresholdAfter(this.id)");
    document.getElementById(id).parentNode.before(input);
    document.getElementById(id).setAttribute("style", "transform: rotate(45deg); background-color: #690101;");
    document.getElementById(id).setAttribute("onclick", "deleteThreshold(this.id);");

    $("<input>",
    {
        type: "range",
        oninput: "changeThresholdValueAfter(this.id)",
        id: `range-${elemId}-1`,
        class: "range",
        min: "0",
        max: "255",
        value: `${+input.value}`
    }).appendTo(`#range-container-${elemId}`);

    $("<div>",
    {
        class: "graph-threshold-after",
        id: `trhd_after-${elemId}`,
        width: `${(255 - +input.value) * 523 / 256}px`
    }).appendTo(`#graph-${elemId}`);
}

function deleteThreshold(id) {
    let elemId = id.slice(id.indexOf("-") + 1);
    document.getElementById(`trhd-${elemId}-1`).className = "trhd disapp";
    document.getElementById(`trhd_after-${elemId}`).remove();
    document.getElementById(`range-${elemId}-1`).remove();
    document.getElementById(id).setAttribute("style", "transform: rotate(0deg); background-color: #3a3a3a;");
    document.getElementById(id).setAttribute("onclick", "addThreshold(this.id)");

    switch (elemId) {
      case "0":
        isRedTwoThresholds = false;
        break;
      case "1":
        isGreenTwoThresholds = false;
        break;
      default:
        isBlueTwoThresholds = false;
    }
}

function changeTrhdClass(id) {
    document.getElementById(id).className = "trhd trhd-enable";
}

function addRange(elemId) {
    let elem = document.getElementById(elemId);
    let index = elem.id.indexOf("-") + 1;
    let range = document.createElement("input");

    range.type = "range";
    range.classList.add("range");
    range.id = `range-${elem.id.slice(index)}`;
    range.min = 0;
    range.max = 255;
    range.value = 127;

    elem.append(range);
}


$("#source_image").change(function(){
    readURL(this);
});

$(function() {
  $('#calc_btn').on("click", function(e) {

    var query = "/Home/Binarization?"

    if (isColored) {

      var redThresholds = getThresholds(0);
      var greenThresholds = getThresholds(1);
      var blueThresholds = getThresholds(2);

      var redTemplate = getTemplate('r');
      var greenTemplate = getTemplate('g');
      var blueTemplate = getTemplate('b');

      query += "redTemplate=" + redTemplate + "&";
      query += "greenTemplate=" + greenTemplate + "&";
      query += "blueTemplate=" + blueTemplate + "&";

      query += getQueryThreshols(redThresholds, 'r') + '&';
      query += getQueryThreshols(greenThresholds, 'g') + '&';
      query += getQueryThreshols(blueThresholds, 'b');


    } else {
      var thresholds = getThresholds(0);
      var template = getTemplate(thresholds);

      query += "redTemplate=" + template + "&";
      query += "greenTemplate=" + template + "&";
      query += "blueTemplate=" + template + "&";

      query += getQueryThreshols(thresholds, 'r') + '&';
      query += getQueryThreshols(thresholds, 'g') + '&';
      query += getQueryThreshols(thresholds, 'b') + '&';
    }



    query += "&id=" + id;
    console.log(query);

    sendRequestForImage(query);

  })
})

function getQueryThreshols(collection, sign) {
  var query = "";

  collection.forEach((it, index, arr) => {
    query += sign + index + '=' + it;
    if (index + 1 != collection.length) {
      query += '&'
    }
  });

  return query;
}

function getTemplate(color) {

  switch (color) {
    case 'b':
      return isBlueTwoThresholds ? '010' : '01';
      break;
    case 'g':
      return isGreenTwoThresholds ? '010' : '01';
      break;
    default:
      return isRedTwoThresholds ? '010' : '01';
      break;
  }
}

function getThresholds (index) {

  collection = [];
  
  collection.push($('#trhd-' + index + '-0').val());
  if (index == 0 && isRedTwoThresholds || index == 1 && isGreenTwoThresholds || index == 2 && isBlueTwoThresholds) {
      collection.push($('#trhd-' + index + '-1').val())
  }


  return collection;
}

async function sendRequestForImage(query) {

  var response = await fetch(query);
  var blob = await response.blob();

  var image = URL.createObjectURL(blob);

  $("#result_img").attr("src", image);

  if (isColored)
      $('#result_img').attr('class', 'image colored');
  else
      $('#result_img').attr('class', 'image gray');
}

$(function() {
    $('#calc_btn_auto').on('click', e => {

      if (typeof $("#trhd-0-1").val() != "undefined" && $("#trhd-0-1").width() != 0){
        deleteThreshold("btn-0");
      }
      if (typeof $("#trhd-1-1").val() != "undefined" && $("#trhd-1-1").width() != 0) {
        deleteThreshold("btn-1");
      }
      if (typeof $("#trhd-2-1").val() != "undefined" && $("#trhd-2-1").width() != 0) {
        deleteThreshold("btn-2");
      }

      $("#trhd-0-0").val(otsuMethod(histograms[0]));
      changeThresholdBefore("trhd-0-0");

      if (isColored) {

        $("#trhd-1-0").val(otsuMethod(histograms[1]));
        changeThresholdBefore("trhd-1-0");

        $("#trhd-2-0").val(otsuMethod(histograms[2]));
        changeThresholdBefore("trhd-2-0");
     }

      $('#calc_btn').click();

    })
})

$(function() {
    $('#loaded_img').on("load", function(e) {
        /*let graphs = document.getElementsByClassName("graph");
        if (graphs.length > 0) {
            graphs.map(function(elem) { elem.remove(); })
        }*/
        $(".graph").detach();
        numberOfGraph = 0;

        this.canvas = $('<canvas />')[0];
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);

        //var isColored = false;
        var isDefined = false;

        for (let i = 0; i < this.canvas.width; i++) {
            if (isDefined) break;
            for (let j = 0; j < this.canvas.height; j++) {
                var pixelData = this.canvas.getContext('2d').getImageData(i, j, 1, 1).data;
                var r = pixelData[0];
                var g = pixelData[1];
                var b = pixelData[2];

                if (Math.abs(r - g) <= 10 && Math.abs(r - b) <= 10 && Math.abs(g - b) <= 10)
                    isColored = false
                else {
                    isColored = true;
                    isDefined = true;
                    break;
                };
            }
        }
        //console.log(isColored);

        let images = document.getElementsByTagName("img");
        if (isColored == true) {
            $('#output').html('Изображение цветное');
            images[0].className = "image colored";
        }
        else {
            $('#output').html('Изображение черно-белое');
            images[0].className = "image gray";
        }

        let redData = [];
        let greenData = [];
        let blueData = [];

        for (let i = 0; i < 256; i++) {
            redData.push({x: i + 1, y: histograms[0][i]});
            greenData.push({x: i + 1, y: histograms[1][i]});
            blueData.push({x: i + 1, y: histograms[2][i]});
        }

        let maxRedCount = Math.max.apply(Math, redData.map(function(elem) { return elem.y; }));
        let maxGreenCount = Math.max.apply(Math, greenData.map(function(elem) { return elem.y; }));
        let maxBlueCount = Math.max.apply(Math, blueData.map(function(elem) { return elem.y; }));


        if (isColored) {
            buildGrahp(redData, maxRedCount);
            paintGraph(document.getElementsByClassName("g-0")[0], 'r');
            buildGrahp(greenData, maxGreenCount);
            paintGraph(document.getElementsByClassName("g-1")[0], 'g');
            buildGrahp(blueData, maxBlueCount);
            paintGraph(document.getElementsByClassName("g-2")[0], 'b');
        }
        else {
            buildGrahp(redData, maxRedCount);
            paintGraph(document.getElementsByClassName("g-0")[0], 'bw');

        }

    });
});
