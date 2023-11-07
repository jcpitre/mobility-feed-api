import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import '../styles/Account.css';
import {
  Typography,
  Container,
  IconButton,
  Button,
  Link,
  Paper,
  Box,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  AccountCircleOutlined,
  ContentCopyOutlined,
  ExitToAppOutlined,
  RefreshOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import {
  selectIsRefreshingAccessToken,
  selectRefreshingAccessTokenError,
  selectUserProfile,
} from '../store/selectors';
import { useAppDispatch } from '../hooks';
import { requestRefreshAccessToken } from '../store/profile-reducer';
import { getTimeLeftForTokenExpiration } from '../utils/date';
import LogoutConfirmModal from '../components/LogoutConfirmModal';
export interface APIAccountState {
  showRefreshToken: boolean;
  showAccessToken: boolean;
  accessTokenGenerated: boolean;
  codeBlockTooltip: string;
}

enum TokenTypes {
  Access = 'accessToken',
  Refresh = 'refreshToken',
}

const texts = {
  accessTokenHidden: 'Your access token is hidden',
  refreshTokenHidden: 'Your refresh token is hidden',
  copyAccessToken: 'Copy Access Token',
  copyAccessTokenToClipboard: 'Copy access token to clipboard',
  copyRefreshToken: 'Copy Refresh Token',
  copyRefreshTokenToClipboard: 'Copy refresh token to clipboard',
  copyToClipboard: 'Copy to clipboard',
  copied: 'Copied!',
  tokenUnavailable: 'Your token is unavailable',
};

export default function APIAccount(): React.ReactElement {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUserProfile);
  const refreshingAccessTokenError = useSelector(
    selectRefreshingAccessTokenError,
  );
  const isRefreshingAccessToken = useSelector(selectIsRefreshingAccessToken);

  const [accountState, setAccountState] = React.useState<APIAccountState>({
    showRefreshToken: false,
    showAccessToken: false,
    accessTokenGenerated: false,
    codeBlockTooltip: texts.copyToClipboard,
  });

  const [timeLeftForTokenExpiration, setTimeLeftForTokenExpiration] =
    React.useState<string>('');
  const [openDialog, setOpenDialog] = React.useState<boolean>(false);
  const [showAccessTokenCopiedTooltip, setShowAccessTokenCopiedTooltip] =
    React.useState(false);
  const [accessTokenCopyResult, setAccessTokenCopyResult] =
    React.useState<string>('');
  const [showRefreshTokenCopiedTooltip, setShowRefreshTokenCopiedTooltip] =
    React.useState(false);
  const [refreshTokenCopyResult, setRefreshTokenCopyResult] =
    React.useState<string>('');

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (user?.accessTokenExpirationTime !== null) {
      interval = setInterval(() => {
        setTimeLeftForTokenExpiration(
          getTimeLeftForTokenExpiration(
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            user?.accessTokenExpirationTime,
          ),
        );
      }, 250);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [user?.accessTokenExpirationTime]);

  const handleClickShowToken = React.useCallback(
    (tokenType: TokenTypes): void => {
      switch (tokenType) {
        case TokenTypes.Access:
          setAccountState({
            ...accountState,
            showAccessToken: !accountState.showAccessToken,
          });
          break;
        case TokenTypes.Refresh:
          setAccountState({
            ...accountState,
            showRefreshToken: !accountState.showRefreshToken,
          });
          break;
      }
    },
    [accountState],
  );

  const handleCopyTokenToClipboard = React.useCallback(
    (
      token: string,
      setResult: (result: string) => void,
      setShowTooltip: (showToolTip: boolean) => void,
    ): void => {
      navigator.clipboard
        .writeText(token)
        .then(() => {
          setResult(texts.copied);
        })
        .catch((error) => {
          setResult(`Could not copy text: ${error}`);
        })
        .finally(() => {
          setShowTooltip(true);
          setTimeout(() => {
            setShowTooltip(false);
          }, 1000);
        });
    },
    [],
  );

  const handleGenerateAccessToken = (): void => {
    setAccountState({
      ...accountState,
      accessTokenGenerated: true,
    });
    dispatch(requestRefreshAccessToken());
  };

  const handleCopyCodeBlock = (): void => {
    const accessToken =
      user?.accessToken !== undefined
        ? user?.accessToken
        : '[Your Access Token]';
    const codeBlock = `curl --location 'https://api-dev.mobilitydatabase.org/api/v1/metadata' --header 'Accept: application/json' --header 'Authorization: Bearer ${accessToken}'`;
    navigator.clipboard
      .writeText(codeBlock)
      .then(() => {
        setAccountState({
          ...accountState,
          codeBlockTooltip: 'Copied!',
        });
        setTimeout(() => {
          setAccountState({
            ...accountState,
            codeBlockTooltip: 'Copy to clipboard',
          });
        }, 1000);
      })
      .catch((error) => {
        // TODO display error message
        console.log('Could not copy text: ', error);
      });
  };

  function handleSignOutClick(): void {
    setOpenDialog(true);
  }

  const refreshAccessTokenButtonText = isRefreshingAccessToken
    ? 'Refreshing Access token...'
    : 'Refresh Access token';

  return (
    <Container
      component={'main'}
      maxWidth={false}
      sx={{
        mt: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {refreshingAccessTokenError != null ? (
        <Alert severity='error'>{refreshingAccessTokenError.message}</Alert>
      ) : null}
      <CssBaseline />
      <Typography
        component='h1'
        variant='h4'
        color='primary'
        sx={{ fontWeight: 'bold', ml: 5 }}
        alignSelf='flex-start'
      >
        Your API Account
      </Typography>
      <Box sx={{ display: 'flex', width: '100%', mt: 2 }}>
        <Paper
          sx={{
            bgcolor: '#f9f5f5',
            width: '390px',
            p: 3,
            mr: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
          elevation={0}
        >
          <Typography
            component='h5'
            variant='h5'
            color='primary'
            sx={{
              fontWeight: 'bold',
              mb: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AccountCircleOutlined sx={{ mr: 1 }} />
            User Details
          </Typography>
          <Typography variant='body1'>
            <b>Name:</b>{' '}
            {user?.fullname !== undefined ? user?.fullname : 'Unknown'}
          </Typography>
          <Typography variant='body1'>
            <b>Email:</b> {user?.email !== undefined ? user?.email : 'Unknown'}
          </Typography>
          <Typography variant='body1'>
            <b>Organization:</b>{' '}
            {user?.organization !== undefined ? user?.organization : 'Unknown'}
          </Typography>
          <Box sx={{ mt: 4 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button variant='contained' color='primary' sx={{ mt: 1, ml: 1 }}>
              Change Password
            </Button>
            <Button
              variant='contained'
              color='primary'
              sx={{ mt: 1 }}
              startIcon={<ExitToAppOutlined />}
              onClick={handleSignOutClick}
            >
              Sign Out
            </Button>
          </Box>
          <Box sx={{ mt: 4 }} />
          <Typography>
            Want your account removed? Send us an email at{' '}
            <Link
              href='mailto:api@mobilitydata.org'
              color={'inherit'}
              fontWeight={'bold'}
            >
              api@mobilitydata.org
            </Link>
            .
          </Typography>
        </Paper>
        <Box sx={{ ml: 10 }}>
          <Box sx={{ width: 'fit-content', p: 1, mb: 5 }}>
            <Typography
              component='h5'
              variant='h5'
              color='primary'
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Refresh Token
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Use your refresh token to connect to the API in your app.
            </Typography>
            <Box className='token-display-element'>
              <Typography width={500} variant='body1'>
                {accountState.showRefreshToken
                  ? user?.refreshToken !== undefined
                    ? user?.refreshToken
                    : texts.tokenUnavailable
                  : texts.refreshTokenHidden}
              </Typography>
              <Box className='token-action-buttons'>
                <Tooltip
                  title={
                    showRefreshTokenCopiedTooltip
                      ? refreshTokenCopyResult
                      : texts.copyRefreshToken
                  }
                >
                  <span>
                    <IconButton
                      color='primary'
                      aria-label={texts.copyRefreshTokenToClipboard}
                      edge='end'
                      disabled={user?.refreshToken === undefined}
                      onClick={() => {
                        handleCopyTokenToClipboard(
                          user!.refreshToken!,
                          setRefreshTokenCopyResult,
                          setShowRefreshTokenCopiedTooltip,
                        );
                      }}
                      sx={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                    >
                      <ContentCopyOutlined fontSize='small' />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title='Toggle Refresh Token Visibility'>
                  <IconButton
                    color='primary'
                    aria-label='toggle refresh token visibility'
                    onClick={() => {
                      handleClickShowToken(TokenTypes.Refresh);
                    }}
                    edge='end'
                    sx={{ display: 'inline-block', verticalAlign: 'middle' }}
                  >
                    {accountState.showRefreshToken ? (
                      <VisibilityOffOutlined fontSize='small' />
                    ) : (
                      <VisibilityOutlined fontSize='small' />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography
              component='h5'
              variant='h5'
              color='primary'
              sx={{ fontWeight: 'bold' }}
            >
              Access Token for Testing
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Want some quick testing? Copy the access token bellow to test
              endpoints in our Swagger documentation.
              <br />
              The access token updates regularly.
            </Typography>
            {!accountState.accessTokenGenerated && (
              <Box sx={{ mb: 2 }}>
                <Button onClick={handleGenerateAccessToken} variant='contained'>
                  Generate Access Token
                </Button>
              </Box>
            )}

            {accountState.accessTokenGenerated && (
              <Box sx={{ width: 'fit-content', p: 1, mb: 5 }}>
                <Box className='token-display-element'>
                  <Typography width={500} variant='body1'>
                    {accountState.showAccessToken
                      ? user?.accessToken !== undefined
                        ? user?.accessToken
                        : texts.tokenUnavailable
                      : texts.accessTokenHidden}
                  </Typography>
                  <Box className='token-action-buttons'>
                    <Tooltip title={refreshAccessTokenButtonText}>
                      <span>
                        <IconButton
                          color='primary'
                          aria-label={refreshAccessTokenButtonText}
                          edge='end'
                          sx={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                          onClick={handleGenerateAccessToken}
                          disabled={isRefreshingAccessToken}
                        >
                          {isRefreshingAccessToken ? (
                            <CircularProgress size={14} />
                          ) : (
                            <RefreshOutlined
                              fontSize='small'
                              sx={{
                                display: 'inline-block',
                                verticalAlign: 'middle',
                              }}
                            />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip
                      title={
                        showAccessTokenCopiedTooltip
                          ? accessTokenCopyResult
                          : texts.copyAccessToken
                      }
                    >
                      <span>
                        <IconButton
                          color='primary'
                          aria-label={texts.copyAccessTokenToClipboard}
                          edge='end'
                          disabled={user?.accessToken === undefined}
                          onClick={() => {
                            handleCopyTokenToClipboard(
                              user!.accessToken!,
                              setAccessTokenCopyResult,
                              setShowAccessTokenCopiedTooltip,
                            );
                          }}
                          sx={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        >
                          <ContentCopyOutlined
                            fontSize='small'
                            sx={{
                              display: 'inline-block',
                              verticalAlign: 'middle',
                            }}
                          />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title='Toggle Access Token Visibility'>
                      <IconButton
                        color='primary'
                        aria-label='Toggle access token visibility'
                        edge='end'
                        onClick={() => {
                          handleClickShowToken(TokenTypes.Access);
                        }}
                        sx={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}
                      >
                        {accountState.showAccessToken ? (
                          <VisibilityOffOutlined
                            fontSize='small'
                            sx={{
                              display: 'inline-block',
                              verticalAlign: 'middle',
                            }}
                          />
                        ) : (
                          <VisibilityOutlined
                            fontSize='small'
                            sx={{
                              display: 'inline-block',
                              verticalAlign: 'middle',
                            }}
                          />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography color='error' sx={{ mb: 2 }}>
                  <WarningAmberOutlined style={{ verticalAlign: 'bottom' }} />
                  {timeLeftForTokenExpiration}.
                </Typography>
              </Box>
            )}
          </Box>
          <Paper elevation={3} id='code-block'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div>
                <Typography variant='h6'>API Test</Typography>

                <Typography>
                  Copy the CLI command to test your access to the API.
                </Typography>
              </div>
              <Tooltip title={accountState.codeBlockTooltip}>
                <IconButton
                  color='inherit'
                  aria-label='Copy access token to clipboard'
                  edge='end'
                  onClick={handleCopyCodeBlock}
                  sx={{ display: 'inline-block', verticalAlign: 'middle' }}
                >
                  <ContentCopyOutlined fontSize='small' />
                </IconButton>
              </Tooltip>
            </div>
            <Typography id='code-block-content'>
              <span style={{ color: '#ff79c6', fontWeight: 'bold' }}>curl</span>{' '}
              --location
              &apos;https://api-dev.mobilitydatabase.org/api/v1/metadata&apos;
              <span style={{ color: '#f1fa8c' }}>\</span>
              <br />
              <span style={{ color: '#f1fa8c' }}>--header</span> &apos;Accept:
              application/json&apos;
              <span style={{ color: '#f1fa8c' }}>\</span>
              <br />
              <span style={{ color: '#f1fa8c' }}>--header</span>
              &apos;Authorization: Bearer{' '}
              {accountState.accessTokenGenerated
                ? user?.accessToken
                : '[Your Access Token]'}
              &apos;
            </Typography>
          </Paper>
        </Box>
      </Box>
      <LogoutConfirmModal
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </Container>
  );
}
