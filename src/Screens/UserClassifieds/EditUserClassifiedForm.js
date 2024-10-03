import React, {Component} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
// import {TextInput} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import NavigationService from '../../Navigation';
import AwesomeAlert from 'react-native-awesome-alerts';
import {Container, Navbar, Divider} from '../../Components/Stateless';
import { useStoreActions, useStoreState } from 'easy-peasy'

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Block, Button} from 'galio-framework';
import {iOSColors, human} from 'react-native-typography';
import {ApiService, StoreService} from '../../Store';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
class EditUserClassifiedForm extends Component{
    constructor(props) {
        super();
        this.state = {
          modalVisible: false,
          image: '',
          showAlert: false,
          imagesArr: [],
          modalVisible: false,
          rentKey: false,
          title: '',
          description: '',
          phone: '',
          url: '',
          price: '',
          scope: 1,
          PropertyType: '',
          pageName: '',
          imageBoolean:false,
          classifiedId:'',
          imagesBase64:[]
        };
        
 
      }
   componentDidMount(){
       const data = this.props.navigation.state.params.dataValue
       console.log(data,"data props >>>>>");
       this.setState({
           title: data.title,
           description:data.description,
           url:data.url,
           price:data.price,
           imagesArr:data.documents,
           scope:data.scope,
           PropertyType:data.PropertyType,
           classifiedId: data.id
           },()=>{
           console.log(this.state.price,"price >>>>> ");
       })

   }

   setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  openPicker = () => {
    console.log('calling picker');
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      multiple: true,
      includeBase64: true,
    }).then(image => {
      console.log(image, 'image at picker >>>');
      if (image.length <= 5) {
        image.map((item, index) => {
          console.log(item.path, 'path >>>>>');
          this.setState({modalVisible: false, showAlert: false});
          this.setState(
            {
              imagesArr: this.state.imagesArr.concat(item),
              imagesBase64: this.state.imagesBase64.concat(item.data),
            },
            () => {
              console.log(
                this.state.imagesArr,
                this.state.imagesBase64,
                'images array >>>',
              );
            },
          );
        });
      } else {
        alert('You can upload only five images');
      }
    });
  };

  openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
    }).then(image => {
      console.log(image, 'path ');
      // console.log(image.path, 'path >>>>');
      // // const data = this.getCropToBase64(image.path)
      // //  console.log(data ," sending image res >>>>");
      // this.setState({modalVisible: true});
      // // setImage(image.path)
      // this.setState({image: image});

      this.setState({modalVisible: false});
      this.setState(
        {
          imagesArr: this.state.imagesArr.concat(image),
          imagesBase64: this.state.imagesBase64.concat(image.data),
          showAlert: false,
        },
        () => {
          console.log(this.state.imagesArr, 'array of images >>');
        },
      );
      if (this.state.imagesArr.length > 0) {
        if (this.state.imagesArr.length <= 5) {
          // this.state.imagesArr.pop()
          // console.log(this.state.imagesArr,"images array >>>");
          console.log('calling only the lenght ,', this.state.imagesArr);
          // this.setState({imageBoolean :true})
          
        } else {
          alert('Upto five image allowed');
          // this.setState({imageBoolean :false})
        }
      }
    });
  };
  openSellPopup() {
    // NavigationService.navigate('SellClassified')
    this.setState({modalVisible: true});
    this.setState({rentKey: false});
  }

  openRentPopup() {
    this.setState({modalVisible: true});
    this.setState({rentKey: true});
    // setSellModalVisible(true);
    // setRentKey(true)
  }

  async submit() {
   
    if( this.state.title && this.state.description && this.state.url && this.state.price){
      let payload = {
        id: this.state.classifiedId,
        BuildingId: StoreService.getState().app.building.id,
        OwnerId: StoreService.getState().login.id,
        PropertyType: this.state.PropertyType,
        Scope: this.state.scope,
        IsDelete:0,
        documents: this.state.imagesBase64,
        title: this.state.title,
        description: this.state.description,
        url: this.state.url,
        price: this.state.price,
      };
   
       
  
      const data = await ApiService.updatePostClassified(payload);
      console.log(data, 'data >>>>>>>>');
      if(data.data == 1){
         NavigationService.navigate('UserClassified')
        alert('Sucessfully submitted')
      }else{
        alert('Server error')
      }
    
  
      // console.log(this.state.imagesArr,this.state.title, this.state.description, this.state.price, this.state.url , this.state.phone, "valuess >>>>");
      this.setState({modalVisible: false});

    }else{
      alert('Please fill the form')
    }
    
  }

  cancel() {
    this.setState({modalVisible: false});
  }

  disable(){
    alert('Upto five image can upload')
  }

  removeImage(index) {
    console.log('calling images');
    let imagesData = this.state.imagesArr;
    console.log(imagesData, index, 'imagesDataimagesDataimagesDataimagesData');
    imagesData.splice(index, 1);
    this.setState({imagesArr: imagesData,showAlert:false}, () => {
      console.log(this.state.imagesArr, 'imagesArr >>>>');
    });
  }
    render(){
       console.log(this.state.price ,"at reander parice");
      
        return(
            <View>
            <ScrollView>
              <View>
                <View style={styles.centeredView}>
                  <TouchableHighlight
                    style={styles.openButton}
                    // onPress={() => {
                    //   this.showAlert();
                    // }}
                    onPress={()=> this.state.imagesArr.length >=5 ?this.disable() :this.showAlert() }
                    >
                    <View>
                      <View style={{borderWidth: 1, borderRadius: 5}}>
                        <EvilIcons color="grey" name="camera" size={100} />
                      </View>
                    </View>
                  </TouchableHighlight>
                  <View>
                    {this.state.imagesArr.length > 0 ? (
                      <ScrollView horizontal>
                        {this.state.imagesArr.map((item, index) => {
                          return (
                            <View>
                              <View style={styles.thumbnailContainer}>
                              <Image
                              source={{
                                uri: `data:${item.mime};base64,${item.data}`,
                              }}
                              style={{height: 50, width: 50}}
                            />
                                <EvilIcons
                                  style={styles.removeThumbnail}
                                  onPress={() => this.removeImage(index)}
                                  color="white"
                                  name="close-o"
                                  size={20}
                                />
                              </View>
                            </View>
                          );
                        })}
                      </ScrollView>
                    ) : null}
                  </View>
    
                  <View>
                    <AwesomeAlert
                      show={this.state.showAlert}
                      showProgress={false}
                      title="Choose action"
                      // message="I have a message for you!"
                      closeOnTouchOutside={true}
                      closeOnHardwareBackPress={false}
                      showCancelButton={true}
                      showConfirmButton={true}
                      cancelText="Camera"
                      confirmText="Gallery"
                      cancelButtonColor="#AEDEF4"
                      confirmButtonColor="#AEDEF4"
                      onCancelPressed={() => {
                        this.openCamera();
                      }}
                      onConfirmPressed={() => {
                        this.openPicker();
                      }}
                    />
                  </View>
                </View>
                <ScrollView>
                  <View style={{marginTop: 20, margin: 30}}>
                    <Block>
                      <View style={styles.textInput}>
                        <TextInput
                          placeholder="Please enter title"
                       
                         value={this.state.title}
                          onChangeText={text => {
                            this.setState({title: text});
                            console.log(this.state.title, 'title >>>>>');
                          }}
                        />
                      </View>
                    </Block>
                    <Block>
                      <View style={styles.textInput}>
                        <TextInput
                          placeholder="Please enter description"
                          numberOfLines={2}
                          multiline={true}
                          value={this.state.description}
                          onChangeText={text => {
                            this.setState({description: text});
                            console.log(this.state.phone, 'phone >>>>>');
                          }}
                        />
                      </View>
                    </Block>
                    <Block>
                      <View style={styles.textInput}>
                        <TextInput
                          placeholder="Please enter url"
                          value={this.state.url}
                          onChangeText={text => {
                            this.setState({url: text});
                            console.log(this.state.url, 'url >>>>>');
                          }}
                        />
                      </View>
                    </Block>
                     <Block>
                      <View style={styles.textInput}>
                        <TextInput
                          placeholder="Please enter price"
                        //   value={this.state.price}
                        defaultValue={`${this.state.price}`}
                           onChangeText={text => {
                            this.setState({price: text});
                            console.log(this.state.price, 'price >>>>>');
                          }}
                        />
                      </View>
                    </Block>
                    {/* <Block>
                      <View style={styles.textInput}>
                        <TextInput
                          placeholder="Please enter price"
                          value={this.state.price}
                          onChangeText={text => {
                            this.setState({price: text});
                            console.log(this.state.price, 'price >>>>> at onchange >>>');
                          }}
                        />
                      </View>
                    </Block> */}
                  </View>
                  <Block>
                    <Button
                      round
                      color={iOSColors.tealBlue}
                      onPress={() => this.submit()}
                      // style={styles.donationCardButton}
                      style={{marginTop: 15, width: 120, alignSelf: 'center'}}>
                      <Text style={{...human.bodyWhite}}>Submit</Text>
                    </Button>
                  </Block>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )
    }
}

