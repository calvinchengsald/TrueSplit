import React, { Component } from 'react'
import {  StyleSheet, Text, TouchableOpacity, View, FlatList, PanResponder, Animated ,TextInput, Alert  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {  ScrollView } from 'react-native-gesture-handler';
import Item, {ITEM_VIEW_TYPE}  from '../components/Item'
import User  from '../components/User'
import uuid from 'react-uuid';
import {Icon} from 'react-native-elements'
import {DRAG_EVENT_SOURCE, TOLERANCE} from '../constants/DragEventSource';
import {standardizeNumber,parseFloatZero, parseFloatZero2,sortObjectArrayByKey, isValid, coalesce} from '../utility/utils';
import {Menu, MenuOptions, MenuOption, MenuTrigger, renderers   } from 'react-native-popup-menu';


const { Popover } = renderers;

export default class SplitScreen extends Component {

    
    point = new Animated.ValueXY();
    myComponent;
    dragEventSource;
    screenVariables = {
        scrollOffsetY: 0,
        itemlistTopOffset : 0,
        itemlistHeight: 0,
        itemHeight : 0,
        itemWidth : 0,
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
        billDetailTipWidth: 0,
        billDetailInitialize: false
    }
    billVariables = {
        billSubtotal: 0,
        billTax: "",
        billTip: 0,
        billTotal: "",
        validTax: false,
        validTip: false,
        validTotal: false,
        validSubtotal: false,
        validBillValues: true,
        validTax2: true,
        validTax3: true,
        validTotal2: false,
        allItemsSplit: true,
    }
    
    refList = {
        tax: null,
        tip: null,
        total: null,
    }
    constructor(props){
        super(props);
        this.state = {
            items: [
                // {id: uuid(), editable: true, name: 'Pokibowl', cost: '10' , taxable: true, split: false, totalShares: 0},
                // {id: uuid(), editable: true, name: 'Sushi', cost: '15' , taxable: true, split: false, totalShares: 0},
                // {id: uuid(), editable: true, name: 'Pizza', cost: '8' , taxable: true, split: false, totalShares: 0},
                // {id: uuid(), editable: true, name: 'Mozerella Sticks', cost: '10', taxable: false, split: false , totalShares: 0}
            ],
            users: [
                // {id: uuid(), name: 'Calvin', itemList: {}, confirmDelete: false, showItems: true},
                // {id: uuid(), name: 'Jenny', itemList: {}, confirmDelete: false, showItems: true},
                // {id: uuid(), name: 'Sunny', itemList: {}, confirmDelete: false, showItems: true}
            ],
            dragging: false,
            itemIdx: -1,
            userIdx: -1,
            billSubtotal: 0,
            billTotal: 0,
            billTax: 0,
            billTip: 0,
            validTax: false,
            validTip: false,
            validTotal: false,
            validSubtotal: false,
            statusInformation: "",
            showBillDetailTipText: true,
            showBillDetailTotalText: true,
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
                    // else if (this.screenVariables.itemIdx !== -1 && this.findHoverOverDelete(gestureState.moveX,gestureState.moveY)){
                    //     this.deleteItem(this.state.items[this.screenVariables.itemIdx].id);
                    // }
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

    resetAll = () => {
        Alert.alert(
            'Reset All',
            'Are you sure you want to delete all Items and Users?',
            [
                
                {text: 'Cancel', onPress: () => {}},
                {text: 'OK', onPress: () => {
                    this.billVariables.billSubtotal=0;
                    this.billVariables.billTax=0;
                    this.billVariables.billTip=0;
                    this.billVariables.billTotal=0;
                    this.setStateAll({
                        users: [],
                        items: []
                    })
                }, style: 'cancel'},
            ],
            { cancelable: true }
        )
        
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

    // No longer needed , implement a direct trash button
    // findHoverOverDelete = (x,y) => {
    //     var yy = y - this.screenVariables.rootViewOffsetY - this.screenVariables.containerViewOffsetY;
    //     var xx = x - this.screenVariables.containerViewOffsetX;
    //     if( xx>=this.screenVariables.deleteBoxPoints.x0 && xx<=this.screenVariables.deleteBoxPoints.x1 &&
    //         yy>=this.screenVariables.deleteBoxPoints.y0 && yy<=this.screenVariables.deleteBoxPoints.y1){
    //         return true
    //     }
    //     return false
    // }
    
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
        this.billVariables.billTax = parseFloatZero(this.billVariables.billTax+"");
        this.billVariables.billTip = parseFloatZero(this.billVariables.billTip+"");
        //calculate the bill subtotal
        var billSubtotal = 0.0;
        this.state.items.map( (item) => {
            billSubtotal+=parseFloatZero(item.cost)
        });
        this.billVariables.billSubtotal = parseFloat(billSubtotal);
        //calculate the bill total
        this.billVariables.billTotal = this.billVariables.billTax+this.billVariables.billTip+this.billVariables.billSubtotal;

        var users = this.state.users;
        var items = this.state.items;
        // Calcualte everything
        this.billVariables.validBillValues = this.validBillValues();
        this.billVariables.allItemsSplit = false;
        if ( this.billVariables.validBillValues  ) {
            this.billVariables.allItemsSplit = this.allItemsSplit();
            if(this.billVariables.allItemsSplit) {
                var hashedItems={};
                var taxableTotal=0;
                //reset all items split to false
                items.map( (item)=> {
                    hashedItems[item.id] = item;
                    if (hashedItems[item.id].taxable){
                        taxableTotal += parseFloatZero(hashedItems[item.id].cost);
                    }
                })
                // invalid if all items are non-taxable but user enters a tax
                this.billVariables.validTax2 = taxableTotal!==0 || this.billVariables.billTax === 0;
                // invalid if any items are taxable but user doesnt enter any tax
                this.billVariables.validTax3 = taxableTotal===0 || this.billVariables.billTax !== 0;
                this.billVariables.validTax = this.billVariables.validTax && this.billVariables.validTax2 && this.billVariables.validTax3
                users.map( (user) => {
                    user.billSubtotal = 0;
                    var billSubtotalTaxable = 0;
                    user.billTax = 0;
                    Object.keys(user.itemList).map( itemKey => {
                        user.billSubtotal += parseFloatZero(hashedItems[itemKey].cost) * user.itemList[itemKey] / hashedItems[itemKey].totalShares
                        if (hashedItems[itemKey].taxable){
                            billSubtotalTaxable += parseFloatZero(hashedItems[itemKey].cost) * user.itemList[itemKey] / hashedItems[itemKey].totalShares;
                        }
                    })
                    user.billTax = this.billVariables.billTax * parseFloatZero(billSubtotalTaxable/taxableTotal)
                    user.billTip = this.billVariables.billTip * user.billSubtotal/this.billVariables.billSubtotal
                    user.billTotal =  user.billSubtotal + user.billTax + user.billTip;

                    // console.log(user);
                    return user;
                })

                //since all these values are exact, we need to display the rounded pretty values for each user.
                //rounding can differ though and exact values will be off by 0.01cent when multiple people is involved.
                users = this.distributeTotalWithRounding(users);

            }
        }

        // use display pretty values
        this.billVariables.billSubtotal = parseFloatZero2(this.billVariables.billSubtotal)
        this.billVariables.billTax = isNaN(this.billVariables.billTax)||this.billVariables.billTax===0.00?"":parseFloat(this.billVariables.billTax).toFixed(2)
        this.billVariables.billTip = parseFloatZero2(this.billVariables.billTip)
        this.billVariables.billTotal = isNaN(this.billVariables.billTotal)||this.billVariables.billTotal===0.00?"":parseFloat(this.billVariables.billTotal).toFixed(2)


        // find status of this calculation:
        var statusInformation = "All calculated."
        statusInformation = this.findStatusInformation(statusInformation)
        this.setState({
            billSubtotal:  this.billVariables.billSubtotal,
            billTax:  this.billVariables.billTax,
            billTip:  this.billVariables.billTip,
            billTotal:  this.billVariables.billTotal,
            validTax: this.billVariables.validTax,
            validTip: this.billVariables.validTip,
            validTotal: this.billVariables.validTotal,
            validSubtotal: this.billVariables.validSubtotal,
            users: users,
            statusInformation : statusInformation,
            showBillDetailTipText: true,
        }) 
    }

    findStatusInformation = (statusInformation) => {
        if(!this.billVariables.validTax2){
            // invalid if all items are non-taxable but user enters a tax
            statusInformation = "Please fix Tax. All items are marked as non-taxable but tax is entered."
        }
        else if(!this.billVariables.validTax3){
            // invalid if any items are taxable but user doesnt enter any tax
            statusInformation = "Please fix Tax. Items are taxable but no tax is entered."
        }
        else if(!this.billVariables.validTotal2){
            // invalid if any items are taxable but user doesnt enter any tax
            statusInformation = "Values do not add up to provided Total."
        }
        else if(!this.billVariables.validBillValues) {
            statusInformation = "Please fix the values below in red."
        }
        else if(!this.billVariables.allItemsSplit){
            statusInformation = "Please split all remaining items in blue."
        } 
        return statusInformation;
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
            taxable: true,
            split: false,
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
            showItems: true,
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

    //find the total rounding extra cents, and divide faily between everyone
    distributeTotalWithRounding = (users) =>{
        var hashedUsers = {};
        // keeps track of which user had which extra cent, sorted
        var extraCentArray = [];
        var totalExtraCents = 0.0;
        
        users.map(user => {
            var extraCents = Math.abs(user.billTotal*100  - parseInt(user.billTotal*100) );
            totalExtraCents += extraCents;
            extraCentArray.push({id: user.id, extraCents: extraCents});
            user.billTotal = parseFloat(  parseInt(user.billTotal*100)/100 );
            hashedUsers[user.id] = user;
        })

        //sort the floaterArray to see which users to assign the extra cents to
        extraCentArray = sortObjectArrayByKey(extraCentArray,"extraCents");
        //just to get to the next digit of cents
        totalExtraCents+=TOLERANCE*100;
        var centsToSplit = parseInt(totalExtraCents);
        //for every extra cent to split, give them to each successive top extraCent user
        for(var i = 0; i< centsToSplit; i++){
            hashedUsers[extraCentArray[i]["id"]].billTotal += 0.01;
        }


        //store the user back into the list format
        users.map( user => {
            user = hashedUsers[user.id];
            // use display pretty values
            user.billSubtotal = parseFloatZero2(user.billSubtotal);
            user.billTip = parseFloatZero2(user.billTip);
            user.billTax = parseFloatZero2(user.billTax);
            user.billTotal = parseFloatZero2(user.billTotal);
        })

        return users;

        
                    
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

    // return true when tax>=0, tip>=0, subtotal >0 total>0, subtotal+tax+tip=total
    validBillValues = () => {
        
        // use real values for calculations
        this.billVariables.billSubtotal = parseFloatZero(this.billVariables.billSubtotal);
        this.billVariables.billTax = parseFloatZero(this.billVariables.billTax);
        this.billVariables.billTip = parseFloatZero(this.billVariables.billTip);
        this.billVariables.billTotal = parseFloatZero(this.billVariables.billTotal);


        this.billVariables.validSubtotal =  this.billVariables.billSubtotal > 0 ;
        this.billVariables.validTax =  this.billVariables.billTax >= 0 - TOLERANCE;
        this.billVariables.validTip = this.billVariables.billTip >= 0 - TOLERANCE;
        this.billVariables.validTotal = this.billVariables.billTotal > 0 && this.billVariables.billTotal >= this.billVariables.billSubtotal;

        // valid if subtotal+tax+tip = total
        this.billVariables.validTotal2 = Math.abs(this.billVariables.billSubtotal+this.billVariables.billTax+this.billVariables.billTip-this.billVariables.billTotal)<= TOLERANCE;
        this.billVariables.validTotal = this.billVariables.validTotal && this.billVariables.validTotal2;

        return (
            this.billVariables.validTotal &&
            !isNaN(this.billVariables.billSubtotal)  && this.billVariables.billSubtotal > 0 &&
            this.billVariables.validTax && this.billVariables.validTip
        );
    }
    
    focusRef = (refToFocus) => {
        if (isValid(refToFocus)){
            refToFocus.focus();
        }
    }
    //custom set state to render the tip edit textbox viewable, then focus on it
    setShowBillAndFocus = (showBillField, bool, refToFocus) => {
        this.setState({
            [showBillField]: bool
        }, () => {
            this.focusRef(this.refList[refToFocus]);
        })
    }

    // calculate the total based on the subtotal/tax/tip and converts to 2 precision string
    calculateTotal = () =>{
        return parseFloatZero2(parseFloatZero(this.billVariables.billSubtotal) + parseFloatZero(this.billVariables.billTax) + parseFloatZero(this.billVariables.billTip));
    }

    handleChangeBillValues = (type, value, calcualteAfter) => {
        this.billVariables[type] = standardizeNumber(value);
        if (calcualteAfter) {
            this.setStateVariable(type,this.billVariables[type] );
        }
        else {
            this.setState({
                [type] : this.billVariables[type]
            })
        }
    }
    componentDidMount() {
        // Print component dimensions to console
        this.myComponent.measure( (fx, fy, width, height, px, py) => {
            this.screenVariables.rootViewOffsetY = py;
        })  
    }

    render() {

        const renderedItem = ({item, index, itemViewType}) => (
            <View style={index===this.state.itemIdx && styles.dragSoruce} 
            onLayout={e => {
                this.screenVariables.itemHeight = e.nativeEvent.layout.height;
                this.screenVariables.itemWidth = e.nativeEvent.layout.width;
            }}
            key={"itemView_" +itemViewType+"_" + item.id }
            >
                <Item  key={"item_" +itemViewType+"_" + item.id } panResponder={this._panResponder}  item={item} deleteItem={this.deleteItem} editItem={this.editItem} editable={item.editable} itemViewType={itemViewType}></Item>
            </View>
        )
        
        const renderPopupItem = () => (
            <Animated.View 
            style={[styles.dragItem,
                {
                    top: this.point.getLayout().top,
                    left: this.point.getLayout().left,
                    width: this.screenVariables.itemWidth/2,
                    height: this.screenVariables.itemHeight
                }
            ]} 
            >
                <View style={{flex:1}}>
                    <Icon name='drag-handle' color='black'></Icon>
                </View>
                <Text style={{flex:3, textAlign: 'center'}}>{this.state.items[this.state.itemIdx].name}</Text>
            </Animated.View>
        )

        const renderToolbarContainer = () => (
            <View style={styles.toolbarContainer}>
                <TouchableOpacity style={styles.toolbarItem} onPress={()=>this.addItem()}>
                    <Icon name='add' color='blue'></Icon>
                    <Icon name='local-grocery-store' color='blue'></Icon>
                </TouchableOpacity>
                
                <View style={styles.toolbarReset}  >
                    <Text style={styles.resetButton} onPress={()=>this.resetAll()} >Reset All</Text>
                    {/* <Icon name="settings-backup-restore" color="red" onPress={()=>this.resetAll()}></Icon> */}
                </View>
                <TouchableOpacity style={styles.toolbarUser} onPress={()=>this.addUser()}>
                    <Icon name='add' color='blue'></Icon>
                    <Icon name='account-circle' color='blue'></Icon>
                </TouchableOpacity>
                {/* <View style={styles.itemOptions} 
                onLayout={ e => {
                    this.screenVariables.deleteBoxPoints = {
                        x0: e.nativeEvent.layout.x,
                        x1: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
                        y0: e.nativeEvent.layout.y,
                        y1: e.nativeEvent.layout.y + e.nativeEvent.layout.height,
                    }
                }}>
                    <Icon name='delete' color={this.state.dragging?'red':'black'} ></Icon>
                </View> */}
            </View>
        )

        const renderItemHeader = () => (
            <View>
                {renderedItem({
                    item: {id:'HEADER', editable: false, name: 'Item', cost: '$' , taxable: true, forceUpdate: 0, },
                    itemViewType: ITEM_VIEW_TYPE.ITEM_HEADER
                })}
            </View>
        )

        const renderItemContainer = () => (
            <KeyboardAwareScrollView
            
                resetScrollToCoords={{ x: 0, y: 0 }}
                onScroll={ e => {
                    this.screenVariables.scrollOffsetY = e.nativeEvent.contentOffset.y;
                }}
                onLayout={ e => {
                    this.screenVariables.itemlistTopOffset = e.nativeEvent.layout.y;
                    this.screenVariables.itemlistHeight = e.nativeEvent.layout.height;
                }}
                scrollEventThrottle={16}
                style={styles.itemListHolder}
            >
                {this.state.items.map( (item, index) => renderedItem({
                        item: item,
                        index: index,
                        itemViewType: ITEM_VIEW_TYPE.ITEM_ACTUAL
                    }))

                }
            </KeyboardAwareScrollView>
            
        )
        const renderBillDetail = () => (
            <View style={styles.billDetailView}>




                <View style={[styles.billDetailViewElement, styles.disabled,!this.state.validSubtotal && styles.billDetailInvalid]}>
                    <Text style={[styles.billDetailText, styles.billDetailFull]} >Sub:${this.state.billSubtotal}</Text>
                </View>
                <TouchableOpacity onPress={()=>this.focusRef(this.refList.tax)} style={[styles.billDetailViewElement,!this.state.validTax && styles.billDetailInvalid]}>
                    <Text style={[styles.billDetailText, styles.billDetailDescription]} >Tax:$</Text>
                    <TextInput ref={(c) => {   this.refList.tax = c;   }} style={[styles.billDetailText, styles.billDetailInput]} defaultValue={this.billVariables.billTax+""}  placeholder="0"  placeholderTextColor='#9c9191'  keyboardType='numeric'   value={this.state.billTax +""}  onChangeText={(text)=>this.handleChangeBillValues("billTax",text,false)} onEndEditing={()=>this.calculateBill()}/>
                </TouchableOpacity>
                {
                    this.screenVariables.billDetailInitialize && this.state.showBillDetailTipText?
                    <Menu style={[styles.billDetailViewElement,!this.state.validTip && styles.billDetailInvalid]}  renderer={Popover}  placement='top' >
                        <MenuTrigger style={[styles.billDetailMenuTriggerElement, this.screenVariables.billDetailInitialize && {width: this.screenVariables.billDetailTipWidth }]} >
                            <Text style={[styles.billDetailText, styles.billDetailDescription]} >Tip:$</Text>
                            <Text style={[styles.billDetailText, styles.billDetailInput, this.billVariables.billTip==""&&styles.placeholderText]} >{this.billVariables.billTip==""?0 :this.billVariables.billTip+""}</Text>            
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => this.handleChangeBillValues("billTip","0",true)} text='  0% : $0.00' />
                            <MenuOption onSelect={() => this.handleChangeBillValues("billTip",parseFloatZero2(this.billVariables.billSubtotal*0.10),true)} text={'10% : $' + parseFloatZero2(this.billVariables.billSubtotal*0.10)} />
                            <MenuOption onSelect={() => this.handleChangeBillValues("billTip",parseFloatZero2(this.billVariables.billSubtotal*0.15),true)} text={'15% : $' + parseFloatZero2(this.billVariables.billSubtotal*0.15)} />
                            <MenuOption onSelect={() => this.handleChangeBillValues("billTip",parseFloatZero2(this.billVariables.billSubtotal*0.18),true)} text={'18% : $' + parseFloatZero2(this.billVariables.billSubtotal*0.18)} />
                            <MenuOption onSelect={() => this.handleChangeBillValues("billTip",parseFloatZero2(this.billVariables.billSubtotal*0.20),true)} text={'20% : $' + parseFloatZero2(this.billVariables.billSubtotal*0.20)} />
                            <MenuOption onSelect={() => this.setShowBillAndFocus("showBillDetailTipText",false,"tip")} text='Custom' />
                        </MenuOptions>
                    </Menu>
                    :
                    <TouchableOpacity style={[styles.billDetailViewElement,!this.state.validTip && styles.billDetailInvalid]} onPress={()=>this.focusRef(this.refList.tip)}
                    onLayout={ e => {
                        this.screenVariables.billDetailTipWidth = e.nativeEvent.layout.width;
                        this.screenVariables.billDetailInitialize = true;
                    }}>
                        <Text style={[styles.billDetailText, styles.billDetailDescription]} >Tip:$</Text>
                        <TextInput ref={(c) => {   this.refList.tip = c;   }} style={[styles.billDetailText, styles.billDetailInput]} defaultValue={this.billVariables.billTip+""}  placeholder="0"  placeholderTextColor='#9c9191'  keyboardType='numeric'   value={this.state.billTip +""}  onChangeText={(text)=>this.handleChangeBillValues("billTip",text,false)} onEndEditing={()=>this.calculateBill()}/>               
                    </TouchableOpacity>
                }
                
                {/* {this.screenVariables.billDetailInitialize && this.state.showBillDetailTotalText?
                    <Menu style={[styles.billDetailViewElement,!this.state.validTotal && styles.billDetailInvalid]}   renderer={Popover}  placement='top' >
                        <MenuTrigger style={[styles.billDetailMenuTriggerElement, this.screenVariables.billDetailInitialize && {width: this.screenVariables.billDetailTipWidth }]} >
                            <Text style={[styles.billDetailText, styles.billDetailDescription]} >Total:$</Text>
                            <Text style={[styles.billDetailText, styles.billDetailInput, this.billVariables.billTotal==""&&styles.placeholderText]} >{this.billVariables.billTotal==""?0 :this.billVariables.billTotal+""}</Text>            
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => this.handleChangeBillValues("billTotal","0",true)} text='Clear' />
                            <MenuOption onSelect={() => this.handleChangeBillValues("billTotal",this.calculateTotal(),true)} text={"Auto: $" +this.calculateTotal()} />
                            <MenuOption onSelect={() => this.setShowBillAndFocus("showBillDetailTotalText",false,"total")} text='Enter' />
                        </MenuOptions>
                    </Menu>
                    :
                    <TouchableOpacity style={[styles.billDetailViewElement,!this.state.validTotal && styles.billDetailInvalid]} onPress={()=>this.focusRef(this.refList.total)}>
                        <Text style={[styles.billDetailText, styles.billDetailDescription]} >Total:$</Text>
                        <TextInput  ref={(c) => {  this.refList.total = c;   }} style={[styles.billDetailText, styles.billDetailInput]} defaultValue={this.billVariables.billTotal+""}  placeholder="0"  placeholderTextColor='#9c9191'  keyboardType='numeric'  value={this.state.billTotal +""} onChangeText={(text)=>this.handleChangeBillValues("billTotal",text,false)} onEndEditing={()=>this.calculateBill()} />
                    
                    </TouchableOpacity>
                } */}
                
                <View style={[styles.billDetailViewElement,styles.disabled,!this.state.validTotal && styles.billDetailInvalid]}>
                    <Text style={[styles.billDetailText, styles.billDetailFull]} >Total:${this.billVariables.billTotal==""?0 :this.billVariables.billTotal+""}</Text>
                </View>
            </View>
        )
        const renderUserContainer = () => (
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
        )
        
        const renderStatusBar = () => (
            <View style={[styles.statusBar, (!this.billVariables.allItemsSplit || !this.billVariables.validBillValues || !this.billVariables.validTax2 || !this.billVariables.validTax3) && styles.statusBarError ]}>    
                <View style={[{flex: 4}]}>
                    <Text style={[styles.statusInformation,(!this.billVariables.allItemsSplit || !this.billVariables.validBillValues || !this.billVariables.validTax2 || !this.billVariables.validTax3) && styles.statusInformationError ]}>{this.state.statusInformation} </Text>
                </View>
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
                {this.state.dragging && renderPopupItem()}
                <View  
                style={styles.container} 
                onLayout={ e => {
                    this.screenVariables.containerViewOffsetX = e.nativeEvent.layout.x;
                    this.screenVariables.containerViewOffsetY = e.nativeEvent.layout.y;
                }} 
                >
                    
                    <View style={styles.itemContainer}
                    >
                        {renderItemHeader()}
                        {renderItemContainer()}
                    </View>
                    {renderToolbarContainer()}
                    {renderUserContainer()}
                    {renderStatusBar()}
                    {renderBillDetail()}
                </View >
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
        margin: 2,
        borderColor: '#fafafa',
        borderWidth: 1,
    },
    scrollChildren: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    dragItem:{
        zIndex: 2,
        position: 'absolute',
        backgroundColor: '#9fcfed',
        borderWidth: 1,
        borderColor: '#416982',
        alignItems: 'center',
        flexDirection: 'row'
    },
    dragSoruce:{
        opacity: 0.3
    },
    itemContainer: {
        flex:1,
        borderColor: '#AA8CBD',
        backgroundColor: '#DDDDDD',
        borderWidth: 4
    },
    itemListHolder: {
        flex: 1,
    },
    toolbarContainer: {
        flexDirection: 'row',
    },
    toolbarItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#AA8CBD',
        borderColor: '#AA8CBD',
        borderBottomWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        flex:1,
    },
    toolbarReset: {
        justifyContent: 'center',
        borderColor: '#8B0046',
        backgroundColor: '#8B0046',
        borderWidth: 2,
        flex: 1,
    },
    resetButton: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
        
    },
    toolbarUser: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#A6C399',
        borderColor: '#A6C399',
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2,
        flex:1,
    },
    userListHolder: {
        backgroundColor: '#DDDDDD',
        borderColor: '#A6C399',
        borderWidth: 4,
        flex: 1
    },
    userList: {
        width: "100%"
    },
    user: {
        width: '100%',
    },
    userHighlight: {
        backgroundColor: '#ffff00',
        borderColor: '#ffff00',
        borderWidth: 2,
        paddingBottom: 2,
        paddingRight: 2,
        paddingLeft: 0,
        paddingTop: 0
    },
    billDetailView: {
        marginTop: 3,
        flexDirection: 'row'
    },
    billDetailViewElement: {
        flexDirection: 'row',
        flex: 1,
        borderColor: '#5e4848',
        borderWidth: 1,
        alignItems: 'center',
    },
    billDetailMenuTriggerElement: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
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
    },
    billDetailInvalid: {
        borderColor: '#8b0046',
        borderWidth: 3,
        
    },
    placeholderText: {
        color: '#A9A9A9',
    },
    statusBar: {
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: '#5e4848',
        borderWidth: 2,
        backgroundColor: '#d0e4ef',
        alignItems: 'center'
    },
    statusBarError: {
        backgroundColor: '#8b0000',
    },
    statusInformation: {
        justifyContent: 'center',
        textAlign: 'center'
    },
    statusInformationError: {
        color: '#ffffff'
    }


    
});

