import React from 'react';
import { ScrollView, Text, WebView, Button } from 'react-native';

class DetailPost extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.title,
  });
  render() {
    return (
      <WebView source={{uri: this.props.navigation.state.params.url}}/>
    );
  }
}

export default DetailPost;
