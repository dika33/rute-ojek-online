// index.js — Peta Rute Ojek Online Bandung
// Library: CrootJS map.js (https://croot.js.org)

import { createMap, addGeoJSON, fitMap, getGeoJSON } from "https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.16/map.js";

// 1. Buat peta di elemen ber-ID "peta"
//    center default Indonesia, zoom level 13 untuk kota
createMap("peta", {
    center: [107.6191, -6.9175],   // Bandung [lng, lat]
    zoom: 13
});

// 2. Ambil data GeoJSON dari file lokal
getGeoJSON("rute.geojson", (response) => {
    if (!response.data) {
        console.log("Gagal membaca GeoJSON, status:", response.status);
        document.getElementById("info-body").innerHTML =
            '<p class="info-placeholder info-error">⚠️ Gagal memuat data rute</p>';
        return;
    }

    // 3. Gambar GeoJSON di peta dengan style khusus
    addGeoJSON("peta", response.data, {
        style: {
            color: "#00AA13",      // warna garis hijau Gojek
            weight: 5,             // ketebalan garis
            opacity: 0.9
        },
        onEachFeature: (feature, element) => {
            // Popup saat klik rute di peta
            const props = feature.properties;
            if (props && props.nama_rute) {
                element.popupContent =
                    `<b>${props.nama_rute}</b><br>` +
                    `Jarak: ${props.jarak_km} km<br>` +
                    `Ongkos: Rp ${props.ongkos.toLocaleString("id-ID")}<br>` +
                    `Waktu: ${props.waktu_tempuh}`;
            }
        }
    });

    // 4. Paskan tampilan peta ke data
    fitMap("peta", response.data);

    // 5. Tampilkan info rute di panel samping
    tampilkanInfoRute(response.data);
});

// Fungsi untuk menampilkan info rute di panel samping
function tampilkanInfoRute(geojson) {
    const infoBody = document.getElementById("info-body");
    const features = geojson.features;

    if (!features || features.length === 0) {
        infoBody.innerHTML = '<p class="info-placeholder">Tidak ada data rute</p>';
        return;
    }

    let html = '';

    features.forEach((feature) => {
        const props = feature.properties;
        if (!props) return;

        html += `
            <div class="route-detail">
                <div class="route-name">${props.nama_rute || 'Rute Tanpa Nama'}</div>
                <div class="route-detail-row">
                    <span class="route-label">🟢 Titik Awal</span>
                    <span class="route-value">${props.titik_awal || '-'}</span>
                </div>
                <div class="route-detail-row">
                    <span class="route-label">🔴 Titik Akhir</span>
                    <span class="route-value">${props.titik_akhir || '-'}</span>
                </div>
                <div class="route-detail-row">
                    <span class="route-label">📏 Jarak</span>
                    <span class="route-value">${props.jarak_km || '-'} km</span>
                </div>
                <div class="route-detail-row">
                    <span class="route-label">💰 Ongkos</span>
                    <span class="route-value ongkos">Rp ${props.ongkos ? props.ongkos.toLocaleString('id-ID') : '-'}</span>
                </div>
                <div class="route-detail-row">
                    <span class="route-label">⏱️ Waktu Tempuh</span>
                    <span class="route-value">${props.waktu_tempuh || '-'}</span>
                </div>
            </div>
        `;
    });

    infoBody.innerHTML = html;
}
