import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import { sendRegistrationEmail, sendViaFormSubmit } from './services/emailService';
import './App.css';

const { FiUser, FiMail, FiMapPin, FiPhone, FiSend, FiCheck, FiMusic, FiAlertCircle } = FiIcons;

function App() {
  const [formData, setFormData] = useState({
    nom: '',
    courriel: '',
    ville: '',
    telephone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }
    
    if (!formData.courriel.trim()) {
      newErrors.courriel = 'Le courriel est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(formData.courriel)) {
      newErrors.courriel = 'Format de courriel invalide';
    }
    
    if (!formData.ville.trim()) {
      newErrors.ville = 'La ville est obligatoire';
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('Envoi en cours...');
    
    try {
      // Méthode 1: Essayer EmailJS d'abord
      const emailResult = await sendRegistrationEmail(formData);
      
      if (emailResult.success) {
        setSubmitMessage('Email envoyé avec succès via EmailJS!');
        setIsSubmitted(true);
      } else {
        // Méthode 2: Essayer FormSubmit comme fallback
        const formSubmitResult = await sendViaFormSubmit(formData);
        
        if (formSubmitResult.success) {
          setSubmitMessage('Inscription envoyée via FormSubmit!');
          setIsSubmitted(true);
        } else {
          // Méthode 3: Fallback final - mailto
          const emailBody = `
Nouvelle inscription à la Troupe de Danse Africulture

Nom complet: ${formData.nom}
Email: ${formData.courriel}
Ville: ${formData.ville}
Téléphone: ${formData.telephone}
Date d'inscription: ${new Date().toLocaleDateString('fr-FR')}

Envoyé depuis le formulaire d'inscription.
          `.trim();
          
          const mailtoLink = `mailto:aimemasukapingi@gmail.com?subject=Nouvelle inscription - Troupe de Danse Africulture&body=${encodeURIComponent(emailBody)}`;
          window.open(mailtoLink, '_blank');
          
          setSubmitMessage('Client email ouvert - Veuillez envoyer l\'email manuellement');
          setIsSubmitted(true);
        }
      }
      
      // Reset form data
      setFormData({
        nom: '',
        courriel: '',
        ville: '',
        telephone: ''
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setSubmitMessage('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setErrors({});
    setSubmitMessage('');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <SafeIcon icon={FiCheck} className="text-3xl text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Inscription envoyée !
          </h2>
          
          <p className="text-gray-600 mb-4">
            Votre demande d'inscription à la Troupe de Danse Africulture a été traitée.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-700">
              {submitMessage}
            </p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            Nous vous contacterons bientôt à l'adresse <strong>{formData.courriel}</strong>
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetForm}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Nouvelle inscription
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 p-6 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <SafeIcon icon={FiMusic} className="text-2xl" />
          </motion.div>
          
          <h1 className="text-2xl font-bold mb-2">
            Troupe de Danse
          </h1>
          <p className="text-lg font-semibold">
            Africulture
          </p>
          <p className="text-sm opacity-90 mt-2">
            Rejoignez notre communauté passionnée
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom complet *
            </label>
            <div className="relative">
              <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                  errors.nom ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Votre nom complet"
              />
            </div>
            {errors.nom && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.nom}
              </motion.p>
            )}
          </motion.div>

          {/* Courriel */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse courriel *
            </label>
            <div className="relative">
              <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="courriel"
                value={formData.courriel}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                  errors.courriel ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="votre@email.com"
              />
            </div>
            {errors.courriel && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.courriel}
              </motion.p>
            )}
          </motion.div>

          {/* Ville */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ville *
            </label>
            <div className="relative">
              <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="ville"
                value={formData.ville}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                  errors.ville ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="Votre ville"
              />
            </div>
            {errors.ville && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.ville}
              </motion.p>
            )}
          </motion.div>

          {/* Téléphone */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Numéro de téléphone *
            </label>
            <div className="relative">
              <SafeIcon icon={FiPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300 ${
                  errors.telephone ? 'border-red-500' : 'border-gray-200 focus:border-orange-500'
                }`}
                placeholder="(XXX) XXX-XXXX"
              />
            </div>
            {errors.telephone && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.telephone}
              </motion.p>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                {submitMessage}
              </>
            ) : (
              <>
                <SafeIcon icon={FiSend} className="text-xl" />
                S'inscrire
              </>
            )}
          </motion.button>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <SafeIcon icon={FiAlertCircle} className="text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-yellow-800 font-medium">
                  Envoi automatique vers aimemasukapingi@gmail.com
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Vos informations seront envoyées directement par email
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            * Champs obligatoires
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default App;