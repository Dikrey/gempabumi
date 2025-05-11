
    function createGempaCard(item, pinned = false) {
      const infoText = `Tanggal: ${item.Tanggal}\nJam: ${item.Jam}\nMagnitudo: ${item.Magnitude}\nKedalaman: ${item.Kedalaman}\nLokasi: ${item.Wilayah}\nKoordinat: ${item.Coordinates}\nPotensi: ${item.Potensi}`;
      const card = document.createElement('div');
      card.className = 'gempa-card';
      card.innerHTML = `
        ${pinned ? '<div class="pin-label">> Gempa Terbaru (New)</div>' : ''}
        <div class="title">
          <img src="https://data.bmkg.go.id/include/assets/img/gempa.svg" alt="gempa icon"/>
          <strong>${item.Tanggal} - ${item.Jam}</strong>
        </div>
        <div class="gempa-info">
          <div><i class="fas fa-ruler-vertical info-icon"></i><strong>Magnitude:</strong> ${item.Magnitude}</div>
          <div><i class="fas fa-arrows-alt-v info-icon"></i><strong>Kedalaman:</strong> ${item.Kedalaman}</div>
          <div><i class="fas fa-map-marker-alt info-icon"></i><strong>Wilayah:</strong> ${item.Wilayah}</div>
          <div><i class="fas fa-globe info-icon"></i><strong>Koordinat:</strong> ${item.Coordinates} (${item.Lintang || ''}, ${item.Bujur || ''})</div>
          <div><i class="fas fa-bell info-icon"></i><strong>Potensi:</strong> ${item.Potensi}</div>
          ${item.Dirasakan ? `<div><i class='fas fa-users info-icon'></i><strong>Dirasakan:</strong> ${item.Dirasakan}</div>` : ''}
          <button class="copy-btn" data-text="${infoText}"><i class="fas fa-copy"></i> Salin</button>
        </div>
        <div class="blink-status"></div>
      `;
      return card;
    }

 
    fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
      .then(res => res.json())
      .then(data => {
        const latest = data.Infogempa.gempa;
        const pinnedContainer = document.getElementById('pinned-gempa');
        const card = createGempaCard(latest, true);
        pinnedContainer.appendChild(card);
      });

    
    fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('gempa-container');
        data.Infogempa.gempa.forEach(item => {
          const card = createGempaCard(item);
          container.appendChild(card);
        });

        //salin
        document.querySelectorAll('.copy-btn').forEach(button => {
          button.addEventListener('click', () => {
            const text = button.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
              button.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
              setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i> Salin';
              }, 2000);
            });
          });
        });
      });
