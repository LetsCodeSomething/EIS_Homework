let tableShown = false;

const sortOptions = [["false", "Нет"], 
                     ["store", "Магазин"], 
                     ["date", "Дата"], 
                     ["weekly_sales", "Продажи за неделю"], 
                     ["holiday_flag", "Выходной"], 
                     ["temperature", "Температура"], 
                     ["fuel_price", "Цена топлива"], 
                     ["cpi", "Цена за показ"], 
                     ["unemployment", "Безработица"]];

function showMainTable()
{
    let table = d3.select("#mainTable");

    let rows  = table.select("tbody").selectAll("tr").data(dataset).enter().append("tr").style("display","");
    let cells = rows.selectAll("td").data(d => Object.values(d)).enter().append("td").text(d => d);
    let head  = table.select("thead").insert("tr", "tr").selectAll("tr").data(d => Object.keys(dataset[0])).enter().append("td").text(d => d);
}

function deleteMainTable()
{
    d3.select("#mainTable").select("tbody").selectAll("tr").remove();
    d3.select("#mainTable").select("thead").selectAll("tr").remove();
}

function isIntNumber(str)
{
    return (parseInt(str).toString().length === str.length);
}

function isFloatNumber(str)
{
    return (parseFloat(str).toString().length === str.length);
}

function stringToDate(str, delimiter)
{
    let parts = str.split(delimiter);
    let dateObject = new Date(parts[2] + "-" + parts[1] + "-" + parts[0]);
    return dateObject;
}

let compareByStore = (a, b) => {
    if(a.Store < b.Store)
    {
        return -1;
    }
    else if(a.Store > b.Store)
    {
        return 1;
    }

    return 0;
};

let compareByDate = (a, b) => {
    let aDate = stringToDate(a.Date, "-");
    let bDate = stringToDate(b.Date, "-");

    if(aDate < bDate)
    {
        return -1;
    }
    else if(aDate > bDate)
    {
        return 1;
    }

    return 0;
};

let compareByWeeklySales = (a, b) => {
    if(a.Weekly_Sales < b.Weekly_Sales)
    {
        return -1;
    }
    else if(a.Weekly_Sales > b.Weekly_Sales)
    {
        return 1;
    }

    return 0;
};

let compareByHolidayFlag = (a, b) => {
    if(a.Holiday_Flag < b.Holiday_Flag)
    {
        return -1;
    }
    else if(a.Holiday_Flag > b.Holiday_Flag)
    {
        return 1;
    }

    return 0;
};

let compareByTemperature = (a, b) => {
    if(a.Temperature < b.Temperature)
    {
        return -1;
    }
    else if(a.Temperature > b.Temperature)
    {
        return 1;
    }

    return 0;
};

let compareByFuelPrice = (a, b) => {
    if(a.Fuel_Price < b.Fuel_Price)
    {
        return -1;
    }
    else if(a.Fuel_Price > b.Fuel_Price)
    {
        return 1;
    }

    return 0;
};

let compareByCpi = (a, b) => {
    if(a.CPI < b.CPI)
    {
        return -1;
    }
    else if(a.CPI > b.CPI)
    {
        return 1;
    }

    return 0;
};

let compareByUnemployment = (a, b) => {
    if(a.Unemployment < b.Unemployment)
    {
        return -1;
    }
    else if(a.Unemployment > b.Unemployment)
    {
        return 1;
    }

    return 0;
};

function getComparator(str)
{
    switch(str)
    {
        case "false": return null;
        case "store": return compareByStore;
        case "date": return compareByDate;
        case "weekly_sales": return compareByWeeklySales;
        case "holiday_flag": return compareByHolidayFlag;
        case "temperature": return compareByTemperature;
        case "fuel_price": return compareByFuelPrice;
        case "cpi": return compareByCpi;
        case "unemployment": return compareByUnemployment;
        default: return null;
    }
}