EditUserClassifiedForm.navigationOptions = ({navigation, screenProps}) => {
    //   const {title} = navigation.state.params.data;
    //   console.log(title, 'title at navigation >>>>>');
      // const {navbarTitle} = this.state.pageName;
    
      return {
        header: (
          <Navbar title="Edit Form" onPressBack={() => NavigationService.goBack()} />
        ),
      };
    };

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      // justifyContent: "center",
      alignItems: 'center',
      marginTop: 22,
    },
    root: {
      position: 'relative',
    },
    thumbnailContainer: {
      margin: 10,
    },
    removeThumbnail: {
      alignItems: 'center',
      borderRadius: 30,
  
      height: 20,
      justifyContent: 'center',
      position: 'absolute',
      right: 5,
      top: 5,
      width: 20,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'grey',
      borderRadius: 20,
      padding: 25,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    openButton: {
      // backgroundColor: '#F194FF',
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    textInput: {
      borderWidth: 1,
      marginTop: 5,
      borderRadius: 1,
    },
  });
  
export default EditUserClassifiedForm












// import React, {Component} from 'react';
// import {
//   Alert,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableHighlight,
//   View,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
// } from 'react-native';
// // import {TextInput} from 'react-native-paper';
// import ImagePicker from 'react-native-image-crop-picker';
// import NavigationService from '../../Navigation';
// import AwesomeAlert from 'react-native-awesome-alerts';
// import {Container, Navbar, Divider} from '../../Components/Stateless';

// import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import {Block, Button} from 'galio-framework';
// import {iOSColors, human} from 'react-native-typography';
// import {ApiService, StoreService} from '../../Store';
// import RadioForm, {
//   RadioButton,
//   RadioButtonInput,
//   RadioButtonLabel,
// } from 'react-native-simple-radio-button';

// class EditUserClassifiedForm extends Component {
//   constructor(props) {
//     super();
//     this.state = {
//       modalVisible: false,
//       image: '',
//       showAlert: false,
//       imagesArr: [],
//       modalVisible: false,
//       rentKey: false,
//       title: '',
//       description: '',
//       phone: '',
//       url: '',
//       price: '',
//       scope: 0,
//       PropertyType: '',
//       pageName: '',
//       imageBoolean:false
//     };
//   }

//   componentDidMount() {
//     // const ooo = this.props;
//     // console.log(ooo, 'prosppppppp');
//     // const data = this.props.navigation.state.params.data;
 
//     // console.log(data, 'prosp jkjkjjlkjlk >>>>');
//     // this.setState({scope: data});
//   }

//   setModalVisible = visible => {
//     this.setState({modalVisible: visible});
//   };

//   showAlert = () => {
//     this.setState({
//       showAlert: true,
//     });
//   };

//   openPicker = () => {
//     console.log('calling picker');
//     ImagePicker.openPicker({
//       width: 300,
//       height: 400,
//       cropping: true,
//       includeBase64: true,
//     }).then(image => {
//       console.log(image);
//       // setPicker(image.path)
//       // setImage(image.path)
//       this.setState({image: image.path});
//       this.setState(
//         {
//           imagesArr: this.state.imagesArr.concat(image.path),
//           showAlert: false,
//         },
//         () => {
//           console.log(this.state.imagesArr, 'array of images >>');
//           if (this.state.imagesArr.length > 0) {
//             console.log('calling if');
//             if (this.state.imagesArr.length >= 5) {
//               console.log('calling only the lenght ,', this.state.imagesArr);
//               // this.setState({imageBoolean :true})
//                alert('Upto five image allowed');
//             }else{
//               // this.setState({imageBoolean :false})
//             }
//           }
//         },
//       );
//     });
//   };

