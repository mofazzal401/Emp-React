import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MyComponent = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MM/dd/yyyy"
                placeholderText="Select a date"
            />
        </div>
    );
}

export default MyComponent;