function deleteGroupTable()
{
    d3.select("#groupTable").select("tbody").selectAll("tr").remove();
    d3.select("#groupTable").select("thead").selectAll("tr").remove();
}

////////////////////////////////////////////////////////////////////////

d3.select("#showTable").on
(
    "click", function()
    {
        let buttonValue = d3.select(this);
        if(tableShown === false)
        {
            tableShown = true;
            buttonValue.attr("value", "Скрыть таблицу");
            
            showMainTable();

            d3.select("#applyFilters").attr("disabled", null);
            d3.select("#resetFilters").attr("disabled", null);
            d3.select("#applySort").attr("disabled", null);
            d3.select("#resetSort").attr("disabled", null);
            d3.select("#applyGrouping").attr("disabled", null);
            d3.select("#resetGrouping").attr("disabled", null);
        }
        else
        {
            tableShown = false;
            buttonValue.attr("value", "Показать таблицу");

            deleteMainTable();

            d3.select("#applyFilters").attr("disabled", "disabled");
            d3.select("#resetFilters").attr("disabled", "disabled");
            d3.select("#applySort").attr("disabled", "disabled");
            d3.select("#resetSort").attr("disabled", "disabled");
            d3.select("#applyGrouping").attr("disabled", "disabled");
            d3.select("#resetGrouping").attr("disabled", "disabled");
        }
    }
);

////////////////////////////////////////////////////////////////////////

