const PLACEIQ_URL = 'https://place-iq.vercel.app';
const BACKEND_URL = 'https://placeiq-ogr7.onrender.com';

document.getElementById('openBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: PLACEIQ_URL });
  window.close();
});

async function checkBackend() {
  const dot  = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  try {
    const res = await fetch(`${BACKEND_URL}/health`, {
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) {
      dot.classList.add('online');
      text.textContent = 'Backend running — ready!';
    } else {
      throw new Error();
    }
  } catch {
    dot.classList.add('offline');
    text.textContent = 'Backend offline or starting up...';
  }
}

checkBackend();