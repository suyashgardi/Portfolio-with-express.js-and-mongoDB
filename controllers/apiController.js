const Project = require('../models/Project');
const Message = require('../models/Message');
const nodemailer = require('nodemailer');


exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects.' });
    }
};


exports.submitContact = async (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please fill in all fields.' });
    }

    try {
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
                subject: `New Portfolio Message from ${name}`,
                text: `You received a new message.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(201).json({ success: 'Message sent and saved successfully!' });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'An error occurred while sending your message.' });
    }
};
