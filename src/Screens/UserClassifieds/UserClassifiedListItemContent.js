import React, {useEffect} from 'react';
import {Text, View, TouchableOpacity, Alert} from 'react-native';
import {Block, theme as galioTheme} from 'galio-framework';
import {human, systemWeights} from 'react-native-typography';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Divider} from '../../Components/Stateless';
import NavigationService from '../../Navigation';
import colors from '../../Themes/Colors';
import {ApiService, StoreService} from '../../Store';
import { useStoreActions, useStoreState } from 'easy-peasy'

const UserClassifiedListItemContent = ({data}) => {

  const load = useStoreActions(actions => actions.userClassifieds.loadUserMyPostData)
  console.log(data, 'data fromm main valiue >>>');

 const  moveToEditForm =() =>{
   console.log('calling edit');
   NavigationService.navigate('EditClassifedForm', {dataValue: data})

  }
   const deleteMyPost=async () =>{
     console.log(id,"id value");
     let payload={
      classifiedId:id
     }
     const data = await ApiService.deleteUserClassifiedItemData(payload)
     load()
    console.log(data,'calling edit');
 
   }

   

   const createTwoButtonAlert = () =>
   Alert.alert(
     "",
     "Are sure want to delete post",

     [
       {
         text: "Cancel",
         onPress: () => console.log("Cancel Pressed"),
         style: "cancel",
       },
       { text: "OK", onPress: () => deleteMyPost() },
     ],
     { cancelable: false }
   );

  const {id,title, description, price, phone, builderName, notification} = data;
  // useEffect(()=>{
  //      load()
  // },[title, description, price])
  return (
    <Block>
    <Block
      flex
      row
      space="between"
      style={{padding: galioTheme.SIZES.BASE, paddingRight: 0}}>
      <Block>
        <Block row space="around">
          <Block>
            <Text style={{...human.subhead, ...systemWeights.bold}}>
              {title}
            </Text>
          </Block>
          <Divider vertical />
          <Block row space="between">
            <TouchableOpacity onPress={()=> moveToEditForm()}>
              <FontAwesome name="edit" size={22} />
            </TouchableOpacity >
            <TouchableOpacity onPress={()=> createTwoButtonAlert()}>
              <FontAwesome name="trash" size={20} style={{marginLeft: 15}} />
            </TouchableOpacity>
          </Block>
        </Block>
        <Text
          numberOfLines={2}
          style={{...human.footnote, color: colors.grey400}}>
          {description}
        </Text>
        <Divider small />
        <Block row space="between">
          <Block>
            <Text style={{...human.caption2}}>Price per Sq. Ft.</Text>
            <Text style={{...human.caption1, ...systemWeights.semibold}}>
              {price || '-'}
            </Text>
          </Block>
          <Divider vertical />
          <Block>
            <Text style={{...human.caption2}}>Contact</Text>
            <Text style={{...human.caption1, ...systemWeights.semibold}}>
              {phone || '-'}
            </Text>
          </Block>
        </Block>
       
      </Block>
     
    </Block>

<Block style={{marginLeft:14,marginBottom:8 ,marginRight:0}}>
{/* <Text style={{fontSize:12}}>Status : aksdfkl;sdfksdfdsfjsdljflsdkjf</Text> */}
{/* <Text style={{...human.caption2}}>Status</Text>  */}
<Text style={{...human.caption1, ...systemWeights.semibold}}>
Status :  {notification != null ?  (
<Text>{notification == 'New'? <Text style={{color:'#5fbae8'}}>Open</Text>:(
  <Text>{notification =='Approved'? <Text style={{color:'green'}}>{notification}</Text>:<Text style={{color:'red',textAlign:'justify' }}>{notification}</Text>}</Text>
)}</Text>
): null}

</Text>
</Block>
</Block>
  );
};

export default UserClassifiedListItemContent;
