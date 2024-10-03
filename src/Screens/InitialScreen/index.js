
import React, { useState } from 'react'
import { View, Text, Image, Dimensions, StyleSheet, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import colors from '../../Themes/Colors'
import LoginScreen from '../Login';
import Icon from "react-native-dynamic-vector-icons";
import { Item } from 'native-base';

const windowWidth = Dimensions.get('window').width;
//  const maintenanceIcon = Icon.getImageSourceSync('rupee-sign', 24, 'white');

export const EventsData = [
    {
        id: 1,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 2,
        title: 'The Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 3,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 4,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 5,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
];

export const AccountsData = [
    {
        id: 21,
        // name: 'rupee-sign',
        name: 'calculator',
        type: 'AntDesign',
        title: 'Maintenance',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        //  image: {maintenanceIcon},
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 22,
        name: 'appstore1',
        type: 'AntDesign',
        title: 'Corpus',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 23,
        // name: 'home-repair-service',
        // type: 'MaterialIcons',
        name: 'solution1',
        type: 'AntDesign',
        title: 'Essentials',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 24,
        name: 'API',
        type: 'AntDesign',
        title: 'Events',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 25,
        name: 'table',
        type: 'AntDesign',
        title: 'Income and Expenditure Statements',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
];

export const VisitorsData = [
    {
        id: 11,
        title: 'Maintenance',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 12,
        title: 'The Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 13,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 14,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 15,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
];

export const BookingsData = [
    {
        id: 31,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 32,
        title: 'The Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 33,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 34,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 35,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
];

export const ActivitiesData = [
    {
        id: 11,
        title: 'Maintenance',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 12,
        title: 'The Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 13,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 14,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 15,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
];

export const ManyOthersData = [
    {
        id: 11,
        title: 'Maintenance',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 12,
        title: 'The Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 13,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 14,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
    {
        id: 15,
        title: 'The Polo Event',
        image: 'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80',
        text: 'An enthralling match between Warriors and the Devils.',
        date: '26/01/2021',
    },
];




const InitialScreen = () => {
    // const carouselRef = React.createRef();
    // const [activeIndex, setActiveIndex] = useState(0)
    const [eventsActiveIndex, setEventsActiveIndex] = useState(0)
    const [accountsActiveIndex, setAccountsActiveIndex] = useState(0)
    const [visitorsActiveIndex, setVisitorsActiveIndex] = useState(0)
    const [bookingsActiveIndex, setBookingsActiveIndex] = useState(0)
    const [activitiesActiveIndex, setActivitiesActiveIndex] = useState(0)
    const [manyOthersActiveIndex, setManyOthersActiveIndex] = useState(0)
    const [loginKey, setLoginKey] = useState(false)

    const _renderItemEvents = ({ item, index }) => {
        console.log(item, "item carouse");
        return (
            <View>
                <Image source={{ uri: item.image }} style={{ width: windowWidth - 40, height: windowWidth / 2 }} resizeMode="cover" />
            </View>
        );
    };

    const _renderItemAccounts = ({ item, index }) => {
        console.log(item, "item carouse");
        return (
            <View>
                <View style={{ width: 100, height: 40, borderRadius: 5, marginLeft: 10, marginRight: 10 }}>
                    <Icon
                        name={item.name}
                        type={item.type}
                        size={30}
                        color="purple"
                        onPress={() => { }}
                        backgroundColor="#3b5998"
                    >
                    </Icon>
                </View>
                <View style={{ fontSize: 24,  fontFamily: 'sans-serif-condensed', textAlign: 'center', color: 'white' }}>
                    <Text>
                        {item.title}
                    </Text>
                </View>
            </View>
        );
    };

    const _renderItemVisitors = ({ item, index }) => {
        console.log(item, "item carouse");
        return (
            <View>
                <Image source={{ uri: item.image }} style={{ width: 100, height: 80, borderRadius: 5, marginLeft: 10, marginRight: 10 }} />
            </View>
        );
    };

    const _renderItemBookings = ({ item, index }) => {
        console.log(item, "item carouse");
        return (
            <View>
                <Image source={{ uri: item.image }} style={{ width: 100, height: 80, borderRadius: 5, marginLeft: 10, marginRight: 10 }} />
            </View>
        );
    };

    const _renderItemActivities = ({ item, index }) => {
        console.log(item, "item carouse");
        return (
            <View>
                <Image source={{ uri: item.image }} style={{ width: 100, height: 80, borderRadius: 5, marginLeft: 10, marginRight: 10 }} />
            </View>
        );
    };

    const _renderItemManyOthers = ({ item, index }) => {
        console.log(item, "item carouse");
        return (
            <View>
                <Image source={{ uri: item.image }} style={{ width: 100, height: 80, borderRadius: 5, marginLeft: 10, marginRight: 10 }} />
            </View>
        );
    };


    // const pagination = () => {
    //     console.log('calling pagination');
    //     return (
    //         <Pagination
    //             dotsLength={ActivitiesData.length}
    //             activeDotIndex={activeIndex}
    //             containerStyle={{ backgroundColor: 'white' }}
    //             dotStyle={{
    //                 width: 10,
    //                 height: 10,
    //                 borderRadius: 5,
    //                 marginHorizontal: 8,
    //                 //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
    //                 backgroundColor: 'black'
    //             }}
    //             inactiveDotStyle={{
    //                 // Define styles for inactive dots here
    //             }}
    //             inactiveDotOpacity={0.4}
    //             inactiveDotScale={0.6}
    //         />
    //     );
    // }

    const eventsPagination = () => {
        console.log('calling eventsPagination');
        return (
            <Pagination
                dotsLength={EventsData.length}
                activeDotIndex={eventsActiveIndex}
                containerStyle={{ backgroundColor: 'white' }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
                    backgroundColor: 'black'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    const accountsPagination = () => {
        console.log('calling accountsPagination');
        return (
            <Pagination
                dotsLength={AccountsData.length}
                activeDotIndex={accountsActiveIndex}
                containerStyle={{ backgroundColor: 'white' }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
                    backgroundColor: 'black'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    const visitorsPagination = () => {
        console.log('calling visitorsPagination');
        return (
            <Pagination
                dotsLength={VisitorsData.length}
                activeDotIndex={visitorsActiveIndex}
                containerStyle={{ backgroundColor: 'white' }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
                    backgroundColor: 'black'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    const bookingsPagination = () => {
        console.log('calling bookingsPagination');
        return (
            <Pagination
                dotsLength={BookingsData.length}
                activeDotIndex={bookingsActiveIndex}
                containerStyle={{ backgroundColor: 'white' }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
                    backgroundColor: 'black'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    const activitiesPagination = () => {
        console.log('calling activitiesPagination');
        return (
            <Pagination
                dotsLength={ActivitiesData.length}
                activeDotIndex={activitiesActiveIndex}
                containerStyle={{ backgroundColor: 'white' }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
                    backgroundColor: 'black'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    const manyOthersPagination = () => {
        console.log('calling manyOthersPagination');
        return (
            <Pagination
                dotsLength={ManyOthersData.length}
                activeDotIndex={manyOthersActiveIndex}
                containerStyle={{ backgroundColor: 'white' }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
                    backgroundColor: 'black'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    const moveToLogin = () => {
        setLoginKey(true)
    }

    return (
        <View style={styles.container}>
            {loginKey ? (
                <LoginScreen />
            ) : (
                <View>
                    <View style={{ marginTop: 24, paddingBottom: 24 }}>
                        <View style={{ backgroundColor: colors.blue300, padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 24, color: 'white' }} >myflatinfo</Text>
                            <TouchableOpacity onPress={() => moveToLogin()}>
                                <Text style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, color: colors.blue300, fontSize: 18 }}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView style={{ marginBottom: 100 }}>

                        <View style={{ margin: 20 }}>
                            <Carousel
                                ref={(c) => { this._carousel = c; }}
                                data={EventsData && EventsData}
                                renderItem={_renderItemEvents}
                                sliderWidth={windowWidth - 40}
                                itemWidth={windowWidth - 40}
                                layout={'default'}
                                onSnapToItem={(index) => setEventsActiveIndex(index)}
                            />
                            {eventsPagination()}
                        </View>

                        <View style={styles.wrapper}>
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.headingText}>Accounts</Text>
                                <View style={{ backgroundColor: 'white', paddingTop: 10 }}>
                                    <Carousel
                                        ref={(c) => { this._carousel = c; }}
                                        data={AccountsData && AccountsData}
                                        renderItem={_renderItemAccounts}
                                        sliderWidth={windowWidth - 40}
                                        itemWidth={100}
                                        layout={'default'}
                                        onSnapToItem={(index) => setAccountsActiveIndex(index)}
                                    />
                                    {accountsPagination()}
                                </View>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.headingText}>Visitors</Text>
                                <View style={{ backgroundColor: 'white', paddingTop: 10 }}>
                                    <Carousel
                                        ref={(c) => { this._carousel = c; }}
                                        data={VisitorsData && VisitorsData}
                                        renderItem={_renderItemVisitors}
                                        sliderWidth={windowWidth - 40}
                                        itemWidth={100}
                                        layout={'default'}
                                        onSnapToItem={(index) => setVisitorsActiveIndex(index)}
                                    />
                                    {visitorsPagination()}
                                </View>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.headingText}>Bookings</Text>
                                <View style={{ backgroundColor: 'white', paddingTop: 10 }}>
                                    <Carousel
                                        ref={(c) => { this._carousel = c; }}
                                        data={BookingsData && BookingsData}
                                        renderItem={_renderItemBookings}
                                        sliderWidth={windowWidth - 40}
                                        itemWidth={100}
                                        layout={'default'}
                                        onSnapToItem={(index) => setBookingsActiveIndex(index)}
                                    />
                                    {bookingsPagination()}
                                </View>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.headingText}>Activities</Text>
                                <View style={{ backgroundColor: 'white', paddingTop: 10 }}>
                                    <Carousel
                                        ref={(c) => { this._carousel = c; }}
                                        data={ActivitiesData && ActivitiesData}
                                        renderItem={_renderItemActivities}
                                        sliderWidth={windowWidth - 40}
                                        itemWidth={100}
                                        layout={'default'}
                                        onSnapToItem={(index) => setActivitiesActiveIndex(index)}
                                    />
                                    {activitiesPagination()}
                                </View>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.headingText}>Many Others</Text>
                                <View style={{ backgroundColor: 'white', paddingTop: 10 }}>
                                    <Carousel
                                        ref={(c) => { this._carousel = c; }}
                                        data={ManyOthersData && ManyOthersData}
                                        renderItem={_renderItemManyOthers}
                                        sliderWidth={windowWidth - 40}
                                        itemWidth={100}
                                        layout={'default'}
                                        onSnapToItem={(index) => setManyOthersActiveIndex(index)}
                                    />
                                    {manyOthersPagination()}
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{ backgroundColor: colors.blue300, padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 10, color: 'white' }} >@ all rights reserved - JTECHS 2021</Text>
                            </View>
                        </View>
                    </ScrollView>

                </View>
            )}

        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7f7'
    },
    header: {
        backgroundColor: colors.blue300,
        padding: 15, color: 'white', fontSize: 24
    },
    wrapper: {
        margin: 20
    },
    imageStyle: { width: 350, height: 150, marginLeft: 5 },
    headingText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    iconStyle: { marginRight: 15, marginLeft: 15 }
})

export default InitialScreen






















// import React, { useEffect } from 'react'
// import {View ,Text ,StyleSheet,Image, ScrollView} from 'react-native'
// import colors from '../../Themes/Colors'
// import AntDesign from 'react-native-vector-icons/AntDesign'

//  const InitialScreen =()=>{

//   useEffect(()=>{

//   })

//   return(
//       <View style={styles.container}>
//          <ScrollView>
        //  <View style={{marginTop:24}}>
        //       <Text style={styles.header}>MyFlatInfo</Text>
        //   </View>
//           <View style={styles.wrapper}>
//              <ScrollView horizontal={true} disableIntervalMomentum={true}>
//              <Image source={{uri:'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80'}} style={styles.imageStyle} />
//              <Image source={{uri:'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80'}} style={styles.imageStyle} />
//              <Image source={{uri:'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80'}} style={styles.imageStyle} />
//              <Image source={{uri:'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80'}} style={styles.imageStyle} />
//              <Image source={{uri:'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80'}} style={styles.imageStyle} />
//              <Image source={{uri:'https://images.unsplash.com/photo-1451153378752-16ef2b36ad05?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1947&q=80'}} style={styles.imageStyle} />          
//              </ScrollView>
//           </View>
//           <View style={styles.wrapper}>
//              <View>
//              <Text style={styles.headingText}>Activities</Text>
//               <View style={{backgroundColor:'white',padding:20,borderRadius:5}}>
//                 <ScrollView horizontal={true}>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>

//                 </ScrollView>
//               </View>
//              </View>

//              <View style={{marginTop:15}}>
//              <Text style={styles.headingText}>Accounts</Text>
//               <View style={{backgroundColor:'white',padding:20,borderRadius:5}}>
//                 <ScrollView horizontal={true}>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>

//                 </ScrollView>
//               </View>
//              </View>

//              <View style={{marginTop:15}}>
//              <Text style={styles.headingText}>Support</Text>
//               <View style={{backgroundColor:'white',padding:20,borderRadius:5}}>
//                 <ScrollView horizontal={true}>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>
//                 <AntDesign name="creditcard" size={80} color={colors.blue300} style={styles.iconStyle}/>

//                 </ScrollView>
//               </View>
//              </View>
//           </View>
//           {/* <View style={styles.wrapper}>

//           </View> */}
//          </ScrollView>
//       </View>
//   )
// }
// const styles=StyleSheet.create({
//     container:{
//         flex:1,
//         backgroundColor:'#f5f7f7'
//     },
//     header:{
//         backgroundColor:colors.blue300,
//         padding:15,color:'white',fontSize:24
//     },
//     wrapper:{
//         margin:20
//     },
//     imageStyle:{width:350,height:150,marginLeft:5},
//     headingText:{fontSize:16,fontWeight:'bold',marginBottom:10},
//     iconStyle:{marginRight:15,marginLeft:15}
// })
// export default InitialScreen