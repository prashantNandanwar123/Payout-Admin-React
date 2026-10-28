import { useContext, useEffect, useState } from "react"
import { sortDate } from "../assets/js/functions"
import { stopTags, typeNumber } from "../assets/js/validationRHF";

import { UsrMgmtContext } from "./UserMgmtModal"

export const InputGroup = ({ register, errors, type, holder, id, name, req, regex, maxLen, icon, focus }) => {
    return (
        <div className="input-group mb-3">
            <span className="input-group-text">{icon}</span>
            <input type={type} className='form-control shadow-none' placeholder={holder} id={id} maxLength={maxLen} autoFocus={focus}
                {...register(name, { required: { value: req, message: 'This is a required field' }, pattern: regex.pattern, maxLength: maxLen })} />
            <strong className="text-danger w-100"><small>{errors && errors.message}</small></strong>
        </div>
    )
}


export const Label = (props) => {
    return (
        <label htmlFor={props.for} className="form-label fw-bold text-secondary form_label">{props.name}
            {props.req ? <span className="text-danger fw-bold"> *</span> : ''}
        </label>
    )
}

export const Input = ({ register, id, name, req, errors, minLen, maxLen, onInput, regex, focus, css, read, val, holder ,style}) => {
    const actionTxt = useContext(UsrMgmtContext)
    return (<>
        <input type="text" className={`form-control shadow-none ${css}`} value={val} id={id} placeholder={holder}
        onInput={onInput} maxLength={maxLen} autoFocus={focus} readOnly={read} disabled={actionTxt==='view'?"disabled":""}
            {...register(name, {
                required: { value: req, message: 'This is a required field' }, pattern: regex.pattern,
                minLength: { value: minLen, message: 'Please enter valid input' }, maxLength: maxLen
            })} style={style}/>
        <strong className="text-danger inpErr">{errors && errors.message}</strong>
    </>)
}
// ---------------------------------------------------------
export const UserInputContainer = ({ label, data }) => {
    return (
        <div className="col-12 ">
            <label className="form-label fw-bold text-secondary form_label" style={{margin: "1px 5px"}}>{label}</label>
            <input type="text" className="form-control shadow-none" defaultValue={data} style={{background:"#73b5f847"}}disabled />
        </div>
    )
}

// ---------------------------------------------------------

export const CstmInput  = ({ register, id, name, req, errors, minLen, maxLen, onInput, regex, focus, css, read, holder, style, defaultValue }) => {
    const actionTxt = useContext(UsrMgmtContext);

    return (
        <>
            <input 
                type="text" 
                className={`form-control shadow-none ${css}`} 
                id={id} 
                placeholder={holder}
                onInput={onInput} 
                maxLength={maxLen} 
                autoFocus={focus} 
                readOnly={read} 
                disabled={actionTxt === 'view'} 
                {...register(name, {
                    required: { value: req, message: 'This is a required field' },
                    pattern: regex?.pattern,
                    minLength: { value: minLen, message: 'Please enter valid input' }, 
                    maxLength: maxLen,
                    // No need to set value here
                })} 
                style={style}
                defaultValue={defaultValue} // Use defaultValue here
            />
            <strong className="text-danger inpErr">{errors && errors.message}</strong>
        </>
    );
};


// ---------------------------------------------------------



export const EditInput = ({ register, name, req, errors, minLen, maxLen, onInput, css, regex, defVal, action}) => {
    return (<>
        <input type="text" className={`form-control shadow-none ${css}`} defaultValue={defVal} onInput={onInput} maxLength={maxLen} disabled={action==='view'?true:false}
        {...register(name, { 
            required: { value: req, message: 'This is a required field' }, pattern: regex.pattern,
            minLength: { value: minLen, message: 'Please enter valid input' }, maxLength: maxLen
         })} />
        <strong className="text-danger inpErr">{errors && errors.message}</strong>
    </>)
}

export const SelectInput = ({register,id,req,option,regex,name,onInput}) => {
    let actionTxt = useContext(UsrMgmtContext)
    return (<>
        <select className="form-select shadow-none" disabled={actionTxt==='view'?"disabled":""}
         id={id} {...register(name, { required: req, pattern:regex.pattern})} onInput={onInput}>
            {option.map(val => <option key={val} value={val}> {val} </option> )}
        </select>
    </>)
}

export const DateInput = ({ dateRef }) => {

    const [defaultDate, setDefaultDate] = useState('');
    useEffect(()=> {
        let date = sortDate(new Date())
        setDefaultDate(date)
    },[])

    //console.log(defaultDate)

    const changeHandler = (e) => {
        let currentDate = e.target.parentElement.querySelector('input[type=date]')
        currentDate.showPicker();
    }
    const selectDate = (e) => {
        let dateInput = e.target.parentElement.querySelector('input[type=text]');
        let date = new Date(e.target.value);
        let actualDate = sortDate(date);
        dateInput.value = actualDate;
        setDefaultDate(actualDate)
    }
    return (<>
        <div className="input-group input-group-sm date-input">
            <input type="date" className="position-absolute bottom-0 border-0" style={{ width: 0, height: 0 }} onChange={selectDate} />
            <span className="input-group-text">
                <i className="fa-solid fa-calendar-days"></i>
            </span>
            <input type="text" className="form-control shadow-none" defaultValue={defaultDate} ref={dateRef} onClick={changeHandler} />
        </div>
    </>)
}

export const FileInput = ({register,errors,req,id,name}) => {
    const uploadFile = (e) => {
        let disErr = document.querySelector('#'+e.target.id+'+strong');
        let file = e.target.files[0];
        if(file){
            let ext = file.name.split('.').pop();
            let size = Math.floor(file.size/1024);
            if((ext === 'png' || ext === 'jpg' || ext === 'pdf') && size < 1000){
                disErr.textContent = '';
            }else{
                e.target.value = '';
                disErr.textContent = 'Please upload jpg / png / pdf with size less than 1000 kb';
            }
        }
    }
    return (<>
        <input type="file" className="form-control shadow-none" id={id} onInput={uploadFile}
        {...register(name, {required: {value:req, message:'Please upload jpg / png / pdf with size less than 1000 kb'}})} />
        <strong className="text-danger inpErr">{errors && errors.message}</strong>
    </>)
}

export const RadioInput = ({register,radioName,name,val,id,checked}) => {
    return (
        <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" id={id}
            value={val} {...register(name, {required: true})} onInput={stopTags} defaultChecked={checked} />
            <label className="form-check-label" htmlFor={id}>{radioName}</label>
        </div>
    )
}

export const InputPsd = ({ register, id, name, req, errors, minLen, maxLen, onInput, regex, focus, css, read, val }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="password-input-container" style={{ position: 'relative' }}>
            <input
                type={showPassword ? "text" : "password"}
                className={`form-control shadow-none ${css}`}
                value={val}
                id={id}
                onInput={onInput}
                maxLength={maxLen}
                autoFocus={focus}
                readOnly={read}
                {...register(name, {
                    required: { value: req, message: 'This is a required field' },
                    pattern: regex?.pattern,
                    minLength: { value: minLen, message: 'Please enter valid input' },
                    maxLength: maxLen
                })}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
            
                {!showPassword ? <i class="bi bi-eye-slash-fill"></i> : <i class="bi bi-eye-fill"></i>}
            </button>
            <strong className="text-danger inpErr">{errors && errors.message}</strong>
        </div>
    );
};