import React, { useState } from 'react';

const api = {
	key: '6ef9a57a6186cdb062cac9bdef08165c',
	base: 'https://api.openweathermap.org/data/2.5/',
};

function App() {
	const [query, setQuery] = useState('');
	const [weather, setWeather] = useState('');

	const search = (evt) => {
		if (evt.key === 'Enter') {
			fetch(`${api.base}weather?q=${query}&units=imperial&APPID=${api.key}`)
				.then((res) => res.json())
				.then((result) => {
					setQuery('');
					setWeather(result);
				});
		}
	};

	const background = (w) => {
		let wthr = w.weather[0].main.toLowerCase();
		let temp = w.main.temp;

		switch (wthr) {
			case 'clear':
				if (temp <= 45) return 'app cool-clear';
				else if (temp >= 90) return 'app hot-clear';
				else return 'app warm-clear';
			case 'clouds':
				return 'app clouds';
			case 'rain':
				return 'app rain';
			case 'thunderstorm':
				return 'app storm';
			case 'snow':
				return 'app snow';
			case 'mist':
				return 'app mist';
			default:
				return 'app';
		}
	};

	let date = String(new window.Date());
	date = date.slice(0, 15);

	return (
		<div
			className={
				typeof weather.main != 'undefined' ? background(weather) : 'app'
			}
		>
			<main>
				<div className="search-box">
					<input
						type="text"
						className="search-bar"
						placeholder="Search..."
						onChange={(e) => setQuery(e.target.value)}
						value={query}
						onKeyPress={search}
					/>
				</div>
				{typeof weather.main != 'undefined' ? (
					<div>
						<div className="location-box">
							<div className="location">
								{weather.name}, {weather.sys.country}
							</div>
							<div className="date">{date}</div>
						</div>
						<div className="weather-box">
							<div className="temp">{Math.round(weather.main.temp)}°F</div>
							<div className="weather">{weather.weather[0].main}</div>
						</div>
						<div className="attribution">
							<a href="https://www.vecteezy.com/free-vector/cloud">
								Cloud Vectors by Vecteezy
							</a>
						</div>
					</div>
				) : (
					<div className="welcome-box">
						<div className="welcome">Welcome to Gabes Weather Application</div>
						<div className="attribution">
							<p>Attributes by </p>
							<a href="https://www.vecteezy.com/free-vector/cloud">Vecteezy</a>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

export default App;
