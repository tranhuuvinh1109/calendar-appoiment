import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Avatar, Select, Space } from 'antd';
import { Popover, PopoverBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { USER } from '../Data';

const { Option } = Select;
function Calendar () {
	const [appointments, setAppointments] = useState([]);
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [newAppointment, setNewAppointment] = useState({ title: '', start: null, end: null, linkMeeting: '', user: [] });

	const handleChange = (value) => {
		setNewAppointment({ ...newAppointment, user: value })
	};
	const togglePopover = () => setPopoverOpen(!popoverOpen);

	const handleAddAppointment = (event) => {
		// Validate user input
		if (!newAppointment.title || !newAppointment.start || !newAppointment.end || newAppointment.end <= newAppointment.start) {
			alert('Invalid appointment information');
			return;
		}

		// Check for scheduling conflicts
		const conflicts = appointments.filter(appt => (
			(newAppointment.start >= appt.start && newAppointment.start < appt.end) ||
			(newAppointment.end > appt.start && newAppointment.end <= appt.end)
		));
		if (conflicts.length > 0) {
			if (window.confirm('There is a scheduling conflict with another appointment. Replace existing appointment?')) {
				setAppointments(prevAppointments => (
					prevAppointments.filter(appt => !conflicts.includes(appt)).concat(newAppointment)
				));
			}
			return;
		}

		// Check for group meeting
		const matchingAppt = appointments.find(appt => (
			appt.title === newAppointment.title && appt.end.getTime() - appt.start.getTime() === newAppointment.end.getTime() - newAppointment.start.getTime()
		));
		if (matchingAppt && window.confirm(`Join existing group meeting "${matchingAppt.title}"?`)) {
			const updatedAppt = { ...matchingAppt, extendedProps: { participants: [...matchingAppt.extendedProps.participants, newAppointment.title] } };
			setAppointments(prevAppointments => (
				prevAppointments.filter(appt => appt !== matchingAppt).concat(updatedAppt)
			));
		} else {
			setAppointments(prevAppointments => prevAppointments.concat(newAppointment));
		}

		// Clear form and close popover
		setNewAppointment({ title: '', start: null, end: null });
		setPopoverOpen(false);
	};

	const handleTitleChange = (event) => setNewAppointment(prevAppointment => ({ ...prevAppointment, title: event.target.value }));
	const handleStartChange = (event) => setNewAppointment(prevAppointment => ({ ...prevAppointment, start: new Date(event.target.value) }));
	const handleEndChange = (event) => setNewAppointment(prevAppointment => ({ ...prevAppointment, end: new Date(event.target.value) }));
	const handeleLinkChange = (event) => setNewAppointment(prevAppointment => ({ ...prevAppointment, linkMeeting: event.target.value }));


	return (
		<>
			<div className='content'>

				<Button id="add-appointment" onClick={ togglePopover } className='btn'>Add Appointment</Button>
				<Popover placement="bottom" isOpen={ popoverOpen } target="add-appointment" toggle={ togglePopover } className='popover'>
					<PopoverBody className='add-body'>
						<Form className='bg-red-400'>
							<FormGroup className='field'>
								<Label for="appointment-title">Title</Label>
								<Input type="text" name="title" id="appointment-title" value={ newAppointment.title } onChange={ handleTitleChange } />
							</FormGroup>
							<FormGroup className='field'>
								<Label for="appointment-start">Start Time</Label>

								<Input type="datetime-local" name="start" id="appointment-start" value={ newAppointment.start ? newAppointment.start.toISOString().substr(0, 16) : '' } onChange={ handleStartChange } />
							</FormGroup>
							<FormGroup className='field'>
								<Label for="appointment-end">End Time</Label>
								<Input type="datetime-local" name="end" id="appointment-end" value={ newAppointment.end ? newAppointment.end.toISOString().substr(0, 16) : '' } onChange={ handleEndChange } />
							</FormGroup>
							<FormGroup className='field'>
								<Label for="linkMeeting">Link Meeting</Label>
								<Input type="text" name="linkMeeting" id="linkMeeting" value={ newAppointment.linkMeeting } onChange={ handeleLinkChange } />
							</FormGroup>
							<FormGroup className='mb-2'>
								<Select
									mode="multiple"
									style={ {
										width: '100%',
									} }
									placeholder="select one country"
									defaultValue={ [1] }
									onChange={ handleChange }
									optionLabelProp="label"
								>
									{
										USER.map((user) => {
											return (
												<Option value={ user.id } label={ user.email }>
													<Space>
														<Avatar src={ user.avatar } alt="avatar" />
														<span>{ user.email }</span>
													</Space>
												</Option>
											)
										})
									}
								</Select>
							</FormGroup>
							{/* <FormGroup className='field'>
								<Label for="appointment-end">Us</Label>
								<Input type="datetime-local" name="end" id="appointment-end" value={ newAppointment.end ? newAppointment.end.toISOString().substr(0, 16) : '' } onChange={ handleEndChange } />
							</FormGroup> */}
							<div className='bottom'>
								<Button color="primary" onClick={ handleAddAppointment }>Save</Button>
								<Button color="secondary" onClick={ () => setPopoverOpen(false) }>Cancel</Button>
							</div>
						</Form>
					</PopoverBody>
				</Popover>
			</div>
			<div style={ { marginTop: "30px" } }>

			</div>
			<FullCalendar
				plugins={ [dayGridPlugin, timeGridPlugin, interactionPlugin] }
				initialView="timeGridWeek"
				events={ appointments }
			/>
		</>
	);
}

export default Calendar;