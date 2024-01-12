import React, { useState, useEffect } from 'react';
import Nav from './NavAdmin';
import { collectionGroup, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

function ShowproblemAdmin() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState({});  
  const [loading, setLoading] = useState(true);

  const fetchProblems = async () => {
    const arr = [];

    const querySnapshot = await getDocs(query(collectionGroup(firestore, 'problems')));
    querySnapshot.forEach((doc) => {
      arr.push({ id: doc.id, ...doc.data() });
    });

    setProblems(arr);
    setLoading(false);
  };

  const handleCheck = (problem) => {
    Swal.fire(problem.problemsusubject);
  };

  const handleOpenModal = (problem) => {
    setSelectedProblem({
      email: problem.email,
      problemsusubject: problem.problemsusubject,
    });
  };

  const handleCloseModal = () => {
    setSelectedProblem({});
  };
  

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <>
      <Nav />
      <div className='box-Promotion'>
        <div>
          <div className='box-Promotion-rox'>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Problem</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>

              {loading && (
              <p className="loading-Conhotel">
                <div class="spinner-border" role="status">
                  <span class="sr-only"></span>
                </div>
              </p>
            )}

                {!loading &&
                 problems.map((problem, i) => (
                  <tr key={i}>
                    <td>{problem.email}</td>
                    <td>{problem.problem}</td>
                    <td>{problem.time}</td>
                    <td>
                      <button className="problemmp" onClick={() => handleOpenModal(problem)}>เพิ่มเติม</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={Object.keys(selectedProblem).length > 0} onClose={handleCloseModal} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton><h3>{selectedProblem.email}</h3></Modal.Header>
        <Modal.Body>
          {selectedProblem && <p>{selectedProblem.problemsusubject}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>close</Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default ShowproblemAdmin;
