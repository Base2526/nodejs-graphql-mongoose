import * as React from 'react';
import { useState } from 'react';
// import { useLogin, useNotify, Notification } from 'react-admin';

import {
  Form,
  required,
  TextInput,
  useTranslate,
  useLogin,
  useNotify,
} from 'react-admin';

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Box from '@mui/material/Box';

import { useNavigate } from 'react-router-dom';

// refer : https://github.com/marmelab/react-admin/blob/master/examples/demo/src/layout/Login.tsx
const ForgotPasswordPage = ({ theme }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();

    const [loading, setLoading] = useState(false);
    const translate = useTranslate();

    const handleSubmit = async e => {
        e.preventDefault();

        // let register = await authProvider.register()
        // console.log("register :", register)
        login({ username, password }).catch(() =>
            notify('Invalid email or password')
        );
    };

    /*
    const handleSubmit = (auth: FormValues) => {
      setLoading(true);
      login(
          auth,
          location.state ? (location.state as any).nextPathname : '/'
      ).catch((error: Error) => {
          setLoading(false);
          notify(
              typeof error === 'string'
                  ? error
                  : typeof error === 'undefined' || !error.message
                  ? 'ra.auth.sign_in_error'
                  : error.message,
              {
                  type: 'warning',
                  messageArgs: {
                      _:
                          typeof error === 'string'
                              ? error
                              : error && error.message
                              ? error.message
                              : undefined,
                  },
              }
          );
      });
  };
  */

    return (
        // <form onSubmit={handleSubmit}>
        //     <input
        //         name="username"
        //         type="email"
        //         value={username}
        //         onChange={e => setUsername(e.target.value)}
        //     />
        //     <input
        //         name="password"
        //         type="password"
        //         value={password}
        //         onChange={e => setPassword(e.target.value)}
        //     />

        //     <button type = 'submit'>Click to submit</button>
        // </form>
        <Form onSubmit={handleSubmit} noValidate>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    background:
                        'url(https://source.unsplash.com/random/1600x900)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                <Card sx={{ minWidth: 300, marginTop: '6em' }}>
                    <Box
                        sx={{
                            margin: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <LockIcon />
                        </Avatar>
                    </Box>
                    {/* <Box
                        sx={{
                            marginTop: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            color: theme => theme.palette.grey[500],
                        }}
                    >
                        Hint: demo / demo
                    </Box> */}
                    <Box sx={{ padding: '0 1em 1em 1em' }}>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextInput
                                autoFocus
                                source="username"
                                label={translate('ra.auth.username')}
                                disabled={loading}
                                validate={required()}
                                fullWidth
                            />
                        </Box>
                        <Box
                        sx={{
                            marginTop: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            color: theme => theme.palette.grey[500],
                        }}
                    >
                       - OR -
                    </Box>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextInput
                                autoFocus
                                source="email"
                                // label={translate('ra.auth.email')}
                                disabled={loading}
                                validate={required()}
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <CardActions sx={{ padding: '0 1em 1em 1em' }}>

                        <Button
                            variant="contained"
                            // type="submit"
                            color="primary"
                            disabled={loading}
                            fullWidth
                            onClick={(ev)=>{
                              console.log("REGISTER")
                              navigate('/register');
                            }}
                        >
                            {loading && (
                                <CircularProgress size={25} thickness={2} />
                            )}
                            FORGOT PASSWORD
                        </Button>
                    </CardActions>
                </Card>
            </Box>
        </Form>
    );
};

export default ForgotPasswordPage;