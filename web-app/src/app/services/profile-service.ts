import { updateProfile, type AdditionalUserInfo } from 'firebase/auth';
import { app } from '../../firebase';
import { type OauthProvider, type User } from '../types';

/**
 * Send an email verification to the current user.
 * This function does nothing if the user is not logged in or if the email is already verified.
 */
export const sendEmailVerification = async (): Promise<void> => {
  try {
    const user = app.auth().currentUser;
    if (user !== null && !user.emailVerified) {
      await user.sendEmailVerification();
    }
  } catch (error) {
    // Nothing to do if the email verification fails
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

/**
 * Return the current user or null if the user is not logged in.
 */
export const getUserFromSession = async (): Promise<User | null> => {
  const currentUser = app.auth().currentUser;
  if (currentUser === null) {
    return null;
  }
  const refreshToken = currentUser.refreshToken;
  return {
    fullname: currentUser?.displayName ?? undefined,
    email: currentUser?.email ?? '',
    // Organization cannot be retrieved from the current user
    organization: undefined,
    refreshToken,
  };
};

export const generateUserAccessToken = async (): Promise<User | null> => {
  const currentUser = app.auth().currentUser;

  if (currentUser === null) {
    return null;
  }
  const refreshToken = currentUser.refreshToken;

  const idTokenResult = await currentUser.getIdTokenResult(true);
  const accessToken = idTokenResult.token;
  const accessTokenExpirationTime = idTokenResult.expirationTime;

  return {
    fullname: currentUser?.displayName ?? undefined,
    email: currentUser?.email ?? '',
    // Organization cannot be retrieved from the current user
    organization: undefined,
    refreshToken,
    accessToken,
    accessTokenExpirationTime,
  };
};

export const updateUserInformation = async (values: {
  fullname: string;
}): Promise<void> => {
  const currentUser = app.auth().currentUser;
  // TODO: this is to be removed and replaced by storing the information in Datastore
  if (currentUser !== null) {
    await updateProfile(currentUser, {
      displayName: values?.fullname,
    });
  }
};

export const populateUserWithAdditionalInfo = (
  user: User,
  additionalUserInfo: AdditionalUserInfo,
  oauthProvider: OauthProvider,
): User => {
  return {
    ...user,
    fullname:
      user?.fullname ??
      (additionalUserInfo.profile?.name as string) ??
      undefined,
    email:
      user?.email ?? (additionalUserInfo.profile?.email as string) ?? undefined,
  };
};
