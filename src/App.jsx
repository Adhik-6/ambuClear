import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = () => {
  const mapContainerStyle = { width: "600px", height: "400px" };
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [trafficSignal, setTrafficSignal] = useState("red");
  const [signalLocation, setSignalLocation] = useState({ lat: 12.872798538923576, lng: 80.22665094179462});
  const [ambulancePosition, setAmbulancePosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const initialLat = signalLocation.lat; // Use signal location latitude
          const initialLng = signalLocation.lng; // Use signal location longitude
  
          setCenter({
            lat: initialLat,
            lng: initialLng,
          });
  
          // Set the initial ambulance position directly under the traffic signal
          setAmbulancePosition({
            lat: initialLat - 0.004, // Start 400 meters south of the signal
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

// import { useState, useEffect } from "react";
// import { GoogleMap, LoadScript, Marker, OverlayView } from "@react-google-maps/api";

// const MapComponent = () => {
//   const mapContainerStyle = { width: "600px", height: "400px" };

//   // Traffic signal location
//   const [signalLocation] = useState({ lat: 12.872798538923576, lng: 80.22665094179462 });

//   // Set ambulance 400 meters south of the signal
//   const [ambulancePosition, setAmbulancePosition] = useState({
//     lat: signalLocation.lat - 0.004, // 400 meters south
//     lng: signalLocation.lng,
//   });

//   const [trafficSignal, setTrafficSignal] = useState("red");

//   useEffect(() => {
//     const moveAmbulance = () => {
//       const duration = 60000; // 60 seconds
//       const startLat = signalLocation.lat - 0.004; // 400 meters south
//       const endLat = signalLocation.lat + 0.004; // Move 800 meters north

//       let startTime = Date.now();

//       const interval = setInterval(() => {
//         let elapsed = Date.now() - startTime;
//         let progress = elapsed / duration;

//         if (progress >= 1) {
//           clearInterval(interval);
//           setAmbulancePosition({ lat: startLat + 0.008, lng: signalLocation.lng });

//           setTimeout(() => {
//             // Reset ambulance back to 400 meters south
//             setAmbulancePosition({ lat: startLat, lng: signalLocation.lng });
//           }, 1000);
//         } else {
//           setAmbulancePosition({
//             lat: startLat + 0.008 * progress,
//             lng: signalLocation.lng,
//           });
//         }
//       }, 1000);

//       return () => clearInterval(interval);
//     };

//     const startAmbulanceMovement = () => {
//       moveAmbulance();
//       const ambulanceMovementInterval = setInterval(moveAmbulance, 60000);
//       return () => clearInterval(ambulanceMovementInterval);
//     };

//     const timeoutId = setTimeout(startAmbulanceMovement, 2000);

//     return () => clearTimeout(timeoutId);
//   }, [signalLocation]);

//   useEffect(() => {
//     const checkTrafficSignal = () => {
//       const distance = 0.002; // Approx 200 meters in latitude
//       if (Math.abs(ambulancePosition.lat - signalLocation.lat) < distance) {
//         setTrafficSignal("green");
//       } else {
//         setTrafficSignal("red");
//       }
//     };

//     const trafficCheckInterval = setInterval(checkTrafficSignal, 1000);

//     return () => clearInterval(trafficCheckInterval);
//   }, [ambulancePosition, signalLocation]);

//   // Traffic Light Component (Animated SVG)
//   const TrafficLightSVG = () => {
//     return (
//       <svg width="40" height="100" viewBox="0 0 40 100">
//         <rect x="10" y="0" width="20" height="80" rx="5" fill="black" />
//         <circle cx="20" cy="20" r="8" fill={trafficSignal === "red" ? "red" : "#400000"} className={trafficSignal === "red" ? "blink" : ""} />
//         <circle cx="20" cy="40" r="8" fill={trafficSignal === "yellow" ? "yellow" : "#404000"} className={trafficSignal === "yellow" ? "blink" : ""} />
//         <circle cx="20" cy="60" r="8" fill={trafficSignal === "green" ? "green" : "#004000"} className={trafficSignal === "green" ? "blink" : ""} />
//         <style>
//           {`
//             .blink {
//               animation: blink-animation 1s infinite alternate;
//             }
//             @keyframes blink-animation {
//               from { opacity: 1; }
//               to { opacity: 0.3; }
//             }
//           `}
//         </style>
//       </svg>
//     );
//   };

//   return (
//     <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//       <div>
//         <GoogleMap mapContainerStyle={mapContainerStyle} center={signalLocation} zoom={16}>
//           {/* Moving Ambulance Marker */}
//           <Marker
//             position={ambulancePosition}
//             icon={{
//               url: "https://img.icons8.com/color/48/ambulance.png", // Ambulance icon
//             }}
//           />

//           {/* Traffic Signal as Animated SVG */}
//           <OverlayView position={signalLocation} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
//             <TrafficLightSVG />
//           </OverlayView>
//         </GoogleMap>
//       </div>
//     </LoadScript>
//   );
// };

// export default MapComponent;
