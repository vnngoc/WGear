const emailjs = require('emailjs-com');

const sendVerificationEmail = async (email, verificationCode) => {
    const templateParams = {
        to_email: email,
        verification_code: verificationCode,
    };

    try {
        await emailjs.send('service_wgo5m5a', 'template_duq3z3e', templateParams, '7oV_vV7xwhrwQvsb9');
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

module.exports = { sendVerificationEmail };