//   openCamera = () => {
//     ImagePicker.openCamera({
//       width: 300,
//       height: 400,
//       cropping: true,
//       includeBase64: true,
//     }).then(image => {
//       console.log(image, 'path ');
//       console.log(image.path, 'path >>>>');
//       this.setState({modalVisible: true});
//       // setImage(image.path)
//       this.setState({image: image.path});
//       this.setState({modalVisible: false});
//       this.setState(
//         {
//           imagesArr: this.state.imagesArr.concat(image.path),
//           showAlert: false,
//         },
//         () => {
//           console.log(this.state.imagesArr, 'array of images >>');
//         },
//       );
//       if (this.state.imagesArr.length > 0) {
//         if (this.state.imagesArr.length >= 5) {
//           // this.state.imagesArr.pop()
//           // console.log(this.state.imagesArr,"images array >>>");
//           console.log('calling only the lenght ,', this.state.imagesArr);
//           // this.setState({imageBoolean :true})
//           alert('Upto five image allowed');
//         }else{
//           // this.setState({imageBoolean :false})
//         }
//       }
//     });
//   };

//   openSellPopup() {
//     // NavigationService.navigate('SellClassified')
//     this.setState({modalVisible: true});
//     this.setState({rentKey: false});
//   }

//   openRentPopup() {
//     this.setState({modalVisible: true});
//     this.setState({rentKey: true});
//     // setSellModalVisible(true);
//     // setRentKey(true)
//   }

//   async submit() {
//     // let payload = {
//     //   id: 0,
//     //   BuildingId: 47,
//     //   OwnerId: StoreService.getState().login.id,
//     //   PropertyType: this.state.rentKey ? 0 : 1,
//     //   Scope: this.state.scope,
//     //   documents: this.state.imagesArr,
//     //   title: 'classifieds',
//     //   description: 'testing api',
//     //   url: 'test',
//     //   price: '567',
//     // };
//     if( this.state.title && this.state.description && this.state.url && this.state.price){
//       let payload = {
//         id: 0,
//         BuildingId: StoreService.getState().app.building.id,
//         OwnerId: StoreService.getState().login.id,
//         PropertyType: this.state.PropertyType,
//         Scope: this.state.scope,
//         documents: this.state.imagesArr,
//         title: this.state.title,
//         description: this.state.description,
//         url: this.state.url,
//         price: this.state.price,
//       };
  
//       const data = await ApiService.createPostClassified(payload);
//       console.log(data, 'data >>>>>>>>');
//       if(data.data == 1){
//         NavigationService.navigate('UserClassified')
//         alert('Sucessfully submitted')
//       }else{
//         alert('Server error')
//       }
    
  
//       // console.log(this.state.imagesArr,this.state.title, this.state.description, this.state.price, this.state.url , this.state.phone, "valuess >>>>");
//       this.setState({modalVisible: false});

//     }else{
//       alert('Please fill the form')
//     }
    
//   }

//   cancel() {
//     this.setState({modalVisible: false});
//   }

//   disable(){
//     alert('Upto five image can upload')
//   }

