import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Block, theme as galioTheme } from 'galio-framework'
import { Picker } from 'native-base'
import { Overlay } from 'react-native-elements'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { human, systemWeights, iOSColors } from 'react-native-typography'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import check from 'check-types'
import moment from 'moment'

import { FloatingActionButton, RupeeIcon, Divider, DatePicker, AccountsListing as Listing, NoData } from '../../Components/Stateless'
import colors from '../../Themes/Colors'
import viewStyles from '../../Styles/ViewStyles'
import { API_REQUEST_DATE_FORMAT } from '../../Constants'
import { formattedMoney } from '../../Utils/Utils'
import { DEFAULT_SELECTED_FILTER_ITEM_ID, DEFAULT_START_DATE, DEFAULT_END_DATE, TYPE_FILTER_DONATION_ITEM_ID } from '../../Utils/Cashflow'

// const CashflowBlockHighlighted = () => {
//   return (
//     <Block center>
//       <Text style={{ ...human.body, ...systemWeights.bold, marginBottom: 15 }}>November 2019</Text>
//       <Block row>
//         <Block>
//           <Text style={{ ...human.footnote, marginBottom: 5, textAlign: 'right' }}>Income</Text>
//           <Block row>
//             <Text style={{ ...human.title2, ...systemWeights.bold, color: iOSColors.blue }}>+</Text>
//             <RupeeIcon style={styles.currency} />
//             <Text style={{ ...human.title2, ...systemWeights.bold, color: iOSColors.blue }}>
//               {`${'82,300'}`}
//             </Text>
//           </Block>
//         </Block>
//         <Block style={styles.verticalDivider} />
//         <Block>
//           <Text style={{ ...human.footnote, marginBottom: 5, textAlign: 'left' }}>Expense</Text>
//           <Block row>
//             <Text style={{ ...human.title2, ...systemWeights.bold, color: iOSColors.pink }}>-</Text>
//             <RupeeIcon style={styles.currency} />
//             <Text style={{ ...human.title2, ...systemWeights.bold, color: iOSColors.pink }}>
//               {`${'77,600'}`}
//             </Text>
//           </Block>
//         </Block>
//       </Block>
//     </Block>
//   )
// }

// const CashflowBlock = ({ data }) => {
//   return (
//     <Block style={styles.block}>
//       <Text style={{ ...human.body, ...systemWeights.bold, marginBottom: 10 }}>November 2019</Text>
//       <Block row space='between'>
//         <Text style={{ ...human.caption2 }}>Income</Text>
//         <Block row>
//           <Text style={{ ...human.caption1, ...systemWeights.bold, color: iOSColors.blue }}>+</Text>
//           <RupeeIcon style={styles.currencySmall} />
//           <Text style={{ ...human.caption1, ...systemWeights.bold, color: iOSColors.blue }}>
//             {`${'82,300'}`}
//           </Text>
//         </Block>
//       </Block>
//       <Block row space='between'>
//         <Text style={{ ...human.caption2 }}>Expense</Text>
//         <Block row>
//           <Text style={{ ...human.caption1, ...systemWeights.bold, color: iOSColors.pink }}>-</Text>
//           <RupeeIcon style={styles.currencySmall} />
//           <Text style={{ ...human.caption1, ...systemWeights.bold, color: iOSColors.pink }}>
//             {`${'77,600'}`}
//           </Text>
//         </Block>
//       </Block>
//     </Block>
//   )
// }

const Status = ({ status }) => {
  return (
    <Block
      middle
      style={{
        ...styles.status,
        backgroundColor: status === 1
          ? iOSColors.blue
          : iOSColors.red
      }}
    >
      <Icon
        name={status === 1
          ? 'plus'
          : 'minus'}
        size={40}
        color={iOSColors.white}
      />
    </Block>
  )
}

const BalanceTag = ({ text, amount, color, icon, currencyComponent }) => {
  return (
    <Block row middle style={{ backgroundColor: color, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 }}>
      <Icon
        size={16}
        name={icon}
        style={{ marginRight: 5 }}
        color={colors.white}
      />
      <Block middle bottom style={{ backgroundColor: colors.white, borderRadius: 2, paddingHorizontal: 8, paddingVertical: 2 }}>
        <Text style={{ ...human.caption2, fontSize: 8, lineHeight: 8, marginTop: 2 }}>{text}</Text>
        <Block row>
          <Block row middle>
            {currencyComponent()}
            <Text style={{ ...human.footnote, ...systemWeights.bold, marginLeft: 2 }}>{amount}</Text>
          </Block>
        </Block>
      </Block>
    </Block>
  )
}

