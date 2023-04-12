import React from 'react';
import './App.css';
import Calendar from './components/Calendar/Calendar';
import { Container, Row, Col } from 'react-bootstrap';

function App () {
  return (
    <div className="App">
      <h1>
        Trần Hữu Vinh
      </h1>
      <Container>
        <Row>
          <Col xs={10}>
            <Calendar />
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default App;
