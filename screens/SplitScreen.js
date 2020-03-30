import React, { useState,Component } from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList, PanResponder, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import Item  from '../components/Item'
import User  from '../components/User'
import { useIsFocused } from '@react-navigation/native';
import uuid from 'react-uuid';
import {Icon} from 'react-native-elements'
import Draggable from 'react-native-draggable';
import { render } from 'react-dom';


export default class SplitScreen extends Component {

    point = new Animated.ValueXY();
    scrollOffsetY = 0;
    itemlistTopOffset = 0;
    itemHeight = 0;
    currentIdx = -1;
    rootViewOffsetY = 0;
    myComponent;
    constructor(props){
        super(props);
        this.state = {
            items: [
                {id: uuid(), editable: true, name: 'Pokibowl', cost: '10' , taxable: true, forceUpdate: 0},
                {id: uuid(), editable: true, name: 'Sushi', cost: '12.45' , taxable: true, forceUpdate: 0},
                {id: uuid(), editable: true, name: 'Milk Tea', cost: '4.42', taxable: false, forceUpdate: 0 }
            ],
            users: [
                {id: uuid(), name: 'Calvin', itemList: [], confirmDelete: false},
                {id: uuid(), name: 'Jenny', itemList: [], confirmDelete: true}
            ],
            dragging: false,
            draggingIdx: -1,
        }
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      
            onPanResponderGrant: (evt, gestureState) => {
              // The gesture has started. Show visual feedback so the user knows
              // what is happening!
              // gestureState.d{x,y} will be set to zero now
              this.currentIdx = this.findIndexFromY(gestureState.y0);
              this.setState({ dragging: true, draggingIdx: this.currentIdx});
            },
            onPanResponderMove: (evt, gestureState) => {
                Animated.event([{y: this.point.y},{x: this.point.x}])({y:gestureState.moveY-this.rootViewOffsetY-this.itemHeight/2},{x:gestureState.moveX});
              // The most recent move distance is gestureState.move{X,Y}
              // The accumulated gesture distance since becoming responder is
              // gestureState.d{x,y}
            },
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderRelease: (evt, gestureState) => {
              // The user has released all touches while this view is the
              // responder. This typically means a gesture has succeeded
              this.currentIdx  = -1;
              this.setState({ dragging: false, draggingIdx: this.currentIdx});
            },
            onPanResponderTerminate: (evt, gestureState) => {
              // Another component has become the responder, so this gesture
              // should be cancelled
              this.currentIdx  = -1;
              this.setState({ dragging: false, draggingIdx: this.currentIdx});
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
              // Returns whether this component should block native components from becoming the JS
              // responder. Returns true by default. Is currently only supported on android.
              return true;
            },
        })
        
    }
    setStateVaraible = (state, value) => {
        this.setState({
            ...this.state,
            [state] : value
        })
    }
    findIndexFromY = (y) => {
        const value = Math.floor( (this.scrollOffsetY + y - this.itemlistTopOffset -this.rootViewOffsetY) / this.itemHeight );
        if(value<0) {
            return 0;
        }
        if(value> this.state.items.length-1){
            return this.state.items.length-1;
        }
        return value;
    }
    
   
    deleteItem = (id) => {
        var newItems = this.state.items.filter(item => item.id != id);
        this.setState({
            items: newItems
        })
    }
    addItem = () =>{
        console.log("pushed add item");
        var newItem = {
            id: uuid(),
            editable: true,
            name: '',
            cost: '',
            taxable: true
        };
        var itemList = this.state.items;
        itemList.push(newItem);
        this.setState({
            items: itemList
        })
    }
    
    editItem = (updatedItem) => {
        var updatedList = this.state.items.map( item => {
            if( item.id != updatedItem.id) {
                return item;
            }
            return updatedItem;
        });
        this.setState({
            items: updatedList
        })
    }
    deleteUser = (id) => {
        var newItems = this.state.users.filter(item => item.id != id);
        this.setState({
            users: newItems
        })
    }
    addUser = () =>{
        console.log("pushed add item");
        var newItem = {
            id: uuid(),
            name: '',
            itemList: []
        };
        var itemList = this.state.users;
        itemList.push(newItem);
        this.setState({
            users: itemList
        })
    }
    
    editUser = (updatedItem) => {
        var updatedList = this.state.users.map( item => {
            if( item.id != updatedItem.id) {
                return item;
            }
            return updatedItem;
        });
        this.setState({
            users: updatedList
        })
    }
    componentDidMount() {
        // Print component dimensions to console
        this.myComponent.measure( (fx, fy, width, height, px, py) => {
            this.rootViewOffsetY = py;
        })  
    }

    render() {
        const renderedItem = ({item, index}) => (
            <View style={index===this.state.draggingIdx && styles.dragSoruce}>
                <Item  key={item.id} panResponder={this._panResponder}  item={item} deleteItem={this.deleteItem} editItem={this.editItem} editable={item.editable}></Item>
            </View>
        )
        return (
            <View style={styles.superContainer}
                ref={view => { this.myComponent = view; }}
                onLayout={event => {
                  }}
            >
                {this.state.dragging && 
                    <Animated.View style={[styles.dragItem,
                            {
                                top: this.point.getLayout().top,
                                left: this.point.getLayout().left
                            }
                        ]} 
                    >
                        <View style={{width:'auto'}}
                            onLayout={e => {
                                this.itemHeight = e.nativeEvent.layout.height;
                            }}
                        >

                            {renderedItem({
                                item: this.state.items[this.state.draggingIdx]
                            })}
                        </View>
                    </Animated.View>
                }
                <View style={styles.container}  >
                    
                    <View style={styles.itemOptionsContainter}>
                        <TouchableOpacity style={styles.itemOptions} onPress={()=>this.addItem()}>
                            <Icon name='add' color='blue'></Icon>
                        </TouchableOpacity>
                        <View style={styles.itemOptions} >
                            <Icon name='delete' color='red'></Icon>
                        </View>
                    </View>
                    {/* <ScrollView style={styles.itemListHolderView} contentContainerStyle={styles.scrollChildren}>
                        <View style={styles.itemList}>
                            {this.state.items.map( (item) => (
                                renderedItem({item})
                                    
                            ))}
                        </View>
                    </ScrollView> */}
                    {renderedItem({
                            item: {id:'HEADER', editable: false, name: 'Name', cost: '$' , taxable: true, forceUpdate: 0}
                    })}
                    <FlatList 
                        scrollEnabled={!this.state.dragging}
                        style={styles.itemList}
                        data={this.state.items}
                        renderItem={renderedItem}
                        onScroll={ e => {
                            this.scrollOffsetY = e.nativeEvent.contentOffset.y;
                        }}
                        onLayout={ e => {
                            this.itemlistTopOffset = e.nativeEvent.layout.y;
                        }}
                        scrollEventThrottle={16}
                    />
        
                    {/* <Draggable  renderColor='black' renderText='A' isCircle shouldReverse />  */}
                    
                    <ScrollView style={styles.userListHolderView} contentContainerStyle={styles.scrollChildren}>
                        
                        <View style={styles.userList} >
                            {this.state.users.map( (user) => (
                                <User key={user.id} user={user} deleteUser={this.deleteUser} editUser={this.editUser}></User>
                            ))}
                        </View>
                    </ScrollView>
                    
        
                </View>
            </View>
            
        )
    }
    
}
    
  
const styles = StyleSheet.create({
    superContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        margin: 10,
        borderColor: '#FF0000',
        borderWidth: 1,
    },
    scrollChildren: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    itemOptionsContainter: {
        flexDirection: 'row'
    },
    itemListHolderView: {
    },
    userListHolderView: {
        flex: 1,
    },
    itemOptions: {
        backgroundColor: '#242020',
        borderColor: '#5e4848',
        borderWidth: 2,
        flex: 1
    },
    itemList: {
        flex: 1,
        borderColor: '#300429',
        borderWidth: 1,
    },
    userList: {
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        borderColor: '#300429',
        borderWidth: 1,
    },
    dragItem:{
        zIndex: 2,
        position: 'absolute',
        width: '100%'
    },
    dragSoruce:{
        opacity: 0.3
    }
});

