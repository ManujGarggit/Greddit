import * as React from 'react';
import Person2Icon from '@mui/icons-material/Person2';
import BookIcon from '@mui/icons-material/Book';
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import { Container, Navbar, Nav } from 'react-bootstrap';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';

export default function DenseAppBar() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar bg="primary" variant="dark" style={{ height: "70px" }}>
        <Container>
          <MenuIcon style={{ color: "white", marginLeft: "0px" }} />
          <Navbar.Brand href="#home" >Greddit</Navbar.Brand>
          <Nav className="ms-auto">
            <Person2Icon style={{ color: "white", }} />
            <Nav.Link href="/profile/MySubGred" style={{ padding: "0px" }}>MySubGreddit</Nav.Link>
            <BookIcon style={{ color: "white", marginLeft: "10px" }} />
            <Nav.Link href="/profile/SubGred" style={{ padding: "0px" }}>Greddit</Nav.Link>
            <LocalPostOfficeIcon style={{ color: "white", marginLeft: "10px" }}/>
            <Nav.Link href="/profile/Saved" style={{ padding: "0px" ,marginLeft:"5px"}}>SavedPosts</Nav.Link>
            <button style={{ borderRadius: "10px", color: "royalblue", marginLeft: "10px" }} onClick={() => {
              localStorage.removeItem('token');
              navigate("/login");
            }}>Logout</button>
          </Nav>
        </Container>
      </Navbar>

    </div >
  );
}