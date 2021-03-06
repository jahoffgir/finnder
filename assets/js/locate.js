/**
 * This script gets the user's location and uses the zomato-js-sdk to get 
 * restaurants near the location
 *
 * Sources:
 * - Google Geolocation API for getting user location
 *   https://developers.google.com/maps/documentation/geolocation/intro
 *
 * - zomato-js-sdk for using Zomato API Library functions
 *   https://github.com/ameykshirsagar/zomato-js-sdk
 *
 * - Google Geocoding API for converting city to co-ordinates
 *   https://developers.google.com/maps/documentation/geocoding/start
 */


/**
 * A helper function  
 */
function zomatoCall( latlng ) {
    Zomato.geocode( latlng, function( restaurants ) {
        // we got the restaurants, populate and return
        var restaurantObjects = new Array();
        var nearbyRestaurants = restaurants.nearby_restaurants;
        console.log( localStorage.getItem( "ZOMATO_API_ID" ) );
        for( var i = 0; i < Object.keys( nearbyRestaurants ).length; i++ ) {
            var r = nearbyRestaurants[ i ].restaurant;
            console.log( r.name );
            restaurantObjects.push( [
                r.name,
                r.url,
                r.location,
                r.cuisine,
                r.price_range,
                r.user_rating,
                r.featured_image,
                r.menu_url
            ] );
        }
        console.log( restaurantObjects );
        localStorage.setItem( "restaurants", restaurantObjects );
        return;
    }, function( error ) {
        alert( "Your search returned no results!" );
        return;
    } )
}


/**
 * Function to handle success of getting current location
 * Uses zomato-js-sdk to pull restaurants in vicinity of location
 * Creates array of restaurant objects with relevant information
 */
function getLocationSuccess( position ) {
    var latlng = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    }
    console.log( latlng );
    zomatoCall( latlng );
    return;
}


/**
 * Function to handle failure to get current position
 */
function getLocationFailure() {
    alert( "Yikes! There was an unknown error in getting your location!" );
    return;
}


/**
 * Function to get the location of the user using Google Geolocation API
 */
function getLocation() {
    if( ! navigator.geolocation ) {
	 	// no location support
        alert( "Yikes! Your browser does not support geolocation :(" );
	}
	else if( navigator.geolocation ) {
        // location is supported
        navigator.geolocation.getCurrentPosition( getLocationSuccess, getLocationFailure );
        
	}
 }


function addressToRestaurants( address ) {
    // Initialize the geocoder
    console.log( address );
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( {
        "address": address
    }, function( results, status ) {
        if( status === google.maps.GeocoderStatus.OK ) { 
            // geocoding successful
            var latlng = {
                latitude: results[ 0 ].geometry.location.lat,
                longitude: results[ 0 ].geometry.location.lng
            };
            console.log( latlng );
            zomatoCall( latlng );
            return;
        }
        else {
            // geocoding failed
            alert( "Unknown error converting " + address + " to co-ordinates!" );
            return;
        }
    } );
}