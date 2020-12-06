import React, { Component } from 'react';
import TextTransition, { presets } from 'react-text-transition';
import { timezones } from './timezones';

// makes the openweather api easier to call
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
			isImp: JSON.parse(localStorage.getItem('isImp')), // converts the cookie string to a boolean
			climate: '',
			favoriteLoc: localStorage.getItem('favLoc'), // sets the saved cookie favorite location
			favorited: false,
			showInfo: true,
		};
	}

	// on launch goes to a users favorited or current location
	componentDidMount() {
		try {
			this.state.favoriteLoc === null
				? this.getUserLocation()
				: this.goFavorite();
		} catch (err) {
			console.log(err);
		}
	}

	// on update adjusts temp and favorite info location to be responsive
	componentDidUpdate() {
		if (typeof this.state.weather.main != 'undefined') {
			document.getElementById('info-met').style.left = `calc(50% - ${
				this.tempSize() * 0.75
			}px)`;

			document.getElementById('info-fav').style.right = `calc(50% - ${
				this.getTextWidth(
					this.state.weather.name +
						'' +
						this.state.weather.sys.country +
						'     ',
					'500 32pt montseratt'
				) * 0.7
			}px)`;
		}
	}

	// changes the informative text and borders to show when the info icon is pressed
	showInfo = (e) => {
		this.state.showInfo === false
			? this.setState({ showInfo: true })
			: this.setState({ showInfo: false });

		let infoFav = document.getElementById('info-fav');
		let infoLoc = document.getElementById('info-loc');
		let infoMet = document.getElementById('info-met');
		let locIcon = document.getElementById('curr-loc');
		let favIcon = document.getElementById('fav-loc');
		let tempIcon = document.getElementById('temp');

		if (this.state.showInfo === true) {
			infoFav.style.display = 'block';
			infoLoc.style.display = 'block';
			infoMet.style.display = 'block';

			locIcon.style.border = 'solid lightcoral 2px';
			locIcon.style.padding = '0px';

			favIcon.style.border = 'solid yellow 2px';
			favIcon.style.padding = '0px';

			tempIcon.style.border = 'solid lightgreen 2px';
			tempIcon.style.padding = '13px 23px';
		} else {
			infoFav.style.display = 'none';
			infoLoc.style.display = 'none';
			infoMet.style.display = 'none';

			locIcon.style.border = 'none';
			locIcon.style.padding = '2px';

			favIcon.style.border = 'none';
			favIcon.style.padding = '2px';

			tempIcon.style.border = 'none';
			tempIcon.style.padding = '15px 25px';
		}
	};

	// gets users coordinates then fetchs the location
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

	// saves or removes users favorite as a local cookie
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

	// fetchs the users favorite location
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

	// checks if the location on screen is favorited or not
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

	// takes the users search input and fetchs with api
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

	// changes background image depending on weather and tempature
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

	// changes animated weather svg based on the currently displayed weather
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

	// finds the searched locations date based off current user date and timezone
	locationDateCalc = (loc) => {
		let d = new Date();

		let utc = d.getTime() + d.getTimezoneOffset() * 60000;

		let locDate = new Date(utc + 3600000 * timezones[loc.timezone]);

		return String(locDate);
	};

	// saves the users last/perfered tempature metric
	setUnit = (evt) => {
		if (this.state.isImp === true) {
			localStorage.setItem('isImp', false);

			this.setState({ isImp: false });
		} else {
			localStorage.setItem('isImp', true);

			this.setState({ isImp: true });
		}
	};

	// calculates and switches between fahrenheit and celsius
	switchUnits = () => {
		if (this.state.isImp === true)
			return Math.round(this.state.weather.main.temp) + '°F';
		else
			return Math.round((this.state.weather.main.temp - 32) * (5 / 9)) + '°C';
	};

	// calculates the tempature text width
	getTextWidth = (text, font) => {
		let canvas =
			this.getTextWidth.canvas ||
			(this.getTextWidth.canvas = document.createElement('canvas'));

		let context = canvas.getContext('2d');

		context.font = font;

		let metrics = context.measureText(text);

		return metrics.width;
	};

	// calls to check the temp text width based on the current metric
	tempSize = () => {
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
					<div id="search" className="search-box">
						<input
							type="text"
							className="search-bar"
							placeholder={
								this.state.showInfo === true
									? 'Search...'
									: 'e.g. dallas or dallas, US'
							}
							onChange={(e) => this.setState({ query: e.target.value })}
							value={this.state.query}
							onKeyPress={this.search}
						/>
						<i
							id="curr-loc"
							className="material-icons current-loc"
							onClick={this.getUserLocation}
						>
							{this.state.home === false ? 'location_searching' : 'gps_fixed'}
						</i>
					</div>
					{typeof this.state.weather.main != 'undefined' ? (
						<div>
							<div>
								<i
									className="material-icons info-toggle"
									onClick={this.showInfo}
								>
									info
								</i>
								<span id="info-fav" className="info info-fav">
									set as
									<br />
									favorite
								</span>
								<span id="info-loc" className="info info-loc">
									current
									<br />
									location
								</span>
								<span id="info-met" className="info info-met">
									tap to
									<br />
									switch
									<br />
									metric
								</span>
							</div>
							<div className="location-box">
								<div className="location">
									{this.state.weather.name},{' '}
									{this.state.weather.sys.country + ' '}
									<i
										id="fav-loc"
										className="material-icons favorited-loc"
										onClick={this.favoriteLocation}
									>
										{this.checkIfFav()}
									</i>
								</div>
								<div className="date">{this.state.date.slice(0, 15)}</div>
							</div>
							<div className="weather-box">
								<div
									id="temp"
									className="temp"
									onClick={this.setUnit}
									style={{ width: this.tempSize() + 'px' }}
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
