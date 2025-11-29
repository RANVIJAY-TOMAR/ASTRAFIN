import Sidebar from './components/Sidebar';
import ChatStage from './components/ChatStage';
import StarField from './components/StarField';
import LoadingScreen from './components/LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onLoadComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <div className="ambient-background"></div>
          <StarField />

          <motion.main
            className="app-container"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sidebar />
            <ChatStage />
          </motion.main>
        </>
      )}
    </>
  );
}

export default App;
