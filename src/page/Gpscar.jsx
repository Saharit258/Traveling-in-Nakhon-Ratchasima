import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Nav from '../navigation/Nav';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/map.css';

const Gpscar = () => {
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([14.877688, 102.014071]);

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(firestore, 'Sightseeings'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => doc.data());
      setDataFromFirestore(fetchedData);

      if (fetchedData.length > 0) {
        const totalLat = fetchedData.reduce((acc, position) => acc + position.lat, 0);
        const totalLon = fetchedData.reduce((acc, position) => acc + position.lon, 0);
        const avgLat = totalLat / fetchedData.length;
        const avgLon = totalLon / fetchedData.length;
        setMapCenter([avgLat, avgLon]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchDataFromFirestore();
      setLoading(false);
    };

    fetchData();
  }, []);

  const usersProfileIcon = new L.Icon({
    iconUrl: "https://www.clipartmax.com/png/middle/2-22665_free-vector-graphic-%E0%B8%A3%E0%B8%96-%E0%B8%95%E0%B8%B9%E0%B9%89-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B9%E0%B8%99-png.png",
    iconSize: [45, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <>
      <Nav/>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet/dist/leaflet.css"
        integrity="sha512-q6sqqxbl6n6RNq3kY5gKkP8C4JF8sWQe0mz4uJgk1fptpV2K5PN6nxahb2jIm/eLNT8lBuRz5Ebhye/OV5IKKg=="
        crossOrigin=""
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <MapContainer center={mapCenter} zoom={12} style={{ height: '650px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {dataFromFirestore.map((position, index) => (
          position.lat && position.lon && (
            <Marker position={[14.877688, 102.014071]} key={index} icon={usersProfileIcon}>
              <Popup>{position.name}</Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </>
  );
};

export default Gpscar;
