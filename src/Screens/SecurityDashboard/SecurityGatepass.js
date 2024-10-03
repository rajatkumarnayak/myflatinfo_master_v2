import { Item } from 'native-base'
import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { StoreService, ApiService } from '../../Store'

class SecurityGatepass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      data: []
    }
    console.log('calling again')
  }

  componentDidMount() {
    this.getGatepass()
  }
  onRefresh = () => {
    this.setState({ isFetching: true, }, () => {
      this.getGatepass();
      this.setState({ isFetching: false })
    });
  }

  ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>
        <Text style={{textAlign: 'center'}}> No records found... Try Again.</Text>
      </View>
 
    );
  }


  renderItem = (item, index) => {
    console.log(item, "item >>>>");
    return (
      <View style={{ backgroundColor: 'white', borderRadius: 5, padding: 15, paddingTop: 0, marginTop: 10, paddingRight: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.item.visitorName}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ padding: 10, backgroundColor: item.item.status == 1 ? 'orange' : item.item.status == 4 ? 'green' : null, borderBottomLeftRadius: 10, color: 'white' }}>{item.item.status == 1 ? 'On Going' : item.item.status == 4 ? 'Completed' : null}</Text>
          </View>
        </View>
        <View>
          <View style={{ marginTop: 5 }}>
            <View>
              {item.item.entryDateTime ? (<Text>Valid From   :  {`${item.item.entryDateTime}`}</Text>) : (<Text>Valid From    :  {`-`}</Text>)}
              {item.item.exitDateTime ? (<Text>Valid Unti     :  {`${item.item.exitDateTime}`}</Text>) : (<Text>Valid Unti    :  {`-`}</Text>)}
            </View>
          </View>
        </View>
      </View>
    )

  }
  getGatepass = async () => {
    const payload = {
      BuildingId: StoreService.getState().app.building.id
    }
    const response = await ApiService.securityGatepass(payload);
    console.log(response, "response lllat he ml>> gatepass");
    this.setState({ data: response.data }, () => {
      console.log(this.state.data, "data :;;");
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ margin: 20 }}>
        <FlatList
              data={this.state.data}
              renderItem={this.renderItem}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isFetching}
              ListEmptyComponent={this.ListEmptyView}
            />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
export default SecurityGatepass