//   removeImage(index) {
//     console.log('calling images');
//     let imagesData = this.state.imagesArr;
//     console.log(imagesData, index, 'imagesDataimagesDataimagesDataimagesData');
//     imagesData.splice(index, 1);
//     this.setState({imagesArr: imagesData}, () => {
//       console.log(this.state.imagesArr, 'imagesArr >>>>');
//     });
//   }
//   render() {
//     const {modalVisible} = this.state;
//     return (
//         <View>
//             <Text>Hello ganesh</Text>
//         </View>
    //   <View>
    //     <ScrollView>
    //       <View>
    //         <View style={styles.centeredView}>
    //           <TouchableHighlight
    //             style={styles.openButton}
    //             // onPress={() => {
    //             //   this.showAlert();
    //             // }}
    //             onPress={()=> this.state.imagesArr.length >=5 ?this.disable() :this.showAlert() }
    //             >
    //             <View>
    //               <View style={{borderWidth: 1, borderRadius: 5}}>
    //                 <EvilIcons color="grey" name="camera" size={100} />
    //               </View>
    //             </View>
    //           </TouchableHighlight>
    //           <View>
    //             {this.state.imagesArr.length > 0 ? (
    //               <ScrollView horizontal>
    //                 {this.state.imagesArr.map((item, index) => {
    //                   return (
    //                     <View>
    //                       <View style={styles.thumbnailContainer}>
    //                         <Image
    //                           source={{uri: item}}
    //                           style={{height: 50, width: 50}}
    //                         />
    //                         <EvilIcons
    //                           style={styles.removeThumbnail}
    //                           onPress={() => this.removeImage(index)}
    //                           color="white"
    //                           name="close-o"
    //                           size={20}
    //                         />
    //                       </View>
    //                     </View>
    //                   );
    //                 })}
    //               </ScrollView>
    //             ) : null}
    //           </View>

    //           <View>
    //             <AwesomeAlert
    //               show={this.state.showAlert}
    //               showProgress={false}
    //               title="Choose action"
    //               // message="I have a message for you!"
    //               closeOnTouchOutside={true}
    //               closeOnHardwareBackPress={false}
    //               showCancelButton={true}
    //               showConfirmButton={true}
    //               cancelText="Camera"
    //               confirmText="Gallery"
    //               cancelButtonColor="#AEDEF4"
    //               confirmButtonColor="#AEDEF4"
    //               onCancelPressed={() => {
    //                 this.openCamera();
    //               }}
    //               onConfirmPressed={() => {
    //                 this.openPicker();
    //               }}
    //             />
    //           </View>
    //         </View>
    //         <ScrollView>
    //           <View style={{marginTop: 20, margin: 30}}>
    //             <Block>
    //               <View style={styles.textInput}>
    //                 <TextInput
    //                   placeholder="Please enter title"
    //                   value={this.state.title}
    //                   onChangeText={text => {
    //                     this.setState({title: text});
    //                     console.log(this.state.title, 'title >>>>>');
    //                   }}
    //                 />
    //               </View>
    //             </Block>
    //             <Block>
    //               <View style={styles.textInput}>
    //                 <TextInput
    //                   placeholder="Please enter description"
    //                   numberOfLines={2}
    //                   multiline={true}
    //                   value={this.state.description}
    //                   onChangeText={text => {
    //                     this.setState({description: text});
    //                     console.log(this.state.phone, 'phone >>>>>');
    //                   }}
    //                 />
    //               </View>
    //             </Block>
    //             <Block>
    //               <View style={styles.textInput}>
    //                 <TextInput
    //                   placeholder="Please enter url"
    //                   value={this.state.url}
    //                   onChangeText={text => {
    //                     this.setState({url: text});
    //                     console.log(this.state.url, 'url >>>>>');
    //                   }}
    //                 />
    //               </View>
    //             </Block>
    //             <Block>
    //               <View style={styles.textInput}>
    //                 <TextInput
    //                   placeholder="Please enter price"
    //                   value={this.state.price}
    //                   onChangeText={text => {
    //                     this.setState({price: text});
    //                     console.log(this.state.price, 'price >>>>>');
    //                   }}
    //                 />
    //               </View>
    //             </Block>
    //           </View>
    //           <Block>
    //             <Button
    //               round
    //               color={iOSColors.tealBlue}
    //               onPress={() => this.submit()}
    //               // style={styles.donationCardButton}
    //               style={{marginTop: 15, width: 120, alignSelf: 'center'}}>
    //               <Text style={{...human.bodyWhite}}>Submit</Text>
    //             </Button>
    //           </Block>
    //         </ScrollView>
    //       </View>
    //     </ScrollView>
    //   </View>
//     );
//   }
// }

// EditUserClassifiedForm.navigationOptions = ({navigation, screenProps}) => {
// //   const {title} = navigation.state.params.data;
// //   console.log(title, 'title at navigation >>>>>');
//   // const {navbarTitle} = this.state.pageName;

//   return {
//     header: (
//       <Navbar title="Edit Form" onPressBack={() => NavigationService.goBack()} />
//     ),
//   };
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     // justifyContent: "center",
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   root: {
//     position: 'relative',
//   },
//   thumbnailContainer: {
//     margin: 10,
//   },
//   removeThumbnail: {
//     alignItems: 'center',
//     borderRadius: 30,

//     height: 20,
//     justifyContent: 'center',
//     position: 'absolute',
//     right: 5,
//     top: 5,
//     width: 20,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'grey',
//     borderRadius: 20,
//     padding: 25,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   openButton: {
//     // backgroundColor: '#F194FF',
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 10,
//     elevation: 2,
//   },
//   textStyle: {
//     color: 'white',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: 'center',
//   },
//   textInput: {
//     borderWidth: 1,
//     marginTop: 5,
//     borderRadius: 1,
//   },
// });

// export default EditUserClassifiedForm;