d3.select("#applyFilters").on
(
    "click", function()
    {
        let rows = d3.select("#mainTable").select("tbody").selectAll("tr");
        
        let storeFilter1 = d3.select("#storeFilter1").property("value");
        let storeFilter2 = d3.select("#storeFilter2").property("value");
        //If storeFilter1 is a valid integer number, storeFilter2 should be null or a greater integer value.
        if(isIntNumber(storeFilter1) && 
           (!storeFilter2 || (isIntNumber(storeFilter2) && parseInt(storeFilter2) >= parseInt(storeFilter1))))
        {
            rows.filter(d => (d.Store < parseInt(storeFilter1))).style("display", "none");
        }
        //If storeFilter2 is a valid integer number, storeFilter1 should be null or a lesser integer value.
        if(isIntNumber(storeFilter2) &&
           (!storeFilter1 || (isIntNumber(storeFilter1) && parseInt(storeFilter2) >= parseInt(storeFilter1))))
        {
            rows.filter(d => (d.Store > parseInt(storeFilter2))).style("display", "none");
        }
        
        //Looks bad, but works. At least.

        let dateFilter1 = Date.parse(d3.select("#dateFilter1").property("value"));
        let dateFilter2 = Date.parse(d3.select("#dateFilter2").property("value"));
        if(dateFilter1 && (!dateFilter2 || dateFilter2 >= dateFilter1))
        {
            rows.filter(d => (stringToDate(d.Date, "-") < dateFilter1)).style("display", "none");
        }
        if(dateFilter2 && (!dateFilter1 || dateFilter2 >= dateFilter1))
        {
            rows.filter(d => (stringToDate(d.Date, "-") > dateFilter2)).style("display", "none");
        }

        let weeklySalesFilter1 = d3.select("#weeklySalesFilter1").property("value");
        let weeklySalesFilter2 = d3.select("#weeklySalesFilter2").property("value");
        if(isFloatNumber(weeklySalesFilter1) &&
           (!weeklySalesFilter2 || (isFloatNumber(weeklySalesFilter2) && parseFloat(weeklySalesFilter2) >= parseFloat(weeklySalesFilter1))))
        {
            rows.filter(d => (d.Weekly_Sales < parseFloat(weeklySalesFilter1))).style("display", "none");
        }
        if(isFloatNumber(weeklySalesFilter2) &&
           (!weeklySalesFilter1 || (isFloatNumber(weeklySalesFilter1) && parseFloat(weeklySalesFilter2) >= parseFloat(weeklySalesFilter1))))
        {
            rows.filter(d => (d.Weekly_Sales > parseFloat(weeklySalesFilter2))).style("display", "none");
        }

        let holidayFlagFilter = d3.select("#holidayFlagFilter").property("value");
        if(holidayFlagFilter === "yes")
        {
            rows.filter(d => (d.Holiday_Flag === 0)).style("display", "none");
        }
        else if(holidayFlagFilter === "no")
        {
            rows.filter(d => (d.Holiday_Flag === 1)).style("display", "none");
        }

        let temperatureFilter1 = d3.select("#temperatureFilter1").property("value");
        let temperatureFilter2 = d3.select("#temperatureFilter2").property("value");
        if(isFloatNumber(temperatureFilter1) &&
           (!temperatureFilter2 || (isFloatNumber(temperatureFilter2) && parseFloat(temperatureFilter2) >= parseFloat(temperatureFilter1))))
        {
            rows.filter(d => (d.Temperature < parseFloat(temperatureFilter1))).style("display", "none");
        }
        if(isFloatNumber(temperatureFilter2) &&
           (!temperatureFilter1 || (isFloatNumber(temperatureFilter1) && parseFloat(temperatureFilter2) >= parseFloat(temperatureFilter1))))
        {
            rows.filter(d => (d.Temperature > parseFloat(temperatureFilter2))).style("display", "none");
        }

        let fuelPriceFilter1 = d3.select("#fuelPriceFilter1").property("value");
        let fuelPriceFilter2 = d3.select("#fuelPriceFilter2").property("value");
        if(isFloatNumber(fuelPriceFilter1) &&
           (!fuelPriceFilter2 || (isFloatNumber(fuelPriceFilter2) && parseFloat(fuelPriceFilter2) >= parseFloat(fuelPriceFilter1))))
        {
            rows.filter(d => (d.Fuel_Price < parseFloat(fuelPriceFilter1))).style("display", "none");
        }
        if(isFloatNumber(fuelPriceFilter2) &&
           (!fuelPriceFilter1 || (isFloatNumber(fuelPriceFilter1) && parseFloat(fuelPriceFilter2) >= parseFloat(fuelPriceFilter1))))
        {
            rows.filter(d => (d.Fuel_Price > parseFloat(fuelPriceFilter2))).style("display", "none");
        }

        let cpiFilter1 = d3.select("#cpiFilter1").property("value");
        let cpiFilter2 = d3.select("#cpiFilter2").property("value");
        if(isFloatNumber(cpiFilter1) &&
           (!cpiFilter2 || (isFloatNumber(cpiFilter2) && parseFloat(cpiFilter2) >= parseFloat(cpiFilter1))))
        {
            rows.filter(d => (d.CPI < parseFloat(cpiFilter1))).style("display", "none");
        }
        if(isFloatNumber(cpiFilter2) &&
           (!cpiFilter1 || (isFloatNumber(cpiFilter1) && parseFloat(cpiFilter2) >= parseFloat(cpiFilter1))))
        {
            rows.filter(d => (d.CPI > parseFloat(cpiFilter2))).style("display", "none");
        }

        let unemploymentFilter1 = d3.select("#unemploymentFilter1").property("value");
        let unemploymentFilter2 = d3.select("#unemploymentFilter2").property("value");
        if(isFloatNumber(unemploymentFilter1) &&
           (!unemploymentFilter2 || (isFloatNumber(unemploymentFilter2) && parseFloat(unemploymentFilter2) >= parseFloat(unemploymentFilter1))))
        {
            rows.filter(d => (d.Unemployment < parseFloat(unemploymentFilter1))).style("display", "none");
        }
        if(isFloatNumber(unemploymentFilter2) &&
           (!unemploymentFilter1 || (isFloatNumber(unemploymentFilter1) && parseFloat(unemploymentFilter2) >= parseFloat(unemploymentFilter1))))
        {
            rows.filter(d => (d.Unemployment > parseFloat(unemploymentFilter2))).style("display", "none");
        }
    }
);

