import React, {Component} from 'react';
import {Tab, Tabs} from 'native-base';
import {View, Text} from 'react-native';
import {Container, Navbar, Divider} from '../../Components/Stateless';
import viewStyles from '../../Styles/NavigationStyles';
import {Radio} from 'galio-framework';
import NavigationService from '../../Navigation';
import MyPosts from './MyPosts';
import BrowseClassifieds from './BrowseClassifieds';
import BrowseMyBuilding from './BrowseMyBuilding';
import MyPostMyBuilding from './MyPostMyBuilding'
import SellRentClassifieds from './SellRentClassifieds';
import ProductsServices from './ProductsServices';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
// const UserClassifieds = ({ navigation }) =>
var radio_props = [
  {label: 'All Buildings                       ', value: 1},
  {label: 'My Building ', value: 2},
];
class UserClassifieds extends Component {
  constructor() {
    super();
    this.state = {
      value: 1,
      allBuilding: true,
      // radioScope:
    };
  }

  componentDidMount(){
    // this.renderAllBuilding()
  }
  renderAllBuilding() {
    this.setState({allBuilding: this.state.value}, () => {
      console.log(this.state.allBuilding, 'all Buildings value >>>>>');
      this.setState({myBuilding: !this.state.allBuilding});
    });
  }
 

  renderMyBuilding(value) {
    console.log(value, 'value >>> at all mYbuildoing');
  }
  render() {
    return (
      <Container
      // status={status}
      // failureReason={failureReason}
      // license={license}
      // data={data}
      // onLoad={() => onLoad()}
      >
        {/* <Divider large /> */}
        <View style={{backgroundColor: 'white'}}>
          <RadioForm
            radio_props={radio_props}
             //initial={1}
            onPress={value => {
              this.setState({value: value});
            }}
            formHorizontal={true}
            buttonWrapStyle={{marginLeft: 10}}
            style={{marginLeft: 50}}
            buttonColor={'#5fbae8'}
            selectedButtonColor={'#5fbae8'}
            // buttonOuterColor={this.state.value3Index === i ? '#70C2D8' : '#000'}
          />
        </View>

        <Tabs tabBarUnderlineStyle={viewStyles.tabBarUnderlineStyle}>
          {this.state.value == 1 ? (
            <Tab
              heading="Sell/Rent"
              tabStyle={viewStyles.tabStyle}
              activeTabStyle={viewStyles.activeTabStyle}
              textStyle={viewStyles.tabTextStyle}
              activeTextStyle={viewStyles.activeTabTextStyle}>
              <SellRentClassifieds data={this.state.value} />
            </Tab>
          ) : (
            <Tab
              heading="Sell/Rent"
              tabStyle={viewStyles.tabStyle}
              activeTabStyle={viewStyles.activeTabStyle}
              textStyle={viewStyles.tabTextStyle}
              activeTextStyle={viewStyles.activeTabTextStyle}>
               <ProductsServices data={this.state.value} />
            </Tab>
          )}

          {this.state.value == 1? (
            <Tab
              heading="Browse"
              tabStyle={viewStyles.tabStyle}
              activeTabStyle={viewStyles.activeTabStyle}
              textStyle={viewStyles.tabTextStyle}
              activeTextStyle={viewStyles.activeTabTextStyle}>
              <BrowseClassifieds data={this.state.value} />
            </Tab>
          ) : (
            <Tab
              heading="Browse"
              tabStyle={viewStyles.tabStyle}
              activeTabStyle={viewStyles.activeTabStyle}
              textStyle={viewStyles.tabTextStyle}
              activeTextStyle={viewStyles.activeTabTextStyle}>
              <BrowseMyBuilding data={this.state.value} />
            </Tab>
          )}

          {this.state.value == 1 ? (
             <Tab
             heading="MyPosts"
             tabStyle={viewStyles.tabStyle}
             activeTabStyle={viewStyles.activeTabStyle}
             textStyle={viewStyles.tabTextStyle}
             activeTextStyle={viewStyles.activeTabTextStyle}>
             <MyPosts data={this.state.value} />
           </Tab>
          ):(
            <Tab
            heading="MyPosts"
            tabStyle={viewStyles.tabStyle}
            activeTabStyle={viewStyles.activeTabStyle}
            textStyle={viewStyles.tabTextStyle}
            activeTextStyle={viewStyles.activeTabTextStyle}>
             <MyPostMyBuilding data={this.state.value} />
          </Tab>
          )}

         
        </Tabs>
      </Container>
    );
  }
}
UserClassifieds.navigationOptions = ({navigation, screenProps}) => {
  const {navbarTitle} = navigation.state.params;
  console.log(navbarTitle, 'navbarTitle >>>>');

  return {
    header: (
      <Navbar
        title={navbarTitle}
        onPressBack={() => NavigationService.goBack()}
      />
    ),
  };
};
export default UserClassifieds;




















// import React from 'react'
// import { Text } from 'react-native'
// import { Block, theme as galioTheme } from 'galio-framework'
// import { human, systemWeights } from 'react-native-typography'

// import { Divider } from '../../Components/Stateless'
// import colors from '../../Themes/Colors'

// const UserClassifiedListItemContent = ({ data }) => {
//   console.log(data, 'data fromm main valiue >>>')
  
//   const { title, description, price, phone, builderName } = data

//   return (
//     <Block flex row space='between' style={{ padding: galioTheme.SIZES.BASE, paddingRight: 0 }}>
//       <Block>
//       <Text
//           numberOfLines={1}
//           style={{ ...human.subhead, ...systemWeights.bold }}
//         >
//           {builderName}
//         </Text>
//         <Text
//           numberOfLines={1}
//           style={{ ...human.subhead, ...systemWeights.bold }}
//         >
//           {title}
//         </Text>
//         <Text
//           numberOfLines={2}
//           style={{ ...human.footnote, color: colors.grey400 }}
//         >
//           {description}
//         </Text>
//         <Divider small />
//         <Block row>
//           <Block>
//             <Text style={{ ...human.caption2 }}>
//               Price per Sq. Ft.
//             </Text>
//             <Text style={{ ...human.caption1, ...systemWeights.semibold }}>
//               {price || '-'}
//             </Text>
//           </Block>
//           <Divider vertical />
//           <Block>
//             <Text style={{ ...human.caption2 }}>
//               Contact
//             </Text>
//             <Text style={{ ...human.caption1, ...systemWeights.semibold }}>
//               {phone || '-'}
//             </Text>
//           </Block>
//         </Block>
//       </Block>
//     </Block>
//   )
// }

// export default UserClassifiedListItemContent

