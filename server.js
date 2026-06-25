import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("========== SERVER START ==========");
console.log("PORT from env:", process.env.PORT);
console.log("EMAIL_USER exists:", !!process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("==================================");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

app.get("/", (req, res) => {
  console.log("GET / hit");
  res.send("Backend is running");
});

app.post("/book-now", async (req, res) => {
  console.log("========== /book-now HIT ==========");
  console.log("Request body received:", req.body);

  try {
    const {
      name,
      phone,
      email,
      address,
      sofas,
      date,
      time,
      specialRequest,
    } = req.body;

    console.log("Step 1: Data extracted successfully");
    console.log({
      name,
      phone,
      email,
      address,
      sofas,
      date,
      time,
      specialRequest,
    });

    console.log("Step 2: Trying to send email directly...");

    const info = await transporter.sendMail({
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
        <p><strong>Number of Sofas:</strong> ${sofas}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Special Request:</strong> ${specialRequest}</p>
      `,
    });

    console.log("Step 2 DONE: Email sent successfully");
    console.log("Mail response info:", info);

    return res.status(200).json({
      success: true,
      message: "Booking sent successfully",
    });
  } catch (error) {
    console.log("========== BOOKING ERROR ==========");
    console.error(error);
    console.log("Error message:", error.message);
    console.log("===================================");

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