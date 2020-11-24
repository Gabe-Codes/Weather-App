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
			fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
				.then((res) => res.json())
				.then((result) => {
					setQuery('');
					setWeather(result);
				});
		}
	};

	let date = String(new window.Date());
	date = date.slice(0, 15);

	return (
		<div className="app">
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
				<div className="location-box">
					<div className="location">Dallas, US</div>
					<div className="date">{date}</div>
				</div>
				<div className="weather-box">
					<div className="temp">15°c</div>
					<div className="weather">Sunny</div>
				</div>
			</main>
		</div>
	);
}

export default App;