const Cashflow = ({ navigation }) => {
  const building = useStoreState(state => state.app.building)
  const load = useStoreActions(actions => actions.cashflows.load)
  const loadFilterList = useStoreActions(actions => actions.cashflows.loadFilterList)
  const { data, cashBalance, bankBalance, filterData, status } = useStoreState(state => ({ ...state.cashflows }))
  console.log(data ,"data >> jjsjsj");
  console.log(cashBalance ,filterData ,"cashBalance >>>> filterData");
  const [isFilterModalVisible, setFilterModalVisibility] = useState(false)
  const [areFiltersActive, setFiltersActiveState] = useState(false)
  const [selectedTypeFilterId, setSelectedTypeFilterId] = useState(DEFAULT_SELECTED_FILTER_ITEM_ID)
  const [selectedDonationTypeFilterId, setSelectedDonationTypeFilterId] = useState(DEFAULT_SELECTED_FILTER_ITEM_ID)
  const [startDate, setStartDate] = useState(DEFAULT_START_DATE)
  const [endDate, setEndDate] = useState(DEFAULT_END_DATE)

  // const onReset = () => {

  // }

  const renderListHeader = () => {
    if (check.emptyArray(filterData)) {
      return <></>
    }

    return (
      <Block row middle space='between' style={styles.listHeader}>
        <Text style={{ ...human.headline }}>{filterData[0].items.find(f => f.id === selectedTypeFilterId).text}</Text>
        <Block row>
          <BalanceTag
            text='Cash Balance'
            amount={formattedMoney(cashBalance)}
            icon='cash'
            color={iOSColors.tealBlue}
            currencyComponent={() => <RupeeIcon size={10} />}
          />
          <Block style={{ marginHorizontal: 5 }} />
          <BalanceTag
            text='Bank Balance'
            amount={formattedMoney(bankBalance)}
            icon='bank'
            color={iOSColors.purple}
            currencyComponent={() => <RupeeIcon size={10} />}
          />
          {/* <Block bottom>
            <Text style={{ ...human.caption2, fontSize: 8 }}>Bank Balance</Text>
            <Block row>
              <Block row middle>
                <RupeeIcon size={10} />
                <Text style={{ ...human.body, ...systemWeights.bold, marginLeft: 2 }}>{bankBalance}</Text>
              </Block>
            </Block>
          </Block> */}
        </Block>
      </Block>
    )
  }

  const onLoad = () => {
    const filters = []

    if (selectedTypeFilterId !== DEFAULT_SELECTED_FILTER_ITEM_ID) {
      filters.push({ filterId: selectedTypeFilterId })

      if (selectedTypeFilterId === TYPE_FILTER_DONATION_ITEM_ID &&
        selectedDonationTypeFilterId !== DEFAULT_SELECTED_FILTER_ITEM_ID) {
        filters[0].itemId = selectedDonationTypeFilterId
      }
    }

    return load({
      startDate: moment(startDate).format(API_REQUEST_DATE_FORMAT),
      endDate: moment(endDate).format(API_REQUEST_DATE_FORMAT),
      filters
    })
  }

  const resetFilters = () => {
    setSelectedTypeFilterId(DEFAULT_SELECTED_FILTER_ITEM_ID)
    setSelectedDonationTypeFilterId(DEFAULT_SELECTED_FILTER_ITEM_ID)
    setStartDate(DEFAULT_START_DATE)
    setEndDate(DEFAULT_END_DATE)
  }

  const _areFiltersActive = () => {
    return check.not.equal(selectedTypeFilterId, DEFAULT_SELECTED_FILTER_ITEM_ID) ||
      check.not.equal(selectedDonationTypeFilterId, DEFAULT_SELECTED_FILTER_ITEM_ID) ||
      check.not.equal(startDate, DEFAULT_START_DATE) ||
      check.not.equal(endDate, DEFAULT_END_DATE)
  }

  const renderFilters = () => {
    if (check.emptyArray(filterData)) {
      return <></>
    }

    return (
      <Block>
        <Block card>
          <Text style={styles.filterLabel}>
            {filterData[0].text}
          </Text>
          <Picker
            mode='dropdown'
            iosHeader={filterData[0].text}
            iosIcon={<Icon name='arrow-down' />}
            style={{ width: undefined }}
            selectedValue={selectedTypeFilterId}
            onValueChange={(value) => {
              setSelectedTypeFilterId(value)
              setSelectedDonationTypeFilterId(DEFAULT_SELECTED_FILTER_ITEM_ID)
            }}
          >
            {filterData[0].items.map(({ id, text }) => <Picker.Item label={text} value={id} key={id} />)}
          </Picker>
        </Block>
        <Divider />
        <Block card style={{ opacity: selectedTypeFilterId === TYPE_FILTER_DONATION_ITEM_ID ? 1 : 0.3 }}>
          <Text style={styles.filterLabel}>
            {filterData[1].text}
          </Text>
          <Picker
            mode='dropdown'
            iosHeader={filterData[1].text}
            iosIcon={<Icon name='arrow-down' />}
            style={{ width: undefined }}
            selectedValue={selectedDonationTypeFilterId}
            onValueChange={(value) => {
              setSelectedDonationTypeFilterId(value)
            }}
            enabled={selectedTypeFilterId === TYPE_FILTER_DONATION_ITEM_ID}
          >
            {filterData[1].items.map(({ id, text }) => <Picker.Item label={text} value={id} key={id} />)}
          </Picker>
        </Block>
        <Divider />
        <Block card>
          <Text style={styles.filterLabel}>Date Range</Text>
          <DatePicker
            initialRange={[startDate, endDate]}
            onSelect={(s, e) => {
              setStartDate(s)
              setEndDate(e)
            }}
          />
        </Block>
      </Block>
    )
  }

  useEffect(() => {
    loadFilterList()
  }, [building])

  useEffect(() => {
    setFiltersActiveState(_areFiltersActive())
    setFilterModalVisibility(false)
    onLoad()
  }, [
    building,
    selectedTypeFilterId,
    selectedDonationTypeFilterId,
    startDate,
    endDate
  ])

  return (
    <Block style={styles.container}>
      <Listing
        items={data}
        onLoad={onLoad}
        onRefresh={resetFilters}
        status={status}
        statusComponent={({ status }) => <Status status={status} />}
        renderListHeader={renderListHeader}
        alwaysDisplayHeader
        noDataComponent={() => <NoData/>}
      />
      <FloatingActionButton
        icon='filter-variant'
        color={colors.blue400}
        onPress={() => setFilterModalVisibility(true)}
        showDot={areFiltersActive}
      />
      <Overlay
        isVisible={isFilterModalVisible}
        onBackdropPress={() => setFilterModalVisibility(false)}
        windowBackgroundColor='rgba(0, 0, 0, .5)'
        overlayStyle={styles.modal}
        containerStyle={styles.modalContainer}
      >
        <>
          <Block row space='between' style={styles.modalHeader}>
            <Text style={styles.modalHeading}>Filters</Text>
            {
              areFiltersActive &&
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={{ ...human.caption1, color: iOSColors.blue }}>Clear Filters</Text>
                </TouchableOpacity>
            }
          </Block>
          <Block style={styles.modalContent}>
            {renderFilters()}
          </Block>
        </>
      </Overlay>
    </Block>
  )
}

