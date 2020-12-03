import React, { Component } from 'react';
import './InfoModal.css';

export default class InfoModal extends Component {
	state = {
		showInfo: true,
	};

	// changes the informative text and borders to show when the info icon is pressed
	showInfo = (e) => {
		this.state.showInfo === false
			? this.setState({ showInfo: true })
			: this.setState({ showInfo: false });

		let infoFav = document.getElementById('info-fav');
		let infoLoc = document.getElementById('info-loc');
		let infoMet = document.getElementById('info-met');
		let infoSearch = document.getElementById('info-search');
		let locIcon = document.getElementById('curr-loc');
		let favIcon = document.getElementById('fav-loc');
		let tempIcon = document.getElementById('temp');

		if (this.state.showInfo === true) {
			infoFav.style.display = 'block';
			infoLoc.style.display = 'block';
			infoMet.style.display = 'block';
			infoSearch.style.display = 'block';

			locIcon.style.border = 'solid lightgreen 2px';
			locIcon.style.padding = '0px';

			favIcon.style.border = 'solid yellow 2px';
			favIcon.style.padding = '0px';

			tempIcon.style.border = 'solid lightcoral 2px';
			tempIcon.style.padding = '13px 23px';
		} else {
			infoFav.style.display = 'none';
			infoLoc.style.display = 'none';
			infoMet.style.display = 'none';
			infoSearch.style.display = 'none';

			locIcon.style.border = 'none';
			locIcon.style.padding = '2px';

			favIcon.style.border = 'none';
			favIcon.style.padding = '2px';

			tempIcon.style.border = 'none';
			tempIcon.style.padding = '15px 25px';
		}
	};

	render() {
		return (
			<div>
				<i className="material-icons info-toggle" onClick={this.showInfo}>
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
				<span id="info-search" className="info info-search">
					e.g. dallas or dallas, US
				</span>
			</div>
		);
	}
}