d3.select("#resetFilters").on
(
    "click", function()
    {
        deleteMainTable();
        showMainTable();
    }
);

////////////////////////////////////////////////////////////////////////

d3.select("#sortFilter1").on
(
    "change", function()
    {
        let sortFilter1 = d3.select("#sortFilter1");
        let sortFilterInv1 = d3.select("#sortFilterInv1");
        let sortFilter2 = d3.select("#sortFilter2");
        let sortFilterInv2 = d3.select("#sortFilterInv2");
        let sortFilter3 = d3.select("#sortFilter3");
        let sortFilterInv3 = d3.select("#sortFilterInv3");

        sortFilterInv1.property("checked", false);

        sortFilter2.selectAll("option").remove();
        sortFilterInv2.property("checked", false);
        sortFilterInv2.attr("disabled", "disabled");

        sortFilter3.selectAll("option").remove();
        sortFilter3.attr("disabled", "disabled");
        sortFilter3.append("option").property("value", "false").html("Нет").attr("selected", "selected");
        sortFilterInv3.property("checked", false);
        sortFilterInv3.attr("disabled", "disabled");

        if(sortFilter1.property("value") === "false")
        {
            sortFilterInv1.attr("disabled", "disabled");

            sortFilter2.attr("disabled", "disabled");
            sortFilter2.append("option").property("value", "false").html("Нет").attr("selected", "selected");
        }
        else
        {
            sortFilterInv1.attr("disabled", null);

            sortFilter2.attr("disabled", null);

            for(const item of sortOptions)
            {
                if(item[0] !== sortFilter1.property("value"))
                {
                    sortFilter2.append("option").property("value", item[0]).html(item[1]);
                }
            }
            sortFilter2.select("option").attr("selected", "selected");
        }
    }
)

d3.select("#sortFilter2").on
(
    "change", function()
    {
        let sortFilter1 = d3.select("#sortFilter1");
        let sortFilter2 = d3.select("#sortFilter2");
        let sortFilterInv2 = d3.select("#sortFilterInv2");
        let sortFilter3 = d3.select("#sortFilter3");
        let sortFilterInv3 = d3.select("#sortFilterInv3");

        sortFilterInv2.property("checked", false);

        sortFilter3.selectAll("option").remove();
        sortFilterInv3.property("checked", false);
        sortFilterInv3.attr("disabled", "disabled");

        if(sortFilter2.property("value") === "false")
        {
            sortFilterInv2.attr("disabled", "disabled");

            sortFilter3.attr("disabled", "disabled");
            sortFilter3.append("option").property("value", "false").html("Нет").attr("selected", "selected");
        }
        else
        {
            sortFilterInv2.attr("disabled", null);

            sortFilter3.attr("disabled", null);

            for(const item of sortOptions)
            {
                if(item[0] !== sortFilter1.property("value") && item[0] !== sortFilter2.property("value"))
                {
                    sortFilter3.append("option").property("value", item[0]).html(item[1]);
                }
            }
            sortFilter3.select("option").attr("selected", "selected");
        }
    }
)

d3.select("#sortFilter3").on
(
    "change", function()
    {
        let sortFilter3 = d3.select("#sortFilter3");
        let sortFilterInv3 = d3.select("#sortFilterInv3");
        
        sortFilterInv3.property("checked", false);

        if(sortFilter3.property("value") === "false")
        {
            sortFilterInv3.attr("disabled", "disabled");
        }
        else
        {
            sortFilterInv3.attr("disabled", null);
        }
    }
)

