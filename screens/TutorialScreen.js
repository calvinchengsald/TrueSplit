import React, { Component } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import  Carousel  from 'react-native-snap-carousel';
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers   } from 'react-native-popup-menu';
import {coalesce } from '../utility/utils';
import {Icon} from 'react-native-elements'

const { SlideInMenu } = renderers;

const TUTORIAL_NAMES = {
    BASIC: 'Basic Splitting',
    TAX: 'Tax and Discounts',
    SHARES: 'Shares'
}

export default class TutorialScreen extends Component {


    constructor(props) {
        super(props);
        this.carouselContainerWidth=0;
        this.loadTutorialImages();
        this.state = {
            currentTutorial: this.imgBasic,
            currentTutorialName: null,
            carouselInitialize: false
        }
    }

    loadTutorialImages = () => {
        this.imgBasic = [
            <Image source={require('../assets/images/tutorial/basic_splitting/0.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/basic_splitting/1.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/basic_splitting/2.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/basic_splitting/3.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/basic_splitting/4.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/basic_splitting/5.png')} style={styles.image} resizeMode="contain"/>
        ]
        this.imgShare = [
            <Image source={require('../assets/images/tutorial/shares/0.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/shares/1.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/shares/2.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/shares/3.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/shares/4.png')} style={styles.image} resizeMode="contain"/>,
            <Image source={require('../assets/images/tutorial/shares/5.png')} style={styles.image} resizeMode="contain"/>
        ]
        this.imgTax = [
            <Image source={require('../assets/images/tutorial/tax_and_discounts/0.png')} style={styles.image}  resizeMode="contain" />,
            <Image source={require('../assets/images/tutorial/tax_and_discounts/1.png')} style={styles.image}  resizeMode="contain" />,
            <Image source={require('../assets/images/tutorial/tax_and_discounts/2.png')} style={styles.image}  resizeMode="contain" />,
            <Image source={require('../assets/images/tutorial/tax_and_discounts/3.png')} style={styles.image}  resizeMode="contain" />,
            <Image source={require('../assets/images/tutorial/tax_and_discounts/4.png')} style={styles.image}  resizeMode="contain" />,
            <Image source={require('../assets/images/tutorial/tax_and_discounts/5.png')} style={styles.image}  resizeMode="contain" />,
            <Image source={require('../assets/images/tutorial/tax_and_discounts/6.png')} style={styles.image}  resizeMode="contain" />,
            <Image source={require('../assets/images/tutorial/tax_and_discounts/7.png')} style={styles.image}  resizeMode="contain" />,
            <Image source={require('../assets/images/tutorial/tax_and_discounts/8.png')} style={styles.image}  resizeMode="contain" />
        ]  
    }
    
    setTutorial = (tutorialName) => {
        var currentTutorial;
        switch(tutorialName) {
            case TUTORIAL_NAMES.BASIC: 
                currentTutorial=this.imgBasic;
                break;
            case TUTORIAL_NAMES.SHARES: 
                currentTutorial=this.imgShare;
                break;
            case TUTORIAL_NAMES.TAX: 
                currentTutorial=this.imgTax;
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
        if( this._carousel !== undefined) {
            this._carousel.snapToItem(0,true,true);
        }
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
                <Menu name="tutorialPicker" style={styles.tutorialPickerMenu} renderer={SlideInMenu}  placement='bottom' onSelect={value => this.selectNumber(value)}>
                    <MenuTrigger style={styles.tutorialPickerMenuTrigger}>
                        <Icon name="arrow-drop-down" ></Icon>
                        <Text style={{ fontSize: 18 }}>{coalesce(this.state.currentTutorialName, 'Select Tutorial')}</Text>
                        <Icon name="arrow-drop-down" ></Icon>
                    </MenuTrigger>
                    <MenuOptions style={styles.tutorialPickerMenuOptionHolder}>
                        
                        <MenuOption style={styles.tutorialPickerMenuOption} onSelect={() => this.setTutorial(TUTORIAL_NAMES.BASIC)} > 
                            <Text style={styles.tutorialPickerMenuOptionText} > {TUTORIAL_NAMES.BASIC} </Text>
                        </MenuOption>
                        <MenuOption style={styles.tutorialPickerMenuOption} onSelect={() => this.setTutorial(TUTORIAL_NAMES.SHARES)} > 
                            <Text style={styles.tutorialPickerMenuOptionText} > {TUTORIAL_NAMES.SHARES} </Text>
                        </MenuOption>
                        <MenuOption style={styles.tutorialPickerMenuOption} onSelect={() => this.setTutorial(TUTORIAL_NAMES.TAX)} > 
                            <Text style={styles.tutorialPickerMenuOptionText} > {TUTORIAL_NAMES.TAX} </Text>
                        </MenuOption>

                    </MenuOptions>
                </Menu>
                <View style={styles.carouselContainer}
                onLayout={ e => {
                    this.carouselContainerWidth = e.nativeEvent.layout.width;
                    this.carouselContainerHeight = e.nativeEvent.layout.height;
                }} >
                    {this.state.carouselInitialize &&
                    <Carousel
                        layout={'default'} 
                        data={this.state.currentTutorial}
                        renderItem={renderTutorialImage}
                        sliderWidth={this.carouselContainerWidth}
                        itemWidth={this.carouselContainerWidth-60}
                        ref={(c) => { this._carousel = c; }}
                        inactiveSlideShift={15}
                        inactiveSlideScale={0.9}
                        layoutCardOffset={50}

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
        
    },
    tutorialPickerMenu: {
        height: 'auto', 
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        flex:1 
    },
    tutorialPickerMenuTrigger: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#5e4848',
        backgroundColor: '#DDDDDD',
        borderWidth: 2,
        paddingRight: 3,
        paddingLeft: 3,
    },
    tutorialPickerMenuOptionHolder: {
        backgroundColor: '#DDDDDD',
        paddingBottom: 100
    },
    tutorialPickerMenuOption: {
        padding: 20,
        borderBottomWidth: 2,
        alignContent: 'center'
    },
    tutorialPickerMenuOptionText: {
        fontSize: 20,
        textAlign: 'center',
    },
    carouselContainer: {
        flex:9,
        flexDirection:'row',
        justifyContent: 'center',
        backgroundColor: '#F6F6F6',
    },
    imageContainer: {
        flex: 1,
        padding: 5,
    },  
    image: {
        flex: 1,
        height: undefined,
        width: undefined,
    }
})