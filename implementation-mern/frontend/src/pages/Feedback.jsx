import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Star, MessageSquarePlus, MessageSquare } from 'lucide-react';
import axios from 'axios';

const Feedback = () => {
    const { user } = useAuth();
    const [modules, setModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState('');
    const [ratings, setRatings] = useState({ teaching: 0, video: 0 });
    const [hover, setHover] = useState({ teaching: 0, video: 0 });
    const [comment, setComment] = useState('');
    const [category, setCategory] = useState('Module');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/modules', config);
                setModules(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchModules();
    }, [user.token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://localhost:5000/api/feedback', {
                moduleId: selectedModule,
                teachingRating: ratings.teaching,
                videoRating: ratings.video,
                comment,
                category
            }, config);
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            // Reset
            setRatings({ teaching: 0, video: 0 });
            setComment('');
        } catch (err) {
            alert('Failed to submit feedback');
        }
    };

    const StarRating = ({ value, type }) => {
        return (
            <div className="star-rating">
                {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                        <Star
                            key={index}
                            size={28}
                            className={ratingValue <= (hover[type] || ratings[type]) ? "star active" : "star"}
                            onClick={() => setRatings({ ...ratings, [type]: ratingValue })}
                            onMouseEnter={() => setHover({ ...hover, [type]: ratingValue })}
                            onMouseLeave={() => setHover({ ...hover, [type]: 0 })}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="feedback-page">
            <div className="header-action">
                <h1>Academic Feedback</h1>
                <p>Your feedback helps us improve the quality of education.</p>
            </div>

            <div className="grid-2">
                <div className="card feedback-card">
                    <h3>Submit New Feedback</h3>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="form-group">
                            <label>Module</label>
                            <select 
                                value={selectedModule} 
                                onChange={(e) => setSelectedModule(e.target.value)}
                                required
                            >
                                <option value="">Select Module...</option>
                                {modules.map(m => <option key={m._id} value={m._id}>{m.name} ({m.code})</option>)}
                            </select>
                        </div>

                        <div className="rating-section grid-2 mt-4">
                            <div className="rating-item">
                                <label>Teaching Quality</label>
                                <StarRating value={ratings.teaching} type="teaching" />
                            </div>
                            <div className="rating-item">
                                <label>Lecture Videos</label>
                                <StarRating value={ratings.video} type="video" />
                            </div>
                        </div>

                        <div className="form-group mt-4">
                            <label>Category</label>
                            <div className="category-chips mt-2">
                                {['Module', 'Lecturer', 'General'].map(cat => (
                                    <button 
                                        key={cat}
                                        type="button" 
                                        className={`chip ${category === cat ? 'active' : ''}`}
                                        onClick={() => setCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group mt-4">
                            <label>Comments & Suggestions</label>
                            <textarea 
                                rows="4" 
                                placeholder="Tell us what you liked or how we can improve..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary w-full mt-6"
                            disabled={!selectedModule || ratings.teaching === 0}
                        >
                            <MessageSquarePlus size={18} />
                            Submit Feedback
                        </button>

                        {submitted && <div className="success-badge mt-4">✅ Thank you! Feedback submitted.</div>}
                    </form>
                </div>

                <div className="info-card section-card">
                    <div className="card bg-primary-light">
                        <h3>Anonymity Notice</h3>
                        <p className="small text-muted mt-2">Your feedbacks are stored securely. Ratings are shared with lecturers in aggregate to protect your identity.</p>
                    </div>

                    <div className="recent-feedback-display mt-6">
                        <h3>Recent Feedback Overview</h3>
                        <div className="card mt-4">
                            <div className="fb-stat">
                                <div className="fb-label">Avg. Module Rating</div>
                                <div className="fb-val">4.8/5.0</div>
                            </div>
                            <div className="fb-stat mt-4">
                                <div className="fb-label">Avg. Video Rating</div>
                                <div className="fb-val">4.2/5.0</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
