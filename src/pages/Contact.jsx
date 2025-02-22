import { useState, useRef, Suspense } from "react";
import emailjs from '@emailjs/browser';
import { Canvas } from "@react-three/fiber";
import Fox from '../models/Fox';
import useAlert from "../hooks/useAlert";
import  Loader from "../components/Loader";
import Alert from "../components/Alert";

const Contact = () => {
  const formRef = useRef(null); 
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setIsLoading] = useState(false); 
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); 
    setCurrentAnimation('hit');
    emailjs.sendForm(
      import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
      formRef.current, 
      import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setIsLoading(false); 
      showAlert({
        show: true,
        text: "Message sent successfully 😃",
        type: "success",
      });
      setTimeout(() => {
        hideAlert(false);
        setCurrentAnimation("idle");
        setForm({
          name: "",
          email: "",
          message: "",
        });
      }, [3000]);
    })
    .catch((error) => {
      console.log(error); 
      setCurrentAnimation('idle');
      setIsLoading(false); 
      showAlert({
        show: true,
            text: "I didn't receive your message 😢",
            type: "danger",
      });
    });
  };

  const handleFocus = () => setCurrentAnimation("walk");
  const handleBlur = () => setCurrentAnimation("idle");

  return (
    <section className="relative flex lg:flex-row flex-col max-container">

      {alert.show && <Alert {...alert} />}

      <div className="flex-1 min-w-[50%] flex flex-col">
        <h1 className="head-text">Get in Touch</h1>
        <form 
          ref={formRef} // Use the ref for the form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-7 mt-14"
        >
          <label className='text-black-500 font-semibold'>
            Name
            <input
              type='text'
              name='name'
              className='input'
              placeholder='Emilia Clarke'
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className='text-black-500 font-semibold'>
            Email
            <input
              type='email'
              name='email'
              className='input'
              placeholder='Justcallmedanny@gmail.com'
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className='text-black-500 font-semibold'>
            Your Message
            <textarea
              name='message'
              rows='4'
              className='textarea'
              placeholder='Let me know how I can help you today'
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <button
            type='submit'
            disabled={loading} // Disable the button while loading
            className='btn'
            onFocus={handleFocus}
              onBlur={handleBlur}
          >
            {loading ? "Sending..." : "Send Message"} {/* Show "Sending..." when loading */}
          </button>
        </form>
      </div>

      <div className="llg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
        <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        >
           <directionalLight position={[0, 0, 1]} intensity={2.5} />
          <ambientLight intensity={1} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />
          <Suspense fallback={<Loader/>}>
            <Fox
             currentAnimation={currentAnimation}
             position={[0.5, 0.35, 0]}
             rotation={[12.625, -0.6, 0]}
             scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default Contact;
