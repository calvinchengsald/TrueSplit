import React from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList,TextInput } from 'react-native';
import {Icon} from 'react-native-elements'
import Item from './Item'

const User =  ({user, deleteUser,editUser, items,panResponder }) => {
    var shallowUser = {
        id : user.id,
        name : user.name,
        confirmDelete : user.confirmDelete,
        itemList: user.itemList,
        subtotal: user.subtotal,
        tax: user.tax,
        tip: user.tip,
        total: user.total,
    };
    var userItems = getUserItems(shallowUser, items);

    // console.log("IN USER OBJECT RENDER");
    // console.log(items);
    return (
        <TouchableOpacity style={styles.user} onPress={()=>pressComponent(shallowUser,editUser)}>
            
            <View style={styles.userView}> 
                <React.Fragment>
                    <View style={styles.userElement}> 
                        <TextInput style={styles.itemText} defaultValue={shallowUser.name}   placeholder="Name"  placeholderTextColor='#9c9191'    onChangeText={(text)=>shallowUser.name=text} onEndEditing={()=> setUserName(shallowUser, editUser) }/>
                    </View>
                    { shallowUser.confirmDelete? 
                        <Icon color='red' name='delete' onPress={()=>deleteUser(shallowUser.id)}></Icon>
                        :
                        <Icon name='delete' onPress={()=>setConfirmDelete(shallowUser, editUser, false)} onPress={()=>setConfirmDelete(shallowUser, editUser, true)}></Icon>
                    }

                </React.Fragment>
                
            </View>
            
            {userItems.map(item => (
                        <Item key={item.id} item={item} editable={false} panResponder={panResponder} deleteItemFromUser={(itemId)=>deleteItemFromUser(shallowUser, itemId, editUser)}></Item>
            ))}
            <Item key="SUBTOTAL" item={ {id:"SUBTOTAL", name:"SUBTOTAL" , cost:shallowUser.subtotal, editable:false}} editable={false} deleteItemFromUser={null}></Item>
            <Item key="TAX" item={ {id:"TAX", name:"TAX" , cost:shallowUser.tax, editable:false}} editable={false} deleteItemFromUser={null}></Item>
            <Item key="TIP" item={ {id:"TIP", name:"TIP" , cost:shallowUser.tip, editable:false}} editable={false} deleteItemFromUser={null}></Item>
            <Item key="TOTAL" item={ {id:"TOTAL", name:"TOTAL" , cost:shallowUser.total, editable:false}} editable={false} deleteItemFromUser={null}></Item>
                    
        </TouchableOpacity>
    )
}
const deleteItemFromUser = (shallowUser, itemId, editUser) => {
    shallowUser.itemList  = shallowUser.itemList.filter( (item) => item!=itemId);
    editUser(shallowUser);

}

const getUserItems = (shallowUser, items) => {
    var userItems = [];
    shallowUser.itemList.map( (itemId) => {
        items.map( (itemObj ) => {
            if (itemObj.id === itemId) {
                userItems.push(itemObj);
            }
        })
    });
    return userItems;
}

const pressComponent = (shallowUser ,editUser)  => {
    shallowUser.confirmDelete = false;
    editUser(shallowUser);
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
        margin: 10,
        backgroundColor: '#9fcfed',
        borderWidth: 2,
        borderColor: '#416982',
        paddingBottom: 50,
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
    }
});
  