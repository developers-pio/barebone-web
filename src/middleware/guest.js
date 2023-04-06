
export default function guest({ next }) {
  const loggedIn = localStorage.getItem('loggedIn')
  if (loggedIn) {
    return next({
      name: 'Events',
    });
  }

  return next();
}
