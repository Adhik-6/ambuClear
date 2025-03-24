import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const MapComponent = () => {
  const mapContainerStyle = { width: "600px", height: "400px" };
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [trafficSignal, setTrafficSignal] = useState("red");
  const [signalLocation, setSignalLocation] = useState([
    { lat: 12.872798538923576, lng: 80.22665094179462 },
    { lat: 12.876498622458756, lng: 80.22687464586105 },
    { lat: 12.831738829201056, lng: 80.22920619101012 },
    { lat: 12.901002, lng: 80.227890 },
    { lat: 12.89779353409247, lng: 80.24746047914714 },
    { lat: 12.948937, lng: 80.240333 }
  ]);
  const [ambulancePosition, setAmbulancePosition] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const initialLat = signalLocation[0].lat; // Use signal location latitude
          const initialLng = signalLocation[0].lng; // Use signal location longitude
  
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
          { signalLocation.map((signal, index) => (
            <Marker key={index}
              position={signal}
              icon={{
                url: trafficSignal === "red"
                  ? "https://img.icons8.com/color/48/stop-sign.png"
                  : "https://img.icons8.com/color/48/go.png",
              }}
            />
          )) }
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
