import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from 'bloomer';
import "bulma/css/bulma.css";
import MoviesList from './MoviesList';
import TEST_DATA from './test_json';
import InfiniteScroll from 'react-infinite-scroll-component';

class App extends Component { 
  
  constructor (props){
    let NEW_PLAYING_URL = "https://api.themoviedb.org/3/movie/now_playing?api_key=347085c63478d00dd3ba964029427ad7&page=1";
    let SEARCH_URL = "https://api.themoviedb.org/3/search/movie?api_key=347085c63478d00dd3ba964029427ad7&query=Jack+Reacher";
    super(props);
    this.state = {
      originMovies : [],
      movies : [],
      isLoading : true,
      api_key : "347085c63478d00dd3ba964029427ad7",
      page : "1",
      shouldLoadMore : true
    }
  }

  sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async componentDidMount(){
    const results = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=" + this.state.api_key + "&page=" + this.state.page);
    const data = await results.json();
    this.movies = data.results;
    await this.sleep(4000); 
    this.setState({
      originMovies : this.movies,
      movies : this.movies,
      isLoading : false,
      page : "1",
      shouldLoadMore : true
    })
    // this.next = this.next.bind(this);
  }

  render() {
    let content;
    var Spinner = require('react-spinkit');
    
    content = this.state.isLoading ?
    (
        <Spinner name='ball-clip-rotate-multiple' />
    ) : <MoviesList movies = {this.state.movies}/>;
    return (
      <Container>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <div className="App-intro">
            <input type="text" name="name" onChange = {(e) => this.onSearchBoxTextChanged(e.target.value)}/>
            <InfiniteScroll loader={<h4>Loading...</h4>} next={this.next.bind(this)} hasMore={this.state.shouldLoadMore}>
              {content}
            </InfiniteScroll>
          </div>
        </div>
      </Container>
    );
  }

  async next(){
    const results = await fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=" + this.state.api_key + "&page=" + (this.state.page + 1));
    let data = await results.json();
    this.movies = data.results;
    await this.sleep(4000);
    this.setState({
      originMovies : this.state.originMovies.concat(this.movies),
      movies : this.state.originMovies.concat(this.movies),
      isLoading : false,
      page : "1",
      shouldLoadMore : true
    })
  }

  onSearchBoxTextChanged(key){
    console.log(this.state.originMovies);
    let movies = [];
    this.state.originMovies.forEach(existedMovie => {
      if(existedMovie.title.indexOf(key) > -1){
        movies.push(existedMovie);
      }
    });
    console.log(movies);
    if (key == ""){
      this.setState({
        originMovies : this.state.originMovies,
        movies : movies,
        isLoading : this.state.isLoading,
        api_key : this.state.api_key,
        page : "1",
        shouldLoadMore : true
      })
    } else {
      this.setState({
        originMovies : this.state.originMovies,
        movies : movies,
        isLoading : this.state.isLoading,
        api_key : this.state.api_key,
        page : "1",
        shouldLoadMore : false
      })
    }
  }
}
export default App;