const styles = StyleSheet.create({
  container: {
    ...viewStyles.mainContainer,
    paddingBottom: 0
  },
  listHeader: {
    marginHorizontal: galioTheme.SIZES.BASE,
    marginTop: galioTheme.SIZES.BASE
  },
  filterLabel: {
    ...human.caption2,
    color: iOSColors.gray,
    position: 'relative',
    top: 10,
    left: 8
  },
  filterItem: {
    borderColor: colors.grey300,
    borderRadius: 5,
    borderWidth: 1
  },
  filterDivider: {
    backgroundColor: colors.grey300,
    height: 40,
    marginRight: 8,
    marginTop: 10,
    width: 1
  },
  currency: { opacity: 0.5, marginHorizontal: 3, position: 'relative', top: 4 },
  verticalDivider: { height: 30, width: 1, backgroundColor: iOSColors.lightGray, marginHorizontal: 10 },
  currencySmall: { opacity: 0.5, marginHorizontal: 3, position: 'relative', top: 2, fontSize: 10 },
  status: {
    height: 100,
    width: 60
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 360,
    margin: 0,
    padding: 0,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  modalContent: {
    padding: 30
  },
  modalHeader: {
    marginHorizontal: 30,
    marginTop: 30
  },
  modalHeading: {
    ...human.title3,
    ...systemWeights.bold
  }
})

export default Cashflow
