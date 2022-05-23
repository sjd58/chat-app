import React from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import BackgroundImage from '../assets/Background_Image.png'
import adaptiveIcon from '../assets/adaptive-icon.png';

export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: '#FFFFFF'
    };
  }

  changeBackgroundColor = (newColor) => {
    this.setState({ bgColor: newColor });
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.backgroundImage}
        >
        <View style={styles.titleBox}>
          <Text style={styles.title}>Chat it up!</Text>
        </View>
          <View style={styles.box1}>
            <View style={styles.inputBox}>
              <Image source={adaptiveIcon} style={styles.image} />
              <TextInput
                style={StyleSheet.inputText}
                onChangeText={(name) => this.setState({name})}
                value={this.state.text}
                placeholder='Please enter your name...'
                />
            </View>
            <View style={styles.colorBox}>
              <Text style={styles.chooseColor}>Choose Your Background Color:</Text>
            <View style={styles.colorArray}>
            <TouchableOpacity
              onPress={() =>{ this.changeBackgroundColor('#FFFFFF')}}
              style={ styles.colorOption }
              >
                <View style={styles.colorOption1}>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
              onPress={() =>{ this.changeBackgroundColor('#474056')}}
              style={styles.colorOption}
              >
                <View style={styles.colorOption2}>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
              onPress={() =>{ this.changeBackgroundColor('#8A95A5')}}
              style={ styles.colorOption }
              >
                <View style={styles.colorOption3}>
                </View>
              </TouchableOpacity>
            </View>
            </View>
            <Pressable
            style={ styles.button }
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, bgColor: this.state.bgColor })}
            >
              <Text style={styles.buttonText}>Start Chatting!</Text>
            </Pressable>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBox: {
    height: '44%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 45,
    alignItems: 'center',
  },
  inputBox: {
    borderWidth: 2,
    borderRadius: 1,
    borderColor: 'grey',
    width: '88%',
    height: 60,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputText: {
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    opacity: 0.5,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  colorBox: {
    marginRight: 'auto',
    paddingLeft: 20,
    width: '88%',
  },
  chooseColor: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 1,
    paddingBottom: 10,
  },
  colorArray: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
    paddingRight: 60
  },
  colorOption:{
    alignSelf: 'center',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'black',
  },
  colorOption1: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: 45,
    height: 45,
    borderRadius: 100,
    margin: 2,
  },
  colorOption2: {
    flexDirection: 'row',
    backgroundColor: '#474056',
    width: 45,
    height: 45,
    borderRadius: 100,
    margin: 2,
  },
  colorOption3: {
    flexDirection: 'row',
    backgroundColor: '#8A95A5',
    width: 45,
    height: 45,
    borderRadius: 100,
    margin: 2,
  },
  button: {
    backgroundColor: '#757083',
    width: '88%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  },
  box1: {
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
});