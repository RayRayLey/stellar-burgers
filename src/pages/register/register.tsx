import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import {
  registerUser,
  setFormValue,
  getUserSelector
} from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { replace, useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (email === '' || password === '' || userName === '') {
      return;
    }
    try {
      dispatch(
        registerUser({ name: userName, email: email, password: password })
      ).unwrap();
      navigate('/profile');
    } catch (err) {
      console.error('Регистрация не удалась:', err);
    }
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
