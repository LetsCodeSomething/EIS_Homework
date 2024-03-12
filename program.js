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

function showTable()
{
    let table = d3.select("#mainTable");

    let rows  = table.select("tbody").selectAll("tr").data(dataset).enter().append("tr").style("display","");
    let cells = rows.selectAll("td").data(d => Object.values(d)).enter().append("td").text(d => d);
    let head  = table.select("thead").insert("tr", "tr").selectAll("tr").data(d => Object.keys(dataset[0])).enter().append("td").text(d => d);
}

function deleteTable()
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
            
            showTable();

            d3.select("#applyFilters").attr("disabled", null);
            d3.select("#resetFilters").attr("disabled", null);
            d3.select("#applySort").attr("disabled", null);
            d3.select("#resetSort").attr("disabled", null);
        }
        else
        {
            tableShown = false;
            buttonValue.attr("value", "Показать таблицу");

            deleteTable();

            d3.select("#applyFilters").attr("disabled", "disabled");
            d3.select("#resetFilters").attr("disabled", "disabled");
            d3.select("#applySort").attr("disabled", "disabled");
            d3.select("#resetSort").attr("disabled", "disabled");
        }
    }
);

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
        deleteTable();
        showTable();
    }
);

d3.select("#sortFilter1").on
(
    "change", function()
    {
        sortFilter1 = d3.select("#sortFilter1");
        sortFilterInv1 = d3.select("#sortFilterInv1");
        sortFilter2 = d3.select("#sortFilter2");
        sortFilterInv2 = d3.select("#sortFilterInv2");
        sortFilter3 = d3.select("#sortFilter3");
        sortFilterInv3 = d3.select("#sortFilterInv3");

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

d3.select("#applySort").on
(
    "click", function()
    {
        let rows = d3.select("#mainTable").select("tbody").selectAll("tr");
        

    }
);

d3.select("#resetSort").on
(
    "click", function()
    {
        deleteTable();
        showTable();
    }
);