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

const buyButtons = () => [...new Set([...document.querySelectorAll('[data-kit-checkout], #kit-buy')])];

function trackRegistration() {
  if (typeof fbq !== 'function') return;
  try {
    fbq('track', 'CompleteRegistration');
    fbq('trackSingle', '711127870519369', 'CompleteRegistration');
  } catch (error) {
    console.error(error);
  }
}

async function openCheckout() {
  const submit = $('kit-account')?.querySelector('[type=submit]');
  for (const button of buyButtons()) button.disabled = true;
  if (submit) submit.disabled = true;
  status('Opening checkout…');
  try {
    const url = await startKitCheckout();
    location.assign(url);
  } catch (error) {
    status(accountMessage(error));
    for (const button of buyButtons()) button.disabled = false;
    if (submit) submit.disabled = false;
  }
}

function showAccount(mode) {
  const form = $('kit-account');
  if (!form) return;
  form.hidden = false;
  form.dataset.mode = mode;
  const signup = mode === 'signup';
  const nameWrap = form.querySelector('[data-kit-name]');
  const roleWrap = form.querySelector('[data-kit-role]');
  const nameInput = form.querySelector('[name=name]');
  const roleInput = form.querySelector('select[name=role]');
  if (nameWrap) nameWrap.hidden = !signup;
  if (roleWrap) roleWrap.hidden = !signup;
  if (nameInput) nameInput.required = signup;
  if (roleInput) roleInput.required = signup;
  form.querySelector('[name=password]').autocomplete = signup ? 'new-password' : 'current-password';
  form.querySelector('[data-kit-signup-note]').hidden = !signup;
  form.querySelector('[data-kit-signin-note]').hidden = signup;
  form.querySelector('[type=submit]').textContent = signup ? 'Get the First App Kit — $27' : 'Sign in and get the kit';
  status('');
  document.getElementById('kit')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.addEventListener('click', event => {
  const buy = event.target.closest?.('[data-kit-checkout], #kit-buy');
  if (!buy) return;
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
  const role = String(data.get('role') || 'Student');
  const mode = form.dataset.mode || 'signup';
  if (mode === 'signup' && (!name || !ROLES.includes(role))) {
    status('Add your name and choose a role.');
    return;
  }
  status(mode === 'signup' ? 'Creating your free account…' : 'Signing in…');
  try {
    const created = mode === 'signup';
    user = created ? await signUp({ name, email, password }) : await signIn(email, password);
    if (created) trackRegistration();
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
