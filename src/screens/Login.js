import React from 'react'
import { View,ImageBackground, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import InputText from '../components/InputText';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { connect } from 'react-redux';
import { setCurrentUser } from '../redux/user/user.action'
import { API } from '../../api.config';
import Ico from 'react-native-vector-icons/AntDesign';

const theme1 = "#E5E5E5";
const Login = ({navigation, setUser}) => {

    const [username, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const handleChange = (name, e) => {
        switch(name){
            case 'username':
                setUserName(e);
                break;
            case 'password':
                setPassword(e);
                break;
            default:
                console.log(e);
        }
    }
    const login = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("email",username);
        formData.append("password",password);

        axios({
            method:'POST',
            url:`${API}/performer_login`,
            data:formData
        }).then((res) => {
            setLoading(false);
            console.log(res.data);
            if(res.data.responseCode){
                console.log(res.data.responseCode);
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.LONG, ToastAndroid.CENTER);
                setUserName("");
                setPassword("");
                console.log(res.data.responseData);
                setUser(res.data.responseData);
            }else{
                ToastAndroid.showWithGravity(res.data.responseText, ToastAndroid.LONG, ToastAndroid.CENTER);
                console.log(res.data.responseText);
            }
        }).catch((err) =>{
            console.log("ERROR",err);
            setLoading(false);
        })
    }
    return (
        <View style={{flex:1}}>
        <LinearGradient colors={['#BC7BE4', '#10152F']}  style={{flex:1, justifyContent:'center'}} >
        <TouchableOpacity style={{position:'absolute', top:10, padding:10}} onPress={() => {
            navigation.goBack();
        }}>
            <Icon name='chevron-back-outline' color={'#fff'} size={30}/>
        </TouchableOpacity>
            <Text style={{color:'#fff', fontSize:40, textAlign:'center', fontWeight:'700', fontFamily:'Helvetica'}}>LOGIN</Text>
            <View style={styles.container}>
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <InputText name="username" icon="person" placeholder="Email or Phone" value={username} handleChange={handleChange}  />
                    <InputText name="password" icon="lock" placeholder="Password" value={password} handleChange={handleChange} password={true}  />
                </View>
                {
                    loading ?
                    (
                        <View style={{alignSelf:'center'}}>
                            <ActivityIndicator size="large" color={theme1} />
                        </View>
                    )
                    :
                    (
                        <TouchableOpacity style={styles.button} onPress={login}>
                            <Ico name="login" size={30} color='#fff' style={{marginRight:20}} />
                            <Text style={{fontSize:22, fontWeight:'400', color:'#fff'}}>LOGIN</Text>
                        </TouchableOpacity>
                    )
                }
                
            </View>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width:'85%',
        marginTop:20,
        justifyContent:'center',
        alignSelf:'center',
        padding:10,
        // fontFamily:iconFont
    },
    button:{
        backgroundColor:'#4BD5CF',
        flexDirection:'row',
        justifyContent:'center',
        marginTop:45,
        marginBottom:20,
        width:'90%',
        alignSelf:'center',
        borderRadius:50,
        alignItems:'center',
        padding:8,
        margin:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    }
})

const mapDispatchToProps = (dispatch) => ({
    setUser : user =>  dispatch(setCurrentUser(user))
})

export default connect(null, mapDispatchToProps)(Login);
