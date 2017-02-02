import React, { Component } from 'react';
import Board from './Board';
import Menu from './Menu';

class Game extends Component {
	constructor() {
		super();
		this.state = {
			screen: 'menu',
			room: '',
			rooms: {},
			playerName: 'Player ' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.round(Math.random() * 26)),
			opponentName: '',
		};
	}
	
	render() {
		return (
			<div className="game">
				{this[this.state.screen]()}
			</div>
		);
	}
	
	menu() {
		return (
			<Menu
				rooms={this.state.rooms}
				room={this.state.room}
				playerName={this.state.playerName}
				playerNameChangeHandler={(e) => this.handlePlayerNameChange(e)}
				onCreate={() => this.handleCreate()}
				onJoin={(room) => this.handleJoin(room)} />
		)
	}
	
	game() {
		return (
			<Board
				ref={board => this.board = board}
				playerName={this.state.playerName}
				opponentName={this.state.opponentName}
				onChange={(state) => this.handleChange(state)}
				onFinish={(winnerName) => this.handleFinish(winnerName)}
				onLeave={() => this.handleLeave()} />
		)
	}
	
	componentDidMount() {
		if (window.socket) window.socket.on('state', state => {return this.board ? this.board.setState(state) : null});
		if (window.socket) window.socket.on('rooms', rooms => this.setState({rooms: rooms}));
		if (window.socket) window.socket.on('create', room => this.created(room));
		if (window.socket) window.socket.on('join', (room, player) => this.joined(room, player));
		if (window.socket) window.socket.on('leave', (room, player) => this.left(room, player));
	}
	
	handleChange(state) {
		if (window.socket) window.socket.emit('state', this.state.room, state);
	}
	
	handleFinish(winnerName) {
		console.log('winner', winnerName);
	}
	
	handleLeave(force) {
		if (force || confirm('Are you sure you want to leave the game?')) {
			if (window.socket) window.socket.emit('leave', this.state.room, this.state.playerName);
			this.setState({
				room: '',
				screen: 'menu',
				opponentName: '',
			});
		}
	}
	
	handlePlayerNameChange(event) {
		this.setState({playerName: event.target.value});
	}
	
	handleCreate() {
		if (!this.state.playerName) return;
		if (window.socket) window.socket.emit('create', this.state.playerName);
	}
	
	handleJoin(room) {
		if (!this.state.playerName) return;
		if (window.socket) window.socket.emit('join', room, this.state.playerName);
	}
	
	created(room) {
		this.setState({
			room: room,
			screen: 'game',
		});
	}
	
	joined(room, player) {
		this.setState({
			room: room,
			screen: 'game',
			opponentName: (player === this.state.playerName ? room : player),
		});
	}
	
	left(room, player) {
		if (player !== this.state.playerName) {
			alert('Player ' + player + ' has left the game');
			if (room === player) {
				this.handleLeave(true);
			}
			else {
				this.setState({
					opponentName: '',
				});
				this.board.reset();
			}
		}
	}
}

export default Game;
