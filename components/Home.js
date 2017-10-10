/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Image
} from 'react-native';

import { List, ListItem } from "react-native-elements";

export default class Home extends Component {
  static navigationOptions = {
    title: 'redditReader',
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      pageAfter: null,
      error: null,
      refreshing: false,
      limit: 25
    }; 
  }

  componentDidMount(){
    this.makeRemoteRequest() 
  } 

  makeRemoteRequest = () => {
    const { pageAfter, limit } = this.state;
    const url = 'https://api.reddit.com/r/programming/new.json?limit='+limit+'&after='+pageAfter+''
    this.setState({ loading: true });
    var posts = []
    
    fetch(url)
    .then(res => res.json())
    .then(responseJSON => {
      var postList = responseJSON.data.children
      for(var i = 0; i < postList.length; i++) {
        var post = new Post(postList[i])
        posts.push(post)
      }
      this.setState({
        data: pageAfter === null ? posts : [...this.state.data, ...posts],
        error: responseJSON.error || null,
        loading: false,
        refreshing: false,
        pageAfter: responseJSON.data.after
      })
    })
    .catch(error => {
      this.setState({error, loading: false})
    })
  }

  handleRefresh = () => {
    this.setState({
      pageAfter: null,
      refreshing: true
    },
    () => {
      this.makeRemoteRequest()
    })
  }

  handleLoadMore = () => {
    this.makeRemoteRequest()
  }

  render() {
    return (
         <View containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
         <FlatList
           data={this.state.data}
           renderItem={({ item }) => (
              this.renderFlatListItem(item)             
           )}
          keyExtractor= {(item) => item.id+item.subreddit_id}
          onEndReached={this.handleLoadMore}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
         />
       </View>    
    );
  }

  renderPostImage(item) {
    const postImage = item.thumbnail || null
    if (postImage) {
      return (
        <Image source={{uri: postImage}}
          style={{margin: 10, width: 100, height: 100, alignSelf: 'center'}}          
        />
      )
    } else {
      return (
        <Image source={require('../assets/unnamed.png')}
          style={{margin: 10, width: 100, height: 100, alignSelf: 'center'}}          
        />
      )
    }
  }

  renderFlatListItem(item) {
    const {navigate} = this.props.navigation
    const currentDate = item.getDateString
    console.log(currentDate)
    return (
      <TouchableWithoutFeedback  onPressIn={() =>
        navigate('DetailPost', {url: item.url, title: item.title})}>
        <View style={styles.cell}>   
         <View style={{flex: 1, flexDirection:'row', justifyContent: 'center'}}>
          <View style= {{flex: 0.3}}>
            {this.renderPostImage(item)}
          </View>
          <View style={{flex: 0.7}}>
            <View style={{flex: 1, margin: 2}}> 
              <View style={{flex: 0.2, margin: 2, justifyContent: 'center'}}>
                <Text style={[styles.smallFont, {textAlign: 'right'}]}>{currentDate}</Text>
              </View>
              <View style={{flex: 0.6, margin: 2, justifyContent: 'center'}}>
                <Text style={{textAlign: 'auto'}}> {item.title} </Text>
              </View>
              <View style={{flex: 0.2, margin: 2, flexDirection: 'row'}}>
                <View style={{flex: 0.5, marginRight: 5, justifyContent: 'center'}}>
                  <Text style={styles.smallFont}>{item.author}</Text>
                </View>
                <View style= {{flex: 0.25, marginRight: 5, justifyContent: 'center'}}>
                  <Text style={styles.smallFont}>score: {item.score}</Text>
                </View>
                <View style= {{flex: 0.25, justifyContent: 'center'}}>
                  <Text style={styles.smallFont}>comments: {item.num_comments}</Text>
                </View>
              </View>
            </View>
          </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
	   )
    }
  
}

function Post(jsonDict) {
  this.title = jsonDict.data.title
  this.url = jsonDict.data.url
  this.id = jsonDict.data.id
  this.subreddit_id = jsonDict.data.subreddit_id
  this.thumbnail = jsonDict.data.thumbnail
  this.score = jsonDict.data.score
  this.num_comments = jsonDict.data.num_comments
  this.author = jsonDict.data.author
  this.created = jsonDict.data.created
  this.getDateString = ''+new Date(this.created*1000)+''
}

const styles = StyleSheet.create({
  cell: {
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 125
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0FF',
  },
  smallFont: {
    fontSize: 9,
    textAlign: 'center'
  }
});
