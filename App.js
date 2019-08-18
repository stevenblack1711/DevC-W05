
import React, {Component} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import ListItem from './Component/ListItem';
import { Platform } from '@unimodules/core';

const filterForUniqueArticles = arr => {
  const cleaned = [];
  arr.forEach(itm => {
    let unique = true;
    cleaned.forEach(itm2 => {
      const isEqual = JSON.stringify(itm) === JSON.stringify(itm2);
      if (isEqual) unique = false;
    });
    if (unique) cleaned.push(itm);
  });
  return cleaned;
};

export default class  App extends Component {
  state = {
    isLoading : false,
    listArticles: [],
    pageNumber: 1,
    lastPageReached: false,
  };

   componentDidMount = async() => 
{
  const {pageNumber} = this.state;
  this.setState({ isLoading: true});
  await this.callAPI(pageNumber)
}

callAPI = async(pageNumber) => {
  const {listArticles} = this.state; 
  const response = await fetch (
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=a4944832061a486bb3a1ea415559cb7f&page=${pageNumber}`
    );
  const jsonResponse = await response.json();
  this.setState({
  isLoading: false,
  pageNumber : pageNumber,
  listArticles: filterForUniqueArticles(listArticles.concat(jsonResponse.articles)),
    });
}

onEndReached = async () => {
  const {pageNumber} = this.state;
  const newpage = pageNumber + 1; 
  this.callAPI(newpage)
}

onRefresh = async () => {
  const newpage = 1;
  await this.setState({isLoading: true, listArticles: [], pageNumber: newpage});
  await setTimeout(() => {this.callAPI(newpage);},1000 );  
}

renderItem = ({item}) => {
  return<ListItem item = {item}/>
}
  render() {
    const {isLoading, listArticles} = this.state;
    
    if (isLoading)
    {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" animating={isLoading}/>
      </View>
  )}
    return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Articles Count:</Text>
        <Text style={styles.info}>{listArticles.length}</Text>
      </View>
      <FlatList onEndReached={this.onEndReached} onEndReachedThreshold={1}
        data = {listArticles}
        renderItem={this.renderItem}
        ListFooterComponent={<ActivityIndicator size="large" animating={isLoading} />}
        onRefresh={this.onRefresh}
        refreshing={false}
      />
    </View>
    ) ;
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'ios' ? 70 : 70 -24,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row'
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
    fontWeight: 'bold'
  },
  info: {
    fontSize: 16,
    color: 'grey'
  }
});
