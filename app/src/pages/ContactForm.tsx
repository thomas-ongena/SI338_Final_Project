import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Your email handling logic (Formspree, EmailJS, or Backend)
    setSubmitted(true);
  };

  return submitted ? (
    <p>Thank you! We&apos;ll be in touch soon.</p>
  ) : (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-row">
        <div className="form-group name-phone">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group name-phone">
          <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        </div>
      </div>

      <div className="form-group">
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required />
      </div>
      <button type="submit">Send Message</button>
    </form>
  );
}
