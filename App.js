import React from 'react';
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import Navigation from './Navigator';
import uuid from 'uuid/v4';
import {Platform} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {

  state = {
    inputTitle: '',
    inputContent: '',
    selectedDate: '',
    imageUrl: '',
    Posts: [{
      id: 'abcd-efg1',
      title: '11월 21일에 쓴 글',
      content: '입니다.',
      date: '20191121',
      image:'',
    },{
      id: 'abde-efg2',
      title: '11월 22일에 쓴 글',
      content: '입니다.',
      date: '20191122',
      image:'',
    }]
  }

  _changeTitle = (value) => {
    this.setState({
      inputTitle: value
    });
  }

  //////////////////////////////////////
  _changeContent = (value) => {
    this.setState({
      inputContent: value
    });
  }

  ///////////////////////////////////////
  _changeDate = (value) => {
    let year = value._i.year.toString();
    let month = (value._i.month+1).toString();
    let day = value._i.day.toString();

    if(month.length==1) month="0"+month;
    if (day.length==1) day="0"+day;

    this.setState({
      selectedDate: year+month+day
    });
  }

  ////////////////////////////////////////////////
  _getToday = () => {
    let today = new Date();
    day = today.getDate().toString();
    month = (today.getMonth()+1).toString();
    year = today.getFullYear().toString();

    if (month.lentgh == 1) month="0"+month;
    if (day.length == 1) day = "0"+day;

    return year+month+day;
  }

  //////////////////////////////////////////////

  _addPost = () => {
    let id = uuid();
    const today = this._getToday();
    const prevPosts = [...this.state.Posts];
    const newPost = {
      id : id,
      title : this.state.inputTitle,
      content: this.state.inputContent,
      date: today,
      image: this.state.imageUrl,
    }

    this.setState({
        inputTitle: '',
        inputContent: '',
        selectedDate: today,
        imageUrl: '',
        Posts:prevPosts.concat(newPost),
    },this.saveData);
  }

  ///////////////////////////////////////////////////
    _selectPicture = async() => {
      if(Platform.OS == 'ios'){
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted'){
          alert('설정 > expo > 사진 읽기 및 쓰기 허용을 설정해주세요');
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({allowsEditing:true, aspect:[1,1],});
      this.setState({imageUrl: result.uri});
    }

    ///////////////////////////////////////////////////


  _deletePost = (id) => {
    const prevPosts = [...this.state.Posts];
    deleteIndex = prevPosts.findIndex((item) => {return item.id == id});
    deletePost = prevPosts.splice(deleteIndex, 1);
    this.setState({Posts:prevPosts});
  }


  //////////////////////////////////////////////////////
  componentDidMount(){
    const today = this._getToday();
    AsyncStorage.getItem('@diary:state')
    .then((state) => {
      if (state != null){
        this.setState(JSON.parse(state));
      }
    }).then(() => {
      this.setState({
        selectedData : today
      })
    });
  }

  ///////////////////////////////////////////////////////////
  saveData = () => {
    AsyncStorage.setItem('@diary:state', JSON.stringify(this.state));
  }

  ///////////////////////////////////////////////////////
  render() {
    return (
      <Navigation
        screenProps={{
          inputTitle: '',
          inputContent: '',
          Posts:this.state.Posts,
          selectedDate: this.state.selectedDate,
          changeDate: this._changeDate,
          changeTitle: this._changeTitle,
          changeContent: this._changeContent,
          addPost: this._addPost,
          imageUrl: this.state.imageUrl,
          selectPicture: this._selectPicture,
          deletePost: this._deletePost,
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// App.js 다시 전체적으로 수정해보고 다시 돌려보기. 안되면 한울님께 연락해서 App.js 전체 코드 받기