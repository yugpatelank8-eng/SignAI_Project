import React, { useState, useEffect, useRef } from 'react';
import { Camera, Zap, Send, Cpu, Layers, Bot, ScanLine, ArrowRight, Menu, X, BrainCircuit, BookCopy } from 'lucide-react';

// For the 3D effect, ensure three.js is loaded in your index.html
const THREE = window.THREE;

// --- Helper Components ---
const Section = ({ children, className = '' }) => (
  <section className={`min-h-screen w-full flex items-center justify-center text-white py-28 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-6xl mx-auto w-full">
      {children}
    </div>
  </section>
);

const AnimatedCard = ({ children, className = '' }) => (
    <div className={`bg-black bg-opacity-20 p-6 sm:p-8 rounded-2xl border border-cyan-500/10 shadow-lg backdrop-blur-lg hover:border-cyan-500/30 hover:shadow-cyan-500/10 transition-all duration-300 ${className}`}>
        {children}
    </div>
);

// --- 3D Background Component ---
const ThreeJSBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!THREE) return;
    const currentMount = mountRef.current;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);
    camera.position.z = 100;

    const points = [];
    for (let i = 0; i < 500; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        points.push(new THREE.Vector3(x, y, z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointsMaterial({ color: 0x00d1ff, size: 0.5, transparent: true, opacity: 0.8 });
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    for (let i = 0; i < 200; i++) {
        const p1 = points[Math.floor(Math.random() * points.length)];
        const p2 = points[Math.floor(Math.random() * points.length)];
        linePositions.push(p1.x, p1.y, p1.z);
        linePositions.push(p2.x, p2.y, p2.z);
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00d1ff, transparent: true, opacity: 0.1 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    const mouse = new THREE.Vector2();
    const onMouseMove = (event) => {
        const touch = event.touches ? event.touches[0] : event;
        mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);
        pointCloud.rotation.y += 0.0001;
        lines.rotation.y += 0.0001;
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.02;
        camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (currentMount) {
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onMouseMove);
        window.removeEventListener('resize', handleResize);
        if (currentMount && renderer.domElement) {
             currentMount.removeChild(renderer.domElement);
        }
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-full -z-10 bg-black" />;
};


// --- Navbar Component ---
const Navbar = ({ page, setPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['Home', 'About', 'How To Use', 'Tech', 'Contact'];

  const NavLink = ({ item }) => (
    <button 
      onClick={() => {
        setPage(item.toLowerCase().replace(/ /g, ''));
        setIsMenuOpen(false);
      }}
      className={`text-lg font-medium transition-all duration-300 relative py-2 ${page === item.toLowerCase().replace(/ /g, '') ? 'text-cyan-400' : 'text-gray-300 hover:text-white'}`}
    >
      {item}
      {page === item.toLowerCase().replace(/ /g, '') && (
        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-cyan-400 rounded-full"></span>
      )}
    </button>
  );
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-20 backdrop-blur-xl text-white p-4 flex justify-between items-center border-b border-cyan-500/10">
      <div className="flex items-center">
        <Cpu className="h-8 w-8 text-cyan-400 mr-3" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">SignAI</h1>
      </div>
      <nav className="hidden md:flex space-x-8">
        {navItems.map(item => <NavLink key={item} item={item} />)}
      </nav>
      <div className="hidden md:block">
        <button 
          onClick={() => setPage('ai')}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-lg shadow-lg shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300 flex items-center"
        >
          Launch AI <ArrowRight className="ml-2 h-5 w-5"/>
        </button>
      </div>
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>
       {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-black bg-opacity-90 backdrop-blur-xl md:hidden flex flex-col items-center space-y-6 py-8 border-b border-cyan-500/10">
          {navItems.map(item => <NavLink key={item} item={item} />)}
           <button 
              onClick={() => {
                  setPage('ai');
                  setIsMenuOpen(false);
              }}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-lg shadow-lg shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300 flex items-center text-lg"
            >
              Launch AI <ArrowRight className="ml-2 h-5 w-5"/>
            </button>
        </nav>
      )}
    </header>
  );
};

// --- Page Components ---
const HomePage = ({ setPage }) => (
  <Section className="text-center">
    <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold mb-4 bg-gradient-to-r from-white via-cyan-300 to-purple-400 text-transparent bg-clip-text drop-shadow-lg">
        Empowering Communication Beyond Words.
    </h1>
    <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
        SignAI bridges the gap between speech and silence using the power of Artificial Intelligence. Designed to translate hand gestures into real-time text, our platform makes the world more inclusive for the deaf and mute community.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
         <button
            onClick={() => setPage('ai')}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-10 rounded-lg text-xl shadow-2xl shadow-cyan-500/30 transform hover:scale-110 transition-all duration-300"
        >
            Launch SignAI
        </button>
    </div>
  </Section>
);

const AboutPage = () => (
    <Section>
        <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Our Vision & Story</h2>
             <p className="text-2xl italic text-gray-400 mb-16 max-w-3xl mx-auto">“When technology listens to silence, humanity speaks louder.”</p>
            <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-4xl mx-auto">
                SignAI was built with one belief — that communication should never be limited by sound. What started as a final year student project has evolved into a powerful vision for accessibility and inclusivity. Our AI model learns from real-world gestures, recognizing subtle differences in finger positions, motion, and orientation — all in real time. Behind the scenes, we've crafted an intelligent, empathetic, and precise model that not only translates gestures but understands the nuance of human expression.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                <AnimatedCard>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white flex items-center"><Zap className="mr-3 text-cyan-400"/>Our Mission</h3>
                    <p className="text-gray-400">To create a voice for the voiceless through deep learning. We aim to provide an intuitive and instantaneous translation tool that facilitates smoother conversations in daily life, educational settings, and professional environments, fostering a more connected and empathetic global community.</p>
                </AnimatedCard>
                <AnimatedCard>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white flex items-center"><Layers className="mr-3 text-cyan-400"/>Our Vision</h3>
                    <p className="text-gray-400">A future where every human interaction is inclusive, barrier-free, and powered by understanding. SignAI is more than a project; it's a step towards a world where technology amplifies human potential and celebrates the diversity of communication, ensuring every voice, spoken or signed, is heard and valued.</p>
                </AnimatedCard>
            </div>
        </div>
    </Section>
);

const HowToUsePage = () => {
    const signs = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','nothing','space'];
    return (
        <Section>
             <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Talk with Your Hands</h2>
                <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-3xl mx-auto">Using SignAI is designed to be effortless. Launch the AI, grant webcam access, and you're ready. Our model is trained to recognize the following gestures.</p>
                <AnimatedCard>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                        {signs.map(sign => (
                            <div key={sign} className="p-2 rounded-lg flex flex-col items-center justify-center aspect-square transition-transform hover:scale-110">
                                <img 
                                    src={`/${sign}_test.jpg`} 
                                    alt={`ASL sign for ${sign}`}
                                    className="w-full h-full object-contain rounded-md"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += `<div class="w-full h-full bg-gray-700 rounded-md flex items-center justify-center text-xs text-gray-400">${sign.toUpperCase()}</div>`; }}
                                />
                                <p className="mt-2 font-bold text-md uppercase">{sign}</p>
                            </div>
                        ))}
                    </div>
                </AnimatedCard>
            </div>
        </Section>
    );
};

const TechPage = () => (
    <Section>
        <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">The Science Behind the Signs</h2>
            <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-3xl mx-auto">Discover how deep learning and computer vision combine to understand the intricate language of hand gestures, achieving an incredible **99.11% accuracy**.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                <AnimatedCard>
                    <h3 className="text-xl font-bold mb-2 flex items-center"><Layers className="mr-2 text-cyan-400"/>Model Overview</h3>
                    <p className="text-gray-400 text-sm">We use a deep neural network built with TensorFlow/Keras, featuring multiple dense layers and dropout for regularization to prevent overfitting.</p>
                </AnimatedCard>
                 <AnimatedCard>
                    <h3 className="text-xl font-bold mb-2 flex items-center"><BookCopy className="mr-2 text-cyan-400"/>Dataset Details</h3>
                    <p className="text-gray-400 text-sm">The model was trained on a massive dataset of over 87,000 images, covering 29 distinct classes of the American Sign Language alphabet.</p>
                </AnimatedCard>
                 <AnimatedCard>
                    <h3 className="text-xl font-bold mb-2 flex items-center"><BrainCircuit className="mr-2 text-cyan-400"/>Neural Architecture</h3>
                    <p className="text-gray-400 text-sm">Our architecture starts with 42 input nodes (21 hand landmarks, X/Y), passes through hidden layers of 128, 256, and 128 neurons, and ends with a softmax output layer.</p>
                </AnimatedCard>
                 <AnimatedCard>
                    <h3 className="text-xl font-bold mb-2 flex items-center"><Zap className="mr-2 text-cyan-400"/>Real-time Processing</h3>
                    <p className="text-gray-400 text-sm">Google's MediaPipe extracts hand landmarks, which we normalize for scale and rotation. This data is sent via a FastAPI WebSocket to the model for near-instantaneous prediction.</p>
                </AnimatedCard>
            </div>
        </div>
    </Section>
);

// --- CORRECTED Contact Page ---
const ContactPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <Section>
            <div className="max-w-xl w-full mx-auto">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Get in Touch</h2>
                    <p className="text-base sm:text-lg text-gray-300 mb-8">We'd love to hear from you. Whether you have a question, feedback, or a collaboration idea, don't hesitate to reach out.</p>
                </div>
                {submitted ? (
                    <AnimatedCard className="text-center border-green-500/30">
                        <h3 className="text-2xl font-bold text-green-400">Message Sent!</h3>
                        <p className="text-gray-300 mt-2">Thank you for your query. We appreciate your interest and will get back to you as soon as possible.</p>
                    </AnimatedCard>
                ) : (
                    <AnimatedCard>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input type="text" id="name" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input type="email" id="email" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                <textarea id="message" rows="4" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center">
                                <Send className="mr-2 h-5 w-5"/>Submit Query
                            </button>
                        </form>
                    </AnimatedCard>
                )}
            </div>
        </Section>
    );
};

// --- CORRECTED AI Interface Page ---
const AiInterfacePage = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const socketRef = useRef(null);
    const [prediction, setPrediction] = useState('...');
    const [history, setHistory] = useState([]);
    const [isWebcamReady, setIsWebcamReady] = useState(false);
    const [socketStatus, setSocketStatus] = useState('Initializing...');
    const [isPredicting, setIsPredicting] = useState(false);

    useEffect(() => {
        const videoElement = videoRef.current;
        async function setupWebcam() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
                if (videoElement) {
                    videoElement.srcObject = stream;
                    videoElement.onloadedmetadata = () => {
                        console.log("✅ Webcam stream loaded.");
                        setIsWebcamReady(true);
                    };
                }
            } catch (err) {
                console.error("❌ Error accessing webcam:", err);
                setSocketStatus("Webcam Error");
            }
        }
        setupWebcam();
        
        const socket = new WebSocket('ws://127.0.0.1:8000/ws');
        socket.onopen = () => {
            console.log("✅ WebSocket connection established!");
            setSocketStatus('Ready');
        };
        socket.onclose = () => {
            console.log("❌ WebSocket connection closed.");
            setSocketStatus('Offline');
        };
        socket.onerror = (err) => {
            console.error("❌ WebSocket error:", err);
            setSocketStatus('Error');
        };
        socket.onmessage = (event) => {
            const newPrediction = event.data;
            setPrediction(newPrediction);
            setIsPredicting(false);
        };
        socketRef.current = socket;

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (videoElement && videoElement.srcObject) {
                videoElement.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handlePredict = () => {
        const videoElement = videoRef.current;
        if (videoElement && videoElement.readyState >= 3 && canvasRef.current && socketRef.current?.readyState === 1 && !isPredicting) {
            setIsPredicting(true);
            setPrediction('...');
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            socketRef.current.send(dataUrl);
        }
    };
    
    const handleAction = (action) => {
        setHistory(oldHistory => {
            if (action === 'space') return [...oldHistory, ' '];
            if (action === 'del') return oldHistory.slice(0, -1);
            if (action === 'add' && prediction && !['Show Hand', 'Uncertain', 'Error', '...'].includes(prediction)) {
                 return [...oldHistory, prediction];
            }
            return oldHistory;
        });
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center text-white p-4 pt-24">
            <div className="w-full max-w-6xl bg-black bg-opacity-20 border border-cyan-500/20 rounded-3xl shadow-2xl shadow-cyan-500/10 backdrop-blur-xl p-4 sm:p-8 flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-3/5 bg-black rounded-2xl overflow-hidden relative group aspect-video lg:aspect-auto">
                     <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none"></div>
                     <div className="absolute top-4 left-4 text-sm bg-black/30 px-3 py-1 rounded-full">{socketStatus}</div>
                     {!isWebcamReady && <div className="absolute inset-0 flex items-center justify-center bg-black/70"><p>Initializing Webcam...</p></div>}
                </div>
                <div className="w-full lg:w-2/5 flex flex-col">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Control Panel</h2>
                    <p className="text-gray-400 mb-6">Your translated text will appear below.</p>
                    <div className="flex-grow bg-gray-900/50 rounded-xl p-4 border border-gray-700 mb-6 min-h-[150px] sm:min-h-[200px]">
                        <p className="text-xl sm:text-2xl text-gray-200 font-mono h-full break-words">
                            {history.join('')}
                            <span className="animate-pulse text-cyan-400">|</span>
                        </p>
                    </div>
                    <div className="text-center mb-6">
                        <p className="text-gray-400 mb-1">Last Detected Sign</p>
                        <p className="text-5xl sm:text-6xl font-bold text-cyan-300 h-20 flex items-center justify-center">{prediction}</p>
                    </div>
                    <button onClick={handlePredict} disabled={!isWebcamReady || socketStatus !== 'Ready' || isPredicting} className="w-full text-xl sm:text-2xl font-bold py-5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center bg-cyan-500 text-black hover:bg-cyan-400 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed mb-4">
                        <ScanLine className={`mr-3 h-7 w-7 sm:h-8 sm:w-8 ${isPredicting ? 'animate-pulse' : ''}`}/>
                        {isPredicting ? 'ANALYZING...' : 'CAPTURE SIGN'}
                    </button>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => handleAction('add')} className="w-full py-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">Add to Text</button>
                        <button onClick={() => handleAction('space')} className="w-full py-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">Space</button>
                        <button onClick={() => handleAction('del')} className="w-full py-3 rounded-lg bg-red-800/50 hover:bg-red-800 transition-colors">Delete</button>
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};


// --- Main App Component ---
function App() {
  const [page, setPage] = useState('home');

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage setPage={setPage} />;
      case 'about': return <AboutPage />;
      case 'howtouse': return <HowToUsePage />;
      case 'tech': return <TechPage />;
      case 'contact': return <ContactPage />;
      case 'ai': return <AiInterfacePage />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <ThreeJSBackground />
      <header>
        <Navbar page={page} setPage={setPage} />
      </header>
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;