d3.select("#applySort").on
(
    "click", function()
    {
        let rows = d3.select("#mainTable").select("tbody").selectAll("tr");
        
        let sortFilter1 = d3.select("#sortFilter1");
        let sortFilterInv1 = d3.select("#sortFilterInv1");
        let sortFilter2 = d3.select("#sortFilter2");
        let sortFilterInv2 = d3.select("#sortFilterInv2");
        let sortFilter3 = d3.select("#sortFilter3");
        let sortFilterInv3 = d3.select("#sortFilterInv3");

        let level1Order = sortFilterInv1.property("checked") ? -1 : 1;
        let level2Order = sortFilterInv2.property("checked") ? -1 : 1;
        let level3Order = sortFilterInv3.property("checked") ? -1 : 1;
        
        let comparator1 = getComparator(sortFilter1.property("value"));
        let comparator2 = getComparator(sortFilter2.property("value"));
        let comparator3 = getComparator(sortFilter3.property("value"));
        
        if(!comparator1)
        {
            return;
        }
        else if(!comparator2)
        {
            let oneLayerSort = (a, b) => {
                let value = comparator1(a, b);
                value = (value === 0) ? 1 : value;
                return value === -1 ? -level1Order : level1Order;
            };
   
            rows.sort(oneLayerSort);
        }
        else if(!comparator3)
        {
            let twoLayersSort = (a, b) => {
                let value = comparator1(a, b);
                if(value !== 0)
                {
                    return value === -1 ? -level1Order : level1Order;
                }

                let value2 = comparator2(a, b);
                value2 = (value2 === 0) ? 1 : value2;
                return value2 === -1 ? -level2Order : level2Order;
            }

            rows.sort(twoLayersSort);
        }
        else
        {
            let threeLayersSort = (a, b) => {
                let value = comparator1(a, b);
                if(value !== 0)
                {
                    return value === -1 ? -level1Order : level1Order;
                }

                let value2 = comparator2(a, b);
                if(value2 !== 0)
                {
                    return value2 === -1 ? -level2Order : level2Order;
                }
                
                let value3 = comparator3(a, b);
                value3 = (value3 === 0) ? 1 : value3;
                return value3 === -1 ? -level3Order : level3Order;
            }

            rows.sort(threeLayersSort);
        }
    }
);

d3.select("#resetSort").on
(
    "click", function()
    {
        deleteMainTable();
        showMainTable();
    }
);

////////////////////////////////////////////////////////////////////////

d3.select("#groupFilter").on
(
    "change", function()
    {
        groupCountFunc = d3.select("#groupCountFunc");
        groupMaxFunc   = d3.select("#groupMaxFunc");
        groupMinFunc   = d3.select("#groupMinFunc");
        groupMeanFunc  = d3.select("#groupMeanFunc");

        if(d3.select("#groupFilter").property("value") === "false")
        {
            groupCountFunc.property("checked", false);
            groupMaxFunc.property("checked", false);
            groupMinFunc.property("checked", false);
            groupMeanFunc.property("checked", false);

            groupCountFunc.attr("disabled", "disabled");
            groupMaxFunc.attr("disabled", "disabled");
            groupMinFunc.attr("disabled", "disabled");
            groupMeanFunc.attr("disabled", "disabled");
        }
        else
        {
            groupCountFunc.attr("disabled", null);
            groupMaxFunc.attr("disabled", null);
            groupMinFunc.attr("disabled", null);
            groupMeanFunc.attr("disabled", null);
        }
    }
);

