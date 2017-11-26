import React, { Component } from 'react'
import MovieCard from './MovieCard.jsx'

export default class MoviesList extends Component {
    render() {
        return (
            <div>
                {this.props.movies.map(m => <MovieCard movie = {m} />)}
            </div>
        )
    }
}
