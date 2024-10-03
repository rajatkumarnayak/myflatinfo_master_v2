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

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Block, Button} from 'galio-framework';
import {iOSColors, human} from 'react-native-typography';
import {ApiService, StoreService} from '../../Store';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';

class ProductsServices extends Component {
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
    };
  }

  componentDidMount() {
    const data = this.props;
    console.log(data, 'prosp >>>>');
    this.setState({scope: data});
  }
 componentDidUpdate(prevState, prevProps){
  console.log(this.props,"propss ");
  if(this.props == this.state.scope){

  }else{
    this.setState({scope : this.props})
  }
 
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
      includeBase64: true,
    }).then(image => {
      console.log(image);
      // setPicker(image.path)
      // setImage(image.path)
      this.setState({image: image.path});
      this.setState(
        {
          imagesArr: this.state.imagesArr.concat(image.path),
          showAlert: false,
        },
        () => {
          console.log(this.state.imagesArr, 'array of images >>');
          if (this.state.imagesArr.length > 0) {
            console.log('calling if');
            if (this.state.imagesArr.length > 2) {
              alert('Upto five image allowed');
              console.log('callijg at five images >>>');
            }
          }
        },
      );
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
      console.log(image.path, 'path >>>>');
      this.setState({modalVisible: true});
      // setImage(image.path)
      this.setState({image: image.path});
      this.setState({modalVisible: false});
      this.setState(
        {
          imagesArr: this.state.imagesArr.concat(image.path),
          showAlert: false,
        },
        () => {
          console.log(this.state.imagesArr, 'array of images >>');
        },
      );
      if (this.state.imagesArr.length > 0) {
        if (this.state.imagesArr.length > 5) {
          alert('Upto five image allowed');
        }
      }
    });
  };

  openSellPopup() {
    let dataValue ={
      scope:this.state.scope,
      PropertyType: 2,
      title:'Sell Form'
    }
     NavigationService.navigate('SellClassified',{data: dataValue})
    // this.setState({modalVisible: true});
    // this.setState({rentKey: false});
  }

  openRentPopup() {
    let dataValue ={
      scope:this.state.scope,
      PropertyType: 1,
      title:'Rent Form'
    }
     NavigationService.navigate('SellClassified',{data: dataValue})
    // this.setState({modalVisible: true});
    // this.setState({rentKey: true});
    // setSellModalVisible(true);
    // setRentKey(true)
  }

  
  openProductPopup() {
    let dataValue ={
      scope:this.state.scope,
      PropertyType: 3,
      title:'Prodct & Service Form'
    }
     NavigationService.navigate('SellClassified',{data: dataValue})
    // this.setState({modalVisible: true});
    // this.setState({rentKey: true});
    // setSellModalVisible(true);
    // setRentKey(true)
  }

  async submit() {
    let payload = {
      id: 0,
      BuildingId: StoreService.getState().app.building.id,
      OwnerId: StoreService.getState().login.id,
      PropertyType: this.state.rentKey ? 0 : 1,
      Scope: this.state.scope,
      documents: this.state.imagesArr,
      title: 'classifieds',
      description: 'testing api',
      url: 'test',
      price: '567',
    };

    const data = await ApiService.createPostClassified(payload);
    console.log(data, 'data >>>>>>>>');

    // console.log(this.state.imagesArr,this.state.title, this.state.description, this.state.price, this.state.url , this.state.phone, "valuess >>>>");
    this.setState({modalVisible: false});
  }

  cancel() {
    this.setState({modalVisible: false});
  }

  removeImage(index) {
    console.log('calling images');
    let imagesData = this.state.imagesArr;
    console.log(imagesData, index, 'imagesDataimagesDataimagesDataimagesData');
    imagesData.splice(index, 1);
    this.setState({imagesArr: imagesData}, () => {
      console.log(this.state.imagesArr, 'imagesArr >>>>');
    });
  }
  render() {
    const {modalVisible} = this.state;
    return (
      <View>
         {/* <View style={{backgroundColor:'white',marginTop:5}}>
          <RadioForm
            radio_props={radio_props}
            initial={0}
            onPress={value => {
              this.setState({value: value});
            }}
            formHorizontal={true}
            buttonWrapStyle={{marginLeft: 10}}
            style={{marginLeft: 50}}
          />
        </View> */}
      <ScrollView>
        <View>
            <View style={{marginTop:'50%',alignSelf:'center'}}>
             <Button large shadowless round outline color='#5fbae8' onPress={()=> this.openSellPopup()} >Sell </Button>
           </View>
          <View style={{alignSelf:'center',marginTop:10}}>
          <Button large shadowless round outline color='#5fbae8' onPress={()=> this.openRentPopup()}>Rent </Button>
           
          </View>
          <View style={{alignSelf:'center',marginTop:10}}>
          <Button large shadowless round outline color='#5fbae8' onPress={()=> this.openProductPopup()}>Products & Services </Button>
           
          </View>
          </View>

       
      </ScrollView>
      </View>
    );
  }
}

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
    marginTop:5,
    borderRadius:1
  },
});

export default ProductsServices;
