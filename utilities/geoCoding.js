//  pass multiple parts of a location like "city, country" (e.g., "Indore, India"), you simply pass the full string to the function. However, you must ensure it is URL-encoded so that characters like commas and spaces are handled correctly.

// The safest way is to use encodeURIComponent() when inserting the string into the API URL.

//geocode fn
// In your external JS file
async function getCoordinates(location) {
  console.log("hit");
     //make the api call
     const encodedLocation = encodeURIComponent(location); // safely encode "city, country"
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`);
    
  const text = await response.text();
  console.log(text); // This will show you the HTML error page

    //parse the response
    const data = await response.json();
    //data have a lot many things
    if (data && data.length > 0) {
      const lat = data[0].lat;
      const lon = data[0].lon;
      console.log(lat+","+lon);
      console.log(data);
      return {lon,lat};

    } else {
      console.log("Location not found.");
      return {lon:77.216721,lat:28.644800};
    }
}

export default getCoordinates;