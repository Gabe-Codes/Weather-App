import React, { Component } from 'react';

const api = {
	key: '6ef9a57a6186cdb062cac9bdef08165c',
	base: 'https://api.openweathermap.org/data/2.5/',
};

const timezones = {
	'-43200': -12.0,
	'-39600': -11.0,
	'-36000': -10.0,
	'-34200': -9.3,
	'-32400': -9.0,
	'-28800': -8.0,
	'-25200': -7.0,
	'-21600': -6.0,
	'-18000': -5.0,
	'-16200': -4.3,
	'-14400': -4.0,
	'-12600': -3.3,
	'-10800': -3.0,
	'-7200': -2.0,
	'-3600': -1.0,
	// '0': '0',
	// '3600': 1.00,
	// '7200': 2.00,
	// '10800': 3.00,
	// '12600': 3.30,
	// '14400': 4.00,
	// '16200': 4.30,
	// '18000': 5.00,
	// '19800': 5.30,
	// '20700': 5.45,
	// '21600': 6.00,
	// '23400': 6.30,
	// '25200': 7.00,
	// '28800': 8.00,
	// '32400': 9.00,
	// '34200': 9.30,
	// '36000': 10.00,
	// '37800': 10.30,
	// '39600': 11.00,
	// '41400': 11.30,
	// '43200': 12.00,
	// '45900': 12.45,
	// '46800': 13.00,
	// '50400': 14.00,
};

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			query: '',
			weather: '',
			date: '',
			coords: {
				lat: 0,
				lon: 0,
			},
			home: false,
			units: 'imperial',
			climate: '',
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
			this.setState({
				coords: {
					lat: location.coords.latitude,
					lon: location.coords.longitude,
				},
				home: true,
			});

			fetch(
				`${api.base}weather?lat=${this.state.coords.lat}&lon=${this.state.coords.lon}&units=imperial&APPID=${api.key}`
			)
				.then((res) => res.json())
				.then((result) => {
					let d = String(new Date());
					this.setState({
						query: '',
						weather: result,
						climate: result.weather[0].main.toLowerCase(),
						date: d,
					});
				});
		});
	};

	search = (evt) => {
		if (evt.key === 'Enter') {
			this.setState({ home: false });
			fetch(
				`${api.base}weather?q=${this.state.query}&units=imperial&APPID=${api.key}`
			)
				.then((res) => res.json())
				.then((result) => {
					console.log(result);
					if (result.cod === 200) {
						let d = this.locationDateCalc(result);
						this.setState({
							query: '',
							weather: result,
							climate: result.weather[0].main.toLowerCase(),
							date: d,
						});
					} else {
						this.setState({
							query: '',
							weather: result,
						});
					}
				});
		}
	};

	background = (wthr, temp) => {
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

	weatherAnimation = (climate) => {
		switch (climate) {
			case 'clear':
				return 'weather-animation clear-ani';
			case 'clouds':
				return 'weather-animation clouds-ani';
			case 'rain':
				return 'weather-animation rain-ani';
			case 'thunderstorm':
				return 'weather-animation storm-ani';
			case 'snow':
				return 'weather-animation snow-ani';
			case 'mist':
				return 'weather-animation mist-ani';
			default:
				return '';
		}
	};

	locationDateCalc = (loc) => {
		let d = new Date();

		let utc = d.getTime() + d.getTimezoneOffset() * 60000;

		let locDate = new Date(utc + 3600000 * timezones[loc.timezone]);

		return String(locDate);
	};

	render() {
		return (
			<div
				className={
					typeof this.state.weather.main != 'undefined'
						? this.background(this.state.climate, this.state.weather.main.temp)
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
						<i class="material-icons" onClick={this.getUserLocation}>
							{this.state.home === false ? 'location_searching' : 'gps_fixed'}
						</i>
					</div>
					<div className="unit-switch-box">
						<div className="unit-switch">
							<input
								type="radio"
								name="unit_switcher"
								id="imperial"
								className="switch-input switch-input-2"
								value="imperial"
								onClick={(e) => this.setState({ units: 'imperial' })}
							></input>
							<label for="imperial" class="left">
								°F
							</label>
							<input
								type="radio"
								name="unit_switcher"
								id="metric"
								className="switch-input"
								value="metric"
								onClick={(e) => this.setState({ units: 'metric' })}
							/>
							<label for="metric" class="right">
								°C
							</label>
							<span className="switch-selection"></span>
						</div>
					</div>
					{typeof this.state.weather.main != 'undefined' ? (
						<div>
							<div className="location-box">
								<div className="location">
									{this.state.weather.name}, {this.state.weather.sys.country}
								</div>
								<div className="date">{this.state.date.slice(0, 15)}</div>
							</div>
							<div className="weather-box">
								<div className="temp">
									{this.state.units === 'imperial'
										? Math.round(this.state.weather.main.temp)
										: Math.round((this.state.weather.main.temp - 32) * (5 / 9))}
									{this.state.units === 'imperial' ? '°F' : '°C'}
								</div>
								<div className="weather">{this.state.climate}</div>
								<div
									className={this.weatherAnimation(this.state.climate)}
								></div>
							</div>
							<div className="attribution">
								<p>Attributes by </p>
								<a href="https://www.vecteezy.com/free-vector/cloud">
									Vecteezy
								</a>
								<p> and </p>
								<a href="https://www.amcharts.com/free-animated-svg-weather-icons/">
									amCharts
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
								<p> and </p>
								<a href="https://www.amcharts.com/free-animated-svg-weather-icons/">
									amCharts
								</a>
							</div>
						</div>
					)}
				</main>
			</div>
		);
	}
}
