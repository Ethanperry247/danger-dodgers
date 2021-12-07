import React from 'react';
import { View, Linking, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Headline, Paragraph } from 'react-native-paper';

const About = () => (
  <ScrollView style={styles.container}>
    <Headline style={styles.title}>About This App</Headline>
    <Headline style={styles.paddingBelow}>Chad Young</Headline>
    <View style={styles.paddingBelow}>
      <Image style={{...styles.image}} source={require('../../Assets/chad.jpeg')}></Image>
    </View>
    <Paragraph style={styles.paddingBelow}>Chad Young was a man of many talents. Not only was he devoted to his Mechanical Engineering degree at Mines with a near-perfect GPA, but he was also a powerful and accomplished cyclist, receiving numerous accolades at the professional level. On top of all that, Chad was a compassionate, humble, leader.</Paragraph>
    <View style={styles.paddingBelow}>
    <Image style={styles.image} source={require('../../Assets/racing.jpeg')}></Image></View>

    <Paragraph style={styles.paddingBelow}>
    On April 28th, 2017, Chad passed away as a brain injury sustained during a race ended up being fatal. Shortly after the accident, Chad’s parents, Kevin and Lois Young, began the Chad William Young Foundation in an effort to minimize cycling incidents and continue Chad’s legacy.</Paragraph>

    <View style={styles.paddingBelow}>
    <Image style={{...styles.image, paddingBottom: 64 }} source={require('../../Assets/chad-2.jpeg')}></Image></View>

    <Headline style={{...styles.title, ...styles.paddingBelow}}>Sponsors and Partners</Headline>
    <Paragraph style={styles.paddingBelow}>
      This app was conceptualized and funded by the
      {' '}<Text style={styles.link} onPress={() => Linking.openURL('https://cwyf.org/')}>
        Chad William Young Foundation
      </Text>
      , and many students/faculty at 
      {' '}<Text style={styles.link} onPress={() => Linking.openURL('https://www.mines.edu/')}>
        Colorado School of Mines
      </Text>
      , primarily in the 
      {' '}<Text style={styles.link} onPress={() => Linking.openURL('https://www.cs.mines.edu/')}>
      Department of Computer Science
      </Text>{' '}
       have contributed to the project.
    </Paragraph>
    
    <View style={{ paddingBottom: 64 }}><Image style={{ width: '100%', height: 39 }} source={require('../../Assets/mines.png')}></Image></View>

    <Headline style={{...styles.title, ...styles.paddingBelow}}>Development Team</Headline>

    <View style={styles.dev}>
      <View style={{...styles.developer, ...styles.paddingBelow}}>
        <View style={{...styles.centered, ...styles.paddingBelow}}>
        <Image style={styles.avatarImage} source={require('../../Assets/ethan.png')}></Image></View>
        <Headline style={styles.developerInfo}>Ethan Perry</Headline>
        <Paragraph style={styles.developerInfo}>B.S. Computer Science - Fall 2021</Paragraph>
      </View>

      <View style={{...styles.developer, ...styles.paddingBelow}}>
        <View style={{...styles.centered, ...styles.paddingBelow}}>
        <Image style={styles.avatarImage} source={require('../../Assets/zoe.jpg')}></Image></View>
        <Headline style={styles.developerInfo}>Zoe Baker</Headline>
        <Paragraph style={styles.developerInfo}>B.S. Computer Science - Spring 2022</Paragraph>
      </View>

      <View style={{...styles.developer, ...styles.paddingBelow}}>
        <View style={{...styles.centered, ...styles.paddingBelow}}>
        <Image style={styles.avatarImage} source={require('../../Assets/cole.jpg')}></Image></View>
        <Headline style={styles.developerInfo}>Cole Wapelhorst</Headline>
        <Paragraph style={styles.developerInfo}>B.S. Computer Science - Spring 2023</Paragraph>
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  link: {
    color: '#3333ff',
    fontWeight: 'bold'
  }, container: {
    padding: 24
  }, image: {
    width: '100%',
    height: 300,
  }, title: {
    fontSize: 32
  }, paddingBelow: {
    paddingBottom: 24
  }, avatarImage: {
    height: 150,
    width: 150,
    borderRadius: 75
  }, centered: {
    alignItems: 'center'
  }, dev: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 64
  }, developer: {
    padding: 10,
  }, developerInfo: {
    textAlign: 'center'
  }
});

export default About;