import { useState } from "react";
import "./contactPage.scss";

function ContactPage() {
  const [formData, setFormData] = useState({  //react hook bnaya hai aur name email message starting ke liye khali rakha hai
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {   
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo, just alert the form data
    alert(`Thank you, ${formData.name}! Your message has been received.`);
    setFormData({ name: "", email: "", message: "" }); // reset form
  };

  return (  //thodi si html
    <div className="contactPage">
      <h1>Contact Us</h1>
      <p>If you have any questions, please send us a message or can call us.</p>
      <p> Phone number : 9103120272 , 6006224407</p>

      <form onSubmit={handleSubmit} className="contactForm">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Your email address"
          />
        </label>

        <label>
          Message:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Write your message here"
          />
        </label>

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default ContactPage;
