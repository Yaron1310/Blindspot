import type { TranslationKeys } from './en';

export const he: Record<TranslationKeys, string> = {
  // common
  appName: 'BLINDSPOT',
  loading: 'טוען...',
  back: 'חזרה →',
  cancel: 'ביטול',
  start: 'התחל',
  player: 'שחקן',
  players: 'שחקנים',
  howToPlay: '? איך משחקים',
  selectLanguage: 'בחר שפה',

  // home
  tagline: 'משחק חברתי מבוסס מילים',
  playRandom: '▶ שחק משחק אקראי',
  loginSignup: 'כניסה / הרשמה ליצירת מילים משלך',
  yourName: 'השם שלך',
  namePlaceholder: 'הכנס שם...',
  nameRequired: 'נא להכניס שם',
  nameTooLong: 'השם חייב להיות עד 24 תווים',
  continue: 'המשך ←',

  // lobby
  backToRooms: 'חדרים',
  leave: 'יציאה',
  round: 'סיבוב',
  playersLabel: 'שחקנים',
  imReady: 'מוכן ✓',
  startGame: 'התחל משחק ←',
  starting: 'מתחיל...',
  startingGame: 'המשחק מתחיל...',
  notReady: '{n} {players} לא מוכנים',
  waitingFor: 'ממתין ל-{n} {players}...',
  onlyNReady: 'רק {n} {players} מוכנים. להתחיל בכל זאת?',
  scores: 'ניקוד',

  // vote
  youAreTheSpy: 'אתה המרגל',
  waitingToVote: 'ממתין שכולם יצביעו...',
  voteCast: 'ההצבעה הוגשה',
  youVotedFor: 'הצבעת על {name}',
  waitingForOthers: 'ממתין לאחרים...',
  whoDifferentWord: 'למי יש מילה שונה?',
  whoIsTheSpy: 'מי המרגל?',
  tapToVote: 'לחץ על שחקן להצביע',
  meOption: '👤 אני',

  // discuss
  discussion: 'דיון',
  classicHint: 'השחקנים מתחלפים במתן רמז של משפט אחד על המילה הסודית. המרגל חייב להשתלב!',
  superHint: 'השחקנים מתחלפים בתיאור המילה שלהם. למישהו יש מילה שונה מאותה קטגוריה!',
  startVoting: 'התחל הצבעה',

  // result
  loadingResult: 'טוען תוצאה...',
  theSpyWas: 'המרגל היה',
  categoryLabel: 'קטגוריה: {name}',
  crewWord: 'מילת הצוות: {word}',
  spyWord: 'מילת המרגל: {word}',
  theWordWas: 'המילה הייתה {word}',
  foundSpy: 'מצאת את המרגל: +1 נקודה',
  didntFindSpy: 'לא מצאת את המרגל: +0 נקודות',
  youVoted: 'הצבעת על {name}',
  didNotVote: 'לא הצבעת',
  scoreboard: 'לוח ניקוד',
  waitingForHost: 'ממתין למארח להתחיל סיבוב חדש...',
  newRound: '▶ סיבוב חדש',
  closeRoom: 'סגור חדר',

  // reveal
  yourWordLabel: 'המילה שלך',
  yourRole: 'התפקיד שלך',
  spyRole: 'מרגל',
  secretWord: 'מילה סודית',
  blendIn: 'אתה לא יודע את המילה. השתלב!',
  seenRole: 'ראיתי את המילה שלי ←',
  notAllJoined: 'רק {n} מתוך {max} שחקנים הצטרפו.',

  // speaking order
  speakingOrder: 'סדר הדיבור',
  youSpeakTurn: 'אתה מדבר בתור {n}',
  youSuffix: '(אתה)',

  // room list
  noOpenRooms: 'אין חדרים פתוחים. צור אחד למעלה!',
  join: 'הצטרף',
  hostInfo: 'מארח: {host} · {count} {players}',

  // player badges
  badgeYou: 'אתה',
  badgeHost: 'מארח',
  badgeReady: 'מוכן',
  badgeWaiting: 'ממתין',

  // game rooms page
  gameRoomsTitle: 'חדרי משחק',
  playingAs: 'משחק בתור',
  change: '(שנה)',
  createRoomTitle: 'צור חדר',
  roomNameLabel: 'שם החדר',
  roomNamePlaceholder: 'ליל שישי...',
  numPlayersLabel: 'מספר שחקנים',
  numPlayersPlaceholder: 'השאר ריק ללא הגבלה',
  numPlayersHint: 'המשחק יתחיל אוטומטית כשמספר השחקנים יהיה מוכן',
  creating: 'יוצר...',
  createRoom: 'צור חדר',
  openRoomsTitle: 'חדרים פתוחים',
  roomNameRequired: 'שם החדר נדרש',
  networkError: 'שגיאת רשת. נסה שוב.',

  // joining room page
  joiningRoom: 'מצטרף לחדר...',
  backToRoomsLink: 'חזרה לחדרים →',

  // game container standby
  roundInProgress: 'סיבוב מתנהל',
  roundInProgressMsg: 'סיבוב מתנהל כעת. תצטרף אוטומטית כשיסתיים.',

  // auth — login
  signInTitle: 'התחבר לחשבון שלך',
  emailLabel: 'אימייל',
  passwordLabel: 'סיסמה',
  forgotPassword: 'שכחת סיסמה?',
  signingIn: 'מתחבר...',
  signIn: 'כניסה ←',
  noAccount: 'אין לך חשבון?',
  signUpLink: 'הרשמה',

  // auth — signup
  createAccountTitle: 'צור חשבון',
  checkEmailTitle: 'בדוק את האימייל שלך',
  usernameLabel: 'שם משתמש',
  usernameHint: '3–20 תווים, אותיות, מספרים, מקפים',
  passwordHint: 'לפחות 6 תווים',
  confirmPasswordLabel: 'אשר סיסמה',
  passwordsMismatch: 'הסיסמאות אינן תואמות',
  passwordTooShort: 'הסיסמה חייבת להיות לפחות 6 תווים',
  sendingCode: 'שולח קוד...',
  continueBtn: 'המשך ←',
  verifyEmailMsg: 'שלחנו קוד בן 6 ספרות ל-{email}. הכנס אותו למטה לאימות האימייל.',
  verificationCodeLabel: 'קוד אימות',
  creatingAccount: 'יוצר חשבון...',
  createAccountBtn: 'צור חשבון ←',
  alreadyHaveAccount: 'כבר יש לך חשבון?',
  signInLink: 'כניסה',

  // auth — forgot password
  resetPasswordTitle: 'איפוס סיסמה',
  sentResetLink: 'אם קיים חשבון עבור {email}, שלחנו קישור לאיפוס. בדוק את תיבת הדואר.',
  backToSignIn: 'חזרה להתחברות',
  backToSignInArrow: 'חזרה להתחברות →',
  sending: 'שולח...',
  sendResetLink: 'שלח קישור לאיפוס ←',

  // auth — reset password
  setNewPasswordTitle: 'הגדר סיסמה חדשה',
  newPasswordLabel: 'סיסמה חדשה',
  confirmNewPasswordLabel: 'אשר סיסמה חדשה',
  invalidResetLink: 'קישור איפוס לא תקין.',
  requestNewLink: 'בקש קישור חדש',
  resetting: 'מאפס...',
  resetPasswordBtn: 'איפוס סיסמה ←',

  // password input
  showPassword: 'הצג סיסמה',
  hidePassword: 'הסתר סיסמה',
};
