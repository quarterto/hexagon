import React from 'react'
import { render } from 'react-dom'
import styled, { ThemeProvider } from 'styled-components'
import { Record, Set } from 'immutable'

class TriangleGridEdge extends Record({ u: 0, v: 0, s: 'W' }) {
	get x() {
		return this.s === 'E' ? this.u + 0.5 * (this.v + 1) : this.u + 0.5 * this.v
	}

	get y() {
		return this.s === 'E' ? -ROOT3_2 * (this.v + 1) : -ROOT3_2 * this.v
	}

	get angle() {
		return {
			S: 0,
			E: 60,
			W: -60,
		}[this.s]
	}
}

const ROOT3_2 = Math.sin(Math.PI / 3)

class TriangleGridVertex extends Record({ u: 0, v: 0 }) {
	get x() {
		return this.u + 0.5 * this.v
	}

	get y() {
		return -ROOT3_2 * this.v
	}

	get protrudes() {
		return Set.of(
			new TriangleGridEdge({ u: this.u, v: this.v, s: 'W' }),
			new TriangleGridEdge({ u: this.u, v: this.v, s: 'S' }),
			new TriangleGridEdge({ u: this.u, v: this.v - 1, s: 'E' }),
			new TriangleGridEdge({ u: this.u, v: this.v - 1, s: 'W' }),
			new TriangleGridEdge({ u: this.u - 1, v: this.v, s: 'S' }),
			new TriangleGridEdge({ u: this.u - 1, v: this.v, s: 'E' }),
		)
	}

	get adjacent() {
		return Set.of(
			new TriangleGridVertex({ u: this.u, v: this.v + 1 }),
			new TriangleGridVertex({ u: this.u + 1, v: this.v }),
			new TriangleGridVertex({ u: this.u + 1, v: this.v - 1 }),
			new TriangleGridVertex({ u: this.u, v: this.v - 1 }),
			new TriangleGridVertex({ u: this.u - 1, v: this.v }),
			new TriangleGridVertex({ u: this.u - 1, v: this.v + 1 }),
		)
	}
}

const Vertex = styled.div`
	width: ${({ theme }) => theme.scale / 10}px;
	height: ${({ theme }) => theme.scale / 10}px;
	background: ${({ theme }) => theme.colour || 'black'};
	border-radius: 100%;
	position: absolute;
	top: calc(50vh + ${({ theme, vertex }) =>
		theme.scale * vertex.y - theme.scale / 20}px);
	left: calc(50vw + ${({ theme, vertex }) =>
		theme.scale * vertex.x - theme.scale / 20}px);

	main.debug &::after {
		content: "${({ vertex }) => `${vertex.u},${vertex.v}`}";
		margin-left: 1em;
	}
`

const Edge = styled.div`
	width: ${({ theme }) => theme.scale}px;
	height: ${({ theme }) => theme.scale / 20}px;
	background: ${({ theme }) => theme.colour || 'black'};
	position: absolute;
	top: calc(
		50vh + ${({ theme, edge }) => theme.scale * edge.y - theme.scale / 40}px
	);
	left: calc(50vw + ${({ theme, edge }) => theme.scale * edge.x}px);
	transform-origin: left center;
	transform: rotate(${({ edge }) => edge.angle}deg);

	main.debug &::after {
		content: "${({ edge }) => `${edge.u},${edge.v} ${edge.s}`}";
		margin-left: 1em;
	}
`

const v = new TriangleGridVertex()

render(
	<ThemeProvider theme={{ scale: 100 }}>
		<>
			<Vertex vertex={v} />

			{v.adjacent.valueSeq().map(a => (
				<Vertex
					key={`${a.u},${a.v}`}
					vertex={a}
					theme={{ scale: 100, colour: 'red' }}
				/>
			))}

			{v.protrudes.valueSeq().map(e => (
				<Edge
					key={`${e.u},${e.v},${e.s}`}
					edge={e}
					data-edge={JSON.stringify(e)}
				/>
			))}
		</>
	</ThemeProvider>,
	document.querySelector('main'),
)
