import React from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, FlatList,TextInput } from 'react-native';
import {Icon} from 'react-native-elements'
import Item from './Item'

const User =  ({user, deleteUser,editUser }) => {
    var shallowUser = {
        id : user.id,
        name : user.name,
        confirmDelete : user.confirmDelete,
        itemList: user.itemList,
    };

    return (
        <TouchableOpacity style={styles.user} onPress={()=>pressComponent(shallowUser,editUser)}>
            
            <View style={styles.userView}> 
                <React.Fragment>
                    <View style={styles.userElement}> 
                        <TextInput style={styles.itemText} defaultValue={shallowUser.name}      onChangeText={(text)=>shallowUser.name=text} onEndEditing={()=> setUserName(shallowUser, editUser) }/>
                    </View>
                    { shallowUser.confirmDelete? 
                        <Icon color='red' name='delete' onPress={()=>deleteUser(shallowUser.id)}></Icon>
                        :
                        <Icon name='delete' onPress={()=>setConfirmDelete(shallowUser, editUser, false)} onPress={()=>setConfirmDelete(shallowUser, editUser, true)}></Icon>
                    }

                    {shallowUser.itemList.map(item => {
                        <Item key={item.id} item={item} editable={false}></Item>
                    })}
                    
                    
                    
                    
                </React.Fragment>
            </View>
            
        </TouchableOpacity>
    )
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
        width: '42%',
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
  