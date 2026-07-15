const ICONS = {
  clear: '☀️',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
  fog: '🌫️',
};

function codeToCondition(code) {
  if (code === 0) return 'clear';
  if ([1, 2, 3].includes(code)) return 'cloudy';
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'cloudy';
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=celsius`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('weather request failed');
  return res.json();
}

export async function initWeather() {
  const el = document.querySelector('[data-widget="weather"]');
  if (!el) return;
  const tempEl = el.querySelector('.weather-temp');
  const condEl = el.querySelector('.weather-cond');
  const iconEl = el.querySelector('.weather-icon');
  const placeEl = el.querySelector('.weather-place');

  function render(temp, condition, place) {
    tempEl.textContent = `${Math.round(temp)}°`;
    condEl.textContent = condition;
    iconEl.textContent = ICONS[condition.toLowerCase()] ?? ICONS.cloudy;
    if (place) placeEl.textContent = place;
  }

  function fallback() {
    render(24, 'clear', 'Phnom Penh');
  }

  try {
    const useLoc = await new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 3000 }
      );
    });
    const { lat, lon } = useLoc ?? { lat: 11.5564, lon: 104.9282 }; // Phnom Penh fallback coords
    const data = await fetchWeather(lat, lon);
    const cond = codeToCondition(data.current.weather_code);
    render(data.current.temperature_2m, cond, useLoc ? 'Your location' : 'Phnom Penh');
  } catch {
    fallback();
  }
}
