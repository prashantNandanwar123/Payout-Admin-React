import { isproduction } from "./functions.js";

export const alphaNumericRex = {
    pattern:{
        value:/^[A-Za-z0-9]+$/i, 
        message:'This field allow alpha numeric values'
    }     
}

export const alphaNumSpaceRex = {
    pattern:{
        value:/^[A-Za-z0-9\s]+$/i, 
        message:'This field allow alpha numeric values & space'
    }     
}
export const upperCaseCvt = (e) => {
    e.target.value = e.target.value.toUpperCase();
}
export const alphaNumRex = {
    pattern:{
        value:/^[A-Za-z0-9]+$/i, 
        message:'This field allow alpha numeric values'
    }     
}

export const addrRex = {
    pattern:{
        value:/^[a-zA-z0-9/\\''(),-\s]+$/i, 
        message:'Please enter a valid address'
    }     
}
export const alphaSpaceRex = {
    pattern:{
        value:/^[A-Za-z\s]+$/i, 
        message:'This field allow alpha and space'
    }     
}

export const typeIfsc = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    e.target.value = e.target.value.toUpperCase();
}




export const passwordRex = {
    pattern:{
        value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/i,
        message:'Password should not be week'
    }     
}

export const alphaRex = {
    pattern:{
        value:/^[A-Za-z]+$/i, 
        message:'This field allow alpha values'
    }     
}

export const emailRex = {
    pattern:{
        value:/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i, 
        message:'Please enter a valid email address'
    }     
}

export const stopTags = (e) => {
    e.target.value = e.target.value.replace(/<|>/g, '');
}

export const typeNumber = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
}

export const typeFloatNumber = (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
}

export const blankSpace = (e) => {
    if(e.target.value.trim() === ""){
        e.target.value = e.target.value.trim();
    }
}

export const fetchIfscApi = async (ifscVal) => {
    try {
        let res = await fetch(isproduction ? `https://mep.payglobal.co.in/PayoutUser/api/verifyIfsc/${ifscVal}`: `http://localhost:8092/api/verifyIfsc/${ifscVal}`)
        let result = await res.json();
        return [res,result];
    } catch (error) {
        console.log(error)
    }
}

export const fetchFileApi = async (url,body) => {
    try {
        let res = await fetch(isproduction ? `https://mep.payglobal.co.in/PayoutUser/api/${url}` :`http://localhost:8092/api/${url}`,
             {method : 'POST', body : body} )
        let result = await res.json();
        return [res,result];   
    } catch (error) {
        console.log(error)
    }
}

export const fetchApi = async (url,method,body) => {
    let data = body !== null ? JSON.stringify(body) : null;
    try {
        let settings = { 
            method : method,
            headers : {'Accept':'application/json','Content-Type':'application/json'}, 
            body : data 
        }
        let res = await fetch(isproduction ? `https://mep.payglobal.co.in/PayoutUser/api/${url}` :`http://localhost:8092/api/${url}`, settings)
        let result = await res.json();
        return [res,result];   
    } catch (error) {
        console.log(error)
    }
}
