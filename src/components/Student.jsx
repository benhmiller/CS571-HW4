const Student = (props) => {
    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        <p>Major: {props.major}</p>
        <p>Credits: {props.numCredits}</p>
        <p>From Wisconsin: {props.fromWisconsin.toString()}</p>
        <ul>
            {
                props.interests.map(interest => <li key={interest}>{interest}</li>)
            }   
        </ul>
    </div>
}

export default Student;