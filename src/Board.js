import React, { Component } from 'react';
import Square from './Square';

class Board extends Component {
	// settings
	cols = 15;
	rows = 15;
	line = 5;
	
	initialState = {
		xIsNext: true,
		gameIsStarted: false,
		gameIsOver: false,
		status: 'Next move: X',
		xPlayer: '',
		oPlayer: '',
	};
	
	constructor() {
		super();
		this.state = Object.assign({}, this.initialState);
		this.state.squares = this.fill();
	}
	
	fill() {
		return new Array(this.rows).fill(null).map(() => new Array(this.cols).fill(null));
	}
	
	reset() {
		const state = Object.assign({}, this.initialState);
		state.squares = this.fill();
		this.save(state);
	}
	
	save(state) {
		this.setState(state);
		if (typeof this.props.onChange === 'function') this.props.onChange(state);
	}
	
	render() {
		return (
			<div className="board">
				<h4>{this.props.playerName} {this.props.opponentName ? 'vs ' + this.props.opponentName : 'is waiting...'}</h4>
				<div className="line">{this.props.playerName === this.state.xPlayer ? 'You are playing X' : (this.props.playerName === this.state.oPlayer ? 'You are playing O' : this.choose())}</div>
				<div className="line">{this.state.status}</div>
				{[...Array(this.rows)].map((row, y) =>
					<div className="board-row" key={y}>
						{[...Array(this.cols)].map((col, x) =>
							<Square
								value={this.state.squares[y][x] ? this.state.squares[y][x].value : ''}
								onClick={() => this.handleClick(x, y)}
								isLine={this.state.squares[y][x] ? this.state.squares[y][x].isLine : false}
								key={x} />
						)}
					</div>
				)}
				<div className="line">
					<input type="button" value="Restart game" onClick={() => this.reset()} />
					<input type="button" value="Leave game" onClick={() => this.props.onLeave()} />
				</div>
			</div>
		);
	}
	
	choose() {
		return (
			<span>
				Choose 
				<input type="button" value="X" onClick={() => this.handleChoose('X')} disabled={!this.props.opponentName} />
				or
				<input type="button" value="O" onClick={() => this.handleChoose('O')} disabled={!this.props.opponentName} />
				<small>(X begins)</small>
			</span>
		)
	}
	
	handleClick(x, y) {
		if (!this.state.gameIsStarted || this.state.gameIsOver || (this.state.squares[y][x] && this.state.squares[y][x].value)) return;
		if (this.state.xIsNext && this.props.playerName !== this.state.xPlayer) return;
		if (!this.state.xIsNext && this.props.playerName !== this.state.oPlayer) return;
		const squares = this.state.squares.slice();
		if (!squares[y][x]) squares[y][x] = {};
		squares[y][x].value = this.state.xIsNext ? 'X' : 'O';
		this.save({
			squares: squares,
			xIsNext: !this.state.xIsNext,
			status: 'Next move: ' + (!this.state.xIsNext ? 'X' : 'O'),
		});
		this.finish(this.check(x, y));
	}
	
	handleChoose(choice) {
		if (!this.props.opponentName) return;
		if (choice === 'X') {
			this.save({
				xPlayer: this.props.playerName,
				oPlayer: this.props.opponentName,
				gameIsStarted: true,
			});
		}
		else {
			this.save({
				xPlayer: this.props.opponentName,
				oPlayer: this.props.playerName,
				gameIsStarted: true,
			});
		}
	}
	
	finish(winLine) {
		if (!winLine) return;
		const winner = this.state.xIsNext ? 'X' : 'O';
		const winnerName = ((winner === 'X' && this.props.playerName === this.state.xPlayer) || (winner === 'O' && this.props.playerName === this.state.oPlayer) ? this.props.playerName : this.props.opponentName);
		const squares = this.state.squares.slice();
		winLine.forEach((pos) => {
			squares[pos[1]][pos[0]].isLine = true;
		});
		this.save({
			squares: squares,
			gameIsOver: true,
			status: 'Winner is: ' + winnerName,
		});
		if (typeof this.props.onFinish === 'function') this.props.onFinish(winnerName);
	}
	
	check(x, y) {
		const sqs = this.state.squares;
		var lineX = [[x, y]],
			lineY = [[x, y]],
			lineL = [[x, y]],
			lineR = [[x, y]],
			winLine = null;
		[-1, 1].forEach((shift) => {
			if (winLine) return;
			// horizontal –
			var sftX = shift;
			while (sqs[y][x + sftX] && sqs[y][x + sftX].value === sqs[y][x].value) {
				lineX.push([x + sftX, y]);
				sftX += shift;
			}
			if (lineX.length >= this.line) {
				winLine = lineX;
				return;
			}
			// vertical |
			var sftY = shift;
			while (sqs[y + sftY] && sqs[y + sftY][x] && sqs[y + sftY][x].value === sqs[y][x].value) {
				lineY.push([x, y + sftY]);
				sftY += shift;
			}
			if (lineY.length >= this.line) {
				winLine = lineY;
				return;
			}
			// diagonal /
			var sftRX = shift,
				sftRY = -shift;
			while (sqs[y + sftRY] && sqs[y + sftRY][x + sftRX] && sqs[y + sftRY][x + sftRX].value === sqs[y][x].value) {
				lineR.push([x + sftRX, y + sftRY]);
				sftRX += shift;
				sftRY += -shift;
			}
			if (lineR.length >= this.line) {
				winLine = lineR;
				return;
			}
			// diagonal \
			var sftLX = shift,
				sftLY = shift;
			while (sqs[y + sftLY] && sqs[y + sftLY][x + sftLX] && sqs[y + sftLY][x + sftLX].value === sqs[y][x].value) {
				lineL.push([x + sftLX, y + sftLY]);
				sftLX += shift;
				sftLY += shift;
			}
			if (lineL.length >= this.line) {
				winLine = lineL;
				return;
			}
		});
		return winLine;
	}
}

export default Board;
