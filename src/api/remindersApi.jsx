import useAxios from "../hooks/useAxios";


// Get all reminders (Admin or Debugging use)
export const getAllReminders = async () => {
    const res = await useAxios.get("/reminders");
    return res.data;
};

// Get reminders by user email
export const getEmailReminders = async (email) => {
    const res = await useAxios.get(`/reminders?email=${email}`);
    return res.data;
};

// Get reminders by book ID (Book specific reminders)
export const getBookReminders = async (bookId) => {
    const res = await useAxios.get(`/reminders/book/${bookId}`);
    return res.data;
};

// Get single reminder by ID
export const getSingleReminder = async (id) => {
    const res = await useAxios.get(`/reminders/${id}`);
    return res.data;
};

// Create a new reminder
export const createReminder = async (reminderInfo) => {
    const res = await useAxios.post("/reminders", reminderInfo);
    return res.data;
};

// Process / Mark reminder as paid (Triggers transaction insertion in target book)
export const processReminderPayment = async (id, email) => {
    const res = await useAxios.post(`/reminders/${id}/process`, { email });
    return res.data;
};

// Update a reminder by ID
export const updateReminder = async (id, updateReminderInfo) => {
    const res = await useAxios.patch(`/reminders/${id}`, updateReminderInfo);
    return res.data;
};

// Delete reminder
export const deleteReminder = async (id, email) => {
    const res = await useAxios.delete(`/reminders/${id}?email=${email}`);
    return res.data;
};