import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import Nav from '../navigation/Nav';
import { collection, getDocs, query, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/map.css';

const Gpscar = () => {
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [dataFromFirestoress, setDataFromFirestoress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([14.877688, 102.014071]);
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get('uid');
  const [fetchPostInterval, setFetchPostInterval] = useState(null);

  const fetchPost = async () => {
    try {
      const docRef = doc(firestore, 'gps', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedData = { id: docSnap.id, ...docSnap.data() };
        setDataFromFirestoress((prevData) => [fetchedData]);
      } else {
        console.log('Document not found.', uid);
        setDataFromFirestoress([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoading(false);
    };

    const intervalId = setInterval(() => {
      fetchPost();
    }, 5000);

    setFetchPostInterval(intervalId);

    fetchData();

    return () => {
      clearInterval(fetchPostInterval);
    };
  }, [uid, fetchPostInterval]);

  const usersProfileIcon = new L.Icon({
    iconUrl: "https://www.clipartmax.com/png/middle/2-22665_free-vector-graphic-%E0%B8%A3%E0%B8%96-%E0%B8%95%E0%B8%B9%E0%B9%89-%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%95%E0%B8%B9%E0%B8%99-png.png",
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
      <MapContainer center={mapCenter} zoom={12} style={{ height: '650px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {dataFromFirestoress.map((position) => (
          position.latitude && position.longitude && (
            <Marker
              key={position.id}
              position={[position.latitude, position.longitude]}
              icon={usersProfileIcon}
            >
              <Popup>{position.latitude}</Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </>
  );
};

export default Gpscar;
