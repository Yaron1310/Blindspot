export const en = {
  // common
  appName: 'BLINDSPOT',
  loading: 'Loading...',
  back: '← Back',
  cancel: 'Cancel',
  start: 'Start',
  player: 'player',
  players: 'players',
  howToPlay: '? How to play',
  selectLanguage: 'Select language',

  // home
  tagline: 'A word-based social game',
  playRandom: '▶ Play a random game',
  loginSignup: 'Login / Sign Up to create your custom words',
  yourName: 'Your Name',
  namePlaceholder: 'Enter your name...',
  nameRequired: 'Please enter your name',
  nameTooLong: 'Name must be 24 characters or fewer',
  continue: 'Continue →',

  // lobby
  backToRooms: '← Rooms',
  leave: '← Leave',
  round: 'Round',
  playersLabel: 'PLAYERS',
  imReady: "I'm Ready ✓",
  startGame: 'Start Game →',
  starting: 'Starting...',
  startingGame: 'Starting game...',
  notReady: '{n} {players} not ready',
  waitingFor: 'Waiting for {n} {players}...',
  onlyNReady: 'Only {n} {players} ready. Start anyway?',
  scores: 'SCORES',

  // vote
  youAreTheSpy: 'YOU ARE THE SPY',
  waitingToVote: 'Waiting for all players to vote...',
  voteCast: 'VOTE CAST',
  youVotedFor: 'You voted for {name}',
  waitingForOthers: 'Waiting for others...',
  whoDifferentWord: 'Who has the different word?',
  whoIsTheSpy: 'Who is the spy?',
  tapToVote: 'Tap a player to cast your vote',
  meOption: '👤 Me',

  // discuss
  discussion: 'DISCUSSION',
  classicHint: 'Players take turns giving one-sentence clues about the secret word. The spy must blend in!',
  superHint: 'Players take turns describing their word. Someone has a different word from the same category!',
  startVoting: 'Start Voting',

  // result
  loadingResult: 'Loading result...',
  theSpyWas: 'The spy was',
  categoryLabel: 'Category: {name}',
  crewWord: 'Crew word: {word}',
  spyWord: 'Spy word: {word}',
  theWordWas: 'The word was {word}',
  foundSpy: 'You found the spy: +1 point',
  didntFindSpy: "You didn't find the spy: +0 points",
  youVoted: 'You voted for {name}',
  didNotVote: 'You did not vote',
  scoreboard: 'SCOREBOARD',
  waitingForHost: 'Waiting for the host to start a new round...',
  newRound: '▶ New Round',
  closeRoom: 'Close Room',

  // reveal
  yourWordLabel: 'YOUR WORD',
  yourRole: 'YOUR ROLE',
  spyRole: 'SPY',
  secretWord: 'SECRET WORD',
  blendIn: "You don't know the word. Blend in!",
  seenRole: "I've Seen My Role →",

  // speaking order
  speakingOrder: 'SPEAKING ORDER',
  youSpeakTurn: 'You speak turn {n}',
  youSuffix: '(you)',

  // room list
  noOpenRooms: 'No open rooms. Create one above!',
  join: 'Join',
  hostInfo: 'Host: {host} · {count} {players}',

  // player badges
  badgeYou: 'YOU',
  badgeHost: 'HOST',
  badgeReady: 'Ready',
  badgeWaiting: 'Waiting',

  // game rooms page
  gameRoomsTitle: 'GAME ROOMS',
  playingAs: 'Playing as',
  change: '(change)',
  createRoomTitle: 'CREATE ROOM',
  roomNameLabel: 'Room Name',
  roomNamePlaceholder: 'Friday Night...',
  numPlayersLabel: 'Number of Players',
  numPlayersPlaceholder: 'Leave empty for no limit',
  numPlayersHint: 'Game starts automatically when this many players are ready',
  creating: 'Creating...',
  createRoom: 'Create Room',
  openRoomsTitle: 'OPEN ROOMS',
  roomNameRequired: 'Room name is required',
  networkError: 'Network error. Please try again.',

  // joining room page
  joiningRoom: 'Joining room...',
  backToRoomsLink: '← Back to Rooms',

  // game container standby
  roundInProgress: 'ROUND IN PROGRESS',
  roundInProgressMsg: "A round is underway. You'll automatically join when it ends.",

  // auth — login
  signInTitle: 'Sign in to your account',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  forgotPassword: 'Forgot password?',
  signingIn: 'Signing in...',
  signIn: 'Sign In →',
  noAccount: "Don't have an account?",
  signUpLink: 'Sign up',

  // auth — signup
  createAccountTitle: 'Create your account',
  checkEmailTitle: 'Check your email',
  usernameLabel: 'Username',
  usernameHint: '3–20 chars, letters, numbers, hyphens',
  passwordHint: 'At least 6 characters',
  confirmPasswordLabel: 'Confirm Password',
  passwordsMismatch: 'Passwords do not match',
  passwordTooShort: 'Password must be at least 6 characters',
  sendingCode: 'Sending code...',
  continueBtn: 'Continue →',
  verifyEmailMsg: 'We sent a 6-digit code to {email}. Enter it below to verify your email.',
  verificationCodeLabel: 'Verification Code',
  creatingAccount: 'Creating account...',
  createAccountBtn: 'Create Account →',
  alreadyHaveAccount: 'Already have an account?',
  signInLink: 'Sign in',

  // auth — forgot password
  resetPasswordTitle: 'Reset your password',
  sentResetLink: "If an account exists for {email}, we've sent a reset link. Check your inbox.",
  backToSignIn: 'Back to Sign In',
  backToSignInArrow: '← Back to Sign In',
  sending: 'Sending...',
  sendResetLink: 'Send Reset Link →',

  // auth — reset password
  setNewPasswordTitle: 'Set a new password',
  newPasswordLabel: 'New Password',
  confirmNewPasswordLabel: 'Confirm New Password',
  invalidResetLink: 'Invalid reset link.',
  requestNewLink: 'Request a new one',
  resetting: 'Resetting...',
  resetPasswordBtn: 'Reset Password →',

  // password input
  showPassword: 'Show password',
  hidePassword: 'Hide password',
} as const;

export type TranslationKeys = keyof typeof en;
