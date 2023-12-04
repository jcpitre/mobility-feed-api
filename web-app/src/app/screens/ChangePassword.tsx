import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, IconButton, InputAdornment, Tooltip } from '@mui/material';
import { passwordValidatioError } from '../types';
import { useAppDispatch } from '../hooks';
import { changePassword, changePasswordInit } from '../store/profile-reducer';
import {
  selectChangePasswordError,
  selectChangePasswordStatus,
} from '../store/profile-selectors';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useNavigate } from 'react-router-dom';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

export default function ChangePassword(): React.ReactElement {
  const dispatch = useAppDispatch();
  const navigateTo = useNavigate();
  const changePasswordError = useSelector(selectChangePasswordError);
  const changePasswordStatus = useSelector(selectChangePasswordStatus);
  const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Password is required'),
    newPassword: Yup.string()
      .required('New Password is required')
      .min(12, 'Password is too short - should be 12 chars minimum')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.;!@#$%^&*])(?=.{12,})/,
        passwordValidatioError,
      ),
    confirmNewPassword: Yup.string()
      .required('Confirm New Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[.;!@#$%^&*])(?=.{12,})/,
        passwordValidatioError,
      )
      .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values) => {
      dispatch(changePassword({ password: formik.values.newPassword }));
    },
  });

  if (changePasswordStatus === 'success') {
    // Or display a popup message first,
    // naviagte to account page when user clicks ok
    dispatch(changePasswordInit());
    navigateTo('/account');
  }

  const [showNewPassword, setShowNewPassword] = React.useState(true);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    React.useState(true);

  return (
    // Redirect to account page if password change is successful
    <Container component='main' maxWidth='sm'>
      <CssBaseline />
      <Box
        sx={{
          mt: 12,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          component='h1'
          variant='h5'
          color='secondary'
          sx={{ fontWeight: 'bold', textAlign: 'left' }}
        >
          Change Password
        </Typography>
        <Box
          component='form'
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='currentPassword'
            label='Current Password'
            name='currentPassword'
            type='password'
            autoFocus
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
          />
          {formik.errors.currentPassword != null ? (
            <Alert severity='error'>{formik.errors.currentPassword}</Alert>
          ) : null}
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='newPassword'
            label='New Password'
            name='newPassword'
            type={showNewPassword ? 'text' : 'password'}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Tooltip title='Toggle NewPassword Visibility'>
                    <IconButton
                      color='primary'
                      aria-label='toggle NewPassword visibility'
                      onClick={() => {
                        setShowNewPassword(!showNewPassword);
                      }}
                    >
                      {showNewPassword ? (
                        <VisibilityOffOutlined fontSize='small' />
                      ) : (
                        <VisibilityOutlined fontSize='small' />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          {formik.errors.newPassword != null ? (
            <Alert severity='error'>{formik.errors.newPassword}</Alert>
          ) : null}
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='confirmNewPassword'
            label='Confirm New Password'
            name='confirmNewPassword'
            type={showConfirmNewPassword ? 'text' : 'password'}
            value={formik.values.confirmNewPassword}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <Tooltip title='Toggle Confirm New Password Visibility'>
                    <IconButton
                      color='primary'
                      aria-label='toggle confirm New Password visibility'
                      onClick={() => {
                        setShowConfirmNewPassword(!showConfirmNewPassword);
                      }}
                    >
                      {showConfirmNewPassword ? (
                        <VisibilityOffOutlined fontSize='small' />
                      ) : (
                        <VisibilityOutlined fontSize='small' />
                      )}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          {formik.errors.confirmNewPassword != null ? (
            <Alert severity='error'>{formik.errors.confirmNewPassword}</Alert>
          ) : null}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'left' }}>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            sx={{ mt: 3, mb: 2 }}
            onClick={() => formik.handleSubmit}
          >
            Save Changes
          </Button>
          {changePasswordError != null ? (
            <Alert severity='error' data-testid='firebaseError'>
              {changePasswordError.message}
            </Alert>
          ) : null}
        </Box>
      </Box>
    </Container>
  );
}
