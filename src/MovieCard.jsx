import React, { Component } from 'react'
import {Box} from 'bloomer'
import './MovieCard.css'

export default class MovieCard extends Component {
    render() {
        return (
            <div style = {MovieCard-Box}>
            {this.props.movie.original_title}
                {/* <Box className = "MovieCard-Box"> {this.props.movie.original_title}</Box> */}
            </div>
        )
    }
}
