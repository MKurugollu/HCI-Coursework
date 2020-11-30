var mymap = L.map('mapid', {
    minZoom: 6.25
});
mymap.setView([58, -4], 6.25);

// Set up map using leaflet
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    // Select map tile set
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiMjMwNTUzOWIiLCJhIjoiY2toeGxtNnQ2MDFqMzJ4cWE0cGI4NnFtMCJ9.PoNK_6KKiyGaLrJwYFRqXA'
}).addTo(mymap);

// Load data for administrative boundaries into map
$.getJSON("static/js/sco_admin_bounds.json", function (data) {

    var previousArea;

    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(mymap);

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.Tier),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function getColor(t) {
        return t === 0 ? '#007a3d' :
            t === 1 ? '#0071ae' :
                t === 2 ? '#1a466a' :
                    t === 3 ? '#763786' :
                        t === 4 ? '#df0714' :
                            '#ffffff';
    }

    function onEachFeature(feature, layer) {
        layer.on({
            click: highlightFeature,
        });
    }


    function highlightFeature(e) {

        // Removes highlight from previously selected area
        if (e.target != previousArea && previousArea != null) {
            resetHighlight(previousArea)
        }

        var layer = e.target;

        info.update(layer.feature.properties);

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        previousArea = e.target

    }

    function resetHighlight(e) {
        info.update();
        geojson.resetStyle(e.target);
    }


    // Create legend
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            tiers = [0, 1, 2, 3, 4]
        // loop through tiers and create labels
        for (var i = 0; i < tiers.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(tiers[i]) + '"></i> ' + "Tier " +
                tiers[i] + '<br>';
        }

        return div;
    };

    legend.addTo(mymap);


    // Called when area is selected, updates the information jubotron
    info.update = function (props) {

        var rulesDiv = "";

        // load data for tier rules
        $.getJSON("static/js/rules.json", function (ruleData) {

            // props will be undefined when no area is selected
            if (typeof (props) !== "undefined") {
                // -1 for indexing
                rules = ruleData.Tiers[props.Tier - 1].Rules;
                moreInfo = ruleData.Tiers[props.Tier - 1].More;
                console.log(moreInfo)

                // creates the div holdings all rules for current area
                for (rule in rules) {
                    rulesDiv += '<p id="rule-heading">' + rule + '</p>' + '<p>' + ' - ' + rules[rule] + '</p>';
                }

                rulesDiv += '<div class="row">' +
                    '<div class="col">' + '<a href="' + moreInfo + '">Click here for more info about this tiers restrictions!</a></div>' +
                    '<div class="col"><button id="resetButton" type="button" class="btn btn-primary">Reset selection!</button></div>'

                // rulesDiv += '</div><a href="'+ moreInfo + '">Click here for more info about this tier\'s restrictions!</a>' +
                //     '<button type="button" class="btn btn-primary">Reset selection!</button>'
            }

            // checks if area is selected and displays area name, tier, and rules
            // LAD13NM is the area name : local administrative district 2013 name
            document.getElementById("areaInfo").innerHTML = (props ?
                '<h1>' + props.LAD13NM + '</h1>' +
                '<h2>Tier ' + props.Tier + '</h2>' +
                rulesDiv

                : '<h1>Click on an area or enter your postcode!</h1>');


        });
    };

    info.addTo(mymap);

});