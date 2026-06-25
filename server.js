import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // 465 ke liye true hota, 587 ke liye false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/book-now", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      guests,
      date,
      time,
      specialRequest,
    } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Dry Cleaning Booking",
      html: `
        <h2>New Booking Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Guests:</strong> ${guests}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Special Request:</strong> ${specialRequest}</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Booking sent successfully",
    });
  } catch (error) {
    console.error("BOOKING ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send booking. Please try again.",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});