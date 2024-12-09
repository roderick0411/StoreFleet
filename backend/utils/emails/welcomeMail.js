// Import the necessary modules here
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

export const sendWelcomeEmail = async (user) => {
  // Write your code here
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "codingninjas2k16@gmail.com",
      pass: "slwvvlczduktvhdj",
    },
  });

  const viewsPath = path.resolve("backend", "views");
  console.log(viewsPath);
  const hbsOptions = {
    viewEngine: {
      partialsDir: viewsPath,
      layoutsDir: viewsPath,
      defaultLayout: "welcomeMessage",
    },
    viewPath: viewsPath,
  };

  transporter.use("compile", hbs(hbsOptions));

  const mailOptions = {
    from: "codingninjas2k16@gmail.com",
    to: user.email,
    subject: "Welcome to StoreFleet",
    template: "welcomeMessage",
    context: {
      name: user.name,
      imageUrl: "http://localhost:3000/logo.png",
    },
  };
  await transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log(info);
      console.log("Email sent");
    })
    .catch((err) => {
      console.log(err.message);
      throw new Error("Error ocurred in sending Email");
    });
};
