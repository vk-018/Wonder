//  pass multiple parts of a location like "city, country" (e.g., "Indore, India"), you simply pass the full string to the function. However, you must ensure it is URL-encoded so that characters like commas and spaces are handled correctly.

// The safest way is to use encodeURIComponent() when inserting the string into the API URL.

//geocode fn
// In your external JS file
// async function getCoordinates(location) {
//   console.log("hit");
//      //make the api call
//      const encodedLocation = encodeURIComponent(location); // safely encode "city, country"
//     const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`);
    
//   const text = await response.text();
//   console.log(text); // This will show you the HTML error page

//     //parse the response
//     const data = await response.json();
//     //data have a lot many things
//     if (data && data.length > 0) {
//       const lat = data[0].lat;
//       const lon = data[0].lon;
//       console.log(lat+","+lon);
//       console.log(data);
//       return {lon,lat};

//     } else {
//       console.log("Location not found.");
//       return {lon:77.216721,lat:28.644800};
//     }
// }

// export default getCoordinates;
async function getCoordinates(location) {
  const encodedLocation = encodeURIComponent(location);

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}`,
      {
        headers: {
          "User-Agent": "WonderApp/1.0 (hipartner30@gmail.com)"
        }
      }
    );

    const text = await response.text();

    // Try to parse JSON, if fails, log and return fallback
    try {
      const data = JSON.parse(text);

      if (data && data.length > 0) {
        const lat = data[0].lat;
        const lon = data[0].lon;
        console.log("Coordinates:", lat, lon);
        return { lat, lon };
      } else {
        console.log("Location not found.");
        return { lat: 28.644800, lon: 77.216721 }; // fallback coords
      }
    } catch (jsonErr) {
      console.error("Nominatim response is not JSON. Response was:\n", text.slice(0, 300));
      return { lat: 28.644800, lon: 77.216721 };
    }

  } catch (err) {
    console.error("Failed to fetch coordinates:", err);
    return { lat: 28.644800, lon: 77.216721 };
  }
}

export default getCoordinates;
