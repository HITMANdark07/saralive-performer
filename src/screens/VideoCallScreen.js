import React from 'react';
import { View, Text,TouchableOpacity, LogBox } from 'react-native';
import {RtcLocalView, RtcRemoteView, VideoRenderMode} from 'react-native-agora';
import { getDatabase, push, ref, set, orderByChild,remove, equalTo,onChildAdded, query, orderByValue, onValue, update } from "firebase/database";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);
const dark = '#10152F';
const VideoCallScreen = ({currentUser, route}) => {
    const [mic, setMic] = React.useState(false);
    // console.log("Engine",route.params.engine);
    const endCall = () => {
        // route.params.engine?.leaveChannel();
        route.params.engine?.leaveChannel()
        const db = getDatabase();
        const paidRef = ref(db, 'paidcam/'+currentUser.id);
        // const paid = push(paidRef);
        update(paidRef,{
            status:'pending',//pending, waiting, joined
            person2:"",
        }).then((res) => {
        }).catch((err) => {
            console.log("ERROR ", err);
        })
    }
    if(mic){
        route.params.engine?.enableLocalAudio();
    }else{
        route.params.engine?.disableAudio();
    }

    React.useEffect(() => {
        route.params.engine?.joinChannel(null, currentUser.id, null, (Number)(currentUser.id));
        return () => {
            // console.log("HEY UNMOUNTING");
            route.params.engine?.leaveChannel()
        }
    },[]);
    return (
        <View style={{flex:1, justifyContent:'center', backgroundColor:dark}}>
            {route.params.peerIds.length>0 ? 
            <RtcRemoteView.SurfaceView
            style={{ flex:1, position:'relative' }}
            uid={route.params.peerIds[0]}
            channelId={currentUser.id}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true} />
            :
            <Text style={{color:'white', textAlign:'center', fontSize:25, fontWeight:'200'}}>Waiting for Partner...</Text>
            }
            <View style={{ position:'absolute', bottom:150, right:5,borderRadius:10,overflow:'hidden' ,borderColor:'#fff', borderWidth:2}}>
            <RtcLocalView.SurfaceView
            style={{ height:150, width:100 }}
            channelId={currentUser.id}
            renderMode={VideoRenderMode.Hidden} />
            </View>
            <View style={{position:'absolute',bottom:10,flexDirection:'row', justifyContent:'center'}}>
            <View style={{flex:1, alignItems:'center'}}>
            <TouchableOpacity 
                onPress={() => {
                    setMic((prev) => !prev);
                }}
                style={{
                backgroundColor: mic ? '#3498DB': 'grey',
                bottom:10,
                height: 60,
                width: 60,
                zIndex:20,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#fff',
                borderWidth: 2,
                }}>
                {
                    mic ?
                    <Icon name="mic" color="#fff" size={35} />
                    :
                    <Icon name="mic-off" color="#fff" size={35} />
                }
                </TouchableOpacity>
            </View>
            <View style={{flex:1, alignItems:'center'}}>
            <TouchableOpacity 
                onPress={endCall}
                style={{
                backgroundColor: 'red',
                bottom:10,
                height: 60,
                width: 60,
                borderRadius: 100,
                alignItems: 'center',
                zIndex:20,
                justifyContent: 'center',
                borderColor: '#fff',
                borderWidth: 2,
                }}>
                <Icon name="call-end" color="#fff" size={35} />
                </TouchableOpacity>
            </View>
            </View>
        </View>
    )
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(VideoCallScreen);
