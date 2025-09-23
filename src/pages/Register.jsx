import React, { useRef, useState, useEffect } from 'react';
import axios from '../api/axios'; // Axios con baseURL http://localhost:5000

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/users';

const Register = () => {
  const userRef = useRef();   // Foco inicial en input usuario
  const errRef = useRef();    // Mensaje de error

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Foco inicial en input usuario
  useEffect(() => {
    userRef.current.focus();
  }, []);

  // Validaciones en tiempo real
  useEffect(() => setValidName(USER_REGEX.test(user)), [user]);
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  // Limpiar mensaje de error al cambiar inputs
  useEffect(() => setErrMsg(''), [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación extra
    if (!USER_REGEX.test(user) || !PWD_REGEX.test(pwd)) {
      setErrMsg("Entrada inválida");
      return;
    }

    try {
      await axios.post(REGISTER_URL, { user, pwd }); // JSON Server agrega id automáticamente
      setSuccess(true);

      // Limpiar formulario
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      setErrMsg('Registro fallido. Intenta de nuevo.');
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section className="p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg mt-8 text-center">
          <h1 className="text-2xl font-bold mb-4">¡Registro exitoso!</h1>
          <p>
            <a href="/login" className="text-blue-400 hover:text-blue-600">Iniciar sesión</a>
          </p>
        </section>
      ) : (
        <section className="p-8 max-w-md mx-auto bg-gray-800 rounded-xl shadow-lg mt-8">
          <p ref={errRef} className={errMsg ? "text-red-500 mb-4" : "hidden"} aria-live="assertive">
            {errMsg}
          </p>
          <h2 className="text-2xl font-bold mb-4">Registro</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Usuario */}
            <input
              type="text"
              ref={userRef}
              placeholder="Nombre de usuario"
              autoComplete="off"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              className="p-2 rounded bg-gray-700 text-white"
              required
              aria-invalid={validName ? "false" : "true"}
            />

            {/* Contraseña */}
            <input
              type="password"
              placeholder="Contraseña"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              className="p-2 rounded bg-gray-700 text-white"
              required
              aria-invalid={validPwd ? "false" : "true"}
            />

            {/* Confirmar contraseña */}
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={matchPwd}
              onChange={(e) => setMatchPwd(e.target.value)}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              className="p-2 rounded bg-gray-700 text-white"
              required
              aria-invalid={validMatch ? "false" : "true"}
            />

            {/* Botón submit */}
            <button
              type="submit"
              disabled={!validName || !validPwd || !validMatch}
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              Crear Cuenta
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default Register;
