import React, { Component } from 'react'
import {Box} from 'bloomer'
import './MovieCard.css'
import {Media, Image, Content, Level, Icon} from 'reactbulma'
import Lightbox from 'react-images';

export default class MovieCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            shouldShowLightBox : false,
            shouldShowDetail : false
        }
        this.urlLightBox = [
            {src : 'https://image.tmdb.org/t/p/w1280' + this.props.movie.backdrop_path}
        ]
    }

    onClickPosterImage(){
        console.log("onCLickPoster")
        this.setState({
            shouldShowLightBox : true,
            shouldShowDetail: this.state.shouldShowDetail
        })
    }

    onCloseLightBox(){
        this.setState({
            shouldShowLightBox: false,
            shouldShowDetail: this.state.shouldShowDetail
        })
    }

    onShowClick(){
        this.setState({
            shouldShowLightBox: this.state.shouldShowLightBox,
            shouldShowDetail: !this.state.shouldShowDetail
        })
    }

    render() {
        let detail = this.state.shouldShowDetail ? this.props.movie.overview : null;
        return (
            <div style = {{display: 'flex',height:"300px",float:'left',width:'50%',margin:'10px 0px',justifyContent:'center'}}>
                <Lightbox backdropClosesModal = {true} 
                    isOpen={this.state.shouldShowLightBox} 
                    images = {this.urlLightBox}  
                    onClose = {this.onCloseLightBox.bind(this)}/>
                <Box style = {{flex : '0.9'}} className = "MovieCard-Box"> 
                {/* {this.props.movie.original_title} */}
                    <Media>
                        <Media.Left style = {{flex : '1'}}>
                            <img style = {{height : '100%', width : '100%'}} 
                                src={"https://image.tmdb.org/t/p/w1280" + this.props.movie.poster_path} 
                                alt="Image" 
                                onClick = {this.onClickPosterImage.bind(this)}/>
                        </Media.Left>
                        <Media.Content style = {{flex : '2'}}>
                            <Content>
                                <p>
                                    <strong>{this.props.movie.original_title}</strong> 
                                    <br/>
                                    Rating: <small>{this.props.movie.vote_average}</small>
                                    <br/>
                                    Release Date: <small>{this.props.movie.release_date}</small> 
                                    <br/>
                                    Popularity: <small>{this.props.movie.popularity}</small> 
                                    <br/>
                                    <small><a onClick={this.onShowClick.bind(this)}>Detail</a></small>
                                </p>
                            </Content>
                            <Content >
                                {detail}
                            </Content>
                        </Media.Content>
                    </Media>
                </Box>
                {/* </Box> */}
            </div>
        )
    }
}