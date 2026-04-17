const FAQ = require('../models/FAQ');

// @desc    Get FAQ or Chatbot response
// @route   POST /api/faq/chat
// @access  Public
const getChatResponse = async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    // Simple keyword matching for "pre-defined FAQ"
    // In a real app, this would be more sophisticated
    const faqs = await FAQ.find();
    
    const words = query.toLowerCase().split(' ');
    let bestMatch = null;
    let maxMatches = 0;

    faqs.forEach(faq => {
        let matches = 0;
        const qWords = faq.question.toLowerCase() + ' ' + (faq.tags ? faq.tags.join(' ') : '');
        
        words.forEach(word => {
            if (word.length > 3 && qWords.includes(word)) {
                matches++;
            }
        });

        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = faq;
        }
    });

    if (bestMatch && maxMatches > 0) {
        res.status(200).json({ 
            answer: bestMatch.answer,
            category: bestMatch.category
        });
    } else {
        res.status(200).json({ 
            answer: "I'm sorry, I couldn't find a specific answer to that. Please try asking about attendance, modules, or academic records.",
            category: 'General'
        });
    }
};

// @desc    Add FAQ
// @route   POST /api/faq
// @access  Private (Admin)
const addFAQ = async (req, res) => {
    const { question, answer, category, tags } = req.body;
    const faq = await FAQ.create({ question, answer, category, tags });
    res.status(201).json(faq);
};

// @desc    Get all FAQs
// @route   GET /api/faq
// @access  Public
const getAllFAQs = async (req, res) => {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
};

module.exports = {
    getChatResponse,
    addFAQ,
    getAllFAQs
};
