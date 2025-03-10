// import { useState, useEffect } from "react";
// import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

// const MapComponent = () => {
//   const mapContainerStyle = { width: "600px", height: "400px" };
//   const [center, setCenter] = useState({ lat: 0, lng: 0 });
//   const [carPosition, setCarPosition] = useState({ lat: 0, lng: 0 });
//   const [trafficSignal, setTrafficSignal] = useState("red");

//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const initialLat = position.coords.latitude;
//           const initialLng = position.coords.longitude;

//           setCenter({
//             lat: initialLat,
//             lng: initialLng,
//           });

//           // Set the initial car position slightly below the traffic signal
//           setCarPosition({
//             lat: initialLat - 0.001, // Start slightly south of the center
//             lng: initialLng,
//           });
//         },
//         (error) => console.error("Error fetching location:", error),
//         { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//       );
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   useEffect(() => {
//     const moveCar = () => {
//       const duration = 30000; // 30 seconds
//       const startLat = carPosition.lat;
//       const endLat = startLat + 0.002; // Move north by 200 meters (approx)

//       let startTime = Date.now();

//       const interval = setInterval(() => {
//         let elapsed = Date.now() - startTime;
//         let progress = elapsed / duration;

//         if (progress >= 1) {
//           clearInterval(interval);
//           setCarPosition({ lat: startLat + 0.002, lng: carPosition.lng }); // Set final position
//           setTimeout(() => {
//             // Reset car position after reaching the end
//             setCarPosition({ lat: startLat - 0.001, lng: carPosition.lng }); // Reset to initial position
//           }, 1000); // Wait 1 second before resetting
//         } else {
//           setCarPosition({
//             lat: startLat + (0.002) * progress, // Move towards the end position
//             lng: carPosition.lng,
//           });
//         }
//       }, 1000); // Update every second

//       return () => clearInterval(interval);
//     };

//     const carMovementInterval = setInterval(moveCar, 30000); // Start moving the car every 30 seconds

//     return () => clearInterval(carMovementInterval);
//   }, [carPosition]);

//   useEffect(() => {
//     const checkTrafficSignal = () => {
//       const distance = 0.001; // Approx 100 meters in latitude

//       if (Math.abs(carPosition.lat - center.lat) < distance) {
//         setTrafficSignal("green");
//       } else if (Math.abs(carPosition.lat - (center.lat + 0.002)) < distance) {
//         setTrafficSignal("red");
//       }
//     };

//     const trafficCheckInterval = setInterval(checkTrafficSignal, 1000);

//     return () => clearInterval(trafficCheckInterval);
//   }, [carPosition, center]);

//   return (
//     <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//       <div>
//         <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={16}>
//           {/* Moving Car Marker */}
//           <Marker position={carPosition} icon={{ url: "https://img.icons8.com/color/48/car.png" }} />

//           {/* Traffic Signal Marker */}
//           <Marker
//             position={center}
//             icon={{
//               url: trafficSignal === "red"
//                 ? "https://img.icons8.com/color/48/stop-sign.png"
//                 : "https://img.icons8.com/color/48/go.png",
//             }}
//           />
//         </GoogleMap>
//       </div>
//     </LoadScript>
//   );
// };

// export default MapComponent;

import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = () => {
  const mapContainerStyle = { width: "600px", height: "400px" };
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [carPosition, setCarPosition] = useState({ lat: 0, lng: 0 });
  const [trafficSignal, setTrafficSignal] = useState("red");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const initialLat = position.coords.latitude;
          const initialLng = position.coords.longitude;

          setCenter({
            lat: initialLat,
            lng: initialLng,
          });

          // Set the initial car position 400 meters south of the traffic signal
          setCarPosition({
            lat: initialLat - 0.004, // Start 400 meters south of the center
            lng: initialLng,
          });
        },
        (error) => console.error("Error fetching location:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const moveCar = () => {
      const duration = 60000; // 60 seconds
      const startLat = carPosition.lat;
      const endLat = startLat + 0.008; // Move north by 800 meters (approx)

      let startTime = Date.now();

      const interval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let progress = elapsed / duration;

        if (progress >= 1) {
          clearInterval(interval);
          setCarPosition({ lat: startLat + 0.008, lng: carPosition.lng }); // Set final position
          setTimeout(() => {
            // Reset car position after reaching the end
            setCarPosition({ lat: startLat - 0.004, lng: carPosition.lng }); // Reset to initial position
          }, 1000); // Wait 1 second before resetting
        } else {
          setCarPosition({
            lat: startLat + (0.008) * progress, // Move towards the end position
            lng: carPosition.lng,
          });
        }
      }, 1000); // Update every second

      return () => clearInterval(interval);
    };

    const startCarMovement = () => {
      moveCar(); // Start moving the car immediately
      const carMovementInterval = setInterval(moveCar, 60000); // Continue moving the car every 60 seconds
      return () => clearInterval(carMovementInterval);
    };

    const timeoutId = setTimeout(startCarMovement, 2000); // Start moving the car after 2 seconds

    return () => clearTimeout(timeoutId);
  }, [carPosition]);

  useEffect(() => {
    const checkTrafficSignal = () => {
      const distance = 0.002; // Approx 200 meters in latitude

      if (Math.abs(carPosition.lat - center.lat) < distance) {
        setTrafficSignal("green");
      } else {
        setTrafficSignal("red");
      }
    };

    const trafficCheckInterval = setInterval(checkTrafficSignal, 1000);

    return () => clearInterval(trafficCheckInterval);
  }, [carPosition, center]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={16}>
          {/* Moving Car Marker */}
          <Marker position={carPosition} icon={{ url: "https://img.icons8.com/color/48/car.png" }} />

          {/* Traffic Signal Marker */}
          <Marker
            position={center}
            icon={{
              url: trafficSignal === "red"
                ? "https://img.icons8.com/color/48/stop-sign.png"
                : "https://img.icons8.com/color/48/go.png",
            }}
          />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapComponent;