import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Nav from '../navigation/Nav';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/map.css';

const Map = () => {
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([]);

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(firestore, 'famouss'));
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
    iconUrl: "https://png.pngtree.com/png-vector/20220919/ourmid/pngtree-location-pin-3d-icon-png-image_6206658.png",
    iconSize: [45, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <>
      <Nav />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet/dist/leaflet.css"
        integrity="sha512-q6sqqxbl6n6RNq3kY5gKkP8C4JF8sWQe0mz4uJgk1fptpV2K5PN6nxahb2jIm/eLNT8lBuRz5Ebhye/OV5IKKg=="
        crossOrigin=""
      />
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <MapContainer center={mapCenter.length > 0 ? mapCenter : [14.889238, 102.002006]} zoom={12} style={{ height: '650px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {dataFromFirestore.map((position, index) => (
          position.lat && position.lon && (
            <Marker position={[position.lat, position.lon]} key={index} icon={usersProfileIcon}>
              <Popup><img src={position.imgUrls} className='map-img' /> <br /> {position.name} <br /> {position.add}</Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </>
  );
};

export default Map;