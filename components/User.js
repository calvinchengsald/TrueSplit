import React from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList,TextInput, Alert } from 'react-native';
import {Icon} from 'react-native-elements'
import Item from './Item'

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
    };
    var userItems = getUserItems(shallowUser, items);

    return (
        <View style={styles.user}>
            
            <View style={styles.userView}> 
                <React.Fragment>
                    <View style={styles.userElement}> 
                        <TextInput style={styles.itemText} defaultValue={shallowUser.name}   placeholder="Name"  placeholderTextColor='#9c9191'    onChangeText={(text)=>shallowUser.name=text} onEndEditing={()=> setUserName(shallowUser, editUser) }/>
                    </View>
                    <Icon color='#8b0000' name='delete' onPress={()=>confirmDeleteUser(deleteUser,shallowUser)}></Icon>

                </React.Fragment>
                
            </View>
            <View style={styles.userItemView}>
                {userItems.map(item => (
                            <Item key={item.id} item={item} editable={false} panResponder={panResponder} shares={shallowUser.itemList[item.id]} deleteItemFromUser={(itemId)=>deleteItemFromUser(shallowUser, itemId, editUser)}></Item>
                ))}
            </View>
            
            {/* <Item key="SUBTOTAL" item={ {id:"SUBTOTAL", name:"SUBTOTAL" , cost:shallowUser.billSubtotal, editable:false}} editable={false} deleteItemFromUser={null}></Item>
            <Item key="TAX" item={ {id:"TAX", name:"TAX" , cost:shallowUser.billTax, editable:false}} editable={false} deleteItemFromUser={null}></Item>
            <Item key="TIP" item={ {id:"TIP", name:"TIP" , cost:shallowUser.billTip, editable:false}} editable={false} deleteItemFromUser={null}></Item> */}
            <View style={styles.billDetailView}>
                <Item key="TOTAL" item={ {id:"TOTAL", name:"TOTAL" , cost:shallowUser.billTotal, editable:false}} editable={false} deleteItemFromUser={null}></Item>
            </View>
                    
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
        backgroundColor: '#9fcfed',
        borderWidth: 2,
        borderColor: '#416982',
        paddingBottom: 20
    },
    userView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginRight: 10
    },
    userElement: {
        margin:2,
    },
    userText: {
        fontSize: 15,
    },
    userItemView: {
    },
    billDetailView: {
        justifyContent: 'flex-end',
    }
});
  