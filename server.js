import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ujjuarora5@gmail.com",
    pass: "aivhasspbhprtbuw",
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
      from: "ujjuarora5@gmail.com",
      to: "ujjuarora5@gmail.com",
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

    res.status(200).json({
      success: true,
      message: "Booking sent successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// ujjuarora5@gmail.com
// aivhasspbhprtbuw