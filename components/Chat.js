import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

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
      isConnected: false,
      image: null,
      location: null,
    }
  
  //Initialize the Firestore app
  if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    }
  //Store and retrieve the chat messages
  this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  // If user is offline:
  //1 Retrieve messages from async storage
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

  //2 Save messages into async storage, called in onSend()
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };
  
  //3 Delete messages from async storage, for use as I develop the app
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

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
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
            isConnected: true,
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
          });
        console.log('online');
        this.saveMessages();
      } else {
        this.setState({ isConnected: false });
        this.getMessages();
        console.log('offline');
      }
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
        createdAt: new Date(data.createdAt.seconds*1000),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages: messages,
    });
    this.saveMessages();
  };
  componentWillUnmount() {
    if (this.state.isConnected == true) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
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
      image: message.image || null,
      location: message.location || null,
		});
	};

  //function that adds a new message to the state and to firebase as a new document
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
    this.addMessage();
    this.saveMessages();
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

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }

  //render a map on a message with the sender's current location if they shared their location
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: parseInt(currentMessage.location.latitude),
            longitude: parseInt(currentMessage.location.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    const bgColor = this.props.route.params.bgColor;
    return (
      <View style={{flex:1, backgroundColor: bgColor}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={usersNewMessage => this.onSend(usersNewMessage)}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar,
          }}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
        />
        {/* For older Android phones, code to prevent the keyboard from blocking the input */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  };
}
