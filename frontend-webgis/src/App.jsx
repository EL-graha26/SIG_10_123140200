import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MapView from './components/MapView';
import Login from './components/Login';
import api from './services/api';
import './App.css';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

const Dashboard = () => {
    const { logout } = useAuth();
    const [formData, setFormData] = useState({
        nama: '', kode: '', jenis: 'angkot', kapasitas: 0, latitude: '', longitude: ''
    });

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    const handleTambah = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/halte/', {
                nama: formData.nama, kode: formData.kode, jenis: formData.jenis,
                kapasitas: parseInt(formData.kapasitas),
                latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude)
            });
            alert('Berhasil disimpan!');
            window.location.reload();
        } catch (err) {
            alert('Gagal menyimpan data.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#f8fafc', margin: 0, overflow: 'hidden' }}>
            <header style={{ height: '64px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#2563eb', color: 'white', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px' }}>GT</div>
                    <h1 style={{ margin: 0, fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>GeoTransit ID</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Administrator</span>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
                </div>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <aside style={{ width: '320px', backgroundColor: '#ffffff', borderRight: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', overflowY: 'auto', zIndex: 10 }}>
                    <h2 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#0f172a' }}>Tambah Fasilitas</h2>
                    <form onSubmit={handleTambah} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input type="text" placeholder="Nama Halte..." required onChange={e => setFormData({...formData, nama: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="text" placeholder="Kode" onChange={e => setFormData({...formData, kode: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            <input type="number" placeholder="Kapasitas" required onChange={e => setFormData({...formData, kapasitas: e.target.value})} style={{ width: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <select onChange={e => setFormData({...formData, jenis: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                            <option value="angkot">Mikrolet / Angkot</option>
                            <option value="bus">Bus Kota Rapid</option>
                            <option value="brt">BRT Trans Lampung</option>
                        </select>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="number" step="any" placeholder="Latitude (Y)" required onChange={e => setFormData({...formData, latitude: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                            <input type="number" step="any" placeholder="Longitude (X)" required onChange={e => setFormData({...formData, longitude: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                        <button type="submit" style={{ padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', marginTop: '8px' }}>Simpan Data</button>
                    </form>

                    <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Legenda Peta</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#334155' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', marginRight: '12px' }}></span> AI Detection (Kendaraan)</div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#334155' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', marginRight: '12px' }}></span> Halte BRT</div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#334155' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', marginRight: '12px' }}></span> Halte Bus Kota</div>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#334155' }}><span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', marginRight: '12px' }}></span> Pangkalan Angkot</div>
                        </div>
                    </div>
                </aside>

                <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <MapView />
                </main>
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;