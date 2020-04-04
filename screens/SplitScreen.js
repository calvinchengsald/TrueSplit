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
import {standardizeNumber } from '../utility/utils'


export default class SplitScreen extends Component {

    
    point = new Animated.ValueXY();
    myComponent;
    dragEventSource;
    screenVariables = {
        scrollOffsetY: 0,
        itemlistTopOffset : 0,
        itemlistHeight: 0,
        itemHeight : 0,
        itemIdx : -1,
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
        billTax: "",
        billTip: 0,
        billTotal: "",
    }
    constructor(props){
        super(props);
        this.state = {
            items: [
                {id: uuid(), editable: true, name: 'Pokibowl', cost: '10' , taxable: true, split: false, totalShares: 0},
                {id: uuid(), editable: true, name: 'Sushi', cost: '12.45' , taxable: true, split: false, totalShares: 0},
                {id: uuid(), editable: true, name: 'Milk Tea', cost: '4.42', taxable: false, split: false , totalShares: 0}
            ],
            users: [
                {id: uuid(), name: 'Calvin', itemList: {}, confirmDelete: false},
                {id: uuid(), name: 'Jenny', itemList: {}, confirmDelete: false}
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
                    this.screenVariables.itemIdx = this.findItemIndexFromY(gestureState.y0);
                    this.setStateVariable2("dragging", true, "itemIdx", this.screenVariables.itemIdx);
                }
            },
            onPanResponderMove: (evt, gestureState) => {
                
                if(this.dragEventSource === DRAG_EVENT_SOURCE.ITEM){
                    //update the pointer that will be the start of the animated popup box
                    Animated.event([{y: this.point.y},{x: this.point.x}])({y:gestureState.moveY-this.screenVariables.rootViewOffsetY-this.screenVariables.itemHeight/2},{x:gestureState.moveX});
                    //find which user is being hoverd over and highlight them
                    this.screenVariables.userIdx = this.findUserIndexFromXY(gestureState.moveX, gestureState.moveY);
                    if(this.screenVariables.userIdx !== this.state.userIdx) {
                        this.setStateVariable("userIdx", this.screenVariables.userIdx);
                    }
                }

            },
            onPanResponderTerminationRequest: (evt, gestureState) => false,
            onPanResponderRelease: (evt, gestureState) => {
                
                
                var updatedUsers = this.state.users
                if(this.dragEventSource === DRAG_EVENT_SOURCE.ITEM){
                    //add this item into the user's list
                    if(this.screenVariables.userIdx !== -1 && this.screenVariables.itemIdx !== -1 ){
                        var updatedUser = this.state.users[this.screenVariables.userIdx]
                        if (updatedUser.itemList.hasOwnProperty(this.state.items[this.screenVariables.itemIdx].id)) {
                            updatedUser.itemList[this.state.items[this.screenVariables.itemIdx].id] += 1;
                        } 
                        else {
                            updatedUser.itemList[this.state.items[this.screenVariables.itemIdx].id] = 1;
                        }
                        // updatedUser.itemList.push(this.state.items[this.screenVariables.itemIdx].id);
                        this.editUser(updatedUser)
                    }
                    // hoverd over delete button?
                    else if (this.screenVariables.itemIdx !== -1 && this.findHoverOverDelete(gestureState.moveX,gestureState.moveY)){
                        this.deleteItem(this.state.items[this.screenVariables.itemIdx].id);
                    }
                }

                
                // reset all dragging associated variables
                this.screenVariables.itemIdx  = -1;
                this.screenVariables.userIdx  = -1;
                this.setStateVariable3("dragging", false, "itemIdx", this.screenVariables.itemIdx, "userIdx" ,this.screenVariables.userIdx );
            },
            onPanResponderTerminate: (evt, gestureState) => {
              
                
                // reset all dragging associated variables
                this.screenVariables.itemIdx  = -1;
                this.screenVariables.userIdx  = -1;
                this.setStateVariable3("dragging", false, "itemIdx", this.screenVariables.itemIdx, "userIdx" ,this.screenVariables.userIdx );
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
              // Returns whether this component should block native components from becoming the JS
              // responder. Returns true by default. Is currently only supported on android.
              return true;
            },
        })
        
    }
    setStateVariable = (state, value) => {
        var updatedState = this.state;
        updatedState[state] = value;
        this.setStateAll(updatedState)
    }
    setStateVariable2 = (state, value, state2, value2) => {
        var updatedState = this.state;
        updatedState[state] = value;
        updatedState[state2] = value2;
        this.setStateAll(updatedState)
    }
    setStateVariable3 = (state, value, state2, value2, state3, value3) => {
        var updatedState = this.state;
        updatedState[state] = value;
        updatedState[state2] = value2;
        updatedState[state3] = value3;
        this.setStateAll(updatedState)
    }
    setStateAll = (state) => {
            this.setState({...state}, 
            () => {
                this.calculateBill()
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
        const value = Math.floor( (this.screenVariables.scrollOffsetY + y - this.screenVariables.itemlistTopOffset -this.screenVariables.rootViewOffsetY - this.screenVariables.containerViewOffsetY) / this.screenVariables.itemHeight );
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
        return idx;
    }
    
    calculateBill = () => {
        //standardize all the bad values recieved from user
        this.billVariables.billTax = parseFloat(standardizeNumber(this.billVariables.billTax+""));
        this.billVariables.billTotal = parseFloat(standardizeNumber(this.billVariables.billTotal+""));
        //calculate the bill subtotal
        var billSubtotal = 0.0;
        this.state.items.map( (item) => {
            billSubtotal+=parseFloat(item.cost)
        });
        this.billVariables.billSubtotal = parseFloat(billSubtotal);
        //calcualte the tip from the above variables
        this.billVariables.billTip = parseFloat(this.billVariables.billTotal -this.billVariables.billSubtotal -this.billVariables.billTax);
        

        // Calcualte everything
        if (this.allItemsSplit() ) {
            // use real values for calculations
            this.billVariables.billSubtotal = isNaN(this.billVariables.billSubtotal)?0:this.billVariables.billSubtotal.toFixed(2)
            this.billVariables.billTax = isNaN(this.billVariables.billTax)?0:this.billVariables.billTax.toFixed(2)
            this.billVariables.billTip = isNaN(this.billVariables.billTip)?0:this.billVariables.billTip.toFixed(2)
            this.billVariables.billTotal = isNaN(this.billVariables.billTotal)?0:this.billVariables.billTotal.toFixed(2)
        }



        // use display pretty values
        this.billVariables.billSubtotal = isNaN(this.billVariables.billSubtotal)?0:parseFloat(this.billVariables.billSubtotal).toFixed(2)
        this.billVariables.billTax = isNaN(this.billVariables.billTax)||this.billVariables.billTax===0.00?"":parseFloat(this.billVariables.billTax).toFixed(2)
        this.billVariables.billTip = isNaN(this.billVariables.billTip)?0:parseFloat(this.billVariables.billTip).toFixed(2)
        this.billVariables.billTotal = isNaN(this.billVariables.billTotal)||this.billVariables.billTotal===0.00?"":parseFloat(this.billVariables.billTotal).toFixed(2)

        this.setState({
            billSubtotal:  this.billVariables.billSubtotal,
            billTax:  this.billVariables.billTax,
            billTip:  this.billVariables.billTip,
            billTotal:  this.billVariables.billTotal,
        }) 
    }

    deleteItem = (id) => {
        var newItems = this.state.items.filter(item => item.id != id);
        var newUsers = this.state.users;
        newUsers = newUsers.map( (user) => {
            if (user.itemList.hasOwnProperty(id)){
                delete user.itemList[id]
            }
            return user;
        })
        this.setStateVariable2(
            "items", newItems,
            "users", newUsers
        )

        
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
        this.setStateVariable(
            "items" , itemList
        )
    }
    
    editItem = (updatedItem) => {
        var updatedList = this.state.items.map( item => {
            if( item.id != updatedItem.id) {
                return item;
            }
            return updatedItem;
        });
        this.setStateVariable(
            "items" , updatedList
        )
    }
    deleteUser = (id) => {
        var newUsers = this.state.users.filter(user => user.id != id);
        var updatedItems = this.recalculateSplit(newUsers, this.state.items);
        this.setStateVariable(
            "users" , newUsers,
            "items" , updatedItems
        )
    }
    addUser = () =>{
        var newUser = {
            id: uuid(),
            name: '',
            itemList: {}
        };
        var userList = this.state.users;
        userList.push(newUser);
        this.setStateVariable(
            "users" , userList
        )
    }
    editUser = (updatedUser) => {

        //update the user
        var updatedList = this.state.users.map( user => {
            if( user.id != updatedUser.id) {
                return user;
            }
            return updatedUser;
        });

        // recalculate the split
        var updatedItems = this.recalculateSplit(updatedList, this.state.items);


        this.setStateVariable2(
            "users" , updatedList,
            "items" , updatedItems
        )
    }

    //recalculate the split and total shares for each item
    recalculateSplit = (updatedUsers, updatedItems) => {
        //create a temp hash for all the items
        var hashedItems={};
        //reset all items split to false
        updatedItems.map( (item)=> {
            item.split = false;
            item.totalShares = 0;
            hashedItems[item.id] = item;
        })


        //recalculate the split for every user
        updatedUsers.map( user => {
            Object.keys(user.itemList).map (itemKey =>{
                hashedItems[itemKey].split = true;
                hashedItems[itemKey].totalShares += user.itemList[itemKey]
            })
        })

        //store the hash back into the list format
        updatedItems.map( item => {
            item = hashedItems[item.id];
        })
        return updatedItems;
    }
    
    allItemsSplit = () => {
        var allSplit = true;
        this.state.items.map( item => {
            if (item.split === false) {
                allSplit=false;
            } 
        })
        return allSplit
    }
    componentDidMount() {
        // Print component dimensions to console
        this.myComponent.measure( (fx, fy, width, height, px, py) => {
            this.screenVariables.rootViewOffsetY = py;
        })  
    }

    render() {
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
                            <Text style={[styles.billDetailText, styles.billDetailFull]} >Subtotal:${this.state.billSubtotal}</Text>
                        </View>
                        <View style={styles.billDetailViewElement}>
                            <Text style={[styles.billDetailText, styles.billDetailDescription]} >Tax:$</Text>
                            <TextInput style={[styles.billDetailText, styles.billDetailInput]} defaultValue={this.billVariables.billTax+""}  placeholder="0"  placeholderTextColor='#9c9191'  keyboardType='numeric'  onChangeText={(text)=>this.billVariables.billTax=text} onEndEditing={(obj)=> this.calculateBill() }/>
                        </View>
                        <View style={[styles.billDetailViewElement, styles.disabled]}>
                            <Text style={[styles.billDetailText, styles.billDetailFull]} >Tip:${this.state.billTip}</Text>
                        </View>
                        <View style={styles.billDetailViewElement}>
                            <Text style={[styles.billDetailText, styles.billDetailDescription]} >Total:$</Text>
                            <TextInput style={[styles.billDetailText, styles.billDetailInput]} defaultValue={this.billVariables.billTotal+""}  placeholder="0"  placeholderTextColor='#9c9191'  keyboardType='numeric'  onChangeText={(text)=>this.billVariables.billTotal=text} onEndEditing={(obj)=> this.calculateBill() } />
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
    billDetailText: {
        fontSize: 10
    },
    billDetailFull: {
        textAlign: 'center',
        flex: 1,
    },
    billDetailDescription: {
        textAlign: 'right',
        flex: 1,
    },
    billDetailInput: {
        textAlign: 'left',
        flex: 1,
    }


    
});

