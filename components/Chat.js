import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Firestore Database
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

//SDK from Firestore
const firebaseConfig = {
  apiKey: "AIzaSyCjexhK3OaUCUIF0P06DdFysNa7wFF5auM",
  authDomain: "chat-app-a3f3a.firebaseapp.com",
  projectId: "chat-app-a3f3a",
  storageBucket: "chat-app-a3f3a.appspot.com",
  messagingSenderId: "735281964468",
  appId: "1:735281964468:web:a2180752c1774c059e7ee1",
  measurementId: "G-5YQKHKNGSV"
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
			uid: 0,
      user: {
				_id: '',
				name: '',
				avatar: '',
			},
    }
  
  //Initialize the Firestore app
  if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    }
  //Store and retrieve the chat messages
  this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  //5.4  Retrieve messages from async storage
  async getMessages () {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  };
  
  componentDidMount() {
    this.getMessages();

    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    //Authenticates user via Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        return await firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any",
        },
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  };

  //function to get all messages from firebase and add them to the state of the app
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt/*.toDate()*/,
        user: data.user,
      });
    });
    this.setState({
      messages
    });
  };
  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }
  // this function adds whatever the user has just typed in as a new document in the firebase collection. It is called inside the onSend function.
  addMessage() {
		const message = this.state.messages[0];
		// add a new message to the collection

		this.referenceChatMessages.add({
			_id: message._id,
			text: message.text,
			createdAt: message.createdAt,
			user: this.state.user,
      uid: this.state.uid,
		});
	};
  //function that adds a new message to the state and to firebase as a new document
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
    this.addMessage(); //change to this.saveMessages(); for exercise 5.4?
  });
}

  //function that makes the background color of the sender's messages black rather than blue
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          },
          left: {
            backgroundColor: '#FFF'
          }
        }}
      />
    )
  };
  render() {
    const bgColor = this.props.route.params.bgColor;
    return (
      <View style={{flex:1, backgroundColor: bgColor}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={usersNewMessage => this.onSend(usersNewMessage)}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar,
          }}
        />
        {/* For older Android phones, code to prevent the keyboard from blocking the input */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  };
}