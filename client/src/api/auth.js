import Axios from "axios";
import Cookies from "universal-cookie";
import {clearGameCookies} from "./manageGameRoom";

const cookie = new Cookies();

/**
 * logic: Sends and receives data from backend to logic user
 * @param userData sign up data Format: {username, password}
 * @returns true : If successful
 * @returns false : If signup failed. Also creates popup window with error.
 */
export async function login(userData) {
    console.log(`Attempting to login`);
    try {
        const res = await Axios.post(`${process.env.REACT_APP_SERVER}/login`, userData);
        console.log("Server response: ", res.data.res);
        if (res.data.res === `Error: data incomplete`) {
            return ("Please fill all fields before you signup");
        }
        if (res.data.res === `Error: incorrect data`) {
            return ("Please check if your username and/or password are correct");
        }
        if(res.data.res === `success`){
            // Set relevant cookie expiry date
            const cookieExpiryDate = new Date();
            cookieExpiryDate.setDate(cookieExpiryDate.getDate() + 30);
            const cookieOptions = (userData.remember) ? {expires: cookieExpiryDate} : {};

            // Create cookies
            cookie.set("username", res.data.username, cookieOptions);
            cookie.set("firstName", res.data.firstName, cookieOptions);
            cookie.set("lastName", res.data.lastName, cookieOptions);
            cookie.set("token", res.data.token, cookieOptions);
            cookie.set(`wins`, res.data.wins, cookieOptions);
            cookie.set(`losses`, res.data.losses, cookieOptions);
            cookie.set(`ties`, res.data.ties, cookieOptions);
            console.log("login successful");
            return true;
        }
        return "Unknown error";

    } catch (error) {
        console.log("An error occurred:", error);
        return ("An unknown error occurred");
    }
}

/**
 * signUp: Sends and receives data from backend to signUp user
 * @param userData sign up data Format: {username, firstName, lastName, password}
 * @returns true : If successful
 * @returns false : If signup failed. Also creates popup window with error.
 */
export async function signUp(userData) {
    console.log(`Attempting to signup`);
    try {
        const res = await Axios.post(`${process.env.REACT_APP_SERVER}/signup`, userData);
        console.log("Server response:", res.data.res);
        if (res.data.res === `Error: data incomplete`) {
            return ("Please fill all fields before you signup");
        }
        if (res.data.res === `Error: username taken`) {
            return ("Sorry that username already exists");
        }
        if(res.data.res === `success`) {
            return true;
        }
        return "Unknown error";
    } catch (error) {
        console.log("An error occurred:", error);
        return ("An unknown error occurred");
    }
}


/**
 * authenticateToken: Checks if user token is valid from cookies
 * @returns true : If token valid
 * @returns false : If authentication failed
 */
export async function authenticateToken() {
    console.log("Attempting to validate token");
    const token = cookie.get('token');
    if (token === undefined) return false;
    try {
        const res = await Axios.post(`${process.env.REACT_APP_SERVER}/authenticate`, {token: token});
        console.log("Server response:", res.data.res);
        return res.data.res === `token valid`;
    } catch (error) {
        console.log("An error occurred:", error);
        logout();
        return false;
    }
}

// Logout a user
export function logout(){
    cookie.remove("token");
    cookie.remove("username");
    cookie.remove("firstName");
    cookie.remove("lastName");
    cookie.remove("losses");
    cookie.remove("wins");
    cookie.remove("ties");
    clearGameCookies();
}