import React from 'react'
import {   StyleSheet, Text, TouchableOpacity, View,TextInput } from 'react-native';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Icon} from 'react-native-elements'

const Item =  ({item, deleteItem,editItem, editable, panResponder, deleteItemFromUser }) => {

    
    var shallowItem = {
        id : item.id,
        name : item.name,
        cost: item.cost,
        editable: editable,
        taxable: item.taxable,
    };
    return (
        
        <View style={[styles.item, shallowItem.taxable && styles.itemTaxable, shallowItem.id==='HEADER' && styles.header]}>
            <View style={styles.itemView}> 
                {editable? 
                   <React.Fragment>
                       
                        <View  { ...panResponder.panHandlers} style={[styles.itemElement, styles.flex1]}> 
                            <Icon name='list'></Icon>
                        </View>
                        <View style={[styles.itemElement, styles.flex4]}> 
                            <TextInput style={styles.itemText} placeholder='Name' placeholderTextColor='#9c9191' defaultValue={shallowItem.name}      onEndEditing={(obj)=> setItemName(obj.nativeEvent.text,shallowItem, editItem) }/>
                        </View>
                        
                        <View style={[styles.itemElement, styles.flex2]}> 
                            <TextInput style={styles.itemText} defaultValue={(shallowItem.cost).replace(/[^0-9. ]/,'')} onEndEditing={(obj)=> setItemCost(obj.nativeEvent.text,shallowItem, editItem) } keyboardType='numeric'/>
                        </View>
                        
                        <View style={[styles.itemElement, styles.flex1]}> 
                            <Icon onPress={()=>setItemTaxable(shallowItem, editItem)} name={shallowItem.taxable?"check":"remove"}></Icon>
                        </View>
                        
                    </React.Fragment> 
                    :
                    
                    <React.Fragment>
                        {shallowItem.id ==='HEADER' ?
                        <React.Fragment>
                            <View  style={[styles.itemElement, styles.flex1]}> 
                                <Icon name='list'></Icon>
                            </View>
                            <View style={[styles.itemElement, styles.flex4]}> 
                                <Text style={styles.itemText}>{shallowItem.name}</Text>
                            </View>
                            <View style={[styles.itemElement, styles.flex2]}> 
                                <Text style={styles.itemText}>{shallowItem.cost}</Text>
                            </View>
                            <View style={[styles.itemElement, styles.flex1]}> 
                                <Text style={[styles.itemTxText, shallowItem.taxable && styles.itemTxTextTaxable]}>Tax</Text>
                            </View>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            { deleteItemFromUser !== null &&
                            <TouchableOpacity  style={[styles.itemElement, styles.flex1]} onPress={() => deleteItemFromUser(shallowItem.id) }> 
                                <Icon name='remove'></Icon>
                            </TouchableOpacity>
                            }
                            <View style={[styles.itemElement, styles.flex4]}> 
                                <Text style={styles.itemTextSm}>{shallowItem.name}</Text>
                            </View>
                            <View style={[styles.itemElement, styles.flex2]}> 
                                <Text style={styles.itemTextSm}>{shallowItem.cost}</Text>
                            </View>
                        </React.Fragment>
                        }
                    </React.Fragment> 
                } 
            </View>
        </View>
    )

    
}

const setItemCost = (text, item, editItem) => {
    var finalCost = 0;
    text = text.replace(/[^0-9.]/,'');
    var costArr = text.split('.');
    if( costArr.length == 1){
        finalCost = costArr[0].replace(/^0/,'');
    } 
    else if (costArr.length > 1) {
        finalCost = costArr[0].replace(/^0/,'') + '.'+ costArr[1].substring(0,2);
    }
    //because react native only detects change, we need to force a change here in case the rounded decimal is the same as the starting one
    
    if (item.cost.charAt(item.cost.length-1)==' '){
        item.cost = finalCost;
    } else {
        item.cost = finalCost + ' ';
    }
    editItem(item)
}
const setItemName = (text,item ,editItem) => {
    item.name=text;
    editItem(item);
}
const setItemTaxable = (item ,editItem) => {
    item.taxable=!item.taxable;
    editItem(item);
}

export default Item; 


const styles = StyleSheet.create({
    item: {
        backgroundColor: '#9fcfed',
        borderWidth: 2,
        borderColor: '#416982'
    },
    header: {
        backgroundColor: '#b342eb',
        borderColor: 'black',
        borderBottomWidth: 4
    },
    itemTaxable: {
        backgroundColor: '#e8a5d4',
        borderColor: '#6e3d5f',
        borderWidth: 2,
    },
    itemView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginRight: 10
    },
    itemElement: {
        padding:5,
    },
    flex1: {
        flex:1
    },
    flex2: {
        flex:2
    },
    flex4: {
        flex:4
    },
    itemText: {
        fontSize: 15,
    },
    itemTextSm: {
        fontSize: 10,
    },
    itemTxText: {
        textDecorationLine: 'line-through',
        marginLeft: 2
    },
    itemTxTextTaxable: {
        textDecorationLine: 'underline'
    }
});
  