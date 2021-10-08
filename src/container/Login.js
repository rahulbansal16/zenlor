import { Header } from 'antd/lib/layout/layout';
import firebase from 'firebase';
import React from 'react';
import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
// import {UserConsumer} from './UserProvider';
import { useHistory } from "react-router-dom";
// import { Header, Icon } from 'semantic-ui-react';
import { auth, useAuthState } from '../firebase';

const Login = () => {
    const { isAuthenticated } = useAuthState()
    const history = useHistory()
    let uiConfig = {
                    signInFlow: 'popup',
                    signInOptions: [ {
                            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                            defaultCountry:'IN',
                            recaptchaParameters: {
                                size: 'invisible', // 'invisible' or 'compact'
                              },
                            requireDisplayName: true,
                        },
                    ],
                    callbacks: {
                        // Avoid redirects after sign-in.
                        signInSuccessWithAuthResult: () => false,
                      }
                  };
    return (
            <div>
                { !isAuthenticated &&
                    <FirebaseAuth style={{width:'100% !important'}} uiConfig={uiConfig} uiCallback = { (auths, redirectUrl) => {
                        // console.log('This is the callback of success', this.props.location.state.source)
                        console.log('The auth and redirectUrl are', auths, redirectUrl)
                        // debugger;
                        // history.push({
                        //     pathname: '/stylecode',
                        //     state: {user: auths.currentUser}
                        //   })
                        // this.props.history.push(this.props.location.state.source)
                    }} firebaseAuth={auth}/>
                }
                { isAuthenticated
                // && history.push({
                //         pathname: '/stylecode',
                //         state: {user: auth.currentUser}
                // })
                }
            </div>
    )
}
export default Login