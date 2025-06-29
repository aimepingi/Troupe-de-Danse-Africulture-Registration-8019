// Configuration pour les services d'email
export const EMAIL_CONFIG = {
  // Adresse de destination
  RECIPIENT_EMAIL: 'aimemasukapingi@gmail.com',
  
  // Configuration EmailJS (optionnel - nécessite un compte)
  EMAILJS: {
    SERVICE_ID: 'service_africulture',
    TEMPLATE_ID: 'template_registration',
    PUBLIC_KEY: 'your_public_key_here'
  },
  
  // Configuration FormSubmit (gratuit)
  FORMSUBMIT: {
    ENDPOINT: 'https://formsubmit.co/aimemasukapingi@gmail.com',
    SETTINGS: {
      _template: 'box',
      _captcha: 'false',
      _subject: 'Nouvelle inscription - Troupe de Danse Africulture'
    }
  }
};

// Instructions de configuration
export const SETUP_INSTRUCTIONS = `
INSTRUCTIONS DE CONFIGURATION EMAIL:

1. MÉTHODE EMAILJS (Recommandée):
   - Créer un compte sur https://emailjs.com
   - Créer un service email
   - Créer un template avec les variables: {{nom_complet}}, {{email_participant}}, {{ville}}, {{telephone}}
   - Mettre à jour les clés dans emailConfig.js

2. MÉTHODE FORMSUBMIT (Simple):
   - Aucune configuration requise
   - Fonctionne directement avec l'email aimemasukapingi@gmail.com

3. MÉTHODE MAILTO (Fallback):
   - Ouvre le client email par défaut
   - L'utilisateur doit envoyer manuellement

Le système essaiera automatiquement ces méthodes dans l'ordre jusqu'à ce qu'une fonctionne.
`;