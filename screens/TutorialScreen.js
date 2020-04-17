import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default class TutorialScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                im help 5

                </Text>
            </View>
        )
    }
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10
    }
})