import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

const MapView = () => {
  const [geoData, setGeoData] = useState(null);
  const [aiData, setAiData] = useState(null); 

  useEffect(() => {
    window.hapusHalte = async (id) => {
      if(window.confirm("Yakin mau hapus halte ini dari database?")) {
        try {
          await api.delete(`/${id}`);
          alert("Data Halte berhasil dihapus!");
          window.location.reload(); 
        } catch (error) {
          alert("Gagal menghapus halte. Cek konsol.");
        }
      }
    };
    return () => { delete window.hapusHalte; };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/api/halte/');
        setGeoData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetch('/hasil_batch_14_gambar.geojson')
      .then(res => res.json())
      .then(data => setAiData(data))
      .catch(err => console.error(err));
  }, []);

  const pointToLayer = (feature, latlng) => {
    let markerColor = '#94a3b8';
    if (feature.properties.jenis === 'brt') markerColor = '#ef4444';
    if (feature.properties.jenis === 'bus') markerColor = '#3b82f6';
    if (feature.properties.jenis === 'angkot') markerColor = '#10b981';

    return L.circleMarker(latlng, {
      radius: 8, fillColor: markerColor, color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.8
    });
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.nama) {
      const bgBadge = feature.properties.jenis === 'brt' ? '#fee2e2' : feature.properties.jenis === 'bus' ? '#dbeafe' : '#d1fae5';
      const txtBadge = feature.properties.jenis === 'brt' ? '#ef4444' : feature.properties.jenis === 'bus' ? '#3b82f6' : '#10b981';

      layer.bindPopup(`
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; min-width: 220px; padding: 4px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #0f172a; font-weight: bold; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
            ${feature.properties.nama}
          </h3>
          <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
            <span style="background: ${bgBadge}; color: ${txtBadge}; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
              ${feature.properties.jenis}
            </span>
            <span style="color: #64748b; font-size: 12px; font-weight: 500;">• ${feature.properties.kode || 'Tanpa Kode'}</span>
          </div>
          <div style="background: #f8fafc; padding: 10px; border-radius: 6px; margin-bottom: 15px; border: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 13px; color: #475569;">👥 Kapasitas: <strong style="color: #0f172a;">${feature.properties.kapasitas || 0} Orang</strong></p>
          </div>
          <button onclick="window.hapusHalte(${feature.properties.id})" style="width: 100%; padding: 10px; background: white; color: #ef4444; border: 1px solid #fca5a5; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 13px; display: flex; justify-content: center; align-items: center; gap: 6px; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            Hapus Halte
          </button>
        </div>
      `);
    }
  };

  const aiPointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: 6, fillColor: '#f59e0b', color: '#1e293b', weight: 2, opacity: 1, fillOpacity: 0.9
    });
  };

  const aiOnEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(`
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 5px;">
          <h4 style="margin: 0 0 8px 0; color: #f59e0b; font-size: 15px;">🤖 Deteksi AI YOLOv8</h4>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #334155;"><strong>Objek:</strong> ${feature.properties.jenis}</p>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #334155;"><strong>Akurasi:</strong> <span style="color: #10b981; font-weight: bold;">${(feature.properties.confidence * 100).toFixed(1)}%</span></p>
          <p style="margin: 0; font-size: 11px; color: #94a3b8;">Sumber: ${feature.properties.sumber || 'Tidak diketahui'}</p>
        </div>
      `);
    }
  };

  return (
    <MapContainer 
      center={[-5.3575, 105.3140]} 
      zoom={15} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false} 
    >
      <ZoomControl position="topright" />

      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Satelit (Esri)">
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Peta Jalan (OSM)">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Mode Gelap (CartoDB)">
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {geoData && (
        <GeoJSON data={geoData} pointToLayer={pointToLayer} onEachFeature={onEachFeature} />
      )}
      {aiData && (
        <GeoJSON data={aiData} pointToLayer={aiPointToLayer} onEachFeature={aiOnEachFeature} />
      )}
    </MapContainer>
  );
};

export default MapView;