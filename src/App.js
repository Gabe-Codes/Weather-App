import React from 'react';

const api = {
	key: '6ef9a57a6186cdb062cac9bdef08165c',
	base: 'https://api.openweathermap.org/data/2.5/',
};

function App() {
	return (
		<div className="app">
			<main>
				<div className="search-box">
					<input type="text" className="search-bar" placeholder="Search..." />
				</div>
			</main>
		</div>
	);
}

export default App;
