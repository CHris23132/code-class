import { ROLES, watchAuth, signUp, signIn, loadStudent, createStudent, startKitCheckout } from './firebase.js';

const $ = id => document.getElementById(id);
let user = null;

watchAuth(next => {
  user = next && !next.isAnonymous ? next : null;
});

function status(message) {
  const el = $('kit-status');
  if (!el) return;
  el.hidden = !message;
  el.textContent = message || '';
}

function accountMessage(error) {
  return ({
    'auth/email-already-in-use': 'That email already has an account. Sign in instead.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Use a password with at least 6 characters.',
    'auth/invalid-credential': 'That email and password don’t match.',
    'auth/wrong-password': 'That email and password don’t match.',
    'auth/user-not-found': 'That email and password don’t match.',
    'auth/too-many-requests': 'Too many attempts. Wait a moment and try again.',
    'already-exists': 'This account already has the kit. Open the class to use it.',
    unauthenticated: 'Sign in before paying.'
  })[error?.code] || error?.message || 'Checkout could not start.';
}

async function openCheckout() {
  const button = $('kit-buy');
  const submit = $('kit-account')?.querySelector('[type=submit]');
  if (button) button.disabled = true;
  if (submit) submit.disabled = true;
  status('Opening checkout…');
  try {
    const url = await startKitCheckout();
    location.assign(url);
  } catch (error) {
    status(accountMessage(error));
    if (button) button.disabled = false;
    if (submit) submit.disabled = false;
  }
}

function showAccount(mode) {
  const form = $('kit-account');
  if (!form) return;
  form.hidden = false;
  form.dataset.mode = mode;
  const signup = mode === 'signup';
  form.querySelector('[data-kit-name]').hidden = !signup;
  form.querySelector('[data-kit-role]').hidden = !signup;
  form.querySelector('[name=name]').required = signup;
  form.querySelector('[name=role]').required = signup;
  form.querySelector('[name=password]').autocomplete = signup ? 'new-password' : 'current-password';
  form.querySelector('[data-kit-signup-note]').hidden = !signup;
  form.querySelector('[data-kit-signin-note]').hidden = signup;
  form.querySelector('[type=submit]').textContent = signup ? 'Create free account and continue' : 'Sign in and continue';
  $('kit-buy').hidden = true;
  status('');
}

$('kit-buy')?.addEventListener('click', () => {
  if (user) openCheckout();
  else showAccount('signup');
});

$('kit-signin')?.addEventListener('click', () => showAccount('signin'));
$('kit-signup')?.addEventListener('click', () => showAccount('signup'));

$('kit-account')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const password = String(data.get('password') || '');
  const role = String(data.get('role') || '');
  const mode = form.dataset.mode || 'signup';
  if (mode === 'signup' && (!name || !ROLES.includes(role))) {
    status('Add your name and choose a role.');
    return;
  }
  status(mode === 'signup' ? 'Creating your free account…' : 'Signing in…');
  try {
    user = mode === 'signup' ? await signUp({ name, email, password }) : await signIn(email, password);
    const existing = await loadStudent(user.uid);
    if (!existing) {
      await createStudent(user, { name: name || user.displayName || 'Student', role: role || 'Student' }, {
        project: { name: 'My first app', idea: '' },
        progress: { completedLessons: [], completedCount: 0, totalLessons: 12, percent: 0, lastLessonId: 1, started: false, checks: {} },
        notes: {},
        access: { source: 'signup', unlockedAt: new Date().toISOString() }
      });
    }
    await openCheckout();
  } catch (error) {
    status(accountMessage(error));
  }
});