d3.select("#applyGrouping").on
(
    "click", function()
    {
        deleteGroupTable();

        let groupFilter = d3.select("#groupFilter");
        let groupFilterValue = groupFilter.property("value");
        let groupTable = d3.select("#groupTable");
        let head = groupTable.select("thead").insert("tr");

        let groupCountFunc = d3.select("#groupCountFunc").property("checked");
        let groupMaxFunc = d3.select("#groupMaxFunc").property("checked");
        let groupMinFunc = d3.select("#groupMinFunc").property("checked");
        let groupMeanFunc = d3.select("#groupMeanFunc").property("checked");

        let group;
        switch(groupFilterValue)
        {
            case "false":
                return;
            case "store":
                group = d3.group(dataset, d => d.Store);
                head.append("td").text("Store");
                break;
            case "date":
                group = d3.group(dataset, d => d.Date);
                head.append("td").text("Date");
                break;
            case "weekly_sales":
                //group = d3.group(dataset, d => d.Weekly_Sales);
                //head.append("td").text("Weekly_Sales");
                return;
                //break;
            case "holiday_flag":
                group = d3.group(dataset, d => d.Holiday_Flag);
                head.append("td").text("Holiday_Flag");
                break;
            case "temperature":
                group = d3.group(dataset, d => d.Temperature);
                head.append("td").text("Temperature");
                break;
            case "fuel_price":
                group = d3.group(dataset, d => d.Fuel_Price);
                head.append("td").text("Fuel_Price");
                break;
            case "cpi":
                group = d3.group(dataset, d => d.CPI);
                head.append("td").text("CPI");
                break;
            case "unemployment":
                group = d3.group(dataset, d => d.Unemployment);
                head.append("td").text("Unemployment");
                break;
        }

        if(groupCountFunc)
        {
            head.append("td").text("Кол.");
        }
        if(groupMaxFunc)
        {
            head.append("td").text("Макс.");
        }
        if(groupMinFunc)
        {
            head.append("td").text("Мин.");
        }
        if(groupMeanFunc)
        {
            head.append("td").text("Сред.");
        }        
        
        for(const item of group)
        {
            let row = groupTable.select("tbody").append("tr");

            row.append("td").text(item[0]);
            
            if(groupCountFunc)
            {
                let count = d3.count(item[1].map(d => d.Weekly_sales));
                row.append("td").text(count);
            }
            if(groupMaxFunc)
            {
                let max = d3.max(item[1].map(d => d.Weekly_Sales));
                row.append("td").text(max);
            }
            if(groupMinFunc)
            {
                let min = d3.min(item[1].map(d => d.Weekly_Sales));
                row.append("td").text(min);
            }
            if(groupMeanFunc)
            {
                let mean = d3.mean(item[1].map(d => d.Weekly_Sales));
                row.append("td").text(mean);
            } 
        }
    }
);

d3.select("#resetGrouping").on
(
    "click", function()
    {
        deleteGroupTable();
    }
);

////////////////////////////////////////////////////////////////////////

const marginX = 50;
const marginY = 50;
const height = 400;
const width = 800;

let animateFromIndex = -1;
let animateToIndex = -1;

let svg = d3.select("svg");

d3.select(window).on
(
    "load", function()
    {
        if(!drawGraph())
        {
            alert("Ошибка: не выбраны данные для простроения графика");
        }
    }
);

d3.selectAll("input[name='graphType']").on
(
    "change", function()
    {
        let isGraphTypeAnimated = d3.select("#graphTypeAnimated").property("checked");

        let drawGraph = d3.select("#drawGraph");
        let makeStepOnGraph = d3.select("#makeStepOnGraph");
        let animateGraph = d3.select("#animateGraph");

        if(isGraphTypeAnimated)
        {
            drawGraph.attr("value", "Начать заново");
            makeStepOnGraph.style("display", "");
            animateGraph.style("display", "");
        }
        else
        {
            drawGraph.attr("value", "Построить");
            makeStepOnGraph.style("display", "none");
            animateGraph.style("display", "none");
        }
    }
)

d3.select("#drawGraph").on
(
    "click", function()
    {
        animateFromIndex = -1;
        animateToIndex = -1;

        if(!drawGraph())
        {
            alert("Ошибка: не выбраны данные для простроения графика");
        }
    }
);

d3.select("#makeStepOnGraph").on
(
    "click", function()
    {
        if(!makeStepOnGraph())
        {
            alert("Ошибка: не выбраны данные для простроения графика");
        }
    }
);

d3.select("#animateGraph").on
(
    "click", function()
    {
        if(!animateGraph())
        {
            alert("Ошибка: не выбраны данные для простроения графика");
        }
    }
);

