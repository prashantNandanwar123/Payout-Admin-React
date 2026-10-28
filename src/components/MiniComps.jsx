import { useContext, useEffect, useState } from "react"
import { UsrMgmtContext } from "./UserMgmtModal"

export const ModalBodyData = ({name, data}) => {
    return (
        <div className="border p-2 mb-2">
            <h6 className="mb-0">{name}</h6>
            <span>{data}</span>
        </div>
    )
}

export const CheckInput = ({id,val,label,change}) => {
    return (
        <div className="form-check">
            <input className="form-check-input check-bg" type="checkbox" id={id} value={val} onChange={change} />
            <label className="form-check-label" htmlFor={id}>{label}</label>
        </div>
    )
}

export const RadioCheckInput = ({id,val,label,name,status}) => {
    let actionTxt = useContext(UsrMgmtContext)
    if(actionTxt){
        document.querySelector(`input[name=${name}][value=${status}]`).checked=true;
    }
    return (
        <div className="form-check">
            <input className="form-check-input bg-white rounded-1 check-bg" type="radio" 
            name={name} id={id} value={val} disabled={actionTxt==='view'?"disabled":""} />
            <label className="form-check-label opacity-100" htmlFor={id}>{label}</label>
        </div>
    )
}

export const CountDown = (props) => {

    const { minutes, seconds, reSend } = props;
    const [min, setMin] = useState(minutes);
    const [sec, setSec] = useState(seconds);

    useEffect(() => {
        let cdInterval = setInterval(() => {
            if (min === 0 && sec === 0) reSend(false);
            if (sec > 0) setSec(sec - 1);
            if (sec === 0) {
                if (min === 0) clearInterval(cdInterval)
                else {
                    setMin(min - 1);
                    setSec(59);
                }
            }
        }, 1000)
        return () => clearInterval(cdInterval);
    }, [min, sec, reSend]);

    return (<>
        {min === 0 && sec === 0 ? null :
            <>{min < 10 ? `0${min}` : min}:{sec < 10 ? `0${sec}` : sec}</>
        }
    </>)
}

// export const RadioInput = ({}) => {
//     return (
//         <div className="form-check">
//             <input className="form-check-input check-bg" type="checkbox" id={id} value={val} onChange={change} />
//             <label className="form-check-label" htmlFor={id}>{label}</label>
//         </div>
//     )
// }