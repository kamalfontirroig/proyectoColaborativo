//window resolution force (no funciona)
var width = 678;
var height = 500;
self.moveTo((screen.availwidth - width) / 2, (screen.availheight - height) / 2);
self.resizeTo(width, height);
//

//Global Variables
var pokemonNamesArray
var found = {
    status: Boolean,
    is: (bulean) => {
        found.status = bulean;
    }
}

window.onload = function() {
    $("#loading-img").hide();
    CanvasJS.addColorSet("primarios", [ //colorSet Array
        // "orange",
        // "purple",
        // "blue",
        // "yellow",
        // "red",   
        // "green"
        "#03e603",
        "red",
        "blue",
        "#ff00dd",
        "#a1008c",
        "yellow"

    ]);
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/?limit=964`,
    }).done(function(data) {
        var i;
        pokemonNamesArray = data.results
    })
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    $('#formulario').submit(function(event) {
        found.is(false);
        // alert("submited")
        event.preventDefault();
        $(':focus').blur();
        var nombreBuscado = $("#buscador").val().toLowerCase();

        //fuse search options //approximate string matching
        const options = {
            includeScore: true,
            keys: ['name']
        }
        const fuse = new Fuse(pokemonNamesArray, options);
        const resultadoBusqueda = fuse.search(nombreBuscado);
        if (resultadoBusqueda[0] != undefined) {
            var pokemonEncontrado = resultadoBusqueda[0].item.name;
            console.log(resultadoBusqueda)
            $("#pokeInfo").empty();
            $("#pStats").empty();

            $("#loading-img").show();
            $.ajax({
                url: `https://pokeapi.co/api/v2/pokemon/${pokemonEncontrado}/`, //ajax
                error: () => {
                    $('#pokeInfo').append(`<div class="text-center my-3 " style="color:red;"> <p>404 - NO MATCH</p> <div>`);
                },
                complete: () => {
                    $("#loading-img").hide();
                }
            }).done(function(data) {

                if (data) {
                    var dataChart = data.stats;
                    var i;
                    // for (i = dataChart.length - 1; i >= 0; i--) { // ciclos.
                    //     dataChart[dataChart.length - 1 - i].label = dataChart[i]['stat'].name;

                    //     dataChart[dataChart.length - 1 - i].y = dataChart[i]['base_stat'];

                    //     console.log("att " + i + " " + dataChart[i].label)
                    // }    
                    largo = dataChart.length;
                    for (i = 0; i < largo; i++) { // ciclos.
                        dataChart[i].label = dataChart[i]['stat'].name;
                        dataChart[i].y = dataChart[i]['base_stat'];
                        console.log("att " + i + " " + dataChart[i].label)
                    }
                    dataChart.reverse();
                    dataChart[0].label = "HP";
                    dataChart[1].label = "ATK"
                    dataChart[2].label = "DEF"
                    dataChart[3].label = "S-ATK"
                    dataChart[4].label = "S-DEF"
                    dataChart[5].label = "SPD"


                    console.log("Sample of data:", data);

                    console.log("encontrado: " + found.status)
                    $('#pokeInfo').append(`<div class="text-center texto my-3"> <h3>${capitalizar(data.name)}</h3> <div>`); //jquery
                    $("#pokeInfo").append(`<img src="${data.sprites.front_default}" alt="${data.name}"> <img>`);
                    $("#pokeInfo").append(`<div class="text-center texto my-3"> <p>Peso: ${data.weight/10} [kg]<p> <div>`);
                    var options = {
                        animationEnabled: true,
                        backgroundColor: "#000000",
                        colorSet: 'primarios',

                        title: {
                            text: "Stats Base"
                        },
                        axisY: {
                            title: "Value",
                            includeZero: false
                        },
                        axisX: {
                            title: "Stats"
                        },
                        data: [{
                            type: "column",
                            dataPoints: dataChart
                        }]
                    };
                    $("#pStats").CanvasJSChart(options);
                }
                found.is(true);
                $("#encontrado-mensaje").removeClass("al-fondo")
                $("#encontrado-mensaje").addClass("al-frente")
                $("#noencontrado-mensaje").addClass("al-fondo")
                $("#noencontrado-mensaje").removeClass("al-frente")
                console.log("encontrado")


                //Append la coincidencias de pokemones como un listado en infoBox
                $('#pokemonList').empty();
                if (!document.getElementById('title')) {
                    $("#infoBox").prepend('<h10 id="title">Más Pokemones:</h10>');
                }
                for (var i = 1; i < 11; i++) {
                    $('#pokemonList').append(`<div onmouseover="highLight('${i}', 'on')" onmouseout="highLight('${i}','off')" onclick="submiting('${resultadoBusqueda[i].item.name}')" id ="coincidencia${i}" class=" my-1 link-list-item" style="">${i} - ${capitalizar(resultadoBusqueda[i].item.name)}</div>`)
                    $(`#coincidencia${i}>p`).show('slow')
                }
            });

        }

    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function submiting(pokemonDeLista) {

    found.is(false);
    // alert("submited")

    $(':focus').blur();
    console.log(pokemonDeLista)
    var nombreBuscado = pokemonDeLista.toLowerCase();

    //fuse search options //approximate string matching
    const options = {
        includeScore: true,
        keys: ['name']
    }
    const fuse = new Fuse(pokemonNamesArray, options);
    const resultadoBusqueda = fuse.search(nombreBuscado);
    if (resultadoBusqueda[0] != undefined) {
        var pokemonEncontrado = resultadoBusqueda[0].item.name;
        console.log(resultadoBusqueda)
        $("#pokeInfo").empty();
        $("#pStats").empty();

        $("#loading-img").show();
        $.ajax({
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonEncontrado}/`, //ajax
            error: () => {
                $('#pokeInfo').append(`<div class="text-center my-3 " style="color:red;"> <p>404 - NO MATCH</p> <div>`);
            },
            complete: () => {
                $("#loading-img").hide();
            }
        }).done(function(data) {

            if (data) {
                var dataChart = data.stats;
                var i; // for (i = dataChart.length - 1; i >= 0; i--) { // ciclos.
                //     dataChart[dataChart.length - 1 - i].label = dataChart[i]['stat'].name;

                //     dataChart[dataChart.length - 1 - i].y = dataChart[i]['base_stat'];

                //     console.log("att " + i + " " + dataChart[i].label)
                // }


                for (i = 0; i < dataChart.length; i++) { // ciclos.
                    dataChart[i].label = dataChart[i]['stat'].name;
                    dataChart[i].y = dataChart[i]['base_stat'];
                    console.log("att " + i + " " + dataChart[i].label)
                }
                dataChart.reverse();
                dataChart[0].label = "HP";
                dataChart[1].label = "ATK"
                dataChart[2].label = "DEF"
                dataChart[3].label = "S-ATK"
                dataChart[4].label = "S-DEF"
                dataChart[5].label = "SPD"

                console.log("Sample of data:", data);

                console.log(found.status)
                $('#pokeInfo').append(`<div class="text-center texto my-3"> <h3>${capitalizar(data.name)}</h3> <div>`); //jquery
                $("#pokeInfo").append(`<img src="${data.sprites.front_default}" alt="${data.name}"> <img>`);
                $("#pokeInfo").append(`<div class="text-center texto my-3"> <p>Peso: ${data.weight/10} [kg]<p> <div>`);
                var options = {
                    animationEnabled: true,
                    backgroundColor: "#000000",
                    colorSet: 'primarios',

                    title: {
                        text: "Stats Base"
                    },
                    axisY: {
                        title: "Value",
                        includeZero: false
                    },
                    axisX: {
                        title: "Stats"
                    },
                    data: [{
                        type: "column",
                        dataPoints: dataChart
                    }, ],
                    indexLabelPlacement: "inside"

                };
                $("#pStats").CanvasJSChart(options);
            }
            found.is(true);
            $("#encontrado-mensaje").removeClass("al-fondo")
            $("#encontrado-mensaje").addClass("al-frente")
            $("#noencontrado-mensaje").addClass("al-fondo")
            $("#noencontrado-mensaje").removeClass("al-frente")
            console.log("encontrado")


            //Append la coincidencias de pokemones como un listado en infoBox
            $('#pokemonList').empty();
            if (!document.getElementById('title')) {
                $("#infoBox").prepend('<p id="title">Más Pokemones:</p><br><br>');
            }
            for (var i = 1; i < 11; i++) {
                $('#pokemonList').append(`<div onmouseover="highLight('${i}', 'on')" onmouseout="highLight('${i}','off')" onclick="submiting('${resultadoBusqueda[i].item.name}')" id ="coincidencia${i}" class=" my-1 link-list-item" style="">${i} - ${capitalizar(resultadoBusqueda[i].item.name)}</div>`)
                $(`#coincidencia${i}>p`).show('slow')
            }
        });

    }

};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


for (var i = 0; i < 10; i++) {
    $
}

//esta funcion es para la lista de pokemones, es para que se prenda el nombre al ponerse encima
function highLight(i, onOff) {
    console.log("sobrelink");
    if (onOff === 'on') {
        eval("coincidencia" + i + ".style.color = 'green'")
    } else {
        eval("coincidencia" + i + ".style.color = 'black'")

    }
}


function resetScreen() {
    $('.busqueda').attr("placeholder", "");
    $('#buscador').empty()
    $("#encontrado-mensaje").removeClass("al-frente");
    $("#noencontrado-mensaje").removeClass("al-frente");
    $("#encontrado-mensaje").addClass("al-fondo");
    $("#noencontrado-mensaje").addClass("al-fondo");
}

function capitalizar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//FOR BUILDING TESTING

// function() {
//     $("#pokeinfo")
// }