d3.select("#deleteGraph").on
(
    "click", function() 
    {
        svg.attr("height", 0);
        svg.selectAll("*").remove();
    }
);

function drawGraph()
{
    const keyX = d3.select("#oxStore").property("checked") ? "Store" : "Unemployment";

    // значения по оси ОУ
    const isMaxSelected = d3.select("#oyMax").property("checked");
    const isMinSelected = d3.select("#oyMin").property("checked");

    if(!isMaxSelected && !isMinSelected)
    {
        return false;
    }

    svg.attr("height", height).attr("width", width);
    svg.selectAll("*").remove();

    // создаем массив для построения графика
    const data = createGraphData(dataset, keyX);
   
    // создаем шкалы преобразования и выводим оси
    const [scaleX, scaleY] = createGraphAxes(data, isMinSelected, isMaxSelected);
    
    let graphType = d3.select("#graphTypeDot").property("checked") ? 0 : (d3.select("#graphTypeHisto").property("checked") ? 1 : 2);

    // рисуем графики
    if (isMinSelected) 
    {
        fillGraphWithData(data, scaleX, scaleY, 0, "blue", graphType);
    }
    if (isMaxSelected) 
    {
        fillGraphWithData(data, scaleX, scaleY, 1, "red", graphType);
    }

    currentIndex = data.length - 1;

    return true;
}

function createGraphData(rawData, keyX)
{
    groupObj = d3.group(rawData, d => d[keyX]);
    let data =[];
    
    for(const entry of groupObj)
    {
        let minMax = d3.extent(entry[1].map(d => d["Weekly_Sales"]));
        data.push({labelX : entry[0], values : minMax});
    }
    return data;
}

