import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { Form, Button, Modal as BootstrapModal } from 'react-bootstrap';
import { addDoc, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import Nav from './NavAdmin';
import './admincss/CalenderAdmin.css';

const localizer = momentLocalizer(moment);

function CalendarAdmin() {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '', 
  });

  const [currentEvent, setCurrentEvent] = useState(null);

  const fetchEvents = async () => {
    const eventsCollection = collection(firestore, 'events');
    const querySnapshot = await getDocs(eventsCollection);
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
    }));
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventModalOpen = (event) => {
    console.log('Event modal opened:', event);
    setCurrentEvent(event);
    setNewEvent(event);
    setShowEventModal(true);
  };

  const handleEmptyModalOpen = async (start) => {
    await fetchEvents();

    setNewEvent({
      title: '',
      start,
      end: start,
      description: '', 
    });
    setCurrentEvent(null);
    setShowEventModal(true);
  };

  const handleModalClose = () => {
    setShowEventModal(false);
    setShowDeleteModal(false);
  };

  const handleSaveEvent = async () => {
    const eventsCollection = collection(firestore, 'events');

    if (currentEvent) {
      const docRef = doc(firestore, 'events', currentEvent.id);
      await setDoc(docRef, newEvent);
    } else {
      const docRef = await addDoc(eventsCollection, newEvent);
    }

    await fetchEvents();

    setShowEventModal(false);
  };

  const handleDeleteEvent = async () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteEvent = async () => {
    if (currentEvent) {
      const docRef = doc(firestore, 'events', currentEvent.id);
      await deleteDoc(docRef);

      await fetchEvents();

      setShowEventModal(false);
    }

    setShowDeleteModal(false);
  };

  return (
    <>
      <Nav />
      <div>
        <div className="main-content">
          <div className="content-header">
            <div className="header-content">
              <h2>ปฏิทินข่าวสาร</h2>
            </div>
            <div className="calender-card">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleEventModalOpen}
                onSelectSlot={({ start }) => handleEmptyModalOpen(start)}
                selectable
                className="calender-main"
              />
            </div>
          </div>
        </div>
      </div>

      <BootstrapModal
        show={showEventModal}
        onHide={handleModalClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>
            {currentEvent ? 'Edit Event' : 'Add Event'}
          </BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formStart">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    start: new Date(e.target.value),
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEnd">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    end: new Date(e.target.value),
                  })
                }
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter event description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          {currentEvent && (
            <Button variant="danger" onClick={handleDeleteEvent}>
              Delete Event
            </Button>
          )}
          <Button variant="primary" onClick={handleSaveEvent}>
            Save Event
          </Button>
        </BootstrapModal.Footer>
      </BootstrapModal>

      <BootstrapModal
        show={showDeleteModal}
        onHide={handleModalClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>Delete Event</BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          Are you sure you want to delete this event?
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteEvent}>
            Delete
          </Button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default CalendarAdmin;
