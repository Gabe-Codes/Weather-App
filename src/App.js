import React, { Component } from 'react';

const api = {
	key: '6ef9a57a6186cdb062cac9bdef08165c',
	base: 'https://api.openweathermap.org/data/2.5/',
};

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			query: '',
			weather: '',
			date: String(new window.Date()).slice(0, 15),
		};
	}

	componentDidMount() {
		try {
			this.getUserLocation();
		} catch (err) {
			console.log(err);
		}
	}

	getUserLocation = (evt) => {
		navigator.geolocation.getCurrentPosition((location) => {
			let lat = location.coords.latitude;
			let lon = location.coords.longitude;

			fetch(
				`${api.base}weather?lat=${lat}&lon=${lon}&units=imperial&APPID=${api.key}`
			)
				.then((res) => res.json())
				.then((result) => {
					this.setState({ query: '', weather: result });
				});
		});
	};

	search = (evt) => {
		if (evt.key === 'Enter') {
			fetch(
				`${api.base}weather?q=${this.state.query}&units=imperial&APPID=${api.key}`
			)
				.then((res) => res.json())
				.then((result) => {
					this.setState({ query: '', weather: result });
				});
		}
	};

	background = (w) => {
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

	render() {
		return (
			<div
				className={
					typeof this.state.weather.main != 'undefined'
						? this.background(this.state.weather)
						: 'app'
				}
			>
				<main>
					<div className="search-box">
						<input
							type="text"
							className="search-bar"
							placeholder="Search..."
							onChange={(e) => this.setState({ query: e.target.value })}
							value={this.state.query}
							onKeyPress={this.search}
						/>
					</div>
					<div className="user-location-box">
						<button onClick={this.getUserLocation}>My Location</button>
					</div>
					{typeof this.state.weather.main != 'undefined' ? (
						<div>
							<div className="location-box">
								<div className="location">
									{this.state.weather.name}, {this.state.weather.sys.country}
								</div>
								<div className="date">{this.state.date}</div>
							</div>
							<div className="weather-box">
								<div className="temp">
									{Math.round(this.state.weather.main.temp)}°F
								</div>
								<div className="weather">
									{this.state.weather.weather[0].main}
								</div>
							</div>
							<div className="attribution">
								<a href="https://www.vecteezy.com/free-vector/cloud">
									Cloud Vectors by Vecteezy
								</a>
							</div>
						</div>
					) : (
						<div className="welcome-box">
							<div className="welcome">
								Search a location to get the weather!
							</div>
							<div className="attribution">
								<p>Attributes by </p>
								<a href="https://www.vecteezy.com/free-vector/cloud">
									Vecteezy
								</a>
							</div>
						</div>
					)}
				</main>
			</div>
		);
	}
}
