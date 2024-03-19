import SetTypeField from "@/components/SetTypeField"

function switchSelectField(
    type: string, 
    types: {index: number, title: string}[], 
    setTypes: React.Dispatch<React.SetStateAction<{index: number, title: string}[]>>,
    value: string,
) {
    if(Number(type) === 0 || Number(type) === 1) {
        return(
            <SetTypeField type={Number(type)} types={types} setTypes={setTypes} />
        )
    } else if(Number(type) === 2) {
        return (
            <div className='mt-4' style={{width: "100%"}}>
            <input readOnly type='number' style={{width: "40%", borderRadius: 10}} value="" />
            </div>
        )
    } else if(Number(type) === 3) {
        return (
            <div className='mt-4' style={{width: "100%"}}>
                <input readOnly placeholder={value} type='text' style={{width: "80%", borderRadius: 10}} value="" />
            </div>
        )
    } else if(Number(type) === 4) {
        return(
            <div className='mt-4' style={{width: "100%"}}>
                <textarea value="" readOnly placeholder={value} rows={4} style={{width: "80%", borderRadius: 10}}></textarea>
            </div>
        ) 
    } else if(Number(type) === 5) {
        return (
            <div className='mt-4' style={{width: "100%"}}>
                <input readOnly type='date' style={{width: "50%", borderRadius: 10}} />
            </div>
        )
    } else if(Number(type) === 6) {
        return (
            <div>
                <div className='mt-4' style={{width: "100%"}}>
                    <input readOnly placeholder="郵便番号" type='text' style={{width: "30%", borderRadius: 10}} value="" />
                    <div>
                        <input readOnly placeholder="都道府県（自動入力）" type='text' style={{width: "40%", borderRadius: 10, marginTop: 20}} value="" />
                        <input readOnly placeholder="市区町村（自動入力）" type='text' style={{width: "40%", borderRadius: 10, marginLeft: 20}} value="" />
                        <input readOnly placeholder="番地（自動入力）" type='text' style={{width: "40%", borderRadius: 10, marginTop: 20}} value="" />
                    </div>
                </div>
            </div>
        )
    } else if(Number(type) === 7) {
        return(
            <div className='mt-4' style={{width: "100%"}}>
                <input readOnly type='file' style={{width: "80%", borderRadius: 10}} />
            </div>
        )
    } else {
        <div style={{display: "none"}}></div>
    }
}

export default switchSelectField;