# WebGIS & AI Spatial Detection - Tugas 10 SIG 🌍🤖

Repositori ini berisi implementasi pipeline deteksi objek spasial menggunakan kecerdasan buatan (YOLOv8) pada citra satelit/udara, yang diintegrasikan ke dalam sistem WebGIS interaktif berbasis React dan Leaflet dengan antarmuka Modern Minimalist.

## 👨‍💻 Identitas Pengembang
* **Nama:** Muhammad Piela Nugraha
* **NIM:** 123140200
* **Mata Kuliah:** Sistem Informasi Geografis (Praktikum Tugas 10)
* **Instansi:** Institut Teknologi Sumatera (ITERA)
* **Repositori:** [SIG_10_123140200](https://github.com/EL-graha26/SIG_10_123140200)

## 📝 Deskripsi Proyek
Proyek ini mengintegrasikan Deep Learning ke dalam ekosistem GIS untuk mendeteksi kendaraan secara otomatis pada citra satelit Google Maps di wilayah Bandar Lampung. Karena keterbatasan metadata spasial pada citra tangkapan layar (.png), proyek ini menerapkan teknik **Dictionary Mapping** dan **Macro-Tiling** untuk memastikan akurasi lokasi di permukaan bumi (WGS84).

## ✨ Fitur Utama
1. **AI Batch Processing**: Pemindaian otomatis 14 citra udara sekaligus menggunakan YOLOv8.
2. **Manual Georeferencing**: Konversi koordinat piksel ke derajat geografis menggunakan modul `rasterio` dan kamus Bounding Box.
3. **Modern Minimalist UI**: Desain dashboard solid (Sidebar & Header) yang mengutamakan luas pandang peta.
4. **Dynamic Layers Control**: Pilihan basemap yang fleksibel (Satelit Esri, OpenStreetMap, dan CartoDB Dark Mode).
5. **Interactive Popups**: Informasi detail objek deteksi (jenis, confidence, dan sumber file).

## 🚀 Alur Kerja (Workflow)
1. **Preprocessing (Macro-Tiling)**: Membagi area studi Bandar Lampung menjadi 14 unit tangkapan layar strategis.
2. **Detection (Inference)**: Menjalankan model `yolov8n.pt` dengan threshold 0.15.
3. **Spatial Mapping**: Mentransformasikan titik (x, y) piksel menjadi (lon, lat) melalui kamus koordinat.
4. **Visualization**: Merender file GeoJSON hasil deteksi ke atas peta Leaflet.

## 📸 Dokumentasi Screenshot
Berikut adalah panduan peletakan screenshot untuk melengkapi dokumentasi:

### 1. Proses Batch Processing AI
<img width="939" height="272" alt="Screenshot 2026-05-06 235556" src="https://github.com/user-attachments/assets/c8cf40a4-872e-4a37-b6c9-7aed4cfcc374" />
*Gambar 1: Eksekusi skrip Python yang memproses 14 gambar dan menghasilkan file GeoJSON.*

### 2. Dashboard WebGIS (Mode Satelit)
<img width="1919" height="978" alt="Screenshot 2026-05-06 235728" src="https://github.com/user-attachments/assets/5c61cdde-b278-46af-b79d-b23caf5f422e" />
*Gambar 2: Visualisasi sebaran titik kendaraan di atas basemap satelit HD.*

### 3. Detail Deteksi & Interaction
<img width="551" height="450" alt="Screenshot 2026-05-06 235827" src="https://github.com/user-attachments/assets/95e0e67b-a383-4031-bd34-362edea98172" />
*Gambar 3: Fitur popup yang menampilkan data metadata hasil prediksi AI.*

### 4. Inovasi Layers Control (Dark Mode)
<img width="1459" height="808" alt="Screenshot 2026-05-06 235928" src="https://github.com/user-attachments/assets/e11c834b-b567-40e9-9a39-f8add5f582c0" />
*Gambar 4: Tampilan mode gelap yang memberikan kontras tinggi pada titik deteksi.*

## 🛠️ Teknologi
- **Bahasa**: Python 3.10+, JavaScript (React)
- **Library AI**: `ultralytics` (YOLOv8), `opencv-python`
- **Library GIS**: `rasterio`, `leaflet`, `react-leaflet`
- **Bundler**: Vite

## ⚙️ Cara Menjalankan
1. **Backend/AI**: Masuk ke folder `tugas10_ai` dan jalankan `python 3_batch_ai.py`.
2. **Frontend**: Masuk ke folder `frontend-webgis`, lakukan `npm install` lalu `npm run dev`
