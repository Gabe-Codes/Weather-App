import React, { Component } from 'react';
import TextTransition, { presets } from 'react-text-transition';

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
	// '3600': 1.0,
	// '7200': 2.0,
	// '10800': 3.0,
	// '12600': 3.3,
	// '14400': 4.0,
	// '16200': 4.3,
	// '18000': 5.0,
	// '19800': 5.3,
	// '20700': 5.45,
	// '21600': 6.0,
	// '23400': 6.3,
	// '25200': 7.0,
	// '28800': 8.0,
	// '32400': 9.0,
	// '34200': 9.3,
	// '36000': 10.0,
	// '37800': 10.3,
	// '39600': 11.0,
	// '41400': 11.3,
	// '43200': 12.0,
	// '45900': 12.45,
	// '46800': 13.0,
	// '50400': 14.0,
};

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			query: '',
			weather: '',
			date: '',
			home: false,
			isImp: true,
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
			let lat = location.coords.latitude;
			let lon = location.coords.longitude;
			console.log(location);
			fetch(
				`${api.base}weather?lat=${lat}&lon=${lon}&units=imperial&APPID=${api.key}`
			)
				.then((res) => res.json())
				.then((result) => {
					let d = String(new Date());
					this.setState({
						query: '',
						weather: result,
						climate: result.weather[0].main.toLowerCase(),
						date: d,
						home: true,
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
		let time = parseInt(this.state.date.slice(16, 18));
		switch (climate) {
			case 'clear':
				if (time >= 7 && time <= 18) return 'weather-animation clear-day-ani';
				else return 'weather-animation clear-night-ani';
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

	switchUnits = () => {
		if (this.state.isImp === true)
			return Math.round(this.state.weather.main.temp) + '°F';
		else
			return Math.round((this.state.weather.main.temp - 32) * (5 / 9)) + '°C';
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
						<i className="material-icons" onClick={this.getUserLocation}>
							{this.state.home === false ? 'location_searching' : 'gps_fixed'}
						</i>
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
								<div
									className="temp"
									onClick={(e) =>
										this.state.isImp === true
											? this.setState({ isImp: false })
											: this.setState({ isImp: true })
									}
								>
									<TextTransition
										text={this.switchUnits()}
										springConfig={presets.slow}
										noOverflow={true}
										// direction={'down'}
									/>
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
