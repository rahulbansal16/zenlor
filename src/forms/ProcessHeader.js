const ProcessHeader = ({process, styleCode}) => {
    return (<div className="fx-sp-bt mg-x-8">
        <h3>
            {styleCode.toUpperCase()}
        </h3>
        <h3>
            {process.toUpperCase()}
        </h3>
    </div>)
}

export default ProcessHeader