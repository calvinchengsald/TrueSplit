import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import  Carousel  from 'react-native-snap-carousel';
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers   } from 'react-native-popup-menu';
import {coalesce } from '../utility/utils';

const { SlideInMenu } = renderers;

const TUTORIAL_NAMES = {
    BASIC: 'Basic',
    TAX: 'Tax',
    SHARES: 'Shares'
}

export default class TutorialScreen extends Component {


    constructor(props) {
        super(props);
        this.carouselContainerWidth=0;
        this.imgGeneral = [
            <Image source={require('../assets/images/tutorial/general/0.jpg')} style={styles.image}/>,
            <Image source={require('../assets/images/tutorial/general/1.jpg')} style={styles.image}/>,
            <Image source={require('../assets/images/tutorial/general/2.jpg')} style={styles.image}/>
        ]

        this.state = {
            currentTutorial: this.imgGeneral,
            currentTutorialName: null,
            carouselInitialize: false
        }
    }

    setTutorial = (tutorialName) => {
        var currentTutorial;
        switch(tutorialName) {
            case TUTORIAL_NAMES.BASIC: 
                currentTutorial=this.imgGeneral;
                break;
            default: 
                currentTutorial=this.imgGeneral;
                break;
        }

        this.setState({
            carouselInitialize: true,
            currentTutorialName : tutorialName,
            currentTutorial: currentTutorial,
            
        })
    }


    render() {
        const renderTutorialImage = ({item}) => {
            return (
                <View style = {styles.imageContainer}>
                    {item}
                </View>
            )
        }   
        return (
            <View style={styles.container}>
                <View style={styles.tutorialPicker}>
                    <Menu name="tutorialPicker" style={styles.tutorialPickerMenu} renderer={SlideInMenu} onSelect={value => this.selectNumber(value)}>
                        <MenuTrigger style={styles.tutorialPickerMenuTrigger}>
                            <Text style={{ fontSize: 16 }}>{coalesce(this.state.currentTutorialName, 'Select Tutorial')}</Text>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => this.setTutorial(TUTORIAL_NAMES.BASIC)} text={TUTORIAL_NAMES.BASIC} />
                            <MenuOption onSelect={() => this.setTutorial(TUTORIAL_NAMES.TAX)} text={TUTORIAL_NAMES.TAX} />
                            <MenuOption onSelect={() => this.setTutorial(TUTORIAL_NAMES.SHARES)} text={TUTORIAL_NAMES.SHARES} />
                        </MenuOptions>
                    </Menu>
                </View>
                <View style={styles.carouselContainer}
                onLayout={ e => {
                    this.carouselContainerWidth = e.nativeEvent.layout.width;
                    this.carouselContainerHeight = e.nativeEvent.layout.height;
                    // this.setState({
                    //     carouselInitialize:true
                    // })
                }} >
                    {this.state.carouselInitialize &&
                    <Carousel
                        layout={'default'} 
                        data={this.state.currentTutorial}
                        renderItem={renderTutorialImage}
                        sliderWidth={this.carouselContainerWidth}
                        itemWidth={this.carouselContainerWidth-100}
                    />
                    }
                    
                </View>
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
    },
    tutorialPicker: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
        
    },
    tutorialPickerMenu: {
        height: 'auto', 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#5e4848',
        borderWidth: 2,
        backgroundColor: '#d0e4ef',
        paddingRight: 3,
        paddingLeft: 3
    },
    tutorialPickerMenuTrigger: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    carouselContainer: {
        flex:9,
        flexDirection:'row',
        justifyContent: 'center',
        backgroundColor: '#FEE4AC',
        borderColor: '#C6FEAC',
        borderWidth: 2,
    },
    imageContainer: {
        flex: 1,
        padding: 5,
    },  
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    }
})