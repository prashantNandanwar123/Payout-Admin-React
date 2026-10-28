import { Navbar } from "../components/Navbar";

const MessagingService = ({setIsAuth}) => {
    return (
        <div className="home-page">
            <div className="container-fluid">
                <div className="main-content pt-3">
                    <Navbar title="messaging service" setIsAuth={setIsAuth} />

                    {/* <ul className="list-group list-group-horizontal-md mb-3 mt-2 fts_filter">
                        <li className="list-group-item">
                            <CheckInput id="flrcheck1" val="SUCCESS" label="SUCCESS" change={changeHandler} />
                        </li>
                        <li className="list-group-item">
                            <CheckInput id="flrcheck2" val="FAILED" label="FAILED" change={changeHandler} />
                        </li>
                    </ul> */}

                </div>
            </div>
        </div>
    )
}

export default MessagingService;