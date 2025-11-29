import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiUsers, FiLock, FiAward } from "react-icons/fi";

const HomePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* --- HERO SECTION (Dark Theme) --- */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
              Your Voice, <span className="text-amber-400">Your Vote</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Empowering democratic decisions through secure, transparent, and accessible voting technology.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/inquiry">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-bold shadow-lg transition-all flex items-center justify-center mx-auto sm:mx-0"
                >
                  Get Started <FiArrowRight className="ml-2" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FEATURES GRID (Cards) --- */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800">Why Choose Saarthi?</h2>
          <p className="text-slate-600 mt-2">Built for trust, speed, and security.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiCheckCircle className="text-amber-500 text-3xl" />,
              title: "Secure Voting",
              desc: "Complete anonymity ensures you can use your democratic power safely.",
              color: "border-amber-200 bg-amber-50"
            },
            {
              icon: <FiUsers className="text-blue-500 text-3xl" />,
              title: "Voter Verification",
              desc: "Advanced identity checks prevent fraud while maintaining privacy.",
              color: "border-blue-200 bg-blue-50"
            },
            {
              icon: <FiLock className="text-emerald-500 text-3xl" />,
              title: "Tamper-Proof",
              desc: "Once a vote is cast, it is encrypted and cannot be changed by anyone.",
              color: "border-emerald-200 bg-emerald-50"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className={`p-8 rounded-xl border ${feature.color} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- HOW IT WORKS (Steps) --- */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Left Image Placeholder */}
            <div className="md:w-1/2">
              <div className="bg-slate-100 rounded-2xl h-80 flex items-center justify-center border-2 border-dashed border-slate-300">
                <span className="text-slate-400 font-medium">Illustration / Image Here</span>
              </div>
            </div>

            {/* Right Steps */}
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">How It Works</h2>
              {[
                { step: "01", title: "Register Identity", desc: "Verify your eligibility securely." },
                { step: "02", title: "Get Voting ID", desc: "Receive a unique, private access key via email." },
                { step: "03", title: "Cast Vote", desc: "Select your candidate and submit your encrypted ballot." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-4xl font-bold text-slate-200">{item.step}</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;