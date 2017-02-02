import React from 'react';

function Square(props) {
	return (
		<button className={`square ${ props.isLine ? 'isLine' : '' }`} onClick={() => props.onClick()}>
			{props.value}
		</button>
	);
}

export default Square;
