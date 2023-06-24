import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Alert from '@mui/material/Alert';
import Iconify from '../../../components/iconify';
import { handleLogin } from '../../../apis/auth';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    user_name: '',
    password: ''
  })
  const [isLoginError, setIsLoginError] = useState(false)

  const handleUpdateLoginData = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleClick = () => {
    handleLogin(loginData).then(res => {
      navigate('/dashboard/app')
      sessionStorage.setItem('access_token', res.data.token)
    }).catch(() => {
      setIsLoginError(true)
    })
  };

  useEffect(() => {
    if (sessionStorage.getItem('access_token')) {
      navigate('/dashboard/app')
    }
  }, [sessionStorage.getItem('access_token')])

  return (
    <>
      <Stack spacing={3}>
        <TextField name="user_name" label="User Name" onChange={handleUpdateLoginData} />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          onChange={handleUpdateLoginData}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {
          isLoginError && <Alert severity="error">This is an error alert — check it out!</Alert>
        }
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} style={{ marginTop: 20 }}>
        Login
      </LoadingButton>
    </>
  );
}
