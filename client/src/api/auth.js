import Axios from "axios";
import Cookies from "universal-cookie";

const cookie = new Cookies();

/**
 * logic: Sends and receives data from backend to logic user
 * @param userData sign up data Format: {username, password}
 * @returns true : If successful
 * @returns false : If signup failed. Also creates popup window with error.
 */
export async function login(userData) {
    console.log(`Attempting to login`);
    try{
        let res = await Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/login`, userData);
        console.log("Server response: ", res.data.res);
        if (res.data.res === `Error: data incomplete`) {
            return ("Please fill all fields before you signup");
        }
        if (res.data.res === `Error: incorrect data`) {
            return("Please check if your username and/or password are correct");
        }

        // Set relevant cookie expiry date
        const cookieExpiryDate = new Date();
        cookieExpiryDate.setDate(cookieExpiryDate.getDate() + 30);
        const cookieOptions = (userData.remember) ? {expires: cookieExpiryDate} : {};

        // Create cookies
        cookie.set("username", res.data.username, cookieOptions);
        cookie.set("firstName", res.data.firstName, cookieOptions);
        cookie.set("lastName", res.data.lastName, cookieOptions);
        cookie.set("token", res.data.token, cookieOptions);
        console.log("logic successful");
        return true;

    }catch(error){
        console.log("An error occurred:", error);
        return error;
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
        const res = await Axios.post(`http://localhost:${process.env.REACT_APP_SERVER_PORT}/signup`, userData);
        console.log("Server response:", res.data.res);
        if (res.data.res === `Error: data incomplete`) {
            return("Please fill all fields before you signup");
        }
        if (res.data.res === `Error: username taken`) {
            return("Sorry that username already exists");
        }
        return true;
    } catch (error) {
        console.log("An error occurred:", error);
        return("An unknown error occurred");
    }
}

