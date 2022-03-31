import {useEffect, useState} from "react";

export default function Header(){


    const [greeting, setGreeting] = useState('')

    useEffect(() => {
        fetch('/api/greeting', {
            method: 'GET',
            headers: {
                'Accept': 'text/plain'
            }
        })
            .then(response => response.text())
            .then(text => setGreeting(text))
            .catch(err => setGreeting('Da ist etwas schief gelaufen'));
    }, []);



    return(
        <div className={'header'}>
            <h1>{greeting}</h1>
        </div>
    )
}