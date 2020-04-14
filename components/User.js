import React from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList,TextInput, Alert } from 'react-native';
import {Icon} from 'react-native-elements'
import Item ,{ITEM_VIEW_TYPE } from './Item'
import {Collapse,CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';
import {coalesce } from '../utility/utils'

const User =  ({user, deleteUser,editUser, items,panResponder }) => {
    var shallowUser = {
        id : user.id,
        name : user.name,
        confirmDelete : user.confirmDelete,
        itemList: user.itemList,
        billSubtotal: user.billSubtotal,
        billTax: user.billTax,
        billTip: user.billTip,
        billTotal: user.billTotal,
        showItems: user.showItems,
    };
    var userItems = getUserItems(shallowUser, items);

    return (
        <View style={styles.user}>
            
                
            <View style={styles.userItemView}>
                <Collapse isCollapsed={true} >
                    <CollapseHeader style={styles.userView}>
                        <View style={{flex: 1}}>
                            <Icon  color='black' name='list' ></Icon>
                        </View>
                        <View  style={{flex: 4}}> 
                            <TextInput style={{textAlign: 'left'}} defaultValue={shallowUser.name}   placeholder="Name"  placeholderTextColor='#9c9191'    onChangeText={(text)=>shallowUser.name=text} onEndEditing={()=> setUserName(shallowUser, editUser) }/>
                        </View>
                        <Text  style={{flex: 3}}>
                            {"Total: $" + coalesce(shallowUser.billTotal,'N/A') }
                        </Text>
                        <View style={{flex: 1}}>
                            <Icon  color='#8b0000' name='delete' onPress={()=>confirmDeleteUser(deleteUser,shallowUser)}></Icon>
                        </View>
                    </CollapseHeader>
                    <CollapseBody>
                        {userItems.length===0 && 
                            <Text style={ styles.item}> Drag items here</Text>

                        }
                        {userItems.map(item => (
                                    <Item key={item.id} item={item} editable={false} panResponder={panResponder} shares={shallowUser.itemList[item.id]} itemViewType={ITEM_VIEW_TYPE.USER_ITEM_ACTUAL} deleteItemFromUser={(itemId)=>deleteItemFromUser(shallowUser, itemId, editUser)}></Item>
                        ))}
                    </CollapseBody>
                    
                </Collapse>
            </View>
            
            {/* <Item key="SUBTOTAL" item={ {id:"SUBTOTAL", name:"SUBTOTAL" , cost:shallowUser.billSubtotal, editable:false}} editable={false} deleteItemFromUser={null}></Item>
            <Item key="TAX" item={ {id:"TAX", name:"TAX" , cost:shallowUser.billTax, editable:false}} editable={false} deleteItemFromUser={null}></Item>
            <Item key="TIP" item={ {id:"TIP", name:"TIP" , cost:shallowUser.billTip, editable:false}} editable={false} deleteItemFromUser={null}></Item> */}
            
                    
        </View>
    )
}
const deleteItemFromUser = (shallowUser, itemId, editUser) => {
    if ( shallowUser.itemList.hasOwnProperty(itemId) ){
        delete shallowUser.itemList[itemId]
    }
    editUser(shallowUser);

}

const confirmDeleteUser = (deleteUser, user) => {
    Alert.alert(
        'Delete User',
        'Are you sure you want to delete: '+user.name+'?',
        [
            
            {text: 'Cancel', onPress: () => {}},
            {text: 'OK', onPress: () => {deleteUser(user.id)}, style: 'cancel'},
        ],
        { cancelable: false }
    )
    
}

const getUserItems = (shallowUser, items) => {
    var userItems = [];
    Object.keys(shallowUser.itemList).map(itemId => {
        items.map( (itemObj ) => {
            if (itemObj.id === itemId) {
                userItems.push(itemObj);
            }
        })
    })
    return userItems;
}

const setUserName = (shallowUser ,editUser) => {
    shallowUser.confirmDelete = false;
    editUser(shallowUser);
}
const setConfirmDelete = (shallowUser ,editUser,confirmDelete) => {
    shallowUser.confirmDelete=confirmDelete;
    editUser(shallowUser);
}

export default User;
const styles = StyleSheet.create({
    user: {
        flex: 1,
        margin: 2,
        backgroundColor: '#b342eb',
        borderWidth: 2,
        borderColor: '#416982'
    },
    userView: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginRight: 10,
    },
    userText: {
        fontSize: 15,
    },
    userItemView: {
    },
    billDetailView: {
        justifyContent: 'flex-end',
    },
    item: {
        padding: 5,
        backgroundColor: '#9fcfed',
        borderWidth: 2,
        borderColor: '#416982',
        textAlign: 'center'
    },
});
  