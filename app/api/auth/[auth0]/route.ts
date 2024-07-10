
// import { handleAuth } from '@auth0/nextjs-auth0';

// export const GET = handleAuth();


import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        authorizationParams: {
            scope: 'openid profile email read:user repo',
        }
    }) ,
});