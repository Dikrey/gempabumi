 // CODE: Raihan_official0307 X Visualcodepo
 // Jangan hapus credit ini ya kak :D
 // Hargai karya creator dengan tidak mengklaim sebagai milik Anda
 // Pelanggaran akan ditandai
 // Jangan merubah nama author (Raihan_official0307 X Visualcodepo) pada script ini
 // Karya ini dibuat sepenuhnya oleh kami

let map;
    let modalMap;
    let allEarthquakes = [];
    let filteredEarthquakes = [];
    let markers = [];
    let isDarkMode = false;

    function initMap() {
      map = L.map('map').setView([-2.5, 118], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }


    function initModalMap() {
      modalMap = L.map('modal-map').setView([-2.5, 118], 8);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(modalMap);
    }

    function formatCoordinates(coordinates) {
      if (!coordinates) return '';
      const parts = coordinates.split(',');
      if (parts.length !== 2) return coordinates;
      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      return `${lat.toFixed(2)}°${lat >= 0 ? 'LU' : 'LS'}, ${lon.toFixed(2)}°${lon >= 0 ? 'BT' : 'BB'}`;
    }

    function parseCoordinates(coordinates) {
      if (!coordinates) return null;
      const parts = coordinates.split(',');
      if (parts.length !== 2) return null;
      return {
        lat: parseFloat(parts[0]),
        lng: parseFloat(parts[1])
      };
    }

    function createGempaCard(item, pinned = false) {
      const infoText = `Tanggal: ${item.Tanggal}\nJam: ${item.Jam}\nMagnitudo: ${item.Magnitude}\nKedalaman: ${item.Kedalaman}\nLokasi: ${item.Wilayah}\nKoordinat: ${item.Coordinates}\nPotensi: ${item.Potensi}`;
      const card = document.createElement('div');
      card.className = `gempa-card ${pinned ? 'pinned' : ''}`;
      card.dataset.magnitude = item.Magnitude;
      card.dataset.depth = item.Kedalaman;
      card.dataset.location = item.Wilayah;
      
      const magnitude = parseFloat(item.Magnitude);
      let magnitudeClass = 'low';
      if (magnitude >= 6) magnitudeClass = 'high';
      else if (magnitude >= 5) magnitudeClass = 'medium';
      
      card.innerHTML = `
        <div class="gempa-header ${pinned ? 'pinned' : ''}">
          <div class="gempa-date">
            <i class="fas fa-calendar-alt"></i>
            <span>${item.Tanggal} - ${item.Jam}</span>
          </div>
          <div class="gempa-magnitude">${item.Magnitude} SR</div>
          <div class="gempa-location">${item.Wilayah}</div>
          ${pinned ? '<div class="gempa-badge">Terbaru</div>' : ''}
        </div>
        <div class="gempa-body">
          <div class="gempa-info">
            <div class="info-row">
              <div class="info-icon">
                <i class="fas fa-arrows-alt-v"></i>
              </div>
              <div class="info-text">
                <div class="info-label">Kedalaman</div>
                <div class="info-value">${item.Kedalaman}</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fas fa-globe"></i>
              </div>
              <div class="info-text">
                <div class="info-label">Koordinat</div>
                <div class="info-value">${formatCoordinates(item.Coordinates)}</div>
              </div>
            </div>
            <div class="info-row">
              <div class="info-icon">
                <i class="fas fa-bell"></i>
              </div>
              <div class="info-text">
                <div class="info-label">Potensi</div>
                <div class="info-value">${item.Potensi}</div>
              </div>
            </div>
            ${item.Dirasakan ? `
            <div class="info-row">
              <div class="info-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="info-text">
                <div class="info-label">Dirasakan</div>
                <div class="info-value">${item.Dirasakan}</div>
              </div>
            </div>
            ` : ''}
          </div>
          <div class="gempa-actions">
            <button class="action-btn copy-btn" data-text="${infoText}">
              <i class="fas fa-copy"></i>
              <span>Salin</span>
            </button>
            <button class="action-btn map-btn" data-coordinates="${item.Coordinates}" data-location="${item.Wilayah}" data-magnitude="${item.Magnitude}" data-depth="${item.Kedalaman}" data-potensi="${item.Potensi}">
              <i class="fas fa-map-marked-alt"></i>
              <span>Lihat Peta</span>
            </button>
          </div>
        </div>
      `;
  // CODE: Raihan_official0307 X Visualcodepo
 // Jangan hapus credit ini ya kak :D
 // Hargai karya creator dengan tidak mengklaim sebagai milik Anda
 // Pelanggaran akan ditandai
 // Jangan merubah nama author (Raihan_official0307 X Visualcodepo) pada script ini
 // Karya ini dibuat sepenuhnya oleh kami
      return card;
    }

    function updateStats() {
      if (allEarthquakes.length === 0) return;
      

      const latest = allEarthquakes[0];
      document.getElementById('latest-magnitude').textContent = `${latest.Magnitude} SR`;
      
    
      const strongest = allEarthquakes.reduce((max, item) => 
        parseFloat(item.Magnitude) > parseFloat(max.Magnitude) ? item : max
      );
      document.getElementById('strongest-magnitude').textContent = `${strongest.Magnitude} SR`;
      
     
      const deepest = allEarthquakes.reduce((max, item) => {
        const depth = parseInt(item.Kedalaman);
        const maxDepth = parseInt(max.Kedalaman);
        return depth > maxDepth ? item : max;
      });
      document.getElementById('deepest-depth').textContent = deepest.Kedalaman;

      document.getElementById('total-count').textContent = allEarthquakes.length;
    }

    function updateMap() {
     
      markers.forEach(marker => map.removeLayer(marker));
      markers = [];

// CODE: Raihan_official0307 X Visualcodepo
 // Jangan hapus credit ini ya kak :D
 // Hargai karya creator dengan tidak mengklaim sebagai milik Anda
 // Pelanggaran akan ditandai
 // Jangan merubah nama author (Raihan_official0307 X Visualcodepo) pada script ini
 // Karya ini dibuat sepenuhnya oleh kami
    
      allEarthquakes.forEach(item => {
        const coords = parseCoordinates(item.Coordinates);
        if (!coords) return;
        
        const magnitude = parseFloat(item.Magnitude);
        let color = '#10b981';
        if (magnitude >= 6) color = '#ef4444'; 
        else if (magnitude >= 5) color = '#f59e0b'; 
        const marker = L.circleMarker([coords.lat, coords.lng], {
          radius: Math.max(5, magnitude * 2),
          fillColor: color,
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);
        
        marker.bindPopup(`
          <div style="text-align: center;">
            <strong>${item.Wilayah}</strong><br>
            Magnitudo: ${item.Magnitude}<br>
            Kedalaman: ${item.Kedalaman}<br>
            Tanggal: ${item.Tanggal}<br>
            Jam: ${item.Jam}
          </div>
        `);
        
        markers.push(marker);
      });
    }

    
    function showNotificationForSignificantEarthquakes() {
      const significant = allEarthquakes.filter(item => parseFloat(item.Magnitude) >= 5.5);
      if (significant.length > 0) {
        const latest = significant[0];
        showNotification(`Gempa bumi magnitudo ${latest.Magnitude} SR terdeteksi di ${latest.Wilayah}`);
      }
    }


    function showNotification(message) {
      const notification = document.getElementById('notification');
      const notificationText = document.getElementById('notification-text');
      notificationText.textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 5000);
    }

    function fetchEarthquakeData() {
      const refreshBtn = document.getElementById('refresh-btn');
      refreshBtn.classList.add('spinning');
    
      fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
        .then(res => res.json())
        .then(data => {
          const latest = data.Infogempa.gempa;
          
       
          return fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json')
            .then(res => res.json())
            .then(data => {
         
              allEarthquakes = [latest, ...data.Infogempa.gempa];
              filteredEarthquakes = [...allEarthquakes];
              
           
              updateStats();
              updateMap();
              renderEarthquakes();
              showNotificationForSignificantEarthquakes();
              
              refreshBtn.classList.remove('spinning');
            });
        })
        .catch(error => {
          console.error('Error fetching earthquake data:', error);
          showNotification('Gagal memuat data gempa. Silakan coba lagi.');
          refreshBtn.classList.remove('spinning');
        });
    }


    function renderEarthquakes() {
      const container = document.getElementById('gempa-container');
      container.innerHTML = '';
      
      if (filteredEarthquakes.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem;">Tidak ada gempa yang sesuai dengan filter.</div>';
        return;
      }
      
      filteredEarthquakes.forEach((item, index) => {
        const card = createGempaCard(item, index === 0);
        card.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(card);
      });

  // CODE: Raihan_official0307 X Visualcodepo
 // Jangan hapus credit ini ya kak :D
 // Hargai karya creator dengan tidak mengklaim sebagai milik Anda
 // Pelanggaran akan ditandai
 // Jangan merubah nama author (Raihan_official0307 X Visualcodepo) pada script ini
 // Karya ini dibuat sepenuhnya oleh kami
  
      document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
          const text = button.getAttribute('data-text');
          navigator.clipboard.writeText(text).then(() => {
            button.innerHTML = '<i class="fas fa-check"></i> <span>Tersalin!</span>';
            setTimeout(() => {
              button.innerHTML = '<i class="fas fa-copy"></i> <span>Salin</span>';
            }, 2000);
          });
        });
      });
      

      document.querySelectorAll('.map-btn').forEach(button => {
        button.addEventListener('click', () => {
          const coordinates = button.getAttribute('data-coordinates');
          const location = button.getAttribute('data-location');
          const magnitude = button.getAttribute('data-magnitude');
          const depth = button.getAttribute('data-depth');
          const potensi = button.getAttribute('data-potensi');
          
          showMapModal(coordinates, location, magnitude, depth, potensi);
        });
      });
    }

 // CODE: Raihan_official0307 X Visualcodepo
 // Jangan hapus credit ini ya kak :D
 // Hargai karya creator dengan tidak mengklaim sebagai milik Anda
 // Pelanggaran akan ditandai
 // Jangan merubah nama author (Raihan_official0307 X Visualcodepo) pada script ini
 // Karya ini dibuat sepenuhnya oleh kami

    function showMapModal(coordinates, location, magnitude, depth, potensi) {
      const modal = document.getElementById('map-modal');
      const modalDetails = document.getElementById('modal-details');
      
 
      if (modalMap) {
        modalMap.eachLayer(layer => {
          if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
            modalMap.removeLayer(layer);
          }
        });
      } else {
        initModalMap();
      }
  
      const coords = parseCoordinates(coordinates);
      if (coords) {
        modalMap.setView([coords.lat, coords.lng], 8);
        
        const magnitudeValue = parseFloat(magnitude);
        let color = '#10b981'; 
        if (magnitudeValue >= 6) color = '#ef4444'; 
        else if (magnitudeValue >= 5) color = '#f59e0b'; 
        
        L.circleMarker([coords.lat, coords.lng], {
          radius: Math.max(10, magnitudeValue * 3),
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(modalMap);
      }

// CODE: Raihan_official0307 X Visualcodepo
 // Jangan hapus credit ini ya kak :D
 // Hargai karya creator dengan tidak mengklaim sebagai milik Anda
 // Pelanggaran akan ditandai
 // Jangan merubah nama author (Raihan_official0307 X Visualcodepo) pada script ini
 // Karya ini dibuat sepenuhnya oleh kami
      
      modalDetails.innerHTML = `
        <h3>${location}</h3>
        <div class="gempa-info" style="margin-top: 1rem;">
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-ruler"></i>
            </div>
            <div class="info-text">
              <div class="info-label">Magnitudo</div>
              <div class="info-value">${magnitude} SR</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-arrows-alt-v"></i>
            </div>
            <div class="info-text">
              <div class="info-label">Kedalaman</div>
              <div class="info-value">${depth}</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-globe"></i>
            </div>
            <div class="info-text">
              <div class="info-label">Koordinat</div>
              <div class="info-value">${formatCoordinates(coordinates)}</div>
            </div>
          </div>
          <div class="info-row">
            <div class="info-icon">
              <i class="fas fa-bell"></i>
            </div>
            <div class="info-text">
              <div class="info-label">Potensi</div>
              <div class="info-value">${potensi}</div>
            </div>
          </div>
        </div>
      `;
      
      modal.style.display = 'flex';
    }


    function applyFilters() {
      const magnitudeFilter = parseFloat(document.getElementById('magnitude-filter').value) || 0;
      const depthFilter = parseInt(document.getElementById('depth-filter').value) || 1000;
      const locationFilter = document.getElementById('location-filter').value.toLowerCase();
      const sortFilter = document.getElementById('sort-filter').value;
      
      
      filteredEarthquakes = allEarthquakes.filter(item => {
        const magnitude = parseFloat(item.Magnitude);
        const depth = parseInt(item.Kedalaman);
        const location = item.Wilayah.toLowerCase();
        
        return magnitude >= magnitudeFilter && 
               depth <= depthFilter && 
               (locationFilter === '' || location.includes(locationFilter));
      });
      
      switch (sortFilter) {
        case 'terkuat':
          filteredEarthquakes.sort((a, b) => parseFloat(b.Magnitude) - parseFloat(a.Magnitude));
          break;
        case 'terdalam':
          filteredEarthquakes.sort((a, b) => parseInt(b.Kedalaman) - parseInt(a.Kedalaman));
          break;
        case 'terbaru':
        default:

          break;
      }
      
      renderEarthquakes();
      showNotification(`Menampilkan ${filteredEarthquakes.length} gempa yang sesuai filter.`);
    }

 // CODE: Raihan_official0307 X Visualcodepo
 // Jangan hapus credit ini ya kak :D
 // Hargai karya creator dengan tidak mengklaim sebagai milik Anda
 // Pelanggaran akan ditandai
 // Jangan merubah nama author (Raihan_official0307 X Visualcodepo) pada script ini
 // Karya ini dibuat sepenuhnya oleh kami
 
    function toggleDarkMode() {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle('dark-mode');
      
      const themeToggle = document.getElementById('theme-toggle');
      themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      
   
      if (map) {
        map.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
          }
        });
        
        L.tileLayer(isDarkMode 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
      }
      
  
      if (modalMap) {
        modalMap.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            modalMap.removeLayer(layer);
          }
        });
        
        L.tileLayer(isDarkMode 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(modalMap);
      }
    }

    function initEventListeners() {
  
      document.getElementById('theme-toggle').addEventListener('click', toggleDarkMode);
  
      document.getElementById('refresh-btn').addEventListener('click', fetchEarthquakeData);
 
      document.getElementById('apply-filter').addEventListener('click', applyFilters);
      
      document.getElementById('modal-close').addEventListener('click', () => {
        document.getElementById('map-modal').style.display = 'none';
      });


  // CODE: Raihan_official0307 X Visualcodepo
 // Jangan hapus credit ini ya kak :D
 // Hargai karya creator dengan tidak mengklaim sebagai milik Anda
 // Pelanggaran akan ditandai
 // Jangan merubah nama author (Raihan_official0307 X Visualcodepo) pada script ini
 // Karya ini dibuat sepenuhnya oleh kami
      
      
      document.getElementById('map-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('map-modal')) {
          document.getElementById('map-modal').style.display = 'none';
        }
      });
    
      document.getElementById('about-link').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Halaman Tentang akan segera tersedia.');
      });
      
      document.getElementById('contact-link').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Halaman Kontak akan segera tersedia.');
      });
      
      document.getElementById('privacy-link').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Halaman Kebijakan Privasi akan segera tersedia.');
      });
    }

    function init() {
      initMap();
      initEventListeners();
      fetchEarthquakeData();
      
      setInterval(fetchEarthquakeData, 5 * 60 * 1000);
    }

    document.addEventListener('DOMContentLoaded', init);
