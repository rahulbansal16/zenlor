import firebase from 'firebase';
import React from 'react';
import FirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// import { Header, Icon } from 'semantic-ui-react';
import { auth } from '../firebase';


let uiConfig = {
    // signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    // TODO: The successUrl should be the page which initiated the login.
    signInSuccessUrl: '/',
    signInSuccessWithAuthResult:  function(_authResult, _redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        console.log("The signin successful");
        return true;
      },

    signInOptions: [ {
            provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            defaultCountry:'IN',
            recaptchaParameters: {
                size: 'invisible', // 'invisible' or 'compact'
              },
            requireDisplayName: true,
            signInSuccessWithAuthResult: function(authResult, _redirectUrl){
                console.log("Success", authResult);
            }

        },
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };

const Login =  () => {
    const user = useSelector(state => state.taskReducer.user)
    const history = useHistory()
    console.log("The user us ", user)
    if (user && user.uid){
        history.push('/')
        return "Already Login"
    }
    uiConfig["signInSuccessUrl"] = '/'
    return(
            <div>
                <FirebaseAuth style={{width:'100% !important'}}uiConfig={uiConfig} firebaseAuth={auth}/>
            </div>
        )
}

export default Login;
// class Login extends React.Component {

//     constructor(props){
//         super(props);
//         this.state = {
//             email:'',
//             password:''
//         }
//     }

//     handleChange = (event, _data) => {
//         const {name,value} = event.target;
//         if (this.state.hasOwnProperty(name)) {
//           this.setState({ [name]: value.toLowerCase()});
//         }
//     }

//     componentDidMount() {
//         async function updateUserState() {
//             auth.onAuthStateChanged( async userAuth => {
//                 console.log('The uesrAuth is', userAuth)
//               dispatch(userAuth)
//             });
//           }
//           updateUserState();
//     }

//     render(){
//         uiConfig["signInSuccessUrl"] = '/'
//         return(
//             <div>
//                 <FirebaseAuth style={{width:'100% !important'}}uiConfig={uiConfig} firebaseAuth={auth}/>
//             </div>
//         );
//     }

//     // googleSignIn = () => {
//     //     signInWithGoogle();
//     // }

//     // signInWithEmailAndPasswordHandler = (event) => {
//     //     event.preventDefault();
//     //     auth.signInWithEmailAndPassword(this.state.email, this.state.password).catch(error => {
//     //       console.error("Error signing in with password and email", error);
//     //     });
//     // };

//     // sendResetEmail = event => {
//     //     event.preventDefault();
//     //     auth
//     //       .sendPasswordResetEmail(this.state.email)
//     //       .then(() => {
//     //         // setEmailHasBeenSent(true);
//     //         // setTimeout(() => {setEmailHasBeenSent(false)}, 3000);
//     //       })
//     //       .catch((error) => {
//     //         console.log("Error sending up the Reset Email", error);
//     //         // setError("Error resetting password");
//     //       });
//     //   };

// };
// export default withRouter(Login);
