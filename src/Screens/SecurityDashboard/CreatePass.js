import React, {Component} from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import colors from '../../Themes/Colors'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
// import {launchCamera, launchImageLibrary,ImagePicker} from 'react-native-image-picker';
import { StoreService, ApiService } from '../../Store'
import {Picker } from "native-base";
import { showErrorToast, showLoading, showSuccessToast, showInfoToast } from '../../Lib/Toast'


class CreatePass extends Component {
  constructor(props){
    super(props)
    this.state={
      modalvisable:false,
      visitorName:'',
      block:'',
      flatNumber:'',
      mobile:'',
      noOfVisitors:'',
      blocks:[],
      selectedBlock:'',
      selectedFlatNumber:'',
      flats:[]
    }
  }
 

  componentDidMount(){
    this.getBlocks()
  }

   closeModal = () => {
    this.setState({modalvisable:false})
  }
 
   getBlocks= async()=>{
    const payload={
       BuildingId:StoreService.getState().app.building.id
     }
     const response = await ApiService.listOfAllBlocks(payload);
     console.log(response ,"response listOfAllBlocks");
     this.setState({blocks:response.data})
   }

   getFlats= async(val)=>{
    const payload={
      BlockId:val
     }
     const response = await ApiService.listOfAllFlats(payload);
     console.log(response ,"listOfAllFlats >>>>>>>>>");
     this.setState({flats:response.data})
   }

   createVisitor=async()=>{
     const payload={
      "flatId": this.state.selectedFlatNumber,
      "visitorsCount": this.state.noOfVisitors,
      "visitorName": this.state.visitorName,
      "mobile": this.state.mobile,
      // "description": "sample string 5",
      // "image": "sample string 6",
    }
     const response = await ApiService.securityCreateVisitor(payload);
     console.log(response, "visitor createion res >>>>>>>");
     if(response.data ==1){
         showSuccessToast('Successfully created')
         this.props.navigation.goBack()
     }
   }

  

   profileSubmit =async () => {
    console.log(this.state.visitorName, this.state.block, this.state.selectedFlatNumber, this.state.mobile, this.state.noOfVisitors, "detials >>>>");
    if(this.state.visitorName && this.state.selectedFlatNumber && this.state.mobile && this.state.noOfVisitors ){
      this.createVisitor()
    }else{
      showErrorToast('Please fill all details')
    }
    // if(visitorName)
    // await  createVisitor()
    // props.navigation.goBack()
  }

  onChangeOpen=(val)=>{
    console.log(val,"valllo ooo");
   this.setState({selectedBlock:val},()=>{
     this.getFlats(val)
   })
  }

 

  onChangeSelectFlat=(val)=>{
    console.log(val,"valllo ooo flat");
   this.setState({selectedFlatNumber:val})
  }

   openCamera = () => {
   
 
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      console.log(image, 'path  >>>>');
    });
  };

render(){
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.mainView}>
          <View style={{ backgroundColor: colors.blue300, padding: 20 }}>
            <Text style={styles.textStyle}> Create New Pass</Text>
          </View>
          <View style={styles.wrapper}>
            <TouchableOpacity onPress={() => this.setState({modalvisable:true})}>
              <View style={styles.user}>
                <EvilIcons name="user" size={120} />
              </View>
            </TouchableOpacity>
            <View>
              <Text style={styles.textLable}>Name</Text>
              <TextInput placeholder="Enter name"
                style={styles.textInputStyle}
                onChangeText={(text) =>  this.setState({visitorName:text})}
              />
            </View>

           <View style={{marginTop:10}}>
           <Text style={[styles.textLable,{marginTop:0,marginBottom:0}]}>Block</Text>
            <View style={{backgroundColor:'white',marginTop:15}}>
               <Picker 
                onValueChange={(val)=> this.onChangeOpen(val)}
                selectedValue={this.state.selectedBlock}
               >  
                <Picker.Item label="Please select block" value="0" style={{color:'red'}} />
                    {this.state.blocks.map((item, index)=>{
                      console.log(item,"item kkk");
                     return(                
                      <Picker.Item label={`${item.blockName}`} value={`${item.blockId}`}  />  
                     )
                    })}              
                </Picker> 
              
            </View>
           </View>


           <View style={{marginTop:10}}>
           <Text style={[styles.textLable,{marginTop:0,marginBottom:0}]}>Flat Number</Text>
            <View style={{backgroundColor:'white',marginTop:15}}>
               <Picker 
                onValueChange={(val)=> this.onChangeSelectFlat(val)}
                selectedValue={this.state.selectedFlatNumber}
               >  
                <Picker.Item label="Please select flat" value="0" />
                    {this.state.flats.map((item, index)=>{
                      console.log(item,"item kkk");
                     return(                
                      <Picker.Item label={item.flatNumber} value={`${item.flatId}`} />  
                     )
                    })}              
                </Picker> 
              
            </View>
           </View>


            <View>
              <Text style={styles.textLable}>No of visitors</Text>
              <TextInput placeholder="No of visitors"
                style={styles.textInputStyle}
                onChangeText={(text) =>this.setState({noOfVisitors:text})}

              />
            </View>
            <View>
              <Text style={styles.textLable}>Mobile number</Text>
              <TextInput placeholder="Enter mobile number"
                style={styles.textInputStyle}
                onChangeText={(text) =>this.setState({mobile:text})}

              />
            </View>
          </View>
        </View>
        <View>
          <Modal
            isVisible={this.state.modalvisable}
            onBackButtonPress={this.closeModal}
            onBackdropPress={this.closeModal}
            onSwipeComplete={this.closeModal}
            swipeDirection={['down']}
            style={styles.bottomModal}
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={1000}>
            <View style={styles.content}>
              <View style={styles.contentContainer}>
                <View style={styles.scrollableModal}>
                  <View style={styles.MainView}>
                    <TouchableOpacity
                      style={styles.buttonView}
                      onPress={() => this.openCamera()}
                    >
                      {/* <Image
                        source={require('../../../assets/images/camera.png')}
                        style={{
                          width: 50,
                          height: 50,
                        }}
                        resizeMode={'contain'}
                      /> */}
                      <Text style={styles.buttonText}>Camera</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.MainView}>
                    <TouchableOpacity
                      style={styles.buttonView}
                    //   onPress={this.launchImageLibrary}
                    >
                      {/* <Image
                        source={require('../../../assets/images/gallery.png')}
                        style={{
                          width: 50,
                          height: 50,
                        }}
                        resizeMode={'contain'}
                      /> */}
                      <Text style={styles.buttonText}>Gallery</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => this.profileSubmit()}>
        <View style={{ backgroundColor: colors.blue300, padding: 15 }}>
          <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Submit</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafcfc' },
  mainView: { marginTop: 22 },
  textStyle: { color: 'white', fontSize: 18 },
  wrapper: { margin: 20 },
  textInputStyle: { borderWidth: 0.5, borderRadius: 5, backgroundColor: 'white', borderColor: 'white', paddingLeft: 10 },
  textLable: { marginTop: 5, marginBottom: 5, fontSize: 16 },
  user: { alignItems: 'center', marginTop: 20, marginBottom: 60 },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 20,
  },
  scrollableModal: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  MainView: {
    marginLeft: 0,
    width: '90%',
    paddingTop: 0,
    paddingBottom: 0,
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonView: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 15,
    marginHorizontal: 10,
    borderRadius: 10,
  },

  buttonText: {
    marginTop: 10,
    color: 'black',
  },
})
export default CreatePass