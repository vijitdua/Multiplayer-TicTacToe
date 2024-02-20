import Axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();

/**
 * login: Sends and receives data from backend to login user
 * @param userData sign up data Format: {username, password}
 * @returns true : If successful
 * @returns false : If signup failed. Also creates popup window with error.
 */
export function login(userData) {
    console.log(`Attempting to login`);
    Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/login`, userData).then((res)=>{
        console.log("Data received by server & response: ", res.data);
        if (res.data.res === `Error: data incomplete`) {
            window.alert("Please fill all fields before you signup");
            return false;
        }
        if (res.data.res === `Error: incorrect data`) {
            window.alert("Please check if your username and/or password are correct");
            return false;
        }
        const cookieExpiryDate = new Date();
        cookieExpiryDate.setDate(cookieExpiryDate.getDate() + 30);
        cookie.set("username", res.data.username, { expires: cookieExpiryDate });
        cookie.set("userID", res.data.username, { expires: cookieExpiryDate });
        cookie.set("firstName", res.data.firstName, { expires: cookieExpiryDate });
        cookie.set("lastName", res.data.lastName, { expires: cookieExpiryDate });
        cookie.set("token", res.data.token, { expires: cookieExpiryDate });
        console.log("login successful");
        return true;
    }).catch((error) => {
        console.log("An error occurred:", error);
        return false;
    });
    return false;
}

/**
 * signUp: Sends and receives data from backend to signUp user
 * @param userData sign up data Format: {username, firstName, lastName, password}
 * @returns true : If successful
 * @returns false : If signup failed. Also creates popup window with error.
 */
export function signUp(userData) {
    console.log(`Attempting to signup`);
    Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/signup`, userData).then((res) => {
        console.log("Data received by server & response: ", res.data);
        if (res.data.res === `Error: data incomplete`) {
            window.alert("Please fill all fields before you signup");
            return false;
        }
        if (res.data.res === `Error: username taken`) {
            window.alert("Please choose a different username");
            return false;
        }
        return true;
    }).catch((error) => {
        console.log("An error occurred:", error);
        return false;
    });
    return false;
}

