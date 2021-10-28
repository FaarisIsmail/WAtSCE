export  function Register(){
    
    return (
        <div>
        <p>
            This is the unique event ID appended after the URL: <br/><br/>
            {window.location.href.toString().split("/").pop()}
        </p>
    </div>
    )


}
