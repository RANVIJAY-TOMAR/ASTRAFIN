import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from './Typewriter';
import Magnetic from './Magnetic';

export default function ChatStage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initial greeting - warm and conversational
    useEffect(() => {
        setTimeout(() => {
            setMessages([{
                role: 'assistant',
                content: "Hey there! 👋 I'm Astra, your personal AI financial advisor. I'm here to help you take control of your finances and reach your goals. Whether you want to save more, invest smarter, or just understand where your money goes—I've got you covered. What's on your mind today?"
            }]);
        }, 800);
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        const userInput = input.toLowerCase();
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate API call
        try {
            const response = await fetch("http://localhost:8000/api/chat/respond", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    history: messages.slice(-8)
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();

            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }, 500);
        } catch (error) {
            // Enhanced humanized AI responses with personality
            setTimeout(() => {
                setIsTyping(false);

                let reply = "";

                // Greetings - warm and personal
                if (userInput.match(/\b(hi|hello|hey|greetings|sup|yo)\b/)) {
                    const greetings = [
                        "Hey! 😊 So glad you're here! I'm Astra, and I'm genuinely excited to help you take control of your finances. What's been on your mind lately?",
                        "Hello there! 👋 I'm Astra, your AI financial buddy. Think of me as that friend who actually enjoys talking about money (I know, rare, right?). What can I help you with today?",
                        "Hi! 🌟 Great to meet you! I'm here to make finance feel less scary and more... well, fun! What would you like to explore first?",
                    ];
                    reply = greetings[Math.floor(Math.random() * greetings.length)];
                }
                // Help/guidance - supportive and reassuring
                else if (userInput.match(/\b(help|guide|advice|suggest|lost|confused|don't know)\b/)) {
                    const helpResponses = [
                        "I totally get it—finance can feel overwhelming sometimes! 💙 But here's the thing: you're already doing great by asking for help. Let's break this down together. What specific area feels most confusing right now?",
                        "You know what? Everyone feels this way at some point, and that's completely okay! 🤗 I'm here to make things crystal clear. Whether it's budgeting, saving, or investing—let's tackle it step by step. Where should we start?",
                        "Hey, no worries at all! That's exactly what I'm here for. 💪 Think of me as your personal finance translator—I turn complicated money stuff into simple, actionable steps. What's the biggest question on your mind?",
                    ];
                    reply = helpResponses[Math.floor(Math.random() * helpResponses.length)];
                }
                // Savings - encouraging and practical
                else if (userInput.match(/\b(save|saving|savings|emergency fund)\b/)) {
                    const savingsResponses = [
                        "Ooh, I love that you're thinking about saving! 💰 Here's a little secret: the best savers aren't the ones who make the most—they're the ones who save consistently. Even $20 a week adds up to over $1,000 a year! Want me to help you set up an automatic savings plan?",
                        "Smart move! 🎯 Saving is like planting a money tree—it takes time, but future you will be SO grateful. I usually recommend starting with a small emergency fund (think $500-1000), then building from there. How much do you think you could comfortably set aside each month?",
                        "Yes! Saving is the foundation of everything else. 🌱 Here's what works for most people: pay yourself first. Before bills, before fun stuff—set aside your savings. It's like giving future you a gift. Should we figure out a realistic savings goal together?",
                    ];
                    reply = savingsResponses[Math.floor(Math.random() * savingsResponses.length)];
                }
                // Investment - educational and encouraging
                else if (userInput.match(/\b(invest|investment|stock|portfolio|crypto|etf)\b/)) {
                    const investmentResponses = [
                        "Investing! Now we're talking! 📈 Here's the honest truth: investing isn't about getting rich quick—it's about building wealth steadily over time. The stock market has historically returned about 10% annually. Even starting with $100/month can grow to over $200K in 30 years! Interested in learning more?",
                        "Great question! 💡 Investing can seem intimidating, but it's actually pretty straightforward once you understand the basics. My philosophy? Start simple with index funds, diversify, and think long-term. How much risk are you comfortable with? That'll help me point you in the right direction.",
                        "Love your ambition! 🚀 Investing is one of the best ways to build real wealth. But here's what most people don't tell you: the best investment strategy is the one you'll actually stick with. Let's find something that matches your goals and comfort level. What's your timeline—are we talking 5 years or 30?",
                    ];
                    reply = investmentResponses[Math.floor(Math.random() * investmentResponses.length)];
                }
                // Budget - practical and empathetic
                else if (userInput.match(/\b(budget|spending|expense|money|bills)\b/)) {
                    const budgetResponses = [
                        "Budgeting! Okay, I know it sounds boring, but hear me out—it's actually kind of empowering. 📊 When you know exactly where your money goes, you stop feeling guilty about spending and start feeling in control. Want me to show you a simple budgeting method that actually works?",
                        "Let's talk budgets! 💳 Here's the thing: a budget isn't about restricting yourself—it's about making sure your money goes toward things you actually care about. I've seen people save hundreds just by cutting subscriptions they forgot they had! Ready to see where your money's really going?",
                        "Ah, the B-word! 😅 I get it, budgeting doesn't sound fun. But what if I told you it could help you afford that thing you've been wanting? It's true! A good budget is like a roadmap—it shows you how to get from where you are to where you want to be. Shall we create one together?",
                    ];
                    reply = budgetResponses[Math.floor(Math.random() * budgetResponses.length)];
                }
                // Goals - motivational and action-oriented
                else if (userInput.match(/\b(goal|target|plan|dream|want to|wish)\b/)) {
                    const goalResponses = [
                        "I LOVE goal-oriented thinking! 🎯 You know what separates dreamers from achievers? A solid plan. Tell me about your goal—whether it's buying a house, traveling the world, or retiring early—and I'll help you create a realistic roadmap to get there. What's your big dream?",
                        "Yes! Goals are what make all this money stuff meaningful! 🌟 Here's what I've learned: specific goals with deadlines are 10x more likely to happen than vague wishes. So instead of 'save more,' it's 'save $5,000 by December for a down payment.' See the difference? What's your goal?",
                        "Ooh, I get excited about goals! 💫 Because here's the secret: every financial goal is actually achievable with the right strategy. Whether it's 6 months away or 6 years away, we can break it down into bite-sized steps. What are you working toward?",
                    ];
                    reply = goalResponses[Math.floor(Math.random() * goalResponses.length)];
                }
                // Debt - empathetic and solution-focused
                else if (userInput.match(/\b(debt|loan|credit card|owe|payment)\b/)) {
                    const debtResponses = [
                        "Hey, first of all—no judgment here. 💙 Debt is super common, and the fact that you're addressing it shows real strength. Let's tackle this together. There are proven strategies like the debt snowball or avalanche method that actually work. Want to explore which one fits your situation?",
                        "I hear you, and I want you to know: you're not alone in this. 🤗 Millions of people deal with debt, and many have successfully paid it off. The key is having a clear plan. Should we look at your interest rates and create a payoff strategy that won't make you feel deprived?",
                        "Debt can feel heavy, I get it. 😔 But here's some good news: with the right approach, you can absolutely get out of it. I've seen people pay off tens of thousands by following a solid plan. The first step? Understanding exactly what you owe and to whom. Ready to map it out?",
                    ];
                    reply = debtResponses[Math.floor(Math.random() * debtResponses.length)];
                }
                // Thanks/appreciation
                else if (userInput.match(/\b(thank|thanks|appreciate|grateful)\b/)) {
                    const thanksResponses = [
                        "Aw, you're so welcome! 🥰 Honestly, helping people like you is why I exist. Your financial success is my success! Anything else you want to chat about?",
                        "Hey, that's what I'm here for! 😊 I genuinely love helping people take control of their money. It's like... my thing. What else can I help you with today?",
                        "You're very welcome! 💙 Seriously though, thank YOU for trusting me with your financial journey. That means a lot. What's next on your mind?",
                    ];
                    reply = thanksResponses[Math.floor(Math.random() * thanksResponses.length)];
                }
                // Default - conversational and engaging
                else {
                    const defaultReplies = [
                        "Hmm, interesting! 🤔 I want to make sure I give you the best advice possible. Could you tell me a bit more about what you're trying to achieve? The more I understand your situation, the better I can help!",
                        "You know what? I love where your head's at! 💭 Let me ask you this: what's the outcome you're hoping for? Whether it's more savings, less stress, or just understanding your money better—I'm here to make it happen.",
                        "Great question! 🌟 Here's the thing—everyone's financial situation is unique, so I want to give you advice that actually fits YOUR life. Can you share a bit more context? Like, what's your biggest financial priority right now?",
                        "I'm picking up what you're putting down! 😄 Finance is personal, so let's make this about YOU. What would success look like for you? More money in the bank? Less debt? Better investments? Tell me your vision!",
                    ];
                    reply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
                }

                setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
            }, 1500);
        }
    };

    return (
        <section className="chat-stage glass-panel">
            <header className="chat-header">
                <div>
                    <h1 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>Astra Advisor</h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>AI Financial Partner</p>
                </div>
                <div className="agent-status">
                    <span className="status-dot"></span>
                    <span>Online</span>
                </div>
            </header>

            <div className="chat-window">
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className={`message ${msg.role === 'assistant' ? 'bot' : 'user'}`}
                        >
                            {msg.role === 'assistant' ? (
                                <Typewriter text={msg.content} />
                            ) : (
                                msg.content
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="message bot"
                        style={{ display: 'flex', gap: '4px', alignItems: 'center', width: 'fit-content' }}
                    >
                        <span className="typing-dot" style={{ animation: 'pulse 1s infinite' }}>.</span>
                        <span className="typing-dot" style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s' }}>.</span>
                        <span className="typing-dot" style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s' }}>.</span>
                    </motion.div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Enhanced Chat Input Section */}
            <form className="input-area floating-command-bar" onSubmit={handleSend}>
                <div className="input-wrapper glass-panel">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows={1}
                        placeholder="Ask anything about your finances..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                        style={{
                            resize: 'none',
                            overflow: 'hidden'
                        }}
                    />
                    <Magnetic>
                        <button
                            type="submit"
                            className="send-btn"
                            disabled={!input.trim()}
                            style={{
                                background: input.trim()
                                    ? 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)'
                                    : 'var(--text-tertiary)',
                                boxShadow: input.trim()
                                    ? '0 0 20px rgba(99, 102, 241, 0.4)'
                                    : 'none'
                            }}
                        >
                            <Send size={20} />
                        </button>
                    </Magnetic>
                </div>
            </form>
        </section>
    );
}
