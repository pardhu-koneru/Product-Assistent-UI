import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "~/store/index";
import { fetchCurrentUser } from "~/store/thunks/authThunks";
import "./app.css";

/**
 * AppInit — dispatches fetchCurrentUser on boot to rehydrate session.
 * Only fires if an accessToken exists in localStorage.
 */
function AppInit({ children }) {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCurrentUser());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return children;
}

/**
 * Layout — provides the HTML document shell.
 * Wraps both the default Root export and ErrorBoundary.
 */
export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ShopAI</title>
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

/**
 * Root — wraps everything with Redux Provider and boots auth.
 */
export default function Root() {
  return (
    <Provider store={store}>
      <AppInit>
        <Outlet />
      </AppInit>
    </Provider>
  );
}

/**
 * HydrateFallback — shown while SPA JS is loading.
 */
export function HydrateFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}

/**
 * ErrorBoundary — shown when an unhandled error occurs.
 */
export function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Oops!</h1>
        <p className="text-gray-500 mt-4">Something went wrong.</p>
      </div>
    </div>
  );
}
