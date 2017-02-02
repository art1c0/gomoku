import React, { Component } from 'react';

class Menu extends Component {
	render() {
		return (
			<div className="menu">
				<h4>Welcome!</h4>
				<p>Enter your name:</p>
				<div className="line">
					<input type="text" placeholder="Name is required"
						value={this.props.playerName}
						onChange={this.props.playerNameChangeHandler} />
				</div>
				<p>Select the game or create a new one:</p>
				<div className="line">
					{this.listGames()}
				</div>
				<div className="line">
					<input type="button"
						value={this.props.playerName && (this.props.rooms && !(this.props.playerName in this.props.rooms)) ? 'Create game ' + this.props.playerName : '-'}
						disabled={!this.props.playerName.length || (this.props.rooms && (this.props.playerName in this.props.rooms))}
						onClick={this.props.onCreate} />
				</div>
			</div>
		);
	}
	
	listGames() {
		if (Object.keys(this.props.rooms).length) {
			return Object.keys(this.props.rooms).map((room) => {
				return (room !== this.props.playerName) ? (
					(this.props.rooms[room].length < 2) ? (<p><a href="#" onClick={() => this.props.onJoin(room)}>{room}</a></p>) : (<p>{room} <small>(busy)</small></p>)
				) : null;
			});
		}
		else {
			return <p><i>No games</i></p>
		}
	}
	
	
}

export default Menu;
