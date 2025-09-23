import React from 'react'

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-gray-800 to-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-4">About FormalStore</h1>
      <p className="text-lg max-w-2xl text-center mb-6">
        FormalStore es tu tienda online de trajes, camisas, zapatos y accesorios elegantes. 
        Nuestra misión es ofrecer productos de alta calidad que combinan estilo y confort, 
        para que siempre luzcas impecable.
      </p>
      <p className="text-lg max-w-2xl text-center">
        Desde 2025, hemos ayudado a miles de clientes a encontrar su look perfecto, 
        con envío rápido y atención al cliente de primera.
      </p>
    </div>
  )
}

export default About
