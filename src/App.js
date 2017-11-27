import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from 'bloomer';
import "bulma/css/bulma.css";
import MoviesList from './MoviesList';
import InfiniteScroll from 'react-infinite-scroll-component';

class App extends Component { 
  
  constructor (props){
    super(props);
    this.api_key = "347085c63478d00dd3ba964029427ad7";
    this.now_playing_url = "https://api.themoviedb.org/3/movie/now_playing?";
    this.top_rate_url = "https://api.themoviedb.org/3/movie/top_rated?";
    this.state = {
      originMovies : [],
      movies : [],
      isLoading : true,
      page : 1,
      shouldLoadMore : false,
      current_url : this.now_playing_url,
      sort_by : "none",
      key_search : "",
    }
  }

  sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async componentDidMount(){
    const results = await fetch(this.now_playing_url + "&api_key=" + this.api_key + "&page=" + this.state.page);
    const data = await results.json();
    this.movies = data.results;
    await this.sleep(4000); 
    this.setState({
      originMovies : this.movies,
      movies : this.movies,
      isLoading : false,
      page : "1",
      shouldLoadMore : true,
      current_url : this.now_playing_url
    })
  }

  render() {
    let content;
    var Spinner = require('react-spinkit');
    content = 
    <div style = {{position : 'relative', height : '500px'}}>
      <Spinner style = {{position : 'absolute', width:'100%', margin:'0 auto', top:'50%', left:'50%'}} name='ball-clip-rotate-multiple' />
    </div>
    content = this.state.isLoading ?
    (
      <div style = {{position : 'relative', height : '500px'}}>
        <Spinner style = {{position : 'absolute', width:'100%', margin:'0 auto', top:'50%', left:'50%', height:'500px'}} name='ball-clip-rotate-multiple' />
      </div>
    ) : <MoviesList movies = {this.state.movies}/>;
    return (
      <Container>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            {this.state.isLoading ? <h1 className="App-title">Loading</h1> : <h1 className="App-title">Welcome to React</h1>}
            
          </header>
          <div className="App-intro">
            <input type="text" name="name" onChange = {(e) => this.onSearchBoxTextChanged(e.target.value)}/>
            <select onChange={this.onSelectMode.bind(this)} value={this.state.value}>
                <option value="now_playing">Now Playing</option>
                <option value="top_rated">Top Rate</option>
            </select>
            <select onChange={this.onSortChanged.bind(this)} value={this.state.value}>
                <option value="none">None</option>
                <option value="rating_asc">Sort by Rating Asc</option>
                <option value="rating_desc">Sort by Rating Desc</option>
                <option value="popularity_asc">Sort by Popularity Asc</option>
                <option value="popularity_desc">Sort by Popularity Desc</option>
                <option value="release_date_asc">Sort by Release Date Asc</option>
                <option value="release_date_desc">Sort by Release Date Desc</option>
            </select>
            <InfiniteScroll next={this.next.bind(this)} hasMore={this.state.shouldLoadMore}
              loader={<h1 style={{height:'100px',clear:'both'}}><Spinner style = {{width:'100%', margin:'0 auto', top:'50%', left:'50%'}} name='ball-clip-rotate-multiple' /></h1>}>
              {content}
            </InfiniteScroll>
          </div>
        </div>
      </Container>
    );
  }

  async next(){
    const results = await fetch(this.state.current_url + "&api_key=" + this.api_key + "&page=" + (this.state.page + 1));
    let data = await results.json();
    this.movies = data.results;
    await this.sleep(4000);
    this.setState({
      originMovies : this.state.originMovies.concat(this.movies),
      movies : this.state.originMovies.concat(this.movies),
      isLoading : false,
      page : parseInt(this.state.page) + 1,
      shouldLoadMore : true,
      current_url : this.state.current_url
    })
  }

  async onSelectMode(event){
    this.setState({
      isLoading : true,
      shouldLoadMore : false
    })
    switch (event.target.value){
      case "now_playing" :
        const results = await fetch(this.now_playing_url + "&api_key=" + this.api_key + "&page=" + 1);
        const data = await results.json();
        this.movies = data.results;
        await this.sleep(4000); 
        this.setState({
          originMovies : this.movies,
          movies : this.movies,
          isLoading : false,
          page : 1,
          shouldLoadMore : true,
          current_url : this.now_playing_url
        })
        break;
      case "top_rated" :
        const results1 = await fetch(this.top_rate_url + "&api_key=" + this.api_key + "&page=" + 1);
        const data1 = await results1.json();
        this.movies = data1.results;
        await this.sleep(4000); 
        this.setState({
          originMovies : this.movies,
          movies : this.movies,
          isLoading : false,
          page : 1,
          shouldLoadMore : true,
          current_url : this.top_rate_url
        })
        break;
    }
  }

  onSortChanged(event){
    var orderBy = require('lodash.orderby');
    switch (event.target.value){
      case "none" :
        this.setState({
          originMovies : this.state.originMovies,
          movies : this.state.originMovies,
          isLoading : this.state.isLoading,
          page : this.state.page,
          shouldLoadMore : this.state.page,
          current_url : this.top_rate_url
        })
        break;
      case "rating_asc" :
        let rating_asc = orderBy(this.state.movies, ['vote_average'], ['asc']);
        this.setState({
          originMovies : this.state.originMovies,
          movies : rating_asc,
          isLoading : this.state.isLoading,
          page : this.state.page,
          shouldLoadMore : this.state.page,
          current_url : this.top_rate_url
        })
        break;
      case "rating_desc" :
        let rating_desc = orderBy(this.state.movies, ['vote_average'], ['desc']);
        this.setState({
          originMovies : this.state.originMovies,
          movies : rating_desc,
          isLoading : this.state.isLoading,
          page : this.state.page,
          shouldLoadMore : this.state.page,
          current_url : this.top_rate_url
        })
        break;
      case "popularity_asc":
        let popularity_asc = orderBy(this.state.movies, ['popularity'], ['asc']);
        this.setState({
          originMovies : this.state.originMovies,
          movies : popularity_asc,
          isLoading : this.state.isLoading,
          page : this.state.page,
          shouldLoadMore : this.state.page,
          current_url : this.top_rate_url
        })
        break;
      case "popularity_desc":
        let popularity_desc = orderBy(this.state.movies, ['popularity'], ['desc']);
        this.setState({
          originMovies : this.state.originMovies,
          movies : popularity_desc,
          isLoading : this.state.isLoading,
          page : this.state.page,
          shouldLoadMore : this.state.page,
          current_url : this.top_rate_url
        })
        break;
      case "release_date_asc":
        let release_date_asc = orderBy(this.state.movies, ['release_date'], ['asc']);
        this.setState({
          originMovies : this.state.originMovies,
          movies : release_date_asc,
          isLoading : this.state.isLoading,
          page : this.state.page,
          shouldLoadMore : this.state.page,
          current_url : this.top_rate_url
        })
        break;
      case "release_date_desc":
        let release_date_desc = orderBy(this.state.movies, ['release_date'], ['desc']);
        this.setState({
          originMovies : this.state.originMovies,
          movies : release_date_desc,
          isLoading : this.state.isLoading,
          page : this.state.page,
          shouldLoadMore : this.state.page,
          current_url : this.top_rate_url
        })
        break;
    }
  }

  onSearchBoxTextChanged(key){
    console.log(this.state.originMovies);
    let movies = [];
    this.state.originMovies.forEach(existedMovie => {
      if(existedMovie.title.toLowerCase().indexOf(key.toLowerCase()) > -1){
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
