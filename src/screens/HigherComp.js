import React from 'react';
import { View, Text, AppState } from 'react-native';
import RtcEngine, { RtcLocalView, RtcRemoteView, VideoRenderMode } from 'react-native-agora';
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import requestCameraAndAudioPermission from '../permissions/permission';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/Drawer';
import Home from './Home';
import Cam from './Cam';
import InboxScreen from './InboxScreen';
import Profile from './Profile';
import ChatScreen from './ChatScreen';
import Performer from './Performer';



const Drawer = createDrawerNavigator();

function HigherComp() {
    const appId = "bbd961c37a6945318efd2ed41ae214c1";
    const [engine, setEngine] = React.useState(undefined);
    const [peerIds, setPeerIds] = React.useState([]);
    const [joinSucceed, setJoinSucceed] = React.useState(false);
    const [show, setShow] = React.useState(true);

    React.useEffect(() => {
        const subs = AppState.addEventListener('change', ()=> {
            if(AppState.currentState==="active"){
                console.log(AppState.currentState);
            }else{
                console.log(AppState.currentState);
            }
        });
        return () => {
            subs.remove();
        }
    },[]);

    React.useEffect(() => {
        // variable used by cleanup function
        let isSubscribed = true;

        // create the function
        const createEngine = async () => {
            // console.log("inside engine");
            try {
                if (Platform.OS === 'android') {
                    // Request required permissions from Android
                    await requestCameraAndAudioPermission();
                    setShow(true);
                }
                console.log("inside try");
                const rtcEngine = await RtcEngine.create(appId);
                await rtcEngine.enableVideo();
                

                // need to prevent calls to setEngine after the component has unmounted
                if (isSubscribed) {
                    setEngine(rtcEngine);
                }
            } catch (e) {
                console.log(e);
            }
        }

        // call the function
        if (!engine) createEngine();

        engine?.addListener('Warning', (warn) => {
            console.log('Warning', warn)
        })

        engine?.addListener('Error', (err) => {
            console.log('Error', err)
        })

        engine?.addListener('UserJoined', (uid, elapsed) => {
            console.log('UserJoined', uid, elapsed)
            // If new user
            // setWaiting(false);
            // let tim = setTimeout(() => {
            //     endCall(channel);
            //     joinRandomChannel();
            // },10000)
            // setTm(tim);
            if (peerIds.indexOf(uid) === -1) {
                // Add peer ID to state array
                setPeerIds([...peerIds, uid])
            }
        })

        engine?.addListener('UserOffline', (uid, reason) => {
            console.log('UserOffline', uid, reason)
            // Remove peer ID from state array
            // endCall(channel);
            // joinRandomChannel();
            setPeerIds(peerIds.filter(id => id !== uid))
        })

        // If Local user joins RTC channel
        engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
            console.log('JoinChannelSuccess', channel, uid, elapsed)
            if (isSubscribed) {
                // Set state variable to true
                setJoinSucceed(true)
            }
        })

        return () => {
            console.log(engine)
            isSubscribed = false;
            // timeOut.cancel();
            // leaveChannel(channel);
            console.log("*********************************************");
            engine?.removeAllListeners();
            engine?.destroy();
        }

    },
        // will run once on component mount or if engine changes
        [engine]
    );
    return (
        <Drawer.Navigator screenOptions={{drawerStyle:{backgroundColor:'transparent'}}} drawerContent={(props) => <CustomDrawer {...props}  /> }>
            <Drawer.Screen name="Home" component={Home} options={{headerShown:false, unmountOnBlur:true}} />
            <Drawer.Screen name="OnCam" component={Cam} options={{headerShown:false, unmountOnBlur:true}} />
            <Drawer.Screen name="Messages" component={InboxScreen} options={{headerShown:false, unmountOnBlur:true}} />
            <Drawer.Screen name="Me" component={Profile} options={{headerShown:false, unmountOnBlur:true}} />
            <Drawer.Screen name="Chat" component={ChatScreen} options={{headerShown:false, unmountOnBlur:true}} />
            <Drawer.Screen name="Performer" component={Performer} options={{headerShown:false, unmountOnBlur:true}} />
        </Drawer.Navigator>
    )
}

export default HigherComp;
