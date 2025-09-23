import React from 'react'

const Login = () => (
  <div className="p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg mt-8">
    <h2 className="text-2xl font-bold mb-4">Login</h2>
    <form className="flex flex-col gap-4">
      <input type="email" placeholder="Email" className="p-2 rounded bg-gray-700 text-white"/>
      <input type="password" placeholder="Password" className="p-2 rounded bg-gray-700 text-white"/>
      <button className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Ingresar</button>
    </form>
  </div>
)

export default Login
