const About = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-800 to-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">About FormalStore</h1>

      <div className="max-w-2xl space-y-4 text-center">
        <p className="text-lg">
          FormalStore es tu tienda online de trajes, camisas, zapatos y accesorios elegantes. 
          Nuestra misión es ofrecer productos de alta calidad que combinan estilo y confort, 
          para que siempre luzcas impecable.
        </p>

        <p className="text-lg">
          Desde 2025, hemos ayudado a miles de clientes a encontrar su look perfecto, 
          con envío rápido y atención al cliente de primera.
        </p>
      </div>
    </section>
  );
};

export default About;
