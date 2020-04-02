import React, { useState,Component } from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList, PanResponder, Animated ,TextInput} from 'react-native';
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
import {DRAG_EVENT_SOURCE} from '../constants/DragEventSource';


export default class SplitScreen extends Component {

    
    point = new Animated.ValueXY();
    myComponent;
    dragEventSource;
    screenVariables = {
        scrollOffsetY: 0,
        itemlistTopOffset : 0,
        itemlistHeight: 0,
        itemHeight : 0,
        currentIdx : -1,
        rootViewOffsetY : 0,
        userlistTopOffset : 0,
        userlistHeight: 0,
        userlistScrollOffsetY: 0,
        userBoxPoints: [],
        userIdx: -1,
        deleteBoxPoints: { x0: 0, y0:0, x1:0, y1:0 },
        containerViewOffsetY: 0,
        containerViewOffsetX: 0,
    }
    billVariables = {
        billSubtotal: 0,
        billTotal: 0,
        billTax: 0,
        billTip: 0,
    }
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
            itemIdx: -1,
            userIdx: -1,
            billSubtotal: 0,
            billTotal: 0,
            billTax: 0,
            billTip: 0,
        }
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      
            onPanResponderGrant: (evt, gestureState) => {
                //find what is the source of the drag
                this.dragEventSource = this.findDragEventSource(gestureState.x0, gestureState.y0);
                if(this.dragEventSource === DRAG_EVENT_SOURCE.ITEM){
                    //find which item is being selected
                    this.screenVariables.currentIdx = this.findItemIndexFromY(gestureState.y0);
                    this.setState({ dragging: true, itemIdx: this.screenVariables.currentIdx});
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                
                if(this.dragEventSource === DRAG_EVENT_SOURCE.ITEM){
                    //update the pointer that will be the start of the animated popup box
                    Animated.event([{y: this.point.y},{x: this.point.x}])({y:gestureState.moveY-this.screenVariables.rootViewOffsetY-this.screenVariables.itemHeight/2},{x:gestureState.moveX});
                    //find which user is being hoverd over and highlight them
                    this.screenVariables.userIdx = this.findUserIndexFromXY(gestureState.moveX, gestureState.moveY);
                    if(this.screenVariables.userIdx !== this.state.userIdx) {
                        this.setStateVaraible("userIdx", this.screenVariables.userIdx);
                    }
                }

            },
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderRelease: (evt, gestureState) => {
                
                
                var updatedUsers = this.state.users
                if(this.dragEventSource === DRAG_EVENT_SOURCE.ITEM){
                    //add this item into the user's list
                    if(this.screenVariables.userIdx !== -1 && this.screenVariables.currentIdx !== -1 ){
                        var updatedUsers = this.state.users
                        updatedUsers[this.screenVariables.userIdx].itemList.push(this.state.items[this.screenVariables.currentIdx].id);
                    }
                    // hoverd over delete button?
                    else if (this.screenVariables.currentIdx !== -1 && this.findHoverOverDelete(gestureState.moveX,gestureState.moveY)){
                        this.deleteItem(this.state.items[this.screenVariables.currentIdx].id);
                    }
                }

                
                // reset all dragging associated variables
                this.screenVariables.currentIdx  = -1;
                this.screenVariables.userIdx  = -1;
                this.setState({ dragging: false, itemIdx: this.screenVariables.currentIdx, userIdx: this.screenVariables.userIdx, users: updatedUsers});
            },
            onPanResponderTerminate: (evt, gestureState) => {
              
                
                // reset all dragging associated variables
                this.screenVariables.currentIdx  = -1;
                this.screenVariables.userIdx  = -1;
                this.setState({ dragging: false, itemIdx: this.screenVariables.currentIdx, userIdx: this.screenVariables.userIdx});
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

    // find the source that is initiating this drag
    findDragEventSource = (x,y) => {
        var yy = y - this.screenVariables.itemlistTopOffset -this.screenVariables.rootViewOffsetY - this.screenVariables.containerViewOffsetY;
        if( yy>=0 && yy<= this.screenVariables.itemlistHeight ){
            return DRAG_EVENT_SOURCE.ITEM;
        }
        yy = y - this.screenVariables.userlistTopOffset -this.screenVariables.rootViewOffsetY - this.screenVariables.containerViewOffsetY;
        var xx = x - this.screenVariables.containerViewOffsetX;
        if(yy >= 0 && yy <= this.screenVariables.userlistHeight && xx >= 0 && xx <= this.screenVariables.userlistWidth){
            return DRAG_EVENT_SOURCE.ITEM_COPY;
        }

        return "";
    }

    findHoverOverDelete = (x,y) => {
        var yy = y - this.screenVariables.rootViewOffsetY - this.screenVariables.containerViewOffsetY;
        var xx = x - this.screenVariables.containerViewOffsetX;
        if( xx>=this.screenVariables.deleteBoxPoints.x0 && xx<=this.screenVariables.deleteBoxPoints.x1 &&
            yy>=this.screenVariables.deleteBoxPoints.y0 && yy<=this.screenVariables.deleteBoxPoints.y1){
            return true
        }
        return false
    }
    
    // From the X,Y coordinate of the initial drag point, find what item is the drag being applied to
    findItemIndexFromY = (y) => {
        // console.log("this.scrollOffsetY: " + this.screenVariables.scrollOffsetY)
        // console.log("this.y: " + y)
        // console.log("this.itemlistTopOffset: " + this.screenVariables.itemlistTopOffset)
        // console.log("this.rootViewOffsetY: " + this.screenVariables.rootViewOffsetY)
        // console.log("this.itemHeight: " + this.screenVariables.itemHeight)
        const value = Math.floor( (this.screenVariables.scrollOffsetY + y - this.screenVariables.itemlistTopOffset -this.screenVariables.rootViewOffsetY - this.screenVariables.containerViewOffsetY) / this.screenVariables.itemHeight );
        // console.log("this.value: " + value)
        // console.log("this.this.state.items.length-1: " + (this.state.items.length-1))
        if(value<0) {
            return 0;
        }
        if(value> this.state.items.length-1){
            return this.state.items.length-1;
        }
        return value;
    }

    // From the X,Y coordinate of the dragging item, find what user it is hovering over
    findUserIndexFromXY = (x, y ) => {

        var userBoxPoints = this.screenVariables.userBoxPoints;
        var yy = y - this.screenVariables.userlistTopOffset - this.screenVariables.rootViewOffsetY - this.screenVariables.containerViewOffsetY;
        var xx = x - this.screenVariables.containerViewOffsetX;
        var yyy = 0;
        var xxx = xx;
        var idx = -1;
        for( var i = 0; i < userBoxPoints.length; i++) {
            yyy = this.screenVariables.userlistScrollOffsetY + yy;
            if( yyy>= userBoxPoints[i].y0 && yyy<= userBoxPoints[i].y1 && xxx>= userBoxPoints[i].x0 && xxx<= userBoxPoints[i].x1) {
                
                //is it also within our bounds of the user list view?
                if(yy >= 0 && yy <= this.screenVariables.userlistHeight && xx >= 0 && xx <= this.screenVariables.userlistWidth){
                    // is it also within the bounds of our available users
                    idx = i < this.state.users.length ? i : -1;
                }
                break;
            }
        }

        // console.log ( x + "              " +  y);
        // console.log( "X:" + x + "/Y:" + y + " = " +idx);
        return idx;
    }
    
    calculateBill = () => {
        this.billVariables.billSubtotal;
    }

    deleteItem = (id) => {
        var newItems = this.state.items.filter(item => item.id != id);
        var newUsers = this.state.users;
        newUsers = newUsers.map( (user) => {
            user.itemList = user.itemList.filter( item => item != id);
            return user;
        })
        this.setState({
            items: newItems,
            users: newUsers
        })

        
    }
    addItem = () =>{
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
            this.screenVariables.rootViewOffsetY = py;
        })  
    }

    render() {
        // console.log("in main render");
        // console.log(this.state.items);
        const renderedItem = ({item, index}) => (
            <View style={index===this.state.itemIdx && styles.dragSoruce} 
            >
                <Item  key={item.id} panResponder={this._panResponder}  item={item} deleteItem={this.deleteItem} editItem={this.editItem} editable={item.editable}></Item>
            </View>
        )
        
        return (
            <View style={styles.superContainer}
            ref={view => { this.myComponent = view; }}
            onLayout={event => {
                this.myComponent.measure( (fx, fy, width, height, px, py) => {
                    this.screenVariables.rootViewOffsetY = py;
                })
            }}
            >
                {this.state.dragging && 
                <Animated.View 
                style={[styles.dragItem,
                    {
                        top: this.point.getLayout().top,
                        left: this.point.getLayout().left
                    }
                ]} 
                >
                    <View style={{width:'auto'}}
                    onLayout={e => {
                        this.screenVariables.itemHeight = e.nativeEvent.layout.height;
                    }}>

                        {renderedItem({
                            item: this.state.items[this.state.itemIdx]
                        })}
                    </View>
                </Animated.View>
                }
                <View style={styles.container} 
                onLayout={ e => {
                    this.screenVariables.containerViewOffsetX = e.nativeEvent.layout.x;
                    this.screenVariables.containerViewOffsetY = e.nativeEvent.layout.y;
                }} 
                >
                    
                    <View style={styles.itemOptionsContainter}>
                        <TouchableOpacity style={styles.itemOptions} onPress={()=>this.addItem()}>
                            <Icon name='add' color='blue'></Icon>
                            <Icon name='local-grocery-store' color='blue'></Icon>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemOptions} onPress={()=>this.addUser()}>
                            <Icon name='add' color='blue'></Icon>
                            <Icon name='account-circle' color='blue'></Icon>
                        </TouchableOpacity>
                        <View style={styles.itemOptions} 
                        onLayout={ e => {
                            this.screenVariables.deleteBoxPoints = {
                                x0: e.nativeEvent.layout.x,
                                x1: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
                                y0: e.nativeEvent.layout.y,
                                y1: e.nativeEvent.layout.y + e.nativeEvent.layout.height,
                            }
                        }}>
                            <Icon name='delete' color={this.state.dragging?'red':'black'} ></Icon>
                        </View>
                    </View>

                    {renderedItem({
                            item: {id:'HEADER', editable: false, name: 'Name', cost: '$' , taxable: true, forceUpdate: 0}
                    })}
                    <FlatList 
                        scrollEnabled={!this.state.dragging}
                        style={styles.itemListHolder}
                        data={this.state.items}
                        renderItem={renderedItem}
                        onScroll={ e => {
                            this.screenVariables.scrollOffsetY = e.nativeEvent.contentOffset.y;
                        }}
                        onLayout={ e => {
                            this.screenVariables.itemlistTopOffset = e.nativeEvent.layout.y;
                            this.screenVariables.itemlistHeight = e.nativeEvent.layout.height;
                        }}
                        scrollEventThrottle={16}
                    />
                    <View style={styles.billDetailView}>
                        <View style={[styles.billDetailViewElement, styles.disabled]}>
                            <Text style={styles.billDetailInputElement} >Subtotal:${this.state.billSubtotal}</Text>
                        </View>
                        <View style={styles.billDetailViewElement}>
                            <TextInput style={styles.billDetailInputElement} defaultValue={this.billVariables.billTax}   placeholder="Tax"  placeholderTextColor='#9c9191'  keyboardType='numeric'  onChangeText={(text)=>this.billVariables.billTax=text}/>
                        </View>
                        <View style={[styles.billDetailViewElement, styles.disabled]}>
                            <Text style={styles.billDetailInputElement} >Tip:${this.state.billTip}</Text>
                        </View>
                        <View style={styles.billDetailViewElement}>
                            <TextInput style={styles.billDetailInputElement} defaultValue={this.billVariables.billTotal}   placeholder="Total"  placeholderTextColor='#9c9191'  keyboardType='numeric'  onChangeText={(text)=>this.billVariables.billTotal=text}/>
                        </View>
                    </View>
                    <ScrollView style={styles.userListHolder} contentContainerStyle={styles.scrollChildren}
                        onScroll={ e => {
                            this.screenVariables.userlistScrollOffsetY = e.nativeEvent.contentOffset.y;
                        }}
                        onLayout={ e => {
                            this.screenVariables.userlistTopOffset = e.nativeEvent.layout.y;
                            this.screenVariables.userlistHeight = e.nativeEvent.layout.height;
                            this.screenVariables.userlistWidth = e.nativeEvent.layout.width;
                        }}
                        scrollEventThrottle={16}
                    >
                        
                        <View style={styles.userList} >
                            {this.state.users.map( (user, index) => (
                                <View  key={user.id} style={[styles.user , index==this.screenVariables.userIdx && styles.userHighlight]}
                                onLayout={ e => {
                                    this.screenVariables.userBoxPoints[index] = {
                                        x0: e.nativeEvent.layout.x,
                                        x1: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
                                        y0: e.nativeEvent.layout.y,
                                        y1: e.nativeEvent.layout.y + e.nativeEvent.layout.height,
                                    }
                                }}
                                > 
                                    <User key={user.id} user={user} panResponder={this._panResponder} deleteUser={this.deleteUser} editUser={this.editUser} items={this.state.items}></User>
                                </View>
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
    userListHolder: {
        flex: 1,
        borderColor: '#300429',
        borderWidth: 1
    },
    userList: {
        borderColor: '#300429',
        borderWidth: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    user: {
        width: "50%",
        borderColor: '#300429',
        borderWidth: 1,
    },
    userHighlight: {
        backgroundColor: '#ffff00'
    },
    itemOptions: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#5e4848',
        borderWidth: 2,
        flex: 1
    },
    itemListHolder: {
        flex: 1,
        borderColor: '#300429',
        borderWidth: 1
    },
    dragItem:{
        zIndex: 2,
        position: 'absolute',
        width: '100%'
    },
    dragSoruce:{
        opacity: 0.3
    },
    billDetailView: {
        flexDirection: 'row'
    },
    billDetailViewElement: {
        flexDirection: 'row',
        flex: 1,
        borderColor: '#5e4848',
        borderWidth: 1,
        alignItems: 'center',
    },
    disabled: {
        backgroundColor: '#d3d3d3',
    },
    billDetailInputElement: {
        textAlign: 'center',
        flex: 1,
        fontSize: 10
    }
});

