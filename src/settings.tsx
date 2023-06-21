import { motion } from 'framer-motion';

const Settings = () => {
  return (
    <motion.section
      className="p-5 w-full h-[calc(100vh-3rem)] bg-white flex flex-col items-center absolute top-12"
      initial={{ left: '100vw' }}
      animate={{ left: 0 }}
      exit={{ left: '100vw' }}
    >
      あ
    </motion.section>
  );
};

export default Settings;
