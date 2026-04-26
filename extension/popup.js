const PLACEIQ_URL = 'https://place-iq.vercel.app';
const BACKEND_URL = 'https://placeiq-ogr7.onrender.com';

const openBtn    = document.getElementById('openBtn');
const statusDot  = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');

// open PlaceIQ in a new tab
openBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: PLACEIQ_URL });
  window.close();
});

// check if Flask backend is running
async function checkBackend() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });

    if (res.ok) {
      statusDot.classList.add('online');
      statusText.textContent = 'Backend running — ready to analyze';
    } else {
      throw new Error('not ok');
    }
  } catch {
    statusDot.classList.add('offline');
    statusText.textContent = 'Backend offline — run: python app.py';
  }
}

checkBackend();