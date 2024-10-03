import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StoreService, ApiService } from '../../Store'
import colors from '../../Themes/Colors'
import moment from 'moment'
import { GATEPASS_STATUS, GATEPASS_LIST_ITEM_DATETIME_DISPLAY_FORMAT } from '../../Constants'

class SecurityVisitors extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false,
      data: [],
      lastRefresh: Date(Date.now()).toString(),
    }
    this.refreshScreen = this.refreshScreen.bind(this)
    console.log('calling again')
  }

  componentDidMount() {
    this.getVisitors()
  }

  refreshScreen() {
    this.setState({ lastRefresh: Date(Date.now()).toString() })
  }

  onRefresh = () => {
    this.setState({ isFetching: true, }, () => {
      this.getVisitors();
      this.setState({ isFetching: false })
    });
  }

  updateEntryDateTime = async (currentVisitorId) => {
    const entryDateTime = new Date().toLocaleString();
    const response = await ApiService.updateVisitorItemData({
      "visitorId": currentVisitorId,
      "status": 1,
      "entryDateTime": entryDateTime
    });    
    console.log(response, "response >>>>>>");
  }

  updateExitDateTime = async (currentVisitorId) => {
    const exitDateTime = new Date().toLocaleString();
    const response = await ApiService.updateVisitorItemData({
      "visitorId": currentVisitorId,
      "status": 4,
      "exitDateTime": exitDateTime
    });        
    console.log(response, "response >>>>>>");
  }

  ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ textAlign: 'center' }}> No records... Try Again.</Text>
      </View>
    );
  }

  renderItem = (item, index) => {
    console.log(item, "item >>>>");
    const localVariableCreatedOnDate = item.item.createdOn;
    const localVariableEntryDate = item.item.entryDateTime;
    const localVariableExitDate = item.item.exitDateTime;

    return (
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.item.visitorName}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 2 }}>
            <Text style={{
              padding: 10,
              backgroundColor:
                item.item.status == 1 ? "orange"
                  : item.item.status == 2 ? "red"
                    : item.item.status == 3 ? colors.green300
                      : item.item.status == 4 ? "green"
                        : item.item.status == 5 ? "blue"
                          : item.item.status == 6 ? colors.red400
                            : null,
              borderBottomLeftRadius: 10, color: 'white'
            }}>
              {item.item.status == 1 ? 'On Going'
                : item.item.status == 2 ? 'Blocked'
                  : item.item.status == 3 ? 'Allow'
                    : item.item.status == 4 ? 'Completed'
                      : item.item.status == 5 ? 'Request Pending'
                        : item.item.status == 6 ? 'Requiest Expired'
                          : null}</Text>

          </View>

        </View>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              {item.item.createdOn ? (<Text>Created On   :  {`${moment(localVariableCreatedOnDate).format(GATEPASS_LIST_ITEM_DATETIME_DISPLAY_FORMAT)}`}</Text>) : (<Text>Created On   :  {`-`}</Text>)}
              {item.item.entryDateTime ? (<Text>Entry Time    :  {`${moment(localVariableEntryDate).format(GATEPASS_LIST_ITEM_DATETIME_DISPLAY_FORMAT)}`}</Text>) : (<Text>Entry Time    :  {`-`}</Text>)}
              {item.item.exitDateTime ? (<Text>Exit Time       :  {`${moment(localVariableExitDate).format(GATEPASS_LIST_ITEM_DATETIME_DISPLAY_FORMAT)}`}</Text>) : (<Text>Exit Time       :  {`-`}</Text>)}

            </View>

            <View>
              {item.item.status == 3
                ? <TouchableOpacity onPress={() => this.updateEntryDateTime(item.item.visitorId)}>
                  <Text style={{ backgroundColor: colors.green300, padding: 10, borderRadius: 5, color: 'black' }}>Enter</Text>
                </TouchableOpacity> : <Text> </Text>
              }

              {item.item.status == 1 ?
                <TouchableOpacity onPress={() => this.updateExitDateTime(item.item.visitorId)}>
                  <Text style={{ backgroundColor: colors.green300, padding: 10, borderRadius: 5, color: 'black' }}>Exit</Text>
                </TouchableOpacity> : <Text> </Text>
              }

            </View>

          </View>
        </View>
      </View>
    )
  }


  getVisitors = async () => {
    const payload = {
      BuildingId: StoreService.getState().app.building.id
    }
    const response = await ApiService.securityVisitors(payload);
    console.log(response, "response lllat he ml>>");
    this.setState({ data: response.data })
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
  },
  cardHeader: { backgroundColor: 'white', borderRadius: 5, padding: 15, paddingTop: 0, marginTop: 10, paddingRight: 0 }
})
export default SecurityVisitors