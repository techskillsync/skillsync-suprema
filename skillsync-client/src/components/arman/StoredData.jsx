import { useSelector } from 'react-redux'

function StoredData() {
    const dataObj = useSelector(state => state.user)
    console.log(dataObj)

    const STRuserData = JSON.stringify(dataObj.data)

    return (
        <div className="w-[400px] h-[200px] border border-emerald-400 rounded-lg p-8 overflow-scroll">
            {dataObj.loggedIn ? (
                <>
                    <p> Hello <span className="font-black">{dataObj.data.user.user_metadata.name}</span> </p>
                    <p>{STRuserData}</p>
                </>
            ) : (
                <p>Does not have data 😵</p>
            )}
        </div>
    )
}

export default StoredData