function createGraphAxes(data, isMinSelected, isMaxSelected)
{
    // в зависимости от выбранных пользователем данных по OY
    // находим интервал значений по оси OY
    let firstRange = d3.extent(data.map(d => d.values[0]));
    let secondRange = d3.extent(data.map(d => d.values[1]));
    
    //Calculate min and max values for oy axis.
    let min; 
    let max; 
    //isMinSelected and isMaxSelected can't be false simultaneously.
    if(isMinSelected)
    {
        if(isMaxSelected)
        {
            min = firstRange[0];
            max = secondRange[1];
        }
        else
        {
            min = firstRange[0];
            max = firstRange[1];
        }
    }
    else
    {
        min = secondRange[0];
        max = secondRange[1];
    }

    // функция интерполяции значений на оси
    let scaleX = d3.scaleBand()
    .domain(data.map(d => d.labelX))
    .range([0, width - 2 * marginX]);
   
    let scaleY = d3.scaleLinear()
    .domain([min * 0.85, max * 1.1 ])
    .range([height - 2 * marginY, 0]);
   
    // создание осей
    let axisX = d3.axisBottom(scaleX); // горизонтальная
    let axisY = d3.axisLeft(scaleY); // вертикальная
    // отрисовка осей в SVG-элементе
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${height - marginY})`)
        .call(axisX)
        .selectAll("text") // подписи на оси - наклонные
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", d => "rotate(-45)");
   
    svg.append("g")
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .call(axisY);
   
    return [scaleX, scaleY];
}

function fillGraphWithData(data, scaleX, scaleY, minMaxIndex, color, graphType) 
{
    if(graphType == 0)
    {
        //Dot graph.
        const r = 4;
        const offset = (minMaxIndex == 0)? -r / 2 : r / 2;

        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", r)
            .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("cy", d => scaleY(d.values[minMaxIndex]) + offset)
            .attr("transform", `translate(${marginX}, ${marginY})`)
            .style("fill", color);
    }
    else if(graphType == 1)
    {
        //Histogram.
        const barWidth = 5.0;
        const offset = (minMaxIndex == 0) ? -barWidth / 2 : barWidth / 2;
        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("rect")
            .attr("width", barWidth)
            .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
            .attr("height", d => height - marginY * 2 - scaleY(d.values[minMaxIndex]))
            .attr("transform", d => `translate(${marginX - barWidth / 2 + offset},${marginY + scaleY(d.values[minMaxIndex])})`)
            .style("fill", color);
    }
    else
    {
        //Animated line graph.
        let id = "path" + minMaxIndex;
        let line = createPath(scaleX, scaleY, color, id);

        let reshapedData = [];
        for(const item of data)
        {
            reshapedData.push({x: item.labelX, y: item.values[minMaxIndex]});
        }

        let path = svg.select("#"+id).datum(reshapedData).attr("d", line);

        //Calculate the region of the graph that should be animated.
        let duration;

        let fromPathLength = 0;
        let toPathLength = 0;

        //Total length of all lines which the graph consists of.
        const pathLength = path.node().getTotalLength();

        if(animateFromIndex === -1)
        {
            duration = 2000;    

            fromPathLength = pathLength;
            toPathLength = 0;

            animateToIndex = data.length - 1;
        }
        else
        {
            //Scales return undefined, if the passed value is outside of their boundaries.
            for(let i = reshapedData.length - 1; i > animateToIndex; i--)
            {
                toPathLength += calculateDistance(scaleX(reshapedData[i].x), scaleY(reshapedData[i].y), 
                                                   scaleX(reshapedData[i - 1].x), scaleY(reshapedData[i - 1].y));
            }

            fromPathLength = pathLength;
            for(let i = 0; i < animateFromIndex; i++)
            {
                fromPathLength -= calculateDistance(scaleX(reshapedData[i].x), scaleY(reshapedData[i].y), 
                                                    scaleX(reshapedData[i + 1].x), scaleY(reshapedData[i + 1].y));
            }
            
            duration = (fromPathLength - toPathLength) / pathLength * 2000;
        }
    
        //To animate the graph, stroke-dashoffset should be interpolated.
        //pathLength means that the graph should be fully hidden.
        //0 means that the graph should be fully drawn.
        path
            .attr("stroke-dashoffset", fromPathLength)
            .attr("stroke-dasharray", pathLength)
            .transition()
            .ease(d3.easeLinear)
            .duration(duration)
            .attr("stroke-dashoffset", toPathLength);
    }
}

function createPath(scaleX, scaleY, color, id) 
{
    let line = d3.line()
                 .x(d => scaleX(d.x))
                 .y(d => scaleY(d.y));
    svg.append("path") // добавляем путь
       .attr("id", id)  
       .attr("transform", `translate(${marginX}, ${marginY})`)
       .style("stroke-width", "2")
       .style("stroke", color);
   
    return line;
}
 
function makeStepOnGraph()
{
    const keyX = d3.select("#oxStore").property("checked") ? "Store" : "Unemployment";
    let data = createGraphData(dataset, keyX);

    //drawGraph was called, so the entire graph should be on screen.
    //This means we need to restart drawing.
    if(animateFromIndex === -1)
    {
        animateFromIndex = 0;
        animateToIndex = 1;
    }
    else if(animateToIndex < data.length - 1)
    {
        animateFromIndex++;
        animateToIndex++;
    }
    //The graph is fully drawn, restart.
    else
    {
        animateFromIndex = 0;
        animateToIndex = 1;
    }

    return drawGraph();
}

function animateGraph()
{
    const keyX = d3.select("#oxStore").property("checked") ? "Store" : "Unemployment";
    let data = createGraphData(dataset, keyX);

    if(animateToIndex === data.length - 1)
    {
        return true;
    }

    if(animateFromIndex === -1)
    {
        animateFromIndex = -1;
        animateToIndex = data.length - 1;
    }
    else
    {
        animateFromIndex++;
        animateToIndex = data.length - 1;
    }

    return drawGraph();
}

function calculateDistance(x1, y1, x2, y2)
{
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}