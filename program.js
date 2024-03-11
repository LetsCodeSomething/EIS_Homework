let tableShown = false;

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

        rows.filter(d => (d.Unemployment > 8)).style("display", "none");
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