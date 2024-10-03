import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  Text,
  InteractionManager,
  StyleSheet,
  Linking,
  Image,
  Dimensions,
  View,
  TouchableOpacity
} from 'react-native';
import {Block, theme as galioTheme, Button} from 'galio-framework';
import {human, systemWeights, iOSColors} from 'react-native-typography';
import {useStoreActions} from 'easy-peasy';
import check from 'check-types';
import ImageZoom from 'react-native-image-pan-zoom';
import ModalImageViewer from '../../Components/Stateless/ModalImageViewer';

import {
  Divider,
  Icon,
  Loader,
  NoData,
  Navbar,
  RupeeIcon,
} from '../../Components/Stateless';
import NavigationService from '../../Navigation';
import {ApiService, StoreService} from '../../Store';
import viewStyles from '../../Styles/ViewStyles';
import {STATUS} from '../../Constants';
import useTheme from '../../Themes/Context';
import colors from '../../Themes/Colors';

const ClassifiedScreen = ({navigation}) => {
  const {item} = navigation.state.params;
  console.log(item,'item >>>>>')
  const {theme} = useTheme();

  const width = Dimensions.get('window')
  console.log(width,"width >>>")
  const height = width.width * 0.6  //60 %
  console.log(height,"height >>>")

  const loadLikedList = useStoreActions(
    actions => actions.classifieds.loadUserData,
  );
  const [liked, setLiked] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(STATUS.NOT_STARTED);
  const [data, setData] = useState(null);
  const [_isLiked, setIsLiked] = useState(false);
  const [isLikeInProgress, setIsLikeInProgress] = useState(false);
  const [items, setItems] = useState([]);
  const [isImageViewerModalVisible, setIsImageViewerModalVisible] = useState(
    false,
  );
  const [imageViewerIndex, setImageViewerIndex] = useState(0);

  async function load() {
    setNetworkStatus(STATUS.FETCHING);

    const response = await ApiService.fetchClassifiedItemData({
      classifiedId: item.id,
    });
    console.log(response, 'res >>>');
    if (response.ok) {
      setNetworkStatus(STATUS.SUCCESS);
      // setLiked(response.data.isLiked)
      // merge incoming response with the 'item' param in route
      _setData({...item, ...response.data});
    } else {
      setNetworkStatus(STATUS.FAILED);
    }
  }


  const onPressMediaItem = index => {
    console.log('calling >>> images viewer');
    setImageViewerIndex(index);
    setIsImageViewerModalVisible(true);
   
  };

  // const onZomm =(data)=>{
  //   console.log(data ,"data >>>>")
  //   return (
  //     <ImageZoom cropWidth={Dimensions.get('window').width}
  //                cropHeight={Dimensions.get('window').height}
  //                imageWidth={200}
  //                imageHeight={200}>
  //         <Image style={{width:200, height:200}}
  //                source={{uri:data}}/>
  //     </ImageZoom>
  // )
  // }

  async function toggleLike() {
    setIsLikeInProgress(true);
    console.log(
      StoreService.getState().login.id,
      _isLiked,
      item.id,
      'details >>',
    );

    console.log(
      StoreService.getState().login.id,
      _isLiked,
      item.id,
      'details after set  >>',
    );
    const response = await ApiService.postClassifiedItemLikeData({
      OwnerID: StoreService.getState().login.id,
      BuilderClassifiedsID: item.id,
      isliked: !_isLiked,
    });
    console.log(response, 'response >>>>> after');
    if (response.ok) {
      setIsLikeInProgress(false);
      load();
      if (response.data === 1) {
        setIsLiked(true);
      }
      if (response.data === 0) {
        setIsLiked(false);
      }
      loadLikedList();
    } else {
      setIsLikeInProgress(false);
    }
  }

  const onToggleLike = () => {
    toggleLike();
  };

  const _setData = data => {
    console.log(data, 'data >>>A AT SET DATA >>');
    const {title, description, phone, price, documents, isLiked} = data;
    const images = documents.map(uri => ({
      uri,
      freeHeight: true,
    }));
    console.log(isLiked, ' isLiked >>>');

    setData(data);
    setIsLiked(isLiked);

    const _items = [
      {
        label: null,
        value: () => (
          <Block row space="between">
            <Text style={{...human.title3, ...systemWeights.bold}}>
              {title}
            </Text>
          </Block>
        ),
        display: true,
      },
      {
        label: 'Project Details',
        value: description,
        display: true,
      },
      {
        label: 'Contact',
        value: phone,
        display: true,
      },
      {
        label: 'Price Per Sq. Ft.',
        value: () => (
          <Block row>
            <Block row middle>
              {check.assigned(price) ? (
                <>
                  <RupeeIcon size={12} style={{marginRight: 2}} />
                  <Text style={{...human.subhead, ...systemWeights.bold}}>
                    {price}
                  </Text>
                </>
              ) : (
                <Text style={{...human.subhead}}>{price || '-'}</Text>
              )}
            </Block>
          </Block>
        ),
        display: true,
      },
      {
        label: 'Documents',
        value: () =>
          documents && documents.length === 0
            ? null
            : documents.map((url, index) => (
                <>
                 <View style={{marginTop:50 }} key={index}>
                    <ScrollView style={{flex:1}}>
                   <TouchableOpacity onPress={()=> onPressMediaItem(index)}>
                   <Image
                      source={{
                        uri: url,
                      }}
                      style={{
                        width: 300,
                        height: 150,
                        // resizeMode: 'contain',
                        alignSelf:'center'
                      }}
                    />
                   </TouchableOpacity>
                    </ScrollView>

                    <ModalImageViewer
                      visible={isImageViewerModalVisible}
                      images={images}
                      imageIndex={imageViewerIndex}
                      onRequestClose={() => setIsImageViewerModalVisible(false)}
                    />
                 
                    </View>
                  {/* <Block>
                    <View style={{marginTop:50}}>
                    <ScrollView   pagingEnabled  style={{width:'100%',height:200}} >
                    <Image
                      source={{
                        uri: url,
                      }}
                      style={{width:'100%',height:200,resizeMode:'contain'}}
                    />
                    </ScrollView>
                    </View>
                    
                    {/* {() => (
                  <Text
                    onPress={() => Linking.openURL(url)}
                    style={viewStyles.linkText}
                  >
                    {`Document ${index}`}
                  </Text>
                )} */}
                  {/* </Block> */}
                  <Divider small />
                </>
              )),
        display: true,
      },
    ];

    setItems(_items);
  };

  useEffect(() => {
    setNetworkStatus(STATUS.FETCHING);

    InteractionManager.runAfterInteractions(() => {
      load();
    });
  }, [_isLiked,isImageViewerModalVisible,imageViewerIndex]);

  if (networkStatus === STATUS.FETCHING) {
    return (
      <Block style={viewStyles.mainContainer}>
        <Loader />
      </Block>
    );
  }

  if (networkStatus === STATUS.FAILED) {
    return (
      <Block middle style={viewStyles.mainContainer}>
        <NoData text="Something went wrong" />
      </Block>
    );
  }

  return (
    <>
      <Block style={viewStyles.mainContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Divider small />
          {items.map((item, index) => (
            <Item key={index} {...item} />
          ))}
          {/* <TouchableOpacity onPress={onToggleLike} style={styles.likeButton}>
            <Icon
              type='AntDesign'
              name={_isLiked ? 'heart' : 'hearto'}
              color={_isLiked ? iOSColors.red : colors.grey500}
            />
          </TouchableOpacity> */}
          <Divider large />
        </ScrollView>
        <Block style={[styles.floatingButtonContainer]}>
          <Button
            onPress={onToggleLike}
            loading={isLikeInProgress}
            round
            size="small"
            color={_isLiked ? iOSColors.red : theme.colors.primary}>
            <Block row>
              {!_isLiked && (
                <>
                  <Icon name="heart" color={colors.white} />
                  <Divider small vertical />
                </>
              )}
              <Text style={{...human.bodyWhite}}>
                {_isLiked ? 'Unlike' : 'Like'}
              </Text>
            </Block>
          </Button>
        </Block>
      </Block>
    </>
  );
};

ClassifiedScreen.navigationOptions = ({navigation, screenProps}) => {
  const {navbarTitle} = navigation.state.params;

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => NavigationService.goBack()}
      />
    ),
  };
};

const Item = ({label, value, display}) => {
  if (!display) {
    return <></>;
  }

  const _label = () => {
    if (check.not.assigned(label)) {
      return <></>;
    }

    return (
      <>
        <Text
          style={{
            ...human.caption2,
            color: iOSColors.gray,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
          {label}
        </Text>
        <Divider small />
      </>
    );
  };

  const _value = () => {
    if (check.function(value)) {
      return value();
    }

    return <Text style={{...human.subhead}}>{value}</Text>;
  };

  return (
    <Block style={styles.item}>
      {_label()}
      {_value()}
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: galioTheme.SIZES.BASE,
  },
  item: {
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.customGray,
    marginBottom: galioTheme.SIZES.BASE * 2,
  },
  floatingButtonContainer: {
    alignItems: 'center',
    borderRadius: galioTheme.SIZES.BASE * 2,
    flex: 1,
    margin: galioTheme.SIZES.BASE,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ClassifiedScreen;
