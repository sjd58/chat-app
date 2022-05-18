import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Passable, ImageBackground } from 'react-native';
import BackgroundImage from '../assets/Background_Image.png'

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
      <View /*style={{flex:1, justifyContent: 'center', alignItems: 'center'}}*/>
        <ImageBackground
          source={BackgroundImage}
          resizeMode='cover'
          style={styles.image}
        >
        <Text>Chat App!!</Text>
          <TextInput
            style={StyleSheet.inputText}
            onChangeText={(name) => this.setState({name})}
            value={this.state.text}
            placeholder='Please enter your name...'
          />
          <View>
            <Text style={styles.colorSelectionLabel}>Choose Your Background Color</Text>
            <View>
            <TouchableOpacity
              onPress={() =>{ this.changeBackgroundColor('#FFFFFF')}}
              style={ styles.colorOption }
              >
                <View style={styles.colorOption1}>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
              onPress={() =>{ this.changeBackgroundColor('#474056')}}
              style={ styles.colorOption }
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
          <Button
            style={ styles.button}
            title="Go to Chat"
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, bgColor: this.state.bgColor })}
          />
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 45,
  },
  inputText: {
    fontSize: 16,
    fontWeight: "300",
    color: '#757083',
    opacity: 0.5,
  },
  colorSelectionLabel: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
    opacity: 1,
  },
  colorOption:{
    alignSelf: 'center',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'white',
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
  colorOption4: {
    flexDirection: 'row',
    backgroundColor: '#B9C6AE',
    width: 45,
    height: 45,
    borderRadius: 100,
    margin: 2,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#757083',
  }
});