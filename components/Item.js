import React from 'react'
import {   StyleSheet, Text, TouchableOpacity, View,TextInput } from 'react-native';
// import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {Icon} from 'react-native-elements'
import {standardizeNumber,parseFloatZero, parseFloatZero2,parseFloatZero0, coalesceZero,coalesce} from '../utility/utils'

export const ITEM_VIEW_TYPE = {
    ITEM_HEADER: 0,
    ITEM_ACTUAL: 1,
    USER_ITEM_ACTUAL: 2,
    USER_ITEM_HEADER: 3,
    USER_ITEM_BILL: 4
}
const Item =  ({item, deleteItem,editItem, editable, panResponder, deleteItemFromUser, shares, itemViewType }) => {

    
    var shallowItem = {
        id : item.id,
        name : item.name,
        cost: item.cost,
        editable: editable,
        taxable: item.taxable,
        split: item.split,
        totalShares: item.totalShares
    };
    if ( itemViewType === ITEM_VIEW_TYPE.ITEM_HEADER) {
        return (
            <View style={[styles.item, styles.header]}>
                <View style={styles.itemView}> 
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
                </View>
            </View>
        )
    }
    else if ( itemViewType === ITEM_VIEW_TYPE.ITEM_ACTUAL) {
        return (
            <View style={[styles.item,  shallowItem.split && shallowItem.editable && styles.itemSplit]}>
                <View style={styles.itemView}>  
                    <View  { ...panResponder.panHandlers} style={[styles.itemElement, styles.flex1]}> 
                        <Icon name='list'></Icon>
                    </View>
                    <View style={[styles.itemElement, styles.flex4]}> 
                        <TextInput style={styles.itemText} placeholder='Name' placeholderTextColor='#9c9191' defaultValue={shallowItem.name}      onEndEditing={(obj)=> setItemName(obj.nativeEvent.text,shallowItem, editItem) }/>
                    </View>
                    
                    <View style={[styles.itemElement, styles.flex2]}> 
                        {/* <TextInput style={styles.itemText}  placeholder='0' placeholderTextColor='#9c9191' defaultValue={coalesceZero( (shallowItem.cost).replace(/[^0-9.\- ]/,''), '')} onBlur={(e)=>setItemCost(e, shallowItem, item.cost, editItem)}  keyboardType='numeric'/> */}
                        <TextInput style={styles.itemText}  placeholder='0' placeholderTextColor='#9c9191' defaultValue={coalesceZero( (shallowItem.cost).replace(/[^0-9.\- ]/,''), '')} onEndEditing={(obj)=> setItemCost(obj.nativeEvent.text,shallowItem, item.cost, editItem) }  keyboardType='numeric'/>
                    </View>
                    <View style={[styles.itemElement, styles.flex1]}> 
                        <Icon onPress={()=>setItemTaxable(shallowItem, editItem)} name={shallowItem.taxable?"check":"close"}></Icon>
                    </View>
                </View>
            </View>
        )
    }
    else if ( itemViewType === ITEM_VIEW_TYPE.USER_ITEM_HEADER) {
        return (
            <View style={[styles.item, styles.header]}>
                <View style={styles.itemView}> 
                    <View style={[styles.itemElement, {flex: 5}]}> 
                        <Text style={styles.itemText}>{shallowItem.name}</Text>
                    </View>
                    <View style={[styles.itemElement, styles.flex1]}> 
                        <Text style={styles.itemText}>{shallowItem.cost}</Text>
                    </View>
                    <View style={[styles.itemElement, styles.flex2]}> 
                        <Text style={[styles.itemTextXSm]}>Shares</Text>
                    </View>
                </View>             
            </View>
        )
    }
    else if ( itemViewType === ITEM_VIEW_TYPE.USER_ITEM_ACTUAL) {
        return (
            <View style={[styles.item]}>
                <View style={styles.itemView}>  
                    <TouchableOpacity  style={[styles.itemElement, styles.flex1]} onPress={() => deleteItemFromUser(shallowItem.id) }> 
                        <Icon name='remove'></Icon>
                    </TouchableOpacity>
                    <View style={[styles.itemElement, styles.flex4]}> 
                        <Text style={styles.itemTextSm}>{shallowItem.name}</Text>
                    </View>
                    <View style={[styles.itemElement, styles.flex2]}> 
                        <Text style={styles.itemTextSm}>{ parseFloatZero0( 100* shares / shallowItem.totalShares) + "%"}</Text>
                    </View>
                    <View style={[styles.itemElement, styles.flex1]}> 
                        <Text style={styles.itemTextSm}>{shares}</Text>
                    </View>
                </View>             
            </View>
        )
    }
    else if ( itemViewType === ITEM_VIEW_TYPE.USER_ITEM_BILL) {
        return (
            <View style={[styles.item]}>
                <View style={styles.itemView}>  
                    <View style={[styles.itemElement, styles.flex4]}> 
                        <Text style={styles.itemTextSm}>{shallowItem.name}</Text>
                    </View>
                    <View style={[styles.itemElement, styles.flex2]}> 
                        <Text style={styles.itemTextSm}>{'$' + coalesce(shallowItem.cost,'N/A') }</Text>
                    </View>
                </View>             
            </View>
        )
    }
    else {
        return (
            <View style={[styles.item]}>
                <View style={styles.itemView}>  
                    <Text>Invalid ITEM_VIEW_TYPE: {itemViewType}</Text>
                </View>             
            </View>
        )

    }


    
}

const setItemCost = (text, item, origionalCost, editItem) => {
    console.log(text)
    var finalCost = standardizeNumber(text);
    //because react native only detects change, we need to force a change here in case the rounded decimal is the same as the starting one
    
    if (origionalCost.charAt(0)==' '){
        item.cost = finalCost;
    } else {
        item.cost = ' ' + finalCost ;
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
    itemSplit: {
        backgroundColor: '#D3D3D3',
        borderColor: '#416982',
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
    itemTextXSm: {
        fontSize: 9,
    },
    itemTxText: {
        textDecorationLine: 'line-through',
        marginLeft: 2
    },
    itemTxTextTaxable: {
        textDecorationLine: 'underline'
    }
});
  