import React, { Component } from 'react';
import TextTransition, { presets } from 'react-text-transition';
import { timezones } from './timezones';

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
			date: '',
			home: false,
			isImp: true,
			climate: '',
			favoriteLoc: localStorage.getItem('favLoc'),
			favorited: false,
		};
	}

	componentDidMount() {
		try {
			if (this.state.favoriteLoc === null) {
				this.getUserLocation();
			} else {
				this.goFavorite();
			}
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

	favoriteLocation = (evt) => {
		if (
			this.state.favoriteLoc !==
			this.state.weather.name + ', ' + this.state.weather.sys.country
		) {
			localStorage.setItem(
				'favLoc',
				this.state.weather.name + ', ' + this.state.weather.sys.country
			);
			this.setState({
				favoriteLoc:
					this.state.weather.name + ', ' + this.state.weather.sys.country,
			});
		} else {
			localStorage.removeItem('favLoc');
			this.setState({
				favoriteLoc: null,
			});
		}
	};

	goFavorite = () => {
		fetch(
			`${api.base}weather?q=${this.state.favoriteLoc}&units=imperial&APPID=${api.key}`
		)
			.then((res) => res.json())
			.then((result) => {
				let d = this.locationDateCalc(result);
				this.setState({
					query: '',
					weather: result,
					climate: result.weather[0].main.toLowerCase(),
					date: d,
				});
			});
	};

	checkIfFav = () => {
		if (
			this.state.favoriteLoc ===
			this.state.weather.name + ', ' + this.state.weather.sys.country
		) {
			return 'star';
		} else {
			return 'star_border';
		}
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

	getTextWidth = (text, font) => {
		let canvas =
			this.getTextWidth.canvas ||
			(this.getTextWidth.canvas = document.createElement('canvas'));

		let context = canvas.getContext('2d');

		context.font = font;

		let metrics = context.measureText(text);

		return metrics.width;
	};

	sizeCheck = () => {
		let impTemp = String(Math.round(this.state.weather.main.temp)) + '°F';

		let metTemp =
			String(Math.round((this.state.weather.main.temp - 32) * (5 / 9))) + '°C';

		return this.state.isImp === true
			? this.getTextWidth(impTemp, '900 102pt montseratt')
			: this.getTextWidth(metTemp, '900 102pt montseratt');
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
						<i
							className="material-icons current-loc"
							onClick={this.getUserLocation}
						>
							{this.state.home === false ? 'location_searching' : 'gps_fixed'}
						</i>
					</div>
					{typeof this.state.weather.main != 'undefined' ? (
						<div>
							<div className="location-box">
								<div className="location">
									{this.state.weather.name},{' '}
									{this.state.weather.sys.country + ' '}
									<i
										className="material-icons favorited-loc"
										onClick={this.favoriteLocation}
									>
										{this.checkIfFav()}
										{/* {this.state.favorited === false ? 'star_border' : 'star'} */}
									</i>
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
									style={{ width: this.sizeCheck() + 'px' }}
								>
									<TextTransition
										text={this.switchUnits()}
										springConfig={presets.slow}
										noOverflow={true}
										direction={this.state.isImp === true ? 'down' : 'up'}
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
