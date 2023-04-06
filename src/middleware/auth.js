
export default async function auth({ next }) {
  const loggedIn = localStorage.getItem('loggedIn')
  if (!loggedIn) {
    return next({
      name: 'Login',
    });
  }
  return next();
}
