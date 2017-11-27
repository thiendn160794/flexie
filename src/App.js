import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Container } from 'bloomer';
import "bulma/css/bulma.css";
import MoviesList from './MoviesList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Input, Button } from 'reactbulma'

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
    this.onFetchData();
    // const results = await 
    // fetch(this.now_playing_url + "&api_key=" + this.api_key + "&page=" + this.state.page)
    // .then( (response) => {
    //   return response.json()
    // })
    // .then( (data) => {
    //   let myData = data;
    //   this.setState({
    //     originMovies : myData.results,
    //     movies : myData.results,
    //     isLoading : false,
    //     page : "1",
    //     shouldLoadMore : true,
    //     current_url : this.now_playing_url,
    //     sort_by : this.state.sort_by,
    //     key_search : this.state.key_search
    //   })
    // })
    // .catch ( (ex) => {
    //     this.setState({
    //       isError : true
    //     })
    //   }
    // )
  }

  render() {
    let content;
    var Spinner = require('react-spinkit');
    content = this.state.isLoading ?
    ( this.state.isError ?
      (
        <div style = {{position : 'relative', height : '500px', alignContent : "center", alignItems : 'center'}}>
          <h2  >Check your internet then try again!</h2>
        </div>
      ) :
      (
        <div style = {{position : 'relative', height : '400px'}}>
          <Spinner style = {{position : 'absolute', width:'100%', margin:'0 auto', top:'50%', left:'50%', height:'500px'}} name='ball-clip-rotate-multiple' />
        </div>
      )
    ) : <MoviesList movies = {this.state.movies}/>;
    return (
      <Container>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            {this.state.isLoading ? <h1 className="App-title">Loading</h1> : <h1 className="App-title">Welcome to React</h1>}
            
          </header>
          <div className="App-intro">
            <Input placeholder="Search by title..."  value = {this.state.key_search} onChange = {(e) => this.onSearchBoxTextChanged(e.target.value)}/>
            <select onChange={this.onSelectMode.bind(this)}>
                <option value="now_playing">Now Playing</option>
                <option value="top_rated">Top Rate</option>
            </select>
            <select onChange={this.onSortChanged.bind(this)} value={this.state.sort_by}>
                <option value="none">None</option>
                <option value="rating_asc">Sort by Rating Asc</option>
                <option value="rating_desc">Sort by Rating Desc</option>
                <option value="popularity_asc">Sort by Popularity Asc</option>
                <option value="popularity_desc">Sort by Popularity Desc</option>
                <option value="release_date_asc">Sort by Release Date Asc</option>
                <option value="release_date_desc">Sort by Release Date Desc</option>
            </select>
            <br/>
            <Button onClick = {this.onFetchData.bind(this)}>Refresh</Button>
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
    switch (event.target.value){
      case "now_playing" :
        this.current_url = this.now_playing_url;
        break;
      case "top_rated" :
        this.current_url = this.top_rate_url;
        break;
    }
    this.onFetchData();
  }

  onFetchData(){
    console.log("onFetachData");
    console.log(this.state.current_url + "&api_key=" + this.api_key + "&page=1");
    this.setState({
      isLoading : true,
      shouldLoadMore : false
    })
    fetch(this.state.current_url + "&api_key=" + this.api_key + "&page=1")
    .then( (response) => {
      return response.json()
    })
    .then( (data) => {
      setTimeout(
        function(){
          let myData = data;
          this.setState({
            originMovies : myData.results,
            movies : myData.results,
            isLoading : false,
            page : "1",
            shouldLoadMore : true,
            current_url : this.now_playing_url,
            key_search : "",
            sort_by : "none"
          });
        }.bind(this),
        4000
      );
    })
    .catch ( (ex) => {
        this.setState({
          isError : true
        })
      }
    )
  }

  onSortChanged(event){
    console.log(event.target.value);
    this.buildData(this.state.key_search, event.target.value);
  }

  onSearchBoxTextChanged(key){
    console.log(key);
    this.buildData(key, this.state.sort_by);
  }

  buildData(key, sort){
    console.log(this.state.originMovies);
    console.log(key);
    console.log(sort);
    let movies = [];
    this.state.originMovies.forEach(existedMovie => {
      if(existedMovie.title.toLowerCase().indexOf(key.toLowerCase()) > -1){
        movies.push(existedMovie);
      }
    });
    console.log(movies);
    var orderBy = require('lodash.orderby');
    if (key == ""){
      switch (sort){
        case "none" :
          this.setState({
            originMovies : this.state.originMovies,
            movies : movies,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : true,
            current_url : this.top_rate_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "rating_asc" :
          let rating_asc = orderBy(movies, ['vote_average'], ['asc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : rating_asc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : true,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "rating_desc" :
          let rating_desc = orderBy(movies, ['vote_average'], ['desc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : rating_desc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : true,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "popularity_asc":
          let popularity_asc = orderBy(movies, ['popularity'], ['asc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : popularity_asc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : true,
            current_url : this.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "popularity_desc":
          let popularity_desc = orderBy(movies, ['popularity'], ['desc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : popularity_desc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : true,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "release_date_asc":
          let release_date_asc = orderBy(movies, ['release_date'], ['asc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : release_date_asc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : true,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "release_date_desc":
          let release_date_desc = orderBy(movies, ['release_date'], ['desc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : release_date_desc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : true,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        }
    } else {
      switch (sort){
        case "none" :
          this.setState({
            originMovies : this.state.originMovies,
            movies : movies,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : false,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "rating_asc" :
          let rating_asc = orderBy(movies, ['vote_average'], ['asc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : rating_asc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : false,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "rating_desc" :
          let rating_desc = orderBy(movies, ['vote_average'], ['desc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : rating_desc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : false,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "popularity_asc":
          let popularity_asc = orderBy(movies, ['popularity'], ['asc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : popularity_asc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : false,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "popularity_desc":
          let popularity_desc = orderBy(movies, ['popularity'], ['desc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : popularity_desc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : false,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "release_date_asc":
          let release_date_asc = orderBy(movies, ['release_date'], ['asc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : release_date_asc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : false,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        case "release_date_desc":
          let release_date_desc = orderBy(movies, ['release_date'], ['desc']);
          this.setState({
            originMovies : this.state.originMovies,
            movies : release_date_desc,
            isLoading : this.state.isLoading,
            page : this.state.page,
            shouldLoadMore : false,
            current_url : this.state.current_url,
            sort_by : sort,
            key_search : key
          })
          break;
        }
    }
  }
}
export default App;
