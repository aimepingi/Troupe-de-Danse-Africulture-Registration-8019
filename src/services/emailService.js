import emailjs from 'emailjs-com';

// Configuration EmailJS
const EMAILJS_SERVICE_ID = 'service_africulture';
const EMAILJS_TEMPLATE_ID = 'template_registration';
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // À remplacer par votre clé publique EmailJS

// Initialisation d'EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendRegistrationEmail = async (formData) => {
  try {
    // Préparer les données pour l'email
    const emailData = {
      to_email: 'aimemasukapingi@gmail.com',
      from_name: formData.nom,
      from_email: formData.courriel,
      subject: 'Nouvelle inscription - Troupe de Danse Africulture',
      nom_complet: formData.nom,
      email_participant: formData.courriel,
      ville: formData.ville,
      telephone: formData.telephone,
      date_inscription: new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      message: `
Nouvelle inscription reçue pour la Troupe de Danse Africulture

Détails du participant:
- Nom complet: ${formData.nom}
- Email: ${formData.courriel}
- Ville: ${formData.ville}
- Téléphone: ${formData.telephone}
- Date d'inscription: ${new Date().toLocaleDateString('fr-FR')}

Veuillez contacter cette personne pour finaliser son inscription.
      `.trim()
    };

    // Envoyer l'email via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      emailData
    );

    console.log('Email envoyé avec succès:', response);
    return { success: true, response };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    // Fallback: ouvrir le client email par défaut
    const fallbackEmailBody = `
Nouvelle inscription à la Troupe de Danse Africulture

Nom complet: ${formData.nom}
Email: ${formData.courriel}
Ville: ${formData.ville}
Téléphone: ${formData.telephone}
Date d'inscription: ${new Date().toLocaleDateString('fr-FR')}

Envoyé depuis le formulaire d'inscription.
    `.trim();
    
    const mailtoLink = `mailto:aimemasukapingi@gmail.com?subject=Nouvelle inscription - Troupe de Danse Africulture&body=${encodeURIComponent(fallbackEmailBody)}`;
    window.open(mailtoLink, '_blank');
    
    return { success: false, error, fallback: true };
  }
};

// Alternative avec FormSubmit (service gratuit)
export const sendViaFormSubmit = async (formData) => {
  try {
    const formSubmitData = new FormData();
    formSubmitData.append('_to', 'aimemasukapingi@gmail.com');
    formSubmitData.append('_subject', 'Nouvelle inscription - Troupe de Danse Africulture');
    formSubmitData.append('_template', 'box');
    formSubmitData.append('_captcha', 'false');
    formSubmitData.append('nom', formData.nom);
    formSubmitData.append('email', formData.courriel);
    formSubmitData.append('ville', formData.ville);
    formSubmitData.append('telephone', formData.telephone);
    formSubmitData.append('date', new Date().toLocaleDateString('fr-FR'));

    const response = await fetch('https://formsubmit.co/aimemasukapingi@gmail.com', {
      method: 'POST',
      body: formSubmitData
    });

    if (response.ok) {
      return { success: true, service: 'FormSubmit' };
    } else {
      throw new Error('Erreur FormSubmit');
    }
  } catch (error) {
    console.error('Erreur FormSubmit:', error);
    return { success: false, error };
  }
};

// Service de notification par Webhook (optionnel)
export const sendWebhookNotification = async (formData) => {
  try {
    // Vous pouvez utiliser des services comme Zapier, IFTTT, ou Make.com
    const webhookUrl = 'YOUR_WEBHOOK_URL_HERE'; // À remplacer par votre webhook
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'nouvelle_inscription',
        data: formData,
        timestamp: new Date().toISOString(),
        destination: 'aimemasukapingi@gmail.com'
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur webhook:', error);
    return false;
  }
};