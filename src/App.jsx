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
  const [ambulancePosition, setAmbulancePosition] = useState({ lat: 0, lng: 0 });
  const [trafficSignal, setTrafficSignal] = useState("red");
  const [signalLocation, setSignalLocation] = useState({ lat: 12.872798538923576, lng: 80.22665094179462});

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

          // Set the initial ambulance position 400 meters south of the traffic signal
          setAmbulancePosition({
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
    const moveAmbulance = () => {
      const duration = 60000; // 60 seconds
      const startLat = ambulancePosition.lat;
      const endLat = startLat + 0.008; // Move north by 800 meters (approx)

      let startTime = Date.now();

      const interval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let progress = elapsed / duration;

        if (progress >= 1) {
          clearInterval(interval);
          setAmbulancePosition({ lat: startLat + 0.008, lng: ambulancePosition.lng });
          setTimeout(() => {
            // Reset ambulance position after reaching the end
            setAmbulancePosition({ lat: startLat - 0.004, lng: ambulancePosition.lng });
          }, 1000);
        } else {
          setAmbulancePosition({
            lat: startLat + 0.008 * progress,
            lng: ambulancePosition.lng,
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    const startAmbulanceMovement = () => {
      moveAmbulance();
      const ambulanceMovementInterval = setInterval(moveAmbulance, 60000);
      return () => clearInterval(ambulanceMovementInterval);
    };

    const timeoutId = setTimeout(startAmbulanceMovement, 2000);

    return () => clearTimeout(timeoutId);
  }, [ambulancePosition]);

  useEffect(() => {
    const checkTrafficSignal = () => {
      const distance = 0.002; // Approx 200 meters in latitude
      if (Math.abs(ambulancePosition.lat - center.lat) < distance) {
        setTrafficSignal("green");
      } else {
        setTrafficSignal("red");
      }
    };

    const trafficCheckInterval = setInterval(checkTrafficSignal, 1000);

    return () => clearInterval(trafficCheckInterval);
  }, [ambulancePosition, center]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div>
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={16}>
          {/* Moving Ambulance Marker */}
          <Marker
            position={ambulancePosition}
            icon={{
              url: "https://img.icons8.com/color/48/ambulance.png", // Ambulance icon
            }}
          />

          {/* Traffic Signal Marker */}
          <Marker
            position={signalLocation}
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
