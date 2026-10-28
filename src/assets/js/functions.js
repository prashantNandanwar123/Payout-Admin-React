// Environment flag
export const isproduction = false;

const baseURL = isproduction
  ? "https://adp.hellope.co.in/api/Admin"
  : "http://192.168.29.144:8094/api/Admin"; // <-- adjust your local URL here

// Generic API function
export const fetchApi = async (url, method, body) => {
  const data = body ? JSON.stringify(body) : null;

  try {
    const settings = {
      method: method,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    };

    const res = await fetch(`${baseURL}/${url}`, settings);
    console.log("API Response Status:", res);
    const result = await res.json();
    return [res, result];
  } catch (error) {
    console.error("API Fetch Error:", error);
    return [null, { error: error.message }];
  }
};

export const sortDateSwitch = (e, data, key) => {
    let icon = e.target.nextElementSibling;
    switch (key) {
        case 'InitiatedDate':
            return data.sort(function (a, b) {
                let c = new Date(a.requestInitiateddate);
                let d = new Date(b.requestInitiateddate);
                if (e.target.checked) {
                    icon.style.color = "white";
                    return c - d;
                } else {
                    icon.style.color = "#8f8f8f";
                    return d - c;
                }
            })
        case 'TxnReqDate':
            return data.sort(function (a, b) {
                let c = new Date(a.txnRequestDate);
                let d = new Date(b.txnRequestDate);
                if (e.target.checked) {
                    icon.style.color = "white";
                    return c - d;
                } else {
                    icon.style.color = "#8f8f8f";
                    return d - c;
                }
            })
        case 'depositeDate':
            return data.sort(function (a, b) {
                let c = new Date(a.dateTime);
                let d = new Date(b.dateTime);
                if (e.target.checked) {
                    icon.style.color = "white";
                    return c - d;
                } else {
                    icon.style.color = "#8f8f8f";
                    return d - c;
                }
            })
        default:
            return data;
    }
}

export const sortDate = (date) => {
    let dt = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if (dt < 10) dt = '0' + dt;
    if (month < 10) month = '0' + month;
    return dt + '/' + month + '/' + year;
}

export const dateInNumbers = () => {
    let date = new Date().toLocaleString('it-IT').replace(/\/|,|:|\s/g, "");
    return date;
}

export const uploadValidFile = (e) => {
    let file = e.target.files[0];
    let msgElem = e.target.parentElement.querySelector('.inpErr')
    if (file && file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        msgElem.textContent = 'Please upload valid (Excel) file';
        e.target.value = "";
    } else {
        msgElem.textContent = '';
    }
}

export const multiFocus = (target) => {
    let elems = document.querySelectorAll(target);
    let i = 0;
    let interval = setInterval(() => {
        intervalCondition();
        i++;
    }, 2);
    function intervalCondition() {
        if (i < elems.length) elems[i].focus();
        else clearInterval(interval)
    }
}