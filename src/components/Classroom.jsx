import { Button, Container, Form, Row, Col, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import Student from "./Student";

const Classroom = () => {

    // Student Data State Variables
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    // Input State Variables
    const [nameInputVal, setNameInputVal] = useState('');
    const [majorInputVal, setMajorInputVal] = useState('');
    const [interestInputVal, setInterestInputVal] = useState('');

    // Pagination State Variables
    const [activePage, setActivePage] = useState(1);

    // Fetch Data from API
    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw4/students', {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => {
            return res.json()
        })
        .then(data => {
            setStudents(data)
            setFilteredStudents(data)
        })
    }, [])
    
    // Display Students Array to Console
    useEffect(() => {
        console.log(students);
    }, [students]);      
    

    // Manage Filtered Student Array
    useEffect(() => {
        const updateFilteredStudents = students.filter(student => {
            const fullName = `${student.name.first} ${student.name.last}`.toLowerCase();
            const nameMatch = fullName.includes(nameInputVal.trim().toLowerCase());
            const majorMatch = student.major.toLowerCase().includes(majorInputVal.trim().toLowerCase());
            const interestMatch = student.interests.join('').toLowerCase().includes(interestInputVal.trim().toLowerCase());
            return nameMatch && majorMatch && interestMatch;
        })
        setFilteredStudents(filteredStudents => updateFilteredStudents)
        setActivePage(1)
    }, [nameInputVal, majorInputVal, interestInputVal])

    // Handle Search Reset
    const handleResetSearch = () => {
        setNameInputVal('');
        setMajorInputVal('');
        setInterestInputVal('');
        setFilteredStudents(students);
    };

    // Build Paginator
    let lastPage = 0; // Track last page for disabled 'Next' button feature
    const buildPaginator = () => {
        let pages = [];
        const num_pages = Math.ceil(filteredStudents.length / 24);
        lastPage = num_pages;
        for(let i = 1; i <= num_pages; i++) {
            pages.push(
                <Pagination.Item 
                    key={i}
                    active={activePage === i}
                    onClick={() => setActivePage(i)}
                >
                    {i}
                </Pagination.Item>
            )
        }
        return pages;
    }

    return <div>
        <h1>Badger Book - Fall 2023</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control
                id="searchName"
                value={nameInputVal}
                onChange={(e) => setNameInputVal(e.target.value)}
            />
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control
                id="searchMajor"
                value={majorInputVal}
                onChange={(e) => setMajorInputVal(e.target.value)}
            />
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control
                id="searchInterest"
                value={interestInputVal}
                onChange={(e) => setInterestInputVal(e.target.value)}
            />
            <br />
            <Button variant="neutral" onClick={handleResetSearch}>Reset Search</Button>
            <p>There are {filteredStudents.length} student(s) matching your search.</p>
        </Form>
        <br/>
        <Container fluid>
            <Row>
                {filteredStudents.slice(24 * (activePage - 1), 24 * activePage).map(student => 
                    <Col xs={12} sm={6} md={4} lg={3} xl={2} key={student.id}>
                        <Student  {...student}/>
                    </Col>
                )}
            </Row>
        </Container>
        <br/>
        <Pagination>
            <Pagination.Item onClick={() => setActivePage(activePage => activePage - 1)} disabled={activePage <= 1}>
                Previous
            </Pagination.Item>
            {buildPaginator()}
            <Pagination.Item onClick={() => setActivePage(activePage => activePage + 1)} disabled={activePage >= lastPage}>
                Next
            </Pagination.Item>
        </Pagination>
    </div>
}

export default Classroom;