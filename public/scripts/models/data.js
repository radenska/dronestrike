'use strict';

(function(module) {

  var stylesArray =
    [
      {
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#212121'
          }
        ]
      },
      {
        'elementType': 'labels.icon',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#757575'
          }
        ]
      },
      {
        'elementType': 'labels.text.stroke',
        'stylers': [
          {
            'color': '#212121'
          }
        ]
      },
      {
        'featureType': 'administrative',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#757575'
          }
        ]
      },
      {
        'featureType': 'administrative.country',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#9e9e9e'
          }
        ]
      },
      {
        'featureType': 'administrative.land_parcel',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'administrative.locality',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#bdbdbd'
          }
        ]
      },
      {
        'featureType': 'poi',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#757575'
          }
        ]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#181818'
          }
        ]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#616161'
          }
        ]
      },
      {
        'featureType': 'poi.park',
        'elementType': 'labels.text.stroke',
        'stylers': [
          {
            'color': '#1b1b1b'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#2c2c2c'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#8a8a8a'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#373737'
          }
        ]
      },
      {
        'featureType': 'road.highway',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#3c3c3c'
          }
        ]
      },
      {
        'featureType': 'road.highway.controlled_access',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#4e4e4e'
          }
        ]
      },
      {
        'featureType': 'road.local',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#616161'
          }
        ]
      },
      {
        'featureType': 'transit',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#757575'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [
          {
            'color': '#000000'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#3d3d3d'
          }
        ]
      }
    ];
  var mapOptions = {
    zoom: 4,
    styles: stylesArray,
    center: new google.maps.LatLng(18.783174, 58.002993),
    mapTypeId: google.maps.MapTypeId.STREET,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    }
  }

  function Data (opts) {
    Object.keys(opts).forEach(function(val) {
      this[val] = opts[val];
    }, this);
  }

  Data.allData = [];

  Data.prototype.insertRecord = function() {
    $.post('/strikes/insert', {number: this.number, country: this.country, date: this.date, narrative: this.narrative, town: this.town, location: this.location, deaths: this.deaths, deaths_min: this.deaths_min, deaths_max: this.deaths_max, civilians: this.civilians, injuries: this.injuries, children: this.children, tweet_id: this.tweet_id, bureau_id: this.bureau_id, bij_summary_short: this.bij_summary_short, bij_link: this.bij_link, target: this.target, lat: this.lat, lon: this.lon, names: this.names})
  };

  Data.loadAll = function(rows) {
      // console.log('in loadall')
    Data.allData = rows.map(function(ele) {
      return new Data(ele);
    });
  };


  Data.fetchAll = function(ctx, next) {
      // console.log('in data.fetchAll');
    $.get('/strikes/all')
        .then(function(obj) {
          if (obj.rowCount) {
            console.log('in fetch all', obj.rows);
            localStorage.strikes = obj.rows;
            Data.loadAll(obj.rows);
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);

            google.maps.event.addDomListener(window, 'resize', function() {
              var center = {lat: 18.783174, lng: 58.002993};
              google.maps.event.trigger(map, 'resize');
              map.setCenter(center);
            });
            Data.allData.forEach(val => {
              var lat = parseFloat(val.lat);
              var lng = parseFloat(val.lon);
              var marker = new google.maps.Marker({
                position: {lat: lat, lng: lng},
                map: map,
              });
              var infowindow = new google.maps.InfoWindow({
                content: `town: ${val.town}, location: ${val.location}, deaths: ${val.deaths}, injuries: ${val.injuries}`
              });
              marker.addListener('click', function() {
                infowindow.open(map, marker);
              });
            });
          } else {
            $.ajax({
              url: 'https://api.dronestre.am/data',
              method: 'GET',
              dataType: 'jsonp'
            })
             .then(rawData => {
               rawData.strike.forEach(function(item) {
                 var strike = new Data(item);
                 strike.insertRecord();
               });
               Data.fetchAll();
             });
          }
        }).then(function(obj) {
          console.log('data alldata', Data.allData);
        })
        // .then(function(obj) {
        //   var somalia = Data.allData.filter( val => {return val.country ==='Somalia'});
        //   somaliaView.makeMap(somalia);
        //   let yemen = Data.allData.filter( val => {return val.country ==='Yemen'});
        //   somaliaView.makeMap(yemen);
        //   let pakistan = Data.allData.filter( val => {val.country.indexOf('P') === 0});
        //   somaliaView.makeMap(pakistan);
        // });
  };

  module.Data = Data;
})